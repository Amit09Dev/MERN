const { LoginEmployee, Employee } = require("../models/EmployeeModel");
const jwt = require("jsonwebtoken");
const jwt_secret_key =
  "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";

const newEmployeeAdd = async (req, res) => {
  try {
    const newEmpData = req.body;

    const existingEmail = await LoginEmployee.findOne({
      email: newEmpData.email,
      employeeID: getCurrentEmployeeLoggeedinId(req.headers.authorization),
    });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      const _newEmpData = await Employee.create({
        ...newEmpData,
        employeeID: getCurrentEmployeeLoggeedinId(req.headers.authorization),
      });
      res.status(200).json(_newEmpData);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const allEmployeeList = async (req, res) => {
  try {
    const allEmployees = await Employee.find({
      employeeID: getCurrentEmployeeLoggeedinId(req.headers.authorization),
    });
    res.status(200).json(allEmployees);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const employeeById = async (req, res) => {
  try {
    const employee = await Employee.findById({ _id: req.params.id });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    await Employee.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const employee = req.body;
    const existingEmail = await Employee.findOne({ email: employee.email });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      const updatedEmployee = await Employee.findOneAndUpdate(
        { _id: req.params.id },
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          address: req.body.address,
          state: req.body.state,
          city: req.body.city,
          zip: req.body.zip,
          jobRole: req.body.jobRole,
          userRole: req.body.userRole,
          loginEmployeeID: getCurrentEmployeeLoggeedinId(req.headers.authorization),
        },
        { new: true }
      );
      res.status(200).json({ msg: "success" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

function getCurrentEmployeeLoggeedinId(authorization) {
  const token = authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, jwt_secret_key);
  const loginEmployeeID = decodedToken.loginEmployeeID;
  return loginEmployeeID;
}

module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
};
