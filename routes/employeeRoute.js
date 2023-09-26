const  express = require("express");
const  router = express.Router();
const employeeSchema = require('../models/employee');

router.post("/create-employee", async(req, res) => {
    const {personalInfo,emergencyContactInfo,officials,salaryDetails,bankDetails} = req.body;
    try {
        const employee = new employeeSchema({ personalInfo:personalInfo,emergencyContactInfo:emergencyContactInfo,officials:officials,salaryDetails:salaryDetails,bankDetails:bankDetails });
        await employee.save()
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({ error: 'Failed' });
    }
});

router.get("/get-employees", async(req,res)=>{
    try {
        const employees = await employeeSchema.find({});
        res.status(201).json(employees);
    } catch (error) {
        res.status(400).json({ error: 'Failed' }); 
    }
})

router.get("/find-employee/:employeeId",async(req,res)=>{
    try {
        const {employeeId} = req.params;
        const employee = await employeeSchema.findOne({"personalInfo.employeeId":employeeId});
        res.status(201).json(employee);
    } catch (error) {
        res.status(400).json({error:'Failed'});
    }
})

router.delete("/delete-employee/:employeeId",async(req,res)=>{
    try {
        const {employeeId} = req.params;
        const res = await employeeSchema.findOneAndDelete({"personalInfo.employeeId":employeeId});
        res.status(201).json(res);
    } catch (error) {
        res.status(400).json({error:'Failed'});
    }
})

  
module.exports = router;