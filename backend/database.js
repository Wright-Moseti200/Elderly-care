let mongoose = require("mongoose");
require("dotenv").config();
let connectDB = async()=>{
    try{
       await mongoose.connect(`${process.env.MONGO_URL}/elderlycare`);
        console.log("Database is conected successfully")
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports = {connectDB}