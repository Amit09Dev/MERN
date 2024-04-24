const mongoose = require("mongoose");

const additionalFieldData = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: false,
  },
});

const additionalField = mongoose.model("additionalField", additionalFieldData);

module.exports = {additionalField: additionalField}