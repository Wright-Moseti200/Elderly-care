let express = require("express");
const { authmiddleware } = require("../middleware/authmiddleware");
let userRoute = express.Router();
let apicache = require("apicache");
const { upload } = require("../middleware/uploadmiddleware");
const { signin,signup,getCareTakers,getRequests,getMedication,getChat,getTasks,getMetrics,updateRequest,getcredentials,addTasks,addcontacts,addmedication,addmetrics, Upload, createRequest, } = require("../controllers/usercontrollers");
let cache = apicache.middleware;

userRoute.post("/signup",signup)
userRoute.post("/login",signin)
userRoute.post("/addmetrics",authmiddleware,addmetrics);
userRoute.put("/update-status/:requestId", authmiddleware, updateRequest);
userRoute.post("/upload",upload.single("document"),Upload)
userRoute.post("/requests",authmiddleware,createRequest)
userRoute.post("/addtasks",authmiddleware,addTasks)
userRoute.post("/addmedication",authmiddleware,addmedication)
userRoute.post("/addcontacts",authmiddleware,addcontacts)
userRoute.get("/metrics",authmiddleware,getMetrics);
userRoute.get("/tasks",authmiddleware,getTasks);
userRoute.get("/chat",authmiddleware,getChat);
userRoute.get("/medication",authmiddleware,getMedication);
userRoute.get("/requests",authmiddleware,getRequests);
userRoute.get("/getcaretakers",getCareTakers)
userRoute.get("/credentials",authmiddleware,getcredentials)
module.exports={userRoute};