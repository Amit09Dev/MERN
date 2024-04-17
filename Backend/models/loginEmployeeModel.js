const mongoose = require("mongoose");

const loginEmployeeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  orignalPasswordDemo: { type: String, required: true },
});

const LoginEmployee = mongoose.model("LoginEmployee", loginEmployeeSchema);

module.exports = {LoginEmployee : LoginEmployee};