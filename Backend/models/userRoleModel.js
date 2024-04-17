const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_id: { type: String },
  role: { type: String },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = { Role: Role };