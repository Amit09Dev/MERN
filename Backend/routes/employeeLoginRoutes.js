const express = require("express");
const body_parser = require("body-parser");
const loginEmployeeController = require("../controllers/employeeLoginController");

const loginEmployeeRoutes = express();
loginEmployeeRoutes.use(body_parser.json());
loginEmployeeRoutes.use(body_parser.urlencoded({ extended: true }));

loginEmployeeRoutes.post("/register", loginEmployeeController.newLoginEmployee)
loginEmployeeRoutes.post("/login", loginEmployeeController.verifyEmployeeLogin)

module.exports = loginEmployeeRoutes