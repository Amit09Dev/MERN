const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  jobRole: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  color:{
    type:String,
    required:false
  },
  employeeID: {
    type: String,
    required: false
  }
});


const userSchema = new mongoose.Schema({
 email: { type: String, required: true },
 password: { type: String, required: true },
 orignalPasswordDemo: { type: String, required: true }
 });


const user = mongoose.model('User', userSchema);

const stu = mongoose.model("post", studentSchema);

module.exports = {
  user: user,
  stu: stu
}