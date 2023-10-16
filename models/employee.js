const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    emailId: { type: String, required: true,unique:true },
    dob: Date,
    lastName: { type: String, required: true },
    contactNo: { type: String, required: true,unique:true },
    gender: { type: String, required: true },
    bloodGroup: String,
    martialStatus: String,
    educationLevel: String,
    religion: String,
    panNumber: String,
    aadharNumber: { type: String, required: true,unique:true },
    nationality: { type: String, required: true },
    employeeId: { type: String, required: true ,unique:true},
  },
  emergencyContactInfo: {
    fullName: String,
    contactNo: String,
    relationShip: String,
  },
  officials: {
    joiningDate: Date,
    department: String,
    role: String,
    workShift: String,
    workTimings: String,
    totalWorkingHrsPerDay: String,
    overTimeRatePerHour: String,
    status: Boolean,
  },
  salaryDetails: {
    totalMonthlySalary: String,
    BasicSalary: String,
    PF: {
      totalPF: String,
      employeePart: String,
    },
    ESI: {
      totalESI: String,
    },
  },
  bankDetails: {
    bankName: String,
    accountNo: String,
    branchName: String,
    ifscCode: String,
    accountType: String,
  },
  todayAttendence:{
    inTime: Number, // Assuming inTime is stored railway-time format...
    outTime: Number, // Assuming outTime is stored railway-time format...
    Break: String,
    totalHrs: String,
    overTime: String,
    shift: String,
    status: String
  }
});

module.exports = mongoose.model("Employee", employeeSchema);
