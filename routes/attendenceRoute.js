const express = require("express");
const router = express.Router();
const employeeSchema = require("../models/employee");
const attendenceSheetSchema = require("../models/attendence");
const verifyToken = require("./verifyToken");
const joi = require("joi");
const adminSchema = require("../models/admin");
const excelJS = require("exceljs");
const attendence = require("../models/attendence");
const sendEmail = require("../utils/sendEmail");

router.patch(
  "/update-today-attendence/:employeeId",
  verifyToken,
  async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { inTime, outTime, Break, totalHrs, overTime, shift, status } =
        req.body;

      const employeeFilter = { "personalInfo.employeeId": employeeId };
      const attendence = {
        inTime: inTime,
        outTime: outTime,
        Break: Break,
        totalHrs: totalHrs,
        overTime: overTime,
        shift: shift,
        status: status,
      };
      await employeeSchema.findOneAndUpdate(employeeFilter, {
        $set: { todayAttendence: attendence },
      });
      const employee = await employeeSchema.findOne(employeeFilter);
      res.status(200).json(employee);
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.get("/today-attendence", verifyToken, async (req, res) => {
  const { limit, skip } = req.body;

  try {
    const schema = joi.object().keys({
      // limit: joi.number().integer().options({ convert: false }),
      limit: joi.number().integer(),
      skip: joi.number().integer(),
    });
    const data = {
      limit: limit,
      skip: skip,
    };
    const validation = schema.validate(data);
    if (validation.error) {
      return res.status(401).json({ error: validation.error });
    }

    const employeesAttendence = await employeeSchema
      .find({})
      .select({ todayAttendence: 1, _id: 0 })
      .limit(limit)
      .skip(skip);
    res.status(200).json(employeesAttendence);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/employee-today-attendence", verifyToken, async (req, res) => {
  const { searchParam } = req.body;

  try {
    const regex = new RegExp(searchParam, "i");
    const employeeAttendence = await employeeSchema
      .find({
        $or: [
          { "personalInfo.employeeId": regex },
          { "personalInfo.firstName": regex },
          { "personalInfo.lastName": regex },
        ],
      })
      .select({ todayAttendence: 1, _id: 0 });
    if (employeeAttendence) {
      return res.status(200).json(employeeAttendence);
    }
    res.status(401).json({ message: "Employee not found!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/update-attendence-register", verifyToken, async (req, res) => {
  const { employeeId, day, month, year, status } = req.body;

  try {
    const schema = joi.object().keys({
      employeeId: joi.string().required(),
      day: joi.string().required(),
      month: joi.string().required(),
      year: joi.string().required(),
      status: joi.string().required(),
    });

    const data = {
      employeeId: employeeId,
      day: day,
      month: month,
      year: year,
      status: status,
    };

    const validation = schema.validate(data);
    if (validation.error) {
      return res.status(401).json({ error: validation.error });
    }
    await attendenceSheetSchema.findOneAndUpdate(
      { employeeId: employeeId },
      {
        $push: {
          register: { day: day, month: month, year: year, status: status },
        },
      }
    );
    const register = await attendenceSheetSchema.findOne({
      employeeId: employeeId,
    });
    return res.status(200).json({ result: register });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/export-attendence", verifyToken, async (req, res) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Attendence Sheet");
  const {email,month, year } = req.body;
  const filename = "Attendence.xlsx";

  const attendenceRegister = await attendenceSheetSchema.find({}).select({
    register: 1,
    _id: 0,
    employeeId: 1,
    employeeFirstName: 1,
    employeeLastName: 1,
  });

  const monthlyAttendenceRecord = [];
  attendenceRegister.forEach((Sheet) => {
    const { register, employeeId, employeeFirstName, employeeLastName } = Sheet;
    const res = {};
    res.employeeId = employeeId;
    res.fname = employeeFirstName;
    res.lname = employeeLastName;
    const attendenceSheet = [];

    register.forEach((attendence) => {
      if (attendence.month === month && attendence.year === year) {
        attendenceSheet.push({
          day: attendence.day,
          status: attendence.status,
        });
      }
    });

    for (let i = 1; i <= 31; i += 1) {
      const isAttendenceExists = attendenceSheet.some(
        (item) => item.day === JSON.stringify(i)
      );
      if (!isAttendenceExists) {
        attendenceSheet.push({ day: JSON.stringify(i), status: "N/A" });
      }
    }

    attendenceSheet.sort((a, b) => {
      const dayA = parseInt(a.day);
      const dayB = parseInt(b.day);
      if (dayA < dayB) {
        return -1;
      } else if (dayA > dayB) {
        return 1;
      } else {
        return 0;
      }
    });

    attendenceSheet.forEach((attendence) => {
      res[attendence.day] = attendence.status;
    });
    monthlyAttendenceRecord.push(res);
  });

  worksheet.columns = [
    { header: "S no.", key: "s_no", width: 10 },
    { header: "Employee Id", key: "employeeId", width: 10 },
    { header: "First Name", key: "fname", width: 10 },
    { header: "Last Name", key: "lname", width: 10 },
    { header: "1", key: "1", width: 10 },
    { header: "2", key: "2", width: 10 },
    { header: "3", key: "3", width: 10 },
    { header: "4", key: "4", width: 10 },
    { header: "5", key: "5", width: 10 },
    { header: "6", key: "6", width: 10 },
    { header: "7", key: "7", width: 10 },
    { header: "8", key: "8", width: 10 },
    { header: "9", key: "9", width: 10 },
    { header: "10", key: "10", width: 10 },
    { header: "11", key: "11", width: 10 },
    { header: "12", key: "12", width: 10 },
    { header: "13", key: "13", width: 10 },
    { header: "14", key: "14", width: 10 },
    { header: "15", key: "15", width: 10 },
    { header: "16", key: "16", width: 10 },
    { header: "17", key: "17", width: 10 },
    { header: "18", key: "18", width: 10 },
    { header: "19", key: "19", width: 10 },
    { header: "20", key: "20", width: 10 },
    { header: "21", key: "21", width: 10 },
    { header: "22", key: "22", width: 10 },
    { header: "23", key: "23", width: 10 },
    { header: "24", key: "24", width: 10 },
    { header: "25", key: "25", width: 10 },
    { header: "26", key: "26", width: 10 },
    { header: "27", key: "27", width: 10 },
    { header: "28", key: "28", width: 10 },
    { header: "29", key: "29", width: 10 },
    { header: "30", key: "30", width: 10 },
    { header: "31", key: "31", width: 10 },
  ];

  let counter = 1;
  monthlyAttendenceRecord.forEach((user) => {
    user.s_no = counter;
    worksheet.addRow(user);
    counter++;
  });

  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  try {
    const buffer = await workbook.xlsx.writeBuffer();
    await sendEmail(email, "BS-Foils - Attendence Sheet", "Please find the attached file below.", filename, buffer);
      res
        .status(200)
        .json({ message: "Attendence sheet exported successfully." });
   
  } catch (err) {
    res.send({
      status: "error",
      message: err,
    });
  }
});

module.exports = router;
