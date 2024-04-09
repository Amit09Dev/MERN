const express = require("express");
const body_parser = require("body-parser");
const studentController = require("../controllers/studentController");

const studentRoutes = express();
studentRoutes.use(body_parser.json());
studentRoutes.use(body_parser.urlencoded({ extended: true }));

studentRoutes.get("/users/:EmpId", studentController.allStudents);
studentRoutes.get("/user/:id", studentController.studentById);
studentRoutes.patch("/user/:id", studentController.updateStudent);
studentRoutes.delete("/user/:id", studentController.deleteStudent);
studentRoutes.post("/create", studentController.newStudent);

module.exports = studentRoutes;
