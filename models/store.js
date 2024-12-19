const mongoose = require("mongoose");
const { Schema } = mongoose;


mongoose.connect(
  "mongodb+srv://irumriaz:N1UPpbrYa8Ggthvr@cluster0.ngfpv.mongodb.net/AIRTIK"
);

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
