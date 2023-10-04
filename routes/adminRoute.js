const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const adminSchema = require("../models/admin");
const tokenSchema = require("../models/tokenSchema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const joi = require("joi");

router.post("/create-admin", async (req, res) => {
  const { email, password, adminId } = req.body;
  try {
    const schema = joi.object().keys({
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: joi.string().min(5),
      adminId:joi.string().min(5)
    });
    const data = {
      email:email ,
      password:password,
      adminId:adminId
    };
    
    const validation = schema.validate(data);
    if(validation.error){
      return res.status(401).json({error:validation.error});
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const admin = new adminSchema({
      email: email,
      password: hashedPassword,
      adminId: adminId,
    });
    await admin.save();
    res.status(201).json(admin);
  } catch (error) {
    res.status(400).json({ error: "Failed" });
  }
});

router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const schema = joi.object().keys({
      email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      password: joi.string().min(5),
    });
    const data = {
      email:email ,
      password:password
    };
    
    const validation = schema.validate(data);
    if(validation.error){
      return res.status(401).json({error:validation.error});
    }
    const admin = await adminSchema
      .findOne({ email })
      .select({ password: 1, adminId: 1, _id: 1 });

    if (admin) {
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword === false) {
        res.status(401).json("wrong password!");
      } else {
        const { adminId } = admin;
        const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET);
        await adminSchema.findByIdAndUpdate(
          { _id: admin._id },
          { authToken: token }
        );
        res.header("auth-token", token).json({ adminId, token });
      }
    } else {
      res.status(404).json("admin not found!");
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/send-password-reset-mail", async (req, res) => {
  try {
    const { email } = req.body;
    if (email) {
      const schema = joi.object().keys({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
      });
      const data = {
        email:email 
      };
      const validation = schema.validate(data);
      if(validation.error){
        return res.status(401).json({error:validation.error});
      }
      
      const admin = await adminSchema.findOne({ email: email });
      if (!admin)
        return res
          .status(404)
          .json({ message: "admin with given email doesn't exist!" });
      let token = await tokenSchema.findOne({ userId: admin._id });
      if (!token) {
        token = await new tokenSchema({
          userId: admin._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
      }
      const link = `${process.env.BASE_URL}/password-reset/${admin._id}/${token.token}`;
      await sendEmail(email, "BS-Foils - Password Reset", link);
      res
        .status(200)
        .json({ message: "password reset link sent to your email account" });
    } else {
      res.status(400).json({
        message: "please provide your email address to reset your password!",
      });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/password-reset/:userId/:token", async (req, res) => {
  try {
    const admin = await adminSchema.findById(req.params.userId);

    if (!admin) return res.status(400).send("invalid link or expired");
    const token = await tokenSchema.findOne({
      userId: admin._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link or expired");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const filter = admin._id;
    const newPassword = { password: hashedPassword };
    await adminSchema.findByIdAndUpdate(filter, newPassword);
    await tokenSchema.findOneAndDelete({
      userId: admin._id,
      token: req.params.token,
    });
    res.status(201).json({ message: "password reset sucessfully." });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
