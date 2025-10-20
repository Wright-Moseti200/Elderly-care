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
            // --- Added return ---
            return res.status(400).json({
                success:false,
                message:"User already exist"
            });
        }
        // Ensure BCRYPT_PASS is a number (e.g., 10 or 12)
        const saltRounds = parseInt(process.env.BCRYPT_PASS);
        let Password = await bcrypt.hash(req.body.password, saltRounds);

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
            token:token
        });

    }
    catch(error){
        // --- Added return --- (and check headersSent for safety)
        if (!res.headersSent) {
             return res.status(500).json({
                success:false,
                message:error.message
            });
        }
        console.error("Signup Error after headers sent:", error);
    }
}

// signin
let signin = async(req,res)=>{
    try{
        let email = await Users.findOne({Email:req.body.email});
        if(!email){
            // --- Added return ---
            return res.status(404).json({
                success:false,
                message:"Email does not exist"
            });
        }
        let password = await bcrypt.compare(req.body.password,email.Password);
        if(!password){
            // --- Added return ---
            return res.status(400).json({
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
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success:false,
                message:error.message
            });
        }
        console.error("Signin Error after headers sent:", error);
    }
}

//get the caretakerslist
let getCareTakers = async(req,res)=>{
    try{
        let caretakers = await Users.find({Role:"caregiver" });
        res.status(200).json({
            success:true,
            caretakers:caretakers
        });
    }
    catch(error){
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success:false,
                message:error.message
            });
        }
         console.error("GetCareTakers Error after headers sent:", error);
    }
}

//get requests from the database
let getRequests=async(req,res)=>{
    try{
        let user = await Users.findOne({_id:req.user.id});
        // --- Added User Not Found Check ---
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let userRequest = await Requests.find({
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
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success:false,
                message:error.message
            });
        }
        console.error("GetRequests Error after headers sent:", error);
    }
}

//get medication from the database
let getMedication = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        // --- Added User Not Found Check ---
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        // --- Added Profile Not Found Check ---
        if (!elderlyProfile) {
             return res.status(404).json({ success: true, medication: [] }); // Return empty array if no profile
        }
        res.status(200).json({
            success: true,
            medication: elderlyProfile.medication || [] // Ensure array return
        });
    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("GetMedication Error after headers sent:", error);
    }
}

//get contacts from the database (maps to /chat route)
let getChat = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        // --- Added User Not Found Check ---
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        // --- Added Profile Not Found Check ---
        if (!elderlyProfile) {
             return res.status(404).json({ success: true, chat: [] }); // Return empty array if no profile
        }
        res.status(200).json({
            success: true,
            chat: elderlyProfile.contacts || [] // Ensure array return
        });
    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("GetChat Error after headers sent:", error);
    }
}

//get tasks from the database
let getTasks = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        // --- Added User Not Found Check ---
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
        // --- Added Profile Not Found Check ---
        if (!elderlyProfile) {
             return res.status(404).json({ success: true, tasks: [] }); // Return empty array if no profile
        }
        res.status(200).json({
            success: true,
            tasks: elderlyProfile.tasks || [] // Ensure array return
        });
    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("GetTasks Error after headers sent:", error);
    }
}

//get metrics from the database
let getMetrics = async (req, res) => {
    try {
        let user = await Users.findOne({ _id: req.user.id });
        // --- Added User Not Found Check ---
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let elderlyProfile = await Elderly.findOne({
            $or: [
                { Caretaker: user.Username },
                { Family_member: user.Username }
            ]
        });
         // --- Added Profile Not Found Check ---
        if (!elderlyProfile) {
             return res.status(404).json({ success: true, metrics: [] }); // Return empty array if no profile
        }
        res.status(200).json({
            success: true,
            metrics: elderlyProfile.metrics || [] // Ensure array return
        });
    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
         console.error("GetMetrics Error after headers sent:", error);
    }
}

//Update request
let updateRequest = async (req, res) => {
    try {
        const { status } = req.body;
        const { requestId } = req.params;

        if (!status) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Status is required" });
        }
        if (!requestId) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Request ID is required" });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const request = await Requests.findById(requestId);
        if (!request) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        if (request.Caretaker !== user.Username) {
            // --- Added return ---
            return res.status(403).json({ success: false, message: "You are not authorized to update this request." });
        }

        request.Status = status;
        await request.save();

        if (status === "accepted") {
            await Elderly.findOneAndUpdate(
                { Family_member: request.Family_member },
                { Caretaker: request.Caretaker }
            );
        }

        // --- Added return --- (Good practice even for success response)
        return res.status(200).json({
            success: true,
            message: "Request updated successfully",
        });

    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("UpdateRequest Error after headers sent:", error);
    }
};

