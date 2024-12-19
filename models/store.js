const mongoose = require("mongoose");
const { Schema } = mongoose;


mongoose.connect(
  "mongodb+srv://fa7711598:aI3kmYs4IBaFsxNi@cluster0.f5kgg.mongodb.net/AIRTIK"
);

// mongodb+srv://fa7711598:<db_password>@cluster0.f5kgg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phno: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});



const userModel = mongoose.model("Users", userSchema);


module.exports = {
  userModel,

};
