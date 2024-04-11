const { LoginEmployee, Employee } = require("../models/EmployeeModel");

const checkEmail = async (req, res) => {
  try {
    const student = await Employee.findOne({ email: req.query.email });

    if (student) {
      return res.status(404).json({ success: false, msg: 'User already exist' });
    }
    res.status(200).json({ success: true, msg: 'Email Valid' });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};
module.exports = { checkEmail };