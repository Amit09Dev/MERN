const express = require("express");
const body_parser = require("body-parser");
const {showActivityLog} = require("../controllers/activityLogController");

const activityLogRoutes = express();
activityLogRoutes.use(body_parser.json());
activityLogRoutes.use(body_parser.urlencoded({ extended: true }));

activityLogRoutes.get("/allLogs", showActivityLog)

module.exports = activityLogRoutes; 