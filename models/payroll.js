const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
   employeeId: {type:String,required:true,unique:true},
   employeeName: {type:String,required:true},
   totalMonthlySalary: {type:String,required:true},
   basicMonthlySalary: {type:String,required:true},
   salaryPerHour: {type:String,required:true},
   totalWorkingHours: {type:String,required:true},
   totalHours: {type:String,required:true},
   overtimeRatePerHour: {type:String,required:true},
   totalAmount: {type:String,required:true},
   PF:{
    totalPFAmount:{type:String,required:true},
    employeePart:{type:String,required:true},
    employerPart:{type:String,required:true}
   },
   ESI:{type:String,required:true},
   Bonus:{type:String,required:true},
   Penalty: {type:String,required:true},
   Advance: {type:String,required:true},
   otherDeductions: {type:String,required:true},
   netSalary:{type:String,required:true},
   payment:{
     Bank:{type:String,required:true},
     Cash:{type:String,required:true}
   },
   status:{type:String,required:true}
});

module.exports = mongoose.model("payroll", payrollSchema);
