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
    unique: true,
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
    type: Array,
    required: true,
  },
  color: {
    type: String,
    required: false,
  },
  loginEmployeeId: {
    type: String,
    required: true,
  },
  pastExperience: {
    type: Array,
    required: false,
  },
});

const loginEmployeeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  orignalPasswordDemo: { type: String, required: true },
});

const roleSchema = new mongoose.Schema({
  role_id: { type: String },
  role: { type: String },
})

const activityLogSchema = new mongoose.Schema({
  loginEmployeeId: { type: String },
  page: { type: String },
  action: { type: String },
  actionOnId: { type: String },
  timeStamp: { type: String, default: new Date().toISOString()},
})


const LoginEmployee = mongoose.model("LoginEmployee", loginEmployeeSchema);

const Employee = mongoose.model("Employee", employeeSchema);

const Role = mongoose.model("Role", roleSchema);

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = {
  LoginEmployee: LoginEmployee,
  Employee: Employee,
  Role: Role,
  ActivityLog: ActivityLog
};
