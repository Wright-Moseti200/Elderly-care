let express =  require("express");
let ratelimit =  require("express-rate-limit");
const { connectDB } = require("./database");
let app = express();
require("dotenv").config();
let port = process.env.PORT || 3000;
let limit = ratelimit({
    WindowMS:10*60*1000,
    max:100
});

app.use(limit);
app.set("trust proxy",1);

app.use(express.json());

connectDB();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});