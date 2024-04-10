const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
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
  loginEmployeeID: {
    type: String,
    required: false
  }
});


const loginEmployeeSchema = new mongoose.Schema({
 email: { type: String, required: true },
 password: { type: String, required: true },
 orignalPasswordDemo: { type: String, required: true }
 });


const LoginEmployee = mongoose.model('LoginEmployee', loginEmployeeSchema);

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = {
  LoginEmployee: LoginEmployee,
  Employee: Employee
}