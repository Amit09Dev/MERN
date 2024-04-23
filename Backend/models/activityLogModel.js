const { json } = require("body-parser");
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  loginEmployeeEmail: { type: String },
  page: { type: String },
  action: { type: String },
  data: {type : Object},
  actionOnId: { type: String },
  actionOnEmail : {type: String},
  timeStamp: { type: String, default: new Date() },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = { ActivityLog: ActivityLog };
