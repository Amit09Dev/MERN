const express = require("express");
const body_parser = require("body-parser");
const {newActivityLog, showActivityLog} = require("../controllers/activityLogController");

const activityLogRoutes = express();
activityLogRoutes.use(body_parser.json());
activityLogRoutes.use(body_parser.urlencoded({ extended: true }));

activityLogRoutes.post("/activityLog", newActivityLog)
activityLogRoutes.get("/allLogs", showActivityLog)

module.exports = activityLogRoutes; 