// const Model = require("../models/EmployeeModel");

const { user, stu } = require("../models/EmployeeModel");
const jwt = require("jsonwebtoken");
const jwt_secret_key =
  "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";

// const newStudent = async (req, res) => {
//   try {
//     const student = req.body;
//     const existingEmail = await Model.findOne({ email: student.email });

//     if (existingEmail) {
//       res.status(409).json({ message: "Email has already been used" });
//     } else {
//       const _student = await Model.create({...req.body, });
//       res.status(200).json(_student);
//     }
//   } catch (error) {
//     res.status(400).send({ success: false, msg: error.message });
//   }
// };



const newStudent = async (req, res) => {
  try {
    const student = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, jwt_secret_key);
    const userId = decodedToken.userId;

    const existingEmail = await user.findOne({ email: student.email, employeeID: userId });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      const _student = await stu.create({ ...student, employeeID: userId });
      res.status(200).json(_student);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = newStudent;


const allStudents = async (req, res) => {
  try {
    const currentLoggedInEmp = req.params.id
    const students = await stu.find({ employeeID: currentLoggedInEmp });
    res.status(200).json(students);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const studentById = async (req, res) => {
  try {
    const student = await stu.findById({ _id: req.params.id });
    res.status(200).json(student);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    console.log(req.params.id);
    await stu.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = req.body;
    const existingEmail = await stu.findOne({ email: student.email });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      const updateStudent = await stu.findOneAndUpdate(
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
        },
        { new: true }
      );
      res.status(200).json({ msg: "success" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  newStudent,
  allStudents,
  studentById,
  deleteStudent,
  updateStudent,
};
