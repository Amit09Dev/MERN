const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true
  },
  companyAdditionalDetails: {
    type: Array,
    required: false,
  },
});

const company = mongoose.model("Company", companySchema);

module.exports = {company: company}