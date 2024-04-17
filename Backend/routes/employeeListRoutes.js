const express = require("express");
const body_parser = require("body-parser");
const {
    newEmployeeAdd,
    allEmployeeList,
    employeeById,
    deleteEmployee,
    updateEmployee
  } = require("../controllers/employeeListController");

const employeeListRoutes = express();
employeeListRoutes.use(body_parser.json());
employeeListRoutes.use(body_parser.urlencoded({ extended: true }));

employeeListRoutes.get("/emp", allEmployeeList);
employeeListRoutes.get("/emp/:id", employeeById);
employeeListRoutes.patch("/emp/:id", updateEmployee);
employeeListRoutes.delete("/emp/:id", deleteEmployee);
employeeListRoutes.post("/addEmp", newEmployeeAdd);


module.exports = employeeListRoutes;
