const express = require("express");
const body_parser = require("body-parser");
const employeeController = require("../controllers/employeeLogin");

const employeeRoutes = express();
employeeRoutes.use(body_parser.json());
employeeRoutes.use(body_parser.urlencoded({ extended: true }));

employeeRoutes.post("/register", employeeController.newEmployee)
employeeRoutes.post("/login", employeeController.verifyLogin)
employeeRoutes.post("/loggedin", employeeController.verifyToken)

module.exports = employeeRoutes