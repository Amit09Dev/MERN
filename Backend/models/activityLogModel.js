const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema({
  loginEmployeeId: { type: mongoose.Schema.Types.ObjectId },
  page: { type: String },
  action: { type: String },
  actionOnId: { type: mongoose.Schema.Types.ObjectId },
  timeStamp: { type: String, default: new Date().toLocaleString() },
});

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = { ActivityLog: ActivityLog };
