let mongoose = require("mongoose");

let elderlySchema =  new mongoose.Schema({
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
    tasks:{
        type:Array
    },
    medication:{
        type:Array
    },
    metrics:{
        type:Array
    },
    contacts:{
        type:Array
    },
    Caretaker:{
        type:String,
        default:""
    },
    Family_member:{
       type:String,
        required:true 
    }
});

let Elderly = mongoose.model("Elderly",elderlySchema)
module.exports={Elderly};
