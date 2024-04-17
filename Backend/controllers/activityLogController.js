const { Employee, ActivityLog } = require("../models/EmployeeModel");

const newActivityLog = async (req, res) => {
  try {
    const newActivityLogData = req.body;
    if (!newActivityLogData.actionOnId) {
      const newDataAdded = await Employee.findOne({
        email: newActivityLogData.actionOnEmail,
      });
      newActivityLogData.actionOnId = newDataAdded._id;
    }
    newActivityLogData.loginEmployeeId = req.loginEmployeeId;
    const _newActivityLogData = await ActivityLog.create(newActivityLogData);

    res.status(200).json(_newActivityLogData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { newActivityLog };
