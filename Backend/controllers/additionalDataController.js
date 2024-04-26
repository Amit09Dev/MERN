const { additionalField } = require("../models/additionalFieldModel");
const { Employee } = require("../models/EmployeeModel");

const additionalFieldsData = async (req, res) => {
  try {
    const additionalFieldsName = req.body;
    if (additionalFieldsName.length > 0) {
      for (let i = 0; i < additionalFieldsName.length; i++) {
        const additionalFieldData = {
          name: additionalFieldsName[i].name,
          type: additionalFieldsName[i].type,
          options: additionalFieldsName[i].options
        };
        const checkAdditionalField = await additionalField.findOne({
          name: additionalFieldData.name,
          type: additionalFieldData.type,
          options : additionalFieldData.options
        });
        if (!checkAdditionalField) {
          await additionalField.create(additionalFieldData);
        }
      }      
    }
    res.status(200).json({ success: true, msg: "Additional Fields Added Successfully" });
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

    // const additionalFieldName = await additionalField.findOne({ _id: req.params.id });
    
    // const _additionalFields = await Employee.findOne({ 
    //   [additionalFieldName.name]: { $exists: true }
    //  });

    //  console.log(additionalFieldName.name);
    
    await additionalField.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { additionalFieldsData, additionalFields, deleteAdditionalFields };
