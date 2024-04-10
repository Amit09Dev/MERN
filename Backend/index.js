const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const employeeListRoutes = require("./routes/employeeListRoutes");
const employeeLoginRoutes = require("./routes/employeeLoginRoutes")

app.use(
    cors()
);
app.use("/api", employeeListRoutes);
app.use("/api", employeeLoginRoutes);

mongoose.connect("mailto:mongodb+srv://amitkagilsys:znnt61kw9zk2ahj5@mern.nkfnvqn.mongodb.net/");

app.listen(8000, function () {
  console.log("Server is running");
});
