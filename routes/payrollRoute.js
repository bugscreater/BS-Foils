const express = require("express");
const router = express.Router();
const verifyToken = require("./verifyToken");
const payrollSchema = require("../models/payroll");
const excelJS = require("exceljs");
const joi = require("joi");
const sendEmail = require("../utils/sendEmail");

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
    const filter = { employeeId: employeeId };
    const updatedPayRoll = {
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
    };
    await payrollSchema.updateOne(filter, updatedPayRoll);
    const newPayroll = await payrollSchema.findOne(filter);
    res.status(200).json(newPayroll);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/delete-payroll", verifyToken, async (req, res) => {
  const { id } = req.body;

  try {
    const filter = { employeeId: id };
    await payrollSchema.findOneAndDelete({ filter });
    const deletedPayroll = await payrollSchema.findOne(filter);
    res.status(200).json(deletedPayroll);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/export-payroll", verifyToken, async (req, res) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("payroll Sheet");
  const filename = "payroll.xlsx";
  const payrollRegister = await payrollSchema.find({});
  const { email } = req.body;

  const payrollRecord = [];
  payrollRegister.forEach((Sheet) => {
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
    } = Sheet;
    const res = {};
    res.employeeId = employeeId;
    res.employeeName = employeeName;
    res.totalMonthlySalary = totalMonthlySalary;
    res.basicMonthlySalary = basicMonthlySalary;
    res.salaryPerHour = salaryPerHour;
    res.totalWorkingHours = totalWorkingHours;
    res.totalHours = totalHours;
    res.overtimeRatePerHour = overtimeRatePerHour;
    res.totalAmount = totalAmount;
    res.totalPFAmount = PF.totalPFAmount;
    res.employeePFPart = PF.employeePart;
    res.employerPFPart = PF.employerPart;
    res.esi = ESI;
    res.bonus = Bonus;
    res.penalty = Penalty;
    res.advance = Advance;
    res.otherDeductions = otherDeductions;
    res.netSalary = netSalary;
    res.bankPayment = payment.Bank;
    res.cashPayment = payment.Cash;
    res.status = status;
    payrollRecord.push(res);
  });

  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 },
    { header: "Employee Id", key: "employeeId", width: 10 },
    { header: "Employee Name", key: "employeeName", width: 10 },
    { header: "Total Monthly Salary", key: "totalMonthlySalary", width: 10 },
    { header: "Basic Monthly Salary", key: "basicMonthlySalary", width: 10 },
    { header: "Salary Per Hour", key: "salaryPerHour", width: 10 },
    { header: "Total Monthly Salary", key: "totalMonthlySalary", width: 10 },
    { header: "Total Working Hours", key: "totalWorkingHours", width: 10 },
    { header: "Total Hours", key: "totalHours", width: 10 },
    { header: "Overtime Rate PerHour", key: "overtimeRatePerHour", width: 10 },
    { header: "Total Amount", key: "totalAmount", width: 10 },
    { header: "Total PFAmount", key: "totalPFAmount", width: 10 },
    { header: "employee PFPart", key: "employeePFPart", width: 10 },
    { header: "employer PFPart", key: "employerPFPart", width: 10 },
    { header: "ESI", key: "esi", width: 10 },
    { header: "Bonus", key: "bonus", width: 10 },
    { header: "Penalty", key: "penalty", width: 10 },
    { header: "Advance", key: "advance", width: 10 },
    { header: "Other Deductions", key: "otherDeductions", width: 10 },
    { header: "Net Salary", key: "netSalary", width: 10 },
    { header: "Bank Payment", key: "bankPayment", width: 10 },
    { header: "Cash Payment", key: "cashPayment", width: 10 },
    { header: "Status", key: "status", width: 10 },
  ];

  
  let counter = 1;
  payrollRecord.forEach((payroll) => {
    payroll.s_no = counter;
    worksheet.addRow(payroll);
    counter++;
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    await sendEmail(
      email,
      "BS-Foils - Payroll Sheet",
      "Please find the attached file below.",
      filename,
      buffer
    );
    res.status(200).json({ message: "Payroll sheet exported successfully." });
  } catch (err) {
    res.status(400).json(error);
  }
});

module.exports = router;
