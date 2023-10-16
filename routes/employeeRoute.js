const express = require("express");
const router = express.Router();
const employeeSchema = require("../models/employee");
const adminSchema = require("../models/admin");
const attendenceSheetSchema = require("../models/attendence");
const verifyToken = require("./verifyToken");
const joi = require("joi");

router.post("/create-employee", verifyToken, async (req, res) => {
  const {
    personalInfo,
    emergencyContactInfo,
    officials,
    salaryDetails,
    bankDetails,
  } = req.body;
  try {
    const employee = new employeeSchema({
      personalInfo: personalInfo,
      emergencyContactInfo: emergencyContactInfo,
      officials: officials,
      salaryDetails: salaryDetails,
      bankDetails: bankDetails,
    });
    await employee.save();
    const attendenceRegister = new attendenceSheetSchema({
      employeeId: personalInfo.employeeId,
      employeeFirstName: personalInfo.firstName,
      employeeLastName: personalInfo.lastName,
    });
    await attendenceRegister.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.put("/update-employee", verifyToken, async (req, res) => {
  const {
    employeeId,
    personalInfo,
    emergencyContactInfo,
    officials,
    salaryDetails,
    bankDetails,
  } = req.body;
  try {
    const employee = await employeeSchema.findOne({
      "personalInfo.employeeId": employeeId,
    });
    const newEmployeeId = personalInfo.employeeId;
    if (employee && newEmployeeId) {
      const updatedData = {
        personalInfo: personalInfo,
        emergencyContactInfo: emergencyContactInfo,
        officials: officials,
        salaryDetails: salaryDetails,
        bankDetails: bankDetails,
      };
      const filter = { "personalInfo.employeeId": employeeId };
      await employeeSchema.findOneAndUpdate(filter, updatedData);
      const newFilter = { "personalInfo.employeeId": personalInfo.employeeId };
      const updatedEmployee = await employeeSchema.findOne(newFilter);
      return res.status(201).json(updatedEmployee);
    } else if (!employee) {
      res.status(404).json({ error: "employee not found!" });
    } else if (!newEmployeeId) {
      res
        .status(400)
        .json({ error: "employee id is mandatory in personalInfo!" });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/get-employees", verifyToken, async (req, res) => {
  try {
    const { limit, skip } = req.body;
    const employees = await employeeSchema.find({}).limit(limit).skip(skip);
    res.status(200).json(employees);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/find-employee", verifyToken, async (req, res) => {
  try {
    const { searchQuery, limit, skip } = req.body;
    const regex = new RegExp(searchQuery, "i");
    const employee = await employeeSchema
      .find({
        $or: [
          { "personalInfo.employeeId": regex },
          { "personalInfo.firstName": regex },
          { "personalInfo.lastName": regex },
        ],
      })
      .limit(limit)
      .skip(skip);
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/delete-employee/:employeeId", verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;

    await employeeSchema.findOneAndDelete({
      "personalInfo.employeeId": employeeId,
    });
    res.status(200).json({});
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/get-total-employees",verifyToken,async(req,res)=>{
  try {
    const totalCounts = await employeeSchema.countDocuments({});
    return res.status(200).json({totalCounts:totalCounts});
  } catch (error) {
    return res.send({
      status: "error",
      message: err,
    });
  }
})



router.get("/late-comers",verifyToken,async(req,res)=>{
  try {
    const {standardTime} = req.body;
    const totalCounts = await employeeSchema.countDocuments({$and:[{todayAttendence: {$exists:true}},{"todayAttendence.inTime":{$gt:standardTime}}]})
    return res.status(200).json({totalCounts:totalCounts});
  } catch (error) {
    return res.send({
      status: "error",
      message: err,
    });
  }
})

router.get("/on-timers",verifyToken,async(req,res)=>{
  try {
    const {standardTime} = req.body;
    const totalCounts = await employeeSchema.countDocuments({$and:[{todayAttendence: {$exists:true}},{"todayAttendence.inTime":{$eq:standardTime}}]})
    return res.status(200).json({totalCounts:totalCounts});
  } catch (error) {
    return res.send({
      status: "error",
      message: err,
    });
  }
})


router.get("/total-absent",verifyToken,async(req,res)=>{
  try {
    const totalCounts = await employeeSchema.countDocuments({$and:[{todayAttendence: {$exists:true}},{"todayAttendence.status":"Absent"}]})
    return res.status(200).json({totalCounts:totalCounts});
  } catch (error) {
    return res.send({
      status: "error",
      message: error,
    });
  }
})




module.exports = router;
