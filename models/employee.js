const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    personalInfo:{
        firstName: String,
        emailId:String,
        dob: Date,
        lastName: String,
        ContactNo: String,
        Gender: String,
        BloodGroup: String,
        MartialStatus: String,
        EducationLevel: String,
        Religion: String,
        panNumber: String,
        AadharNumber: String,
        Nationality:String,
        employeeId:String
    },
    emergencyContactInfo:{
        fullName: String,
        contactNo: String,
        relationShip: String,
    },
    officials:{
        joiningDate: Date,
        department: String,
        role: String,
        workShift: String,
        workTimings: String,
        totalWorkingHrsPerDay: String,
        overTimeRatePerHour: String,
        status:Boolean
    },
    salaryDetails:{
        totalMonthlySalary: String,
        BasicSalary: String,
        PF:{
            totalPF: String,
            employeePart: String
        },
        ESI:{
            totalESI: String
        }
    },
    bankDetails:{
        bankName: String,
        accountNo: String,
        branchName: String,
        ifscCode: String,
        accountType: String
    }

});

module.exports = mongoose.model('Employee', employeeSchema);