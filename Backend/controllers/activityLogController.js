const { Employee } = require("../models/EmployeeModel");
const { company } = require("../models/companyModel");
const mongoose = require("mongoose"); 

const { ActivityLog } = require("../models/activityLogModel");

const newActivityLog = async (req, res) => {
  try {
    const newActivityLogData = req.body;
    const collectionName = req.body.dataType;
    if (!newActivityLogData.actionOnId) {
      const newDataAdded = await collectionName.findOne({
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

    // const page = parseInt(req.query.page) || 1;
    // const startIndex = page * pageSize - pageSize;
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
      },
      // {
      //   $skip: startIndex,
      // },
      // {
      //   $limit: pageSize,
      // },
      // {
      //   $sort: {
      //     timeStamp:-1
      //   }
      // }
    ];
    const logs = await ActivityLog.aggregate(aggregationPipeline).exec();
       
    console.log(logs);    

    res.status(200).json(logs);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { newActivityLog, showActivityLog };
