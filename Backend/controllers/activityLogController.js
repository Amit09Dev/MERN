const { Employee } = require("../models/EmployeeModel");
const moment = require("moment-timezone");

const { ActivityLog } = require("../models/activityLogModel");

const models = {
  Employee,
};

const showActivityLog = async (req, res) => {
  try {
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const startIndex = page * pageSize - pageSize;
    const filters = [];
    let aggregationPipeline = [
      {
        $match: { loginEmployeeEmail: req.loginEmployeeEmail },
      },
    ];

    const actionOnEmail = req.query.actionOn;
    if (actionOnEmail) {
      filters.push({
        $match: {
          actionOnEmail: actionOnEmail,
        },
      });
    }

    const action = req.query.action;
    if (action) {
      filters.push({
        $match: {
          action: action,
        },
      });
    }

    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    if (startDateStr && endDateStr) {
      let startDate = moment(startDateStr, "YYYY-MM-DD").format("DD/MM/YYYY").concat(", 12:00:00 am");
      let endDate = moment(endDateStr, "YYYY-MM-DD").format("DD/MM/YYYY").concat(", 11:59:59 pm");
      console.log(startDate, endDate);
      filters.push({
        $match: {
          timeStamp: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      });
    }

    aggregationPipeline.push(...filters);

    aggregationPipeline.push({
      $facet: {
        totalRecords: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $sort: { timeStamp: -1 },
          },
          {
            $skip: startIndex,
          },
          {
            $limit: pageSize,
          },
        ],
      },
    });

    const logs = await ActivityLog.aggregate(aggregationPipeline).exec();

    if (logs[0].totalRecords.length == 0) {
      logs[0].totalRecords[0] = 1;
    }

    const allLogsData = {
      data: logs[0].data,
      totalRecords: logs[0].totalRecords[0].total,
    };

    res.status(200).json(allLogsData);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { showActivityLog };
