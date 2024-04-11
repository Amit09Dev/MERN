const express = require("express");
const body_parser = require("body-parser");
const employeeListController = require("../controllers/employeeListController");
const emailExistCheck = require("../controllers/emailExistCheck")

const employeeListRoutes = express();
employeeListRoutes.use(body_parser.json());
employeeListRoutes.use(body_parser.urlencoded({ extended: true }));

employeeListRoutes.get("/emp", employeeListController.allEmployeeList);
employeeListRoutes.get("/emp/:id", employeeListController.employeeById);
employeeListRoutes.patch("/emp/:id", employeeListController.updateEmployee);
employeeListRoutes.delete("/emp/:id", employeeListController.deleteEmployee);
employeeListRoutes.post("/addEmp", employeeListController.newEmployeeAdd);
employeeListRoutes.get("/checkEmail", emailExistCheck.checkEmail)

module.exports = employeeListRoutes;
