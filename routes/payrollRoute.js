const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
const payrollSchema = require("../models/payroll");
const joi = require("joi");

router.post("/create-payroll", verifyToken, async (req, res) => {
  const {
    employeeId,
    employeeName,
    totalMonthlySalary,
    basicMonthlySalary,
    salaryPerHour,
    totalWorkingHours,
    totalHours,
    overtimeRatePerHour,
    totalAmount,
    PF,
    ESI,
    Bonus,
    Penalty,
    Advance,
    otherDeductions,
    netSalary,
    payment,
    status,
  } = req.body;
  try {
    const payroll = new payrollSchema({
      employeeId: employeeId,
      employeeName: employeeName,
      totalMonthlySalary: totalMonthlySalary,
      basicMonthlySalary: basicMonthlySalary,
      salaryPerHour: salaryPerHour,
      totalWorkingHours: totalWorkingHours,
      totalHours: totalHours,
      overtimeRatePerHour: overtimeRatePerHour,
      totalAmount: totalAmount,
      PF: PF,
      ESI: ESI,
      Bonus: Bonus,
      Penalty: Penalty,
      Advance: Advance,
      otherDeductions: otherDeductions,
      netSalary: netSalary,
      payment: payment,
      status: status,
    });
    await payroll.save();
    res.status(201).json(payroll);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.patch("/update-payroll", verifyToken, async (req, res) => {
    const {
      employeeId,
      employeeName,
      totalMonthlySalary,
      basicMonthlySalary,
      salaryPerHour,
      totalWorkingHours,
      totalHours,
      overtimeRatePerHour,
      totalAmount,
      PF,
      ESI,
      Bonus,
      Penalty,
      Advance,
      otherDeductions,
      netSalary,
      payment,
      status,
    } = req.body;
    try {
      const filter = {employeeId:employeeId};
      const updatedPayRoll = {employeeName:employeeName,totalMonthlySalary:totalMonthlySalary,basicMonthlySalary:basicMonthlySalary,salaryPerHour:salaryPerHour,totalWorkingHours:totalWorkingHours,totalHours:totalHours,overtimeRatePerHour:overtimeRatePerHour,totalAmount:totalAmount,PF:PF,ESI:ESI,Bonus:Bonus,Penalty:Penalty,Advance:Advance,otherDeductions:otherDeductions,netSalary:netSalary,payment:payment,status:status};
      await payrollSchema.updateOne(filter,updatedPayRoll);
      const newPayroll = await payrollSchema.findOne(filter);
      res.status(200).json(newPayroll);
    } catch (error) {
      res.status(400).json(error);
    }
});

router.delete("/delete-payroll", verifyToken, async(req,res)=>{
    const {id} = req.body;
    
    try {
        const filter = {employeeId:id};
        await payrollSchema.findOneAndDelete({filter});
        const deletedPayroll = await payrollSchema.findOne(filter);
        res.status(200).json(deletedPayroll);
    } catch (error) {
        res.status(400).json(error);
    }
})
  

module.exports = router;
