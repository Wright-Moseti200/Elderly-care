let mongoose = require("mongoose");

let requestSchema = new mongoose.Schema({
     Names:{
        type:String,
        required:true
    },
    Age:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    Emergency_contact:{
        type:Number,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    Condition:{
        type:String,
        required:true
    },
    Medical_history:{
        type:String,
        required:true
    },
    Family_member:{
         type:String,
        required:true
    },
    Caretaker:{
        type:String,
        required:true
    },
    Status:{
        type:String,
        default:"pending",
        required:true
    }
})

let Requests = mongoose.model("request",requestSchema);
module.exports={Requests};