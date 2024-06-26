const { LoginEmployee } = require("../models/loginEmployeeModel");
const {
  authenticateEmployee,
} = require("../middleWare/employeeAuthentication");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const jwt_secret_key =
  "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";

const newLoginEmployee = async (req, res) => {
  try {
    const employee = req.body;
    if (employee.email != "" && employee.password != "") {
      const existingEmail = await LoginEmployee.findOne({
        email: employee.email,
      });

      if (existingEmail) {
        res.status(409).json({ message: "Email already in use" });
      } else {
        bcrypt.hash(employee.password, 10, function (err, hash) {
          LoginEmployee.create({
            email: employee.email,
            password: hash,
            orignalPasswordDemo: employee.password,
          });
        });
        res.status(200).json(employee);
      }
    }
    else {
      res.status(409).json({ message: "Email and Password can't be empty" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const verifyEmployeeLogin = async (req, res) => {
  try {
    if (!req.headers.authorization) {
      const employeeLoginCred = req.body;
      const existingEmail = await LoginEmployee.findOne({
        email: employeeLoginCred.email,
      });
      const hash = existingEmail.password;
      if (existingEmail) {
        bcrypt.compare(
          employeeLoginCred.password,
          hash,
          function (err, result) {
            if (result) {
              const token = jwt.sign(
                {
                  loginEmployeeEmail: existingEmail.email,
                  loginEmployeeId: existingEmail._id,
                },
                jwt_secret_key,
                { expiresIn: "10h" }
              );

              res.status(200).json({ token, loginEmployeeId:existingEmail._id , msg: "login successful" });
            } else {
              res.status(409).json({ message: "Email or Password is incorrect" });
            }
          }
        );
      } else {
        res.status(409).json({ message: "Email or Password is incorrect" });
      }
    } else {
      app.use(authenticateEmployee);
    }
  } catch (error) {
    res.status(400).send({ success: false, message: "Email or Password is incorrect" });
  }
};
module.exports = { newLoginEmployee, verifyEmployeeLogin };
