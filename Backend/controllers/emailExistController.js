const { LoginEmployee, Employee } = require("../models/EmployeeModel");
// const jwt = require("jsonwebtoken");
// const { all } = require("../routes/employeeLoginRoutes");
// const jwt_secret_key =
//   "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";


const checkEmail = async (req, res) => {
  try {
    const student = await Employee.findOne({ email: req.body.email });

    if (student) {
      return res.status(404).json({ success: false, msg: 'User already exist' });
    }
    res.status(200).json({ success: true, msg: 'Email Valid' });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
module.exports = { checkEmail };