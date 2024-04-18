const { Employee } = require("../models/EmployeeModel");
const mongoose = require("mongoose"); 

const { ActivityLog } = require("../models/activityLogModel");

const newActivityLog = async (req, res) => {
  try {
    const newActivityLogData = req.body;
    if (!newActivityLogData.actionOnId) {
      const newDataAdded = await Employee.findOne({
        email: newActivityLogData.actionOnEmail,
      });
      newActivityLogData.actionOnId = new mongoose.Types.ObjectId(newDataAdded._id);
    }
    newActivityLogData.loginEmployeeId = req.loginEmployeeId;
    const _newActivityLogData = await ActivityLog.create(newActivityLogData);

    res.status(200).json(_newActivityLogData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const showActivityLog = async (req, res) => {
  try {
    let aggregationPipeline = [
      {
        $match: {
          loginEmployeeId: new mongoose.Types.ObjectId(req.loginEmployeeId),
        },
      },
      {
        $lookup: {
          from: "loginemployees",
          localField: "loginEmployeeId",
          foreignField: "_id",
          as: "loginEmployeeId",
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "actionOnId",
          foreignField: "_id",
          as: "actionOnId",
        }
      },
      {
        $group: {
          _id: "$_id",
          loginEmployeeId: { $first: "$loginEmployeeId.email" },
          page: { $first: "$page" },
          action: { $first: "$action" },
          actionOnId: { $first: "$actionOnId.email" },
          timeStamp: {$first: "$timeStamp"}
        },
      },
      {
        $project: {
          _id: 1,
          loginEmployeeId: 1,
          page: 1,
          action: 1,
          actionOnId: 1,
          timeStamp: 1
        },
      }
    ];
    const logs = await ActivityLog.aggregate(aggregationPipeline).exec();
       
    console.log(logs);    

    res.status(200).json(logs);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { newActivityLog, showActivityLog };
