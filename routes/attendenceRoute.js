const express = require("express");
const router = express.Router();
const employeeSchema = require("../models/employee");
const adminSchema = require("../models/admin");
const verifyToken = require("./verifyToken");
const joi = require("joi");

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
      .select({ todayAttendence: 1,_id:0})
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
    const regex = new RegExp(searchParam, 'i');
    const employeeAttendence = await employeeSchema
      .find({
        $or: [
          { "personalInfo.employeeId": regex },
          { "personalInfo.firstName": regex },
          { "personalInfo.lastName": regex },
        ],
      })
      .select({ todayAttendence: 1,_id:0});
    if (employeeAttendence) {
      return res.status(200).json(employeeAttendence);
    }
    res.status(401).json({ message: "Employee not found!" });
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
