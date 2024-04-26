const { Employee } = require("../models/EmployeeModel");

const { ActivityLog } = require("../models/activityLogModel");

const models = {
  Employee
};

const showActivityLog = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    const startIndex = page * pageSize - pageSize;
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
  
    if (logs[0].totalRecords.length == 0) {
      logs[0].totalRecords[0] = 1
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
