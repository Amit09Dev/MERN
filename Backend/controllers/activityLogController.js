const { Employee } = require("../models/EmployeeModel");
const { company } = require("../models/companyModel");
const mongoose = require("mongoose"); 

const { ActivityLog } = require("../models/activityLogModel");

const models = {
  Employee,
  company
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
        $match: {
          loginEmployeeId: new mongoose.Types.ObjectId(req.loginEmployeeId),
        },
      },
      {
        $lookup: {
          from: "loginemployees",
          localField: "loginEmployeeId",
          foreignField: "_id",
          as: "loginEmployee",
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "actionOnId",
          foreignField: "_id",
          as: "actionOnEmployee",
        }
      },
      {
        $lookup: {
          from: "companies",
          localField: "actionOnId",
          foreignField: "_id",
          as: "actionOnCompany",
        }
      },
      {
        $group: {
          _id: "$_id",
          loginEmployee: { $first: "$loginEmployee" },
          page: { $first: "$page" },
          action: { $first: "$action" },
          actionOnEmployee: { $first: "$actionOnEmployee" },
          actionOnCompany: { $first: "$actionOnCompany" },
          timeStamp: { $first: "$timeStamp" }
        },
      },
      {
        $project: {
          _id: 1,
          loginEmployeeId: { $arrayElemAt: ["$loginEmployee.email", 0] },
          page: 1,
          action: 1,
          actionOnId: {
            $cond: {
              if: { $isArray: "$actionOnEmployee" },
              then: { $arrayElemAt: ["$actionOnEmployee.email", 0] },
              else: { $arrayElemAt: ["$actionOnCompany.email", 0] }
            }
          },
          timeStamp: 1
        },
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
              $sort: { timeStamp: 1 } 
            },
            {
              $skip: startIndex,
            },
            {
              $limit: pageSize,
            },
          ],
        },
      }
    ];
    const logs = await ActivityLog.aggregate(aggregationPipeline).exec();
    console.log(logs[0].data);
       
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
