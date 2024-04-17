const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const employeeListRoutes = require("./routes/employeeListRoutes");
const employeeLoginRoutes = require("./routes/employeeLoginRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const companyDataRoutes = require("./routes/companyDataRoutes");
const {checkEmail} = require("./controllers/emailExistController");
const {getUserRole} = require("./controllers/getUserRoleController");
const {authenticateEmployee, verifyToken} = require("./middleWare/employeeAuthentication");

app.use(cors());

app.use("/api/checkEmail", checkEmail);

app.use("/api/loggedin", verifyToken);

app.use("/api", employeeLoginRoutes);

app.use("/api", companyDataRoutes);

app.use("/api/role", getUserRole);

app.use(authenticateEmployee);
app.use("/api", activityLogRoutes);
app.use("/api", employeeListRoutes);

// mongoose.connect("mongodb://127.0.0.1:27017/ReactBackend");
mongoose.connect("mongodb+srv://Agilsys_MERN:123@reactcrud.gc9oca2.mongodb.net/?retryWrites=true&w=majority&appName=ReactCrud");


app.listen(8000, function () {
  console.log("Server is successfully running");
});
