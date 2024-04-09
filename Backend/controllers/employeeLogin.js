const { user } = require("../models/EmployeeModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret_key =
  "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";
  

const newEmployee = async (req, res) => {
  try {
    const employee = req.body;
    const existingEmail = await user.findOne({ email: employee.email });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      bcrypt.hash(employee.password, 10, function (err, hash) {
        user.create({
          email: employee.email,
          password: hash,
          orignalPasswordDemo: employee.password,
        });
      });

      res.status(200).json(employee);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const verifyLogin = async (req, res) => {
  try {
    const employeeLoginCred = req.body;
    console.log(employeeLoginCred);
    const existingEmail = await user.findOne({
      email: employeeLoginCred.email,
    });
    const hash = existingEmail.password;
    if (existingEmail) {
      bcrypt.compare(employeeLoginCred.password, hash, function (err, result) {
        if (result) {
          const token = jwt.sign(
            { userEmail: existingEmail.email,
              userId: existingEmail._id },
            jwt_secret_key,
            { expiresIn: "1h" }
          );

          res.status(200).json({ token });
        } else {
          res.status(409).json({ message: "Incorrect Password" });
        }
      });
    } else {
      res.status(409).json({ message: "Email is not registerd" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      console.log(token);
      console.log(decoded.userId);
    });
    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { newEmployee, verifyLogin, verifyToken };
