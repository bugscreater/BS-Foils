const  express = require("express");
const  router = express.Router();
const bcrypt = require('bcrypt');
const adminSchema = require('../models/admin');
const jwt = require('jsonwebtoken');

router.post("/create-admin", async(req, res) => {
    const {email,password,adminId} = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const admin = new adminSchema({ email:email,password:hashedPassword,adminId:adminId});
      await admin.save()
      res.status(201).json(admin)
    } catch (error) {
      res.status(400).json({ error: 'Failed' });
    }
});

  
router.post("/admin-login",async(req,res) =>{
  const {email,password} = req.body;
  try {
    const admin = await adminSchema.findOne({email}).select({password:1,adminId:1,_id:0});
    console.log(admin);
    if(admin){
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword === false) {
        res.status(401).json('wrong password!')
      }else{
        const {adminId} = admin;
        const token = jwt.sign({_id: admin._id},process.env.TOKEN_SECRET);
        res.header("auth-token",token).json({adminId,token});
      }
    }
    else{
      res.status(404).json('admin not found!')
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }

})


module.exports = router;