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

// mongoose.connect("mongodb://127.0.0.1:27017/ReactBackend");
 mongoose.connect("mongodb+srv://Agilsys_MERN:123@reactcrud.gc9oca2.mongodb.net/?retryWrites=true&w=majority&appName=ReactCrud");

app.listen(8000, function () {
  console.log("Server is successfully running");
});
