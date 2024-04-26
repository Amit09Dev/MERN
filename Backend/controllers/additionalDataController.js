const { add } = require("lodash");
const { additionalField } = require("../models/additionalFieldModel");
const { Employee } = require("../models/EmployeeModel");
const e = require("express");

const additionalFieldsData = async (req, res) => {
  try {
    const additionalFieldsName = req.body;
    if (additionalFieldsName.length > 0) {
      for (let i = 0; i < additionalFieldsName.length; i++) {
        const additionalFieldData = {
          name: additionalFieldsName[i].name,
          type: additionalFieldsName[i].type,
          options: additionalFieldsName[i].options,
        };
        const checkAdditionalField = await additionalField.findOne({
          name: additionalFieldData.name,
          type: additionalFieldData.type,
          options: additionalFieldData.options,
        });
        if (!checkAdditionalField) {
          await additionalField.create(additionalFieldData);
        }
      }
    }
    res
      .status(200)
      .json({ success: true, msg: "Additional Fields Added Successfully" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const additionalFields = async (req, res) => {
  try {
    const _additionalFields = await additionalField.find({});
    res.status(200).json(_additionalFields);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};


const deleteAdditionalFields = async (req, res) => {
  try {
    const additionalFieldName = await additionalField.findOne({
      _id: req.params.id,
    });

    const fieldName = additionalFieldName.name;

    
    const employees = await Employee.find({});
    
    let fieldFound = false;
    
    employees.forEach(employee => {
      if (employee.additionalInfo) {
        employee.additionalInfo.forEach(field => {
          if (Object.keys(field).includes(fieldName)) {
            fieldFound = true;
          }
        });
      }
    });
    
    if (!fieldFound) {
      await additionalField.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ msg: "deleted" });
    }
    else {
      res.status(200).json({ msg: "Field is in use" });
    }

  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  additionalFieldsData,
  additionalFields,
  deleteAdditionalFields,
};
