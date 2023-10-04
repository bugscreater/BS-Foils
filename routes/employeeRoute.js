const  express = require("express");
const  router = express.Router();
const employeeSchema = require('../models/employee');
const adminSchema = require('../models/admin');
const verifyToken = require("./verifyToken");


router.post("/create-employee",verifyToken, async(req, res) => {
    const {userId, personalInfo,emergencyContactInfo,officials,salaryDetails,bankDetails} = req.body;
    try {
        const admin = await adminSchema.findOne({adminId:userId});
        if(admin){
            const employee = new employeeSchema({ personalInfo:personalInfo,emergencyContactInfo:emergencyContactInfo,officials:officials,salaryDetails:salaryDetails,bankDetails:bankDetails });
            await employee.save()
            res.status(201).json(employee);
        }else{
            res.status(401).json({error: "Unauthorized"});
        }
    }catch (error) {
        res.status(400).json(error);
    }
});

router.put("/update-employee",verifyToken,async(req,res)=>{
    const {userId,employeeId, personalInfo, emergencyContactInfo, officials, salaryDetails,bankDetails} = req.body;
    try {
        const admin = await adminSchema.findOne({adminId:userId});
        const employee = await employeeSchema.findOne({"personalInfo.employeeId":employeeId});
        const newEmployeeId = personalInfo.employeeId;
        if(admin && employee && newEmployeeId){
            const updatedData = { personalInfo:personalInfo,emergencyContactInfo:emergencyContactInfo,officials:officials,salaryDetails:salaryDetails,bankDetails:bankDetails };
            const filter = {"personalInfo.employeeId":employeeId};
            await employeeSchema.findOneAndUpdate(filter,updatedData);
            const newFilter = {"personalInfo.employeeId":personalInfo.employeeId}
            const updatedEmployee =  await employeeSchema.findOne(newFilter);
            res.status(201).json(updatedEmployee);
        }else if(!admin){
            res.status(401).json({error: "Unauthorized"});
        }else if(!employee){
            res.status(404).json({error:"employee not found!"})
        }else if(!newEmployeeId){
            res.status(400).json({error:"employee id is mandatory in personalInfo!"})
        }
    } catch (error) {
        res.status(400).json(error); 
    }
})

router.get("/get-employees",verifyToken, async(req,res)=>{
    try {
        const employees = await employeeSchema.find({});
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json(error); 
    }
})

router.get("/find-employee/:employeeId",verifyToken, async(req,res)=>{
    try {
        const {employeeId} = req.params;
        const employee = await employeeSchema.findOne({"personalInfo.employeeId":employeeId});
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json(error);
    }
})

router.delete("/delete-employee/:employeeId",verifyToken, async(req,res)=>{
    try {
        const {employeeId} = req.params;
        const {userId} = req.body;
        const admin = await adminSchema.findOne({adminId:userId});
       
        if(admin){
            await employeeSchema.findOneAndDelete({"personalInfo.employeeId":employeeId});
            res.status(200).json({});
        }else{
            res.status(401).json({error:"Unauthorized"})
        }
    } catch (error) {
        res.status(400).json(error);
    }
})

router.patch("/update-today-attendence/:employeeId",verifyToken, async(req,res)=>{
    try {
        const {employeeId} = req.params;
        const {userId} = req.body;
        const admin = await adminSchema.findOne({adminId:userId});
        const {inTime,outTime,Break,totalHrs,overTime,shift,status} = req.body;
       
        if(admin){
            const employeeFilter = {"personalInfo.employeeId":employeeId};
            const attendence = {inTime:inTime,outTime:outTime,Break:Break,totalHrs:totalHrs,overTime:overTime,shift:shift,status:status};
            await employeeSchema.findOneAndUpdate(employeeFilter,{$set:{todayAttendence:attendence}});
            const employee = await employeeSchema.findOne(employeeFilter);
            res.status(200).json(employee);
        }else{
            res.status(401).json({error:"Unauthorized"})
        }
    } catch (error) {
        res.status(400).json(error);
    }
})

  
module.exports = router;