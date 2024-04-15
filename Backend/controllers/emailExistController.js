const { Employee } = require("../models/EmployeeModel");

const checkEmail = async (req, res) => {
  try {
    if (req.query.id) {
      const employee = await Employee.findOne({$and: [{ email: req.query.email }, { _id: { $ne: req.query.id } }]});
      statusReturn(employee, res);
    } else {
      const employee = await Employee.findOne({ email: req.query.email });
      statusReturn(employee, res);
    }

    function statusReturn(employee, res) {
      if (employee != null) {
        return res
          .status(200)
          .json({ status: false, msg: "Email already in use!" });
      } else {
        res.status(200).json({ status: true, msg: "User does not exist" });
      }
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: error.message });
  }
};

module.exports = { checkEmail };
