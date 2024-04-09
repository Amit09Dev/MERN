const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const student_routes = require("./routes/studentRoutes");
const employee_routes = require("./routes/employeeLoginRoutes")

app.use(
    cors()
);
app.use("/api", student_routes);
app.use("/api", employee_routes);

mongoose.connect("mongodb://127.0.0.1:27017/ReactBackend");

app.listen(8000, function () {
  console.log("Server is running");
});