// Handle file upload response
let Upload = (req,res)=>{
    try{
        // --- Added check for req.file ---
        if (!req.file) {
           return res.status(400).json({
               success: false,
               message: "No file uploaded."
           });
        }
        res.status(200).json({
            success:true,
            url:req.file.path// Assuming path is correct from middleware
        })
    }
    catch(error){
        // --- Added return --- (and check headersSent)
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


//Create requests
let createRequest = async(req,res)=>{
    try{
        let {name,age,gender,number,address,conditions,history,caretaker,family} = req.body;
        // --- Updated validation to include family ---
        if(!name||!age||!gender||!number||!address||!conditions||!history||!caretaker||!family)
        {
            // --- Added return ---
            return res.status(400).json({
                success:false,
                message:"Make sure all required fields are used"
            });
        }

        let request = new Requests({
            Names:name,
            Age:age,
            Gender:gender,
            Emergency_contact:number,
            Address:address,
            Condition:conditions,
            Medical_history:history, // Should match 'history' from req.body
            Family_member:family,
            Caretaker:caretaker,
            Status: "pending" // Set default status
        });

        await request.save();

        // --- Consider if creating Elderly profile here is correct ---
        // Usually, the profile might exist or be created separately.
        // If it MUST be created here, ensure it doesn't duplicate.
        let existingElderly = await Elderly.findOne({ Family_member: family });
        if (!existingElderly) {
            let elderly = new Elderly({
                Names:name, // Assuming Elderly name matches patient name
                Age:age,
                Gender:gender,
                Emergency_contact:number,
                Address:address,
                Condition:conditions,
                Medical_history:history, // This might be redundant if stored in Request
                Family_member:family,
                // Caretaker is added only upon acceptance
                tasks:[],
                medication:[],
                metrics:[],
                contacts:[] // Added contacts array based on getChat
            });
            await elderly.save();
        }


        res.status(200).json({ // Use 201 for Created resource
            success:true,
            message:"Request is created and sent to caretaker"
        });
    }
    catch(error){
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("CreateRequest Error after headers sent:", error);
    }
}

//add metrics
let addmetrics = async (req,res)=>{
    try{
        let {blood_pressure,heart_rate,glucose_level} = req.body;
        if (!blood_pressure || !heart_rate || !glucose_level) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Missing required metric fields." });
        }
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "User not found." });
        }

        let update={
            blood_pressure:blood_pressure,
            heart_rate:heart_rate,
            glucose_level:glucose_level,
            timstamp:`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`
        };
        // --- Ensure findOneAndUpdate returns the document if needed, or handle not found ---
        const updatedElderly = await Elderly.findOneAndUpdate(
            {Caretaker:user.Username}, // Condition to find the doc
            {$push : {metrics:update}}, // The update operation
            // { new: true } // Add this if you need the updated doc back
        );

        if (!updatedElderly) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "Elderly profile not found for this caretaker." });
        }
        res.status(200).json({
            success:true,
            message:"Metrics were updated successfully"
        });
    }
    catch(error){
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("AddMetrics Error after headers sent:", error);
    }
}

//Add tasks
let addTasks = async (req,res)=>{
    try {
        const { title, time } = req.body;
        if (!title || !time) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Task title and time are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newTask = { title, time };

        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { tasks: newTask } }
        );

        if (!updatedElderly) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Tasks were updated successfully"
        });

    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("AddTasks Error after headers sent:", error);
    }
}

//add medication
let addmedication = async (req,res)=>{
    try {
        const { name, dosage } = req.body;
        if (!name || !dosage) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Medication name and dosage are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newMedication = { name, dosage };

        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { medication: newMedication } }
        );

        if (!updatedElderly) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Medication list was updated successfully"
        });

    } catch (error) {
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("AddMedication Error after headers sent:", error);
    }
}

//add contacts
let addcontacts = async (req,res)=>{
    try {
        const { title, number } = req.body;
        if (!title || !number) {
            // --- Added return ---
            return res.status(400).json({ success: false, message: "Contact title and number are required." });
        }

        const user = await Users.findOne({ _id: req.user.id });
        if (!user) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const newContact = { title, number };

        // --- Use $push with the 'contacts' field based on getChat ---
        const updatedElderly = await Elderly.findOneAndUpdate(
            { Family_member: user.Username },
            { $push: { contacts: newContact } } // Ensure 'contacts' field exists in schema
        );

        if (!updatedElderly) {
            // --- Added return ---
            return res.status(404).json({ success: false, message: "Elderly profile not found for this family member." });
        }

        res.status(200).json({
            success: true,
            message: "Contacts were updated successfully"
        });

    } catch (error) {
         // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success: false,
                message: error.message
            });
        }
        console.error("AddContacts Error after headers sent:", error);
    }
}

//get credentials
let getcredentials = async (req,res)=>{
    try{
        let users = await Users.findOne({_id:req.user.id});
        if(!users){
            // --- Added return ---
            return res.status(404).json({
                success:false,
                message:"User does not exist"
            });
        }
        res.status(200).json({
            success:true,
            role:users.Role,
            userName:users.Username
        })
    }
    catch(error){
        // --- Added return --- (and check headersSent)
        if (!res.headersSent) {
             return res.status(500).json({
                success:false, // Fixed typo from 'true' to 'false'
                message:error.message
            });
        }
        console.error("GetCredentials Error after headers sent:", error);
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
    updateRequest,
    getcredentials,
    addTasks,
    addcontacts,
    addmedication,
    addmetrics,
    Upload,
    createRequest
}