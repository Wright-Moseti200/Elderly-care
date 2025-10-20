let express =  require("express");
let cors = require("cors");
let ratelimit =  require("express-rate-limit");
const { connectDB } = require("./database");
const { userRoute } = require("./routes/userRoute");
let app = express();
require("dotenv").config();
let port = process.env.PORT || 3000;

app.use(cors());

app.get("/",(req,res)=>{
    res.send("Express server is running")
});

app.use(express.json());
app.use("/api/user",userRoute);
connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});