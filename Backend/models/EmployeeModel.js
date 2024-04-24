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
  additionalInfo: {
    type: Array,
    required: false,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = {
  Employee: Employee
};
