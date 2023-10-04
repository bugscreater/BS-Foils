const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    adminId:{type:String,required:true,unique:true},
    authToken: {type:String, expires: 3600}
});

module.exports = mongoose.model('Admin', adminSchema);