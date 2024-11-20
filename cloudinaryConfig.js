import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dq4ikdbyi", // Found in your Cloudinary dashboard
  api_key: "453944336159854",       // Found in your Cloudinary dashboard
  api_secret: "kTbBMjD5ntq6alSq-p4YPGTQxMo", // Found in your Cloudinary dashboard
});

export default cloudinary;
