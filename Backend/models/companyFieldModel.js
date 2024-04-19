const mongoose = require("mongoose");

const companyFieldSchema = mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
  }
});

const companyField = mongoose.model("CompanyField", companyFieldSchema);

module.exports = {companyField: companyField}