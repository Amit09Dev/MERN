const { LoginEmployee, Employee } = require("../models/EmployeeModel");

const checkEmail = async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.query.email });

    if (employee != null) {
      return res.status(200).json({ status: false, msg: 'Email already in use!' });
    }
    else {

      res.status(200).json({ status: true, msg: 'User does not exist' });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
};
module.exports = { checkEmail };