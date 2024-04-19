const { company } = require("../models/companyModel");
const { companyField } = require("../models/companyFieldModel");
const { company } = require("../models/companyModel");
const { companyField } = require("../models/companyFieldModel");

const companyData = async (req, res) => {
  try {
    const companyData = req.body;
    const companyFieldsName = req.body.companyFieldsName;
    const companyFieldsName = req.body.companyFieldsName;
    const _companyData = await company.create(companyData);
    if (companyFieldsName) {
      for (let i = 0; i < companyFieldsName.length; i++) {
        const companyFieldData = {
          fieldName: companyFieldsName[i],
        };
        const checkCompanyField = await companyField.findOne({
          fieldName: companyFieldData.fieldName,
        });
        console.log("companyFieldData", companyFieldData);
        console.log("checkCompany", checkCompanyField);
        if (!checkCompanyField) {
          const _companyFieldData = await companyField.create(companyFieldData);
        }
      }      
    }
    res.status(200).json(_companyData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const showCompanyData = async (req, res) => {
  try {
    const _showCompanyData = await company.find({});
    const _showCompanyFieldData = await companyField.find({});
    const companyData = {
      company: _showCompanyData,
      companyField: _showCompanyFieldData,
    };
    res.status(200).json(companyData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { companyData, showCompanyData};

const showCompanyData = async (req, res) => {
  try {
    const _showCompanyData = await company.find({});
    const _showCompanyFieldData = await companyField.find({});
    const companyData = {
      company: _showCompanyData,
      companyField: _showCompanyFieldData,
    };
    res.status(200).json(companyData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { companyData, showCompanyData};
