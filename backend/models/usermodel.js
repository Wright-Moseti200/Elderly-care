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
        type:String,
        required:true,
    },
     Password:{
        type:String,
        required:true,
    },
});

let Users = mongoose.model("User",userSchema);
module.exports={Users}