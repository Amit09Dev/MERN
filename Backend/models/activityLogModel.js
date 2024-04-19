const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  loginEmployeeId: { type: String },
  page: { type: String },
  action: { type: String },
  actionOnId: { type: String },
  timeStamp: { type: String, default: new Date() },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = { ActivityLog: ActivityLog };
