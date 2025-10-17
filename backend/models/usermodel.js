let mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    Role:{
        required:true,
        type:String
    },
    Username:{
        type:String,
        required:true,
    },
    Email:{
        type:String,
        required:true,
    },
    Telephone:{
        type:Number,
        required:true,
    },
     Password:{
        type:Number,
        required:true,
    },
});

let Users = mongoose.model("User",userSchema);
module.exports={Users}