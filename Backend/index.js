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

mongoose.connect("mailto:mongodb+srv://amitkagilsys:znnt61kw9zk2ahj5@mern.nkfnvqn.mongodb.net/");

app.listen(8000, function () {
  console.log("Server is running");
});
