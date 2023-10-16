const jwt = require("jsonwebtoken");
const adminSchema = require("../models/admin");

module.exports = async function(req,res,next){
  const token = req.header("auth-token");

  if(!token){
    res.status(401).send("Access Denied");
  }

  try {
    const adminToken =  await adminSchema.findOne(
      { authToken: token }
    );
    
    let verified = jwt.verify(token,process.env.TOKEN_SECRET);
    if(!adminToken) return res.status(400).send("Invalid token!");
    req.user = verified;
    next();
    
  } catch (error) {
    res.status(400).send("Invalid token!");
  }
}