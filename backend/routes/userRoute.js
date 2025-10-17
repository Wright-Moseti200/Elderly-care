let express = require("express");
const { authmiddleware } = require("../middleware/authmiddleware");
let userRoute = express.Router();
let apicache = require("apicache");
const { upload } = require("../middleware/uploadmiddleware");
let cache = apicache.middleware();

//userRoute.post("/signup",)
//userRoute.post("/login",)
//userRoute.post("/addmetrics",authmiddleware,);
//userRoute.put("/update-status",authmiddleware,);
//userRoute.post("/upload",upload.single("document"),)
//userRoute.post("/requests",authmiddleware)
userRoute.post("/addtasks",authmiddleware,)
userRoute.post("/addmedication",authmiddleware,)
userRoute.post("/addcontacts",authmiddleware,)
//userRoute.get("/metrics",[authmiddleware,cache("10 minutes")],);
//userRoute.get("/tasks",[authmiddleware,cache("10 minutes")],);
//userRoute.get("/chat",[authmiddleware,cache("10 minutes")],);
//userRoute.get("/medication",[authmiddleware,cache("10 minutes")],);
//userRoute.get("/requests",[authmiddleware,cache("10 minutes")],);
//userRoute.get("/getcaretakers",cache("10 minutes"),)

module.exports={userRoute};