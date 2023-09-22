const  express = require("express");
const  router = express.Router();
const bcrypt = require('bcrypt');
const adminSchema = require('../models/admin');

router.post("/create-admin", async(req, res) => {
    const {email,password} = req.body;
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const admin = new adminSchema({ email:email,password:hashedPassword });
      await admin.save()
      res.status(201).json(admin)
  
    } catch (error) {
      res.status(400).json({ error: 'Failed' });
    }
});
  
router.get("/admin-login",async(req,res) =>{
  const {email,password} = req.body;
  try {
    const admin = await adminSchema.findOne({email});
    if(admin){
      const validPassword = await bcrypt.compare(password, admin.password);
      if (validPassword === false) {
        res.status(401).json('wrong password!')
      }else{
        res.status(200).json(admin);
      }
    }
    else{
      res.status(404).json('admin not found!')
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed' });
  }

})


module.exports = router;