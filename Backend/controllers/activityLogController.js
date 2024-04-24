const { Employee } = require("../models/EmployeeModel");
// const { company } = require("../models/companyModel");
const mongoose = require("mongoose");

const { ActivityLog } = require("../models/activityLogModel");

const models = {
  Employee,
  // company,
};

const newActivityLog = async (req, res) => {
  try {
    const newActivityLogData = req.body;
    const modelName = req.body.dataType;
    console.log(modelName);
    const Model = models[modelName];

    if (!newActivityLogData.actionOnId) {
      const newDataAdded = await Model.findOne({
        email: newActivityLogData.actionOnEmail,
      });
      console.log(newDataAdded);
      newActivityLogData.actionOnId = newDataAdded._id;

    }
    newActivityLogData.loginEmployeeId = req.loginEmployeeEmail;
    const _newActivityLogData = await ActivityLog.create(newActivityLogData);
    console.log(_newActivityLogData);
    res.status(200).json(_newActivityLogData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const showActivityLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const startIndex = page * pageSize - pageSize;
    // let aggregationPipeline = [
    //   {
    //     $match: {
    //       loginEmployeeId: new mongoose.Types.ObjectId(req.loginEmployeeId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "loginemployees",
    //       localField: "loginEmployeeId",
    //       foreignField: "_id",
    //       as: "loginEmployeeId",
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "employees",
    //       localField: "actionOnId",
    //       foreignField: "_id",
    //       as: "actionOnId",
    //     }
    //   },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       loginEmployeeId: { $first: "$loginEmployeeId.email" },
    //       page: { $first: "$page" },
    //       action: { $first: "$action" },
    //       actionOnId: { $first: "$actionOnId.email" },
    //       timeStamp: {$first: "$timeStamp"}
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       loginEmployeeId: 1,
    //       page: 1,
    //       action: 1,
    //       actionOnId: 1,
    //       timeStamp: 1
    //     },
    //   },
    //   {
    //     $facet: {
    //       totalRecords: [
    //         {
    //           $count: "total",
    //         },
    //       ],
    //       data: [
    //         {
    //           $sort: {firstName: 1, _id: 1}
    //         },
    //         {
    //           $skip: startIndex,
    //         },
    //         {
    //           $limit: pageSize,
    //         },
    //       ],
    //     },
    //   }
    // ];
    let aggregationPipeline = [
      {
        $match: { loginEmployeeEmail: req.loginEmployeeEmail },
      },
      {
        $facet: {
          totalRecords: [
            {
              $count: "total",
            },
          ],
          data: [
            {
              $sort: { timeStamp: 1 },
            },
            {
              $skip: startIndex,
            },
            {
              $limit: pageSize,
            },
          ],
        },
      },
    ];
    const logs = await ActivityLog.aggregate(aggregationPipeline).exec();
    // console.log(logs[0].data);
    if (logs[0].totalRecords.length == 0) {
      logs[0].totalRecords[0] = 1
    }

    console.log(logs);
    const allLogsData = {
      data: logs[0].data,
      totalRecords: logs[0].totalRecords[0].total,
    };

    res.status(200).json(allLogsData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { newActivityLog, showActivityLog };
