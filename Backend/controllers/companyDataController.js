const {company} = require("../models/companyModel");

const companyData = async (req, res) => {
  try {
    const companyData = req.body;
    const _companyData = await company.create(companyData);
    res.status(200).json(_companyData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { companyData };