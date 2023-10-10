const mongoose = require("mongoose");

const attendenceSheetSchema = new mongoose.Schema({
    employeeId: {type:String,required:true},
    employeeFirstName: {type:String, required:true},
    employeeLastName: {type:String, required:true},
    register:{ type : Array , "default" : [] }
});

module.exports = mongoose.model("attendenceSheet", attendenceSheetSchema);
