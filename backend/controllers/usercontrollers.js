let bcrypt = require("bcrypt");
const { Users } = require("../models/usermodel");
let jwt = require("jsonwebtoken");
const { Requests } = require("../models/request");
const { Elderly } = require("../models/caretaken");

//Signup 
let signup = async (req,res)=>{
    try{
    let email = await Users.findOne({Email:req.body.email});
    if(email){
        res.status(400).json({
            success:false,
            message:"User already exist"
        });
    }
    let Password = await bcrypt.hash(req.body.password,process.env.BCRYPT_PASS)
    let Userdata = new Users({
        Role:req.body.role,
        Username:req.body.username,
        Email:req.body.email,
        Telephone:req.body.telephone,
        Password:Password
    });

  let savedData = await Userdata.save();
  let data = {
    user:{
        id:savedData._id
    }
  }
  let token = jwt.sign(data,process.env.JWT_PASS);

  res.status(201).json({
    success:true,
    token:"User has been created succesfully"
  });

}
catch(error){
    res.status(500).json({
        success:false,
        message:error.message
    });
}
}

// signin
let signin = async(req,res)=>{
try{
    let email = await Users.findOne({Email:req.body.email});
    if(!email){
        res.status(404).json({
            success:false,
            message:"Email does not exist"
        });
    }
    let password = bcrypt.compare(req.body.password,email.Password);
    if(!password){
        res.status(400).json({
            success:false,
            message:"Password is incorrect"
        });
    }
    let data = {user:{
        id:email._id
    }}

    let token = jwt.sign(data,process.env.JWT_PASS)
    res.status(200).json({
        success:true,
        token:token
    });
}
catch(error){
     res.status(500).json({
        success:false,
        message:error.message
    });
}
}

//get the caretakerslist
let getCareTakers = async(req,res)=>{
try{
let users = await Users.find();
let caretakers = users.filter((element)=>{
element.Role === "caretaker"
});
res.status(200).json({
    success:true,
    caretakers:caretakers
});
}
catch(error){
     res.status(500).json({
        success:false,
        message:error.message
    }); 
}    
}

//get requests from the database
let getRequests=async(req,res)=>{
    try{
    let user = await Users.findOne({_id:req.user.id});
    let userRequest = await Requests.findOne({
        $or: [
            { Caretaker: user.Username },
            { Family_member: user.Username }
        ]
    });
    res.status(200).json({
        success:true,
        userRequest:userRequest
    });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

//get medication from the database
let getMedication = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        res.status(200).json({
            success: true,
            medication: elderlyProfile // Assuming medication info is in this profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//get contacts from the database
let getChat = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        res.status(200).json({
            success: true,
            chat: elderlyProfile // Assuming chat info is in this profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//get tasks from the database
let getTasks = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        res.status(200).json({
            success: true,
            tasks: elderlyProfile // Assuming task info is in this profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//get metrics from the database
let getMetrics = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        res.status(200).json({
            success: true,
            metrics: elderlyProfile // Assuming metrics info is in this profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Update request
let updateRequest = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const request = await Requests.findOne({ Caretaker: user.Username });
        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        const updatedRequest = await Requests.findOneAndUpdate(
            { _id: request._id },
            { Status: status },
        );

        if (status === "accepted") {
            const elderly = await Elderly.findOne({ Family_member: request.Family_member });
            if (elderly) {
                await Elderly.findOneAndUpdate(
                    { Family_member: request.Family_member },
                    { Caretaker: request.Caretaker }
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "Request updated successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

let upload = (req,res)=>{
    try{
        res.status(200).json({
            success:true,
            url:req.file.path
        })
    }
    catch(error){
          res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//Create requests
let createRequest = async(req,res)=>{
    try{
    let {name,age,gender,number,address,conditions,history,caretaker,family} = req.body;
    if(!name||!age||!gender||!number||!address||!conditions||!history||!caretaker)
        {
            res.status(400).json({
                success:false,
                message:"Make sure all fields are used"
            });
    }

    let request = new Requests({
        Names:name,
        Age:age,
        Gender:gender,
        Emergency_contact:number,
        Address:address,
        Condition:conditions,
        Medical_history:history,
        Family_member:family,
        Caretaker:caretaker
    });
   
    await request.save();

    let elderly = new Elderly({
         Names:name,
        Age:age,
        Gender:gender,
        Emergency_contact:number,
        Address:address,
        Condition:conditions,
        Medical_history:history,
        Family_member:family,
        tasks:[],
        medication:[],
        metrics:[]
    });
    await elderly.save();

    res.status(200).json({
        success:true,
        message:"Request is created and sent to caretaker"       
    });
    }
    catch(error){
          res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//add metrics
let addmetrics = async (req,res)=>{
     try{
        let {blood_pressure,heart_rate,glucose_level} = req.body;
        // Basic validation
        if (!blood_pressure || !heart_rate || !glucose_level) {
            return res.status(400).json({ success: false, message: "Missing required metric fields." });
        }
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

     let update={
     blood_pressure:blood_pressure,
            heart_rate:heart_rate,
            glucose_level:glucose_level,
            timstamp:`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
    };    const updatedElderly = await Elderly.findOneAndUpdate(
            {Caretaker:user.Username},
            {$push : {metrics:update}}
        );

        if (!updatedElderly) {
            return res.status(404).json({ success: false, message: "Elderly profile not found for this caretaker." });
        }
     res.status(200).json({
    success:true,
     message:"Metrics were updated successfully" 
     });
    }
    catch(error){
     res.status(500).json({
     success: false,
 message: error.message
 }); 
    }
}

//Add tasks
let addTasks = async (req,res)=>{
    try {
        const { title, time } = req.body;
        if (!title || !time) {
            return res.status(400).json({ success: false, message: "Task title and time are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        const newTask = { title, time };

        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { tasks: newTask } }
        );

        if (!updatedElderly) {
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Tasks were updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//add medication
let addmedication = async (req,res)=>{
    try {
        const { name, dosage } = req.body;
        if (!name || !dosage) {
            return res.status(400).json({ success: false, message: "Medication name and dosage are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newMedication = { name, dosage };

        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { medication: newMedication } }
        );

        if (!updatedElderly) {
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Medication list was updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

//add contacts
let addcontacts = async (req,res)=>{
    try {
        const { title, number } = req.body;
        if (!title || !number) {
            return res.status(400).json({ success: false, message: "Contact title and number are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        
        const newContact = { title, number };

        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { contacts: newContact } }
        );

        if (!updatedElderly) {
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Contacts were updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    signin,
    signup,
    getCareTakers,
    getRequests,
    getMedication,
    getChat,
    getTasks,
    getMetrics,
    updateRequest
}