let jwt = require("jsonwebtoken");
require("dotenv").config();

let authmiddleware = (req,res,next)=>{
let token = req.header("auth-token");
if(!token){
    return res.status(404).json({
        message:"Token is not available"
    });
}
let data = jwt.verify(token,process.env.JWT_PASS);
req.user = data.user;
next();
}

module.exports={authmiddleware}