let multer = require("multer");
let cloudinary = require("cloudinary").v2;
let {CloudinaryStorage} = require("multer-storage-cloudinary");
 
cloudinary.config({
    cloud_name:"",
    api_key:"",
    api_secret:""
});

let storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"medical pdf",
        allowed_formats:["pdf","docx","doc"]
    }
})

let upload = multer({storage:storage});
module.exports = {upload};