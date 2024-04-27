const { Employee } = require("../models/EmployeeModel");
const { ActivityLog } = require("../models/activityLogModel");
const mongoose = require("mongoose");
const _ = require("lodash");
const { createDeepComparer } = require("deep-comparer");
const deepCompare = createDeepComparer();

const newEmployeeAdd = async (req, res) => {
  try {
    const newEmpData = req.body;
    const existingEmail = await Employee.findOne({
      email: newEmpData.email,
    });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      newEmpData.loginEmployeeId = req.loginEmployeeId;
      newEmpData.userRole = newEmpData.userRole.map(
        (str) => new mongoose.Types.ObjectId(str)
      );
      const _newEmpData = await Employee.create(newEmpData);
      const _actionOnEmp = await Employee.findOne({ email: _newEmpData.email });
      let _actionOnId = _actionOnEmp._id.toString();



      let currentDate = new Date();
      let currentDateTime = currentDate.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });
      const addLogData = {
        loginEmployeeEmail: req.loginEmployeeEmail,
        page: "/userform",
        action: "Employee Added",
        data: "",
        actionOnId: _actionOnId,
        actionOnEmail: _newEmpData.email,
        timeStamp: currentDateTime,
      };

      await ActivityLog.create(addLogData);
      res.status(200).json(_newEmpData);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const allEmployeeList = async (req, res) => {
  try {
    const _loginEmployeeId = req.loginEmployeeId;
    let aggregationPipeline = [
      {
        $match: {
          loginEmployeeId: _loginEmployeeId,
        },
      },
      {
        $unwind: "$userRole",
      },
      {
        $lookup: {
          from: "roles",
          localField: "userRole",
          foreignField: "_id",
          as: "Uroles",
        },
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          zip: { $first: "$zip" },
          jobRole: { $first: "$jobRole" },
          userRole: { $push: "$Uroles.role" },
          color: { $first: "$color" },
          loginEmployeeId: { $first: "$loginEmployeeId" },
          pastExperience: { $first: "$pastExperience" },
          additionalInfo: { $first: "$additionalInfo" },
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          address: 1,
          state: 1,
          city: 1,
          zip: 1,
          jobRole: 1,
          color: 1,
          loginEmployeeId: 1,
          pastExperience: 1,
          userRole: {
            $reduce: {
              input: "$userRole",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
          additionalInfo: 1,
        },
      },
    ];
    const filters = [];
    const fullName = req.query.fullName;
    if (fullName) {
      const [firstName, lastName] = fullName.split(" ");
      filters.push({
        $match: {
          $and: [
            { firstName: { $regex: new RegExp(firstName, "i") } },
            { lastName: { $regex: new RegExp(lastName, "i") } },
          ],
        },
      });
    }

    const userRoles = req.query.userRole;
    if (userRoles && userRoles.length > 0) {
      const roleMatches = await userRoles.map((role) => ({ userRole: role }));
      filters.push({
        $match: {
          $and: roleMatches,
        },
      });
    }

    const startDateStr = req.query.startDate;
    const endDateStr = req.query.endDate;

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr).toISOString();
      const endDate = new Date(endDateStr).toISOString();
      filters.push(
        { $unwind: "$pastExperience" },
        {
          $match: {
            "pastExperience.startDate": {
              $gte: startDate,
              $lte: endDate,
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            firstName: { $first: "$firstName" },
            lastName: { $first: "$lastName" },
            email: { $first: "$email" },
            address: { $first: "$address" },
            state: { $first: "$state" },
            city: { $first: "$city" },
            zip: { $first: "$zip" },
            jobRole: { $first: "$jobRole" },
            userRole: { $push: "$userRole" },
            color: { $first: "$color" },
            loginEmployeeId: { $first: "$loginEmployeeId" },
            pastExperience: { $push: "$pastExperience" },
            additionalInfo: { $first: "$additionalInfo" },
          },
        }
      );
    }

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize);
    const startIndex = page * pageSize - pageSize;

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
            $sort: { firstName: 1, _id: 1 },
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

    const employees = await Employee.aggregate(aggregationPipeline).exec();
    const data = {
      data: employees[0].data,
      totalRecords: employees[0].totalRecords[0].total,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, msg: error.message });
  }
};

const employeeById = async (req, res) => {
  try {
    let employee = await Employee.findById({ _id: req.params.id });

    employee = await Employee.aggregate([
      {
        $match: { _id: employee._id },
      },
      {
        $unwind: "$userRole",
      },
      {
        $lookup: {
          from: "roles",
          localField: "userRole",
          foreignField: "_id",
          as: "Uroles",
        },
      },
      {
        $group: {
          _id: "$_id",
          firstName: { $first: "$firstName" },
          lastName: { $first: "$lastName" },
          email: { $first: "$email" },
          address: { $first: "$address" },
          state: { $first: "$state" },
          city: { $first: "$city" },
          zip: { $first: "$zip" },
          jobRole: { $first: "$jobRole" },
          userRole: { $push: { value: "$Uroles._id", label: "$Uroles.role" } },
          color: { $first: "$color" },
          loginEmployeeId: { $first: "$loginEmployeeId" },
          pastExperience: { $first: "$pastExperience" },
          additionalInfo: { $first: "$additionalInfo" },
        },
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          address: 1,
          state: 1,
          city: 1,
          zip: 1,
          jobRole: 1,
          color: 1,
          loginEmployeeId: 1,
          pastExperience: 1,
          userRole: "$userRole",
          additionalInfo: 1,
        },
      },
    ]);

    employee[0].userRole = employee[0].userRole.map((role) => {
      return { value: role.value[0].toString(), label: role.label[0] };
    });
    res.status(200).json(...employee);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    let employee = await Employee.findOne({ _id: req.params.id });
    const employeeEmail = employee.email;
    let currentDate = new Date();
    let currentDateTime = currentDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    const deleteLogData = {
      loginEmployeeEmail: req.loginEmployeeEmail,
      page: "/userlist",
      action: "Employe Deleted",
      data: "",
      actionOnId: req.params.id,
      actionOnEmail: employeeEmail,
      timeStamp: currentDateTime,
    };
    await Employee.findOneAndDelete({ _id: req.params.id });
    await ActivityLog.create(deleteLogData);

    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const newUserRole = req.body.userRole.map(
      (str) => new mongoose.Types.ObjectId(str)
    );

    let oldEmployee = await Employee.findOne({ _id: req.params.id });

    oldEmployee = {
      firstName: oldEmployee.firstName,
      lastName: oldEmployee.lastName,
      email: oldEmployee.email,
      address: oldEmployee.address,
      state: oldEmployee.state,
      city: oldEmployee.city,
      zip: oldEmployee.zip,
      jobRole: oldEmployee.jobRole,
      userRole: oldEmployee.userRole,
      pastExperience: oldEmployee.pastExperience,
      color: oldEmployee.color,
      additionalInfo: oldEmployee.additionalInfo,
    };

    let newEmployee = req.body;
    newEmployee.additionalInfo = [req.body.additionalInfo];
    newEmployee.userRole = newUserRole;

    const updatedUserRole = getChangesInUserRole(
      oldEmployee.userRole,
      newEmployee.userRole
    );
    console.log("updatedUserRole", updatedUserRole);

    delete oldEmployee.userRole;
    delete newEmployee.userRole;

    let updatelog = await deepCompare(oldEmployee, newEmployee);

    console.log("updatelog", updatelog);

    updatelog.push(...updatedUserRole);
    // console.log("updatelog", updatelog);

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: req.params.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        address: req.body.address,
        state: req.body.state,
        city: req.body.city,
        zip: req.body.zip,
        jobRole: req.body.jobRole,
        userRole: newUserRole,
        loginEmployeeID: req.loginEmployeeId,
        pastExperience: req.body.pastExperience,
        additionalInfo: req.body.additionalInfo,
      },
      { new: true }
    );

    let currentDate = new Date();
    let currentDateTime = currentDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    let logData = {
      loginEmployeeEmail: req.loginEmployeeEmail,
      page: "/userform",
      action: "Employe Edited",
      data: updatelog,
      actionOnId: req.params.id,
      actionOnEmail: oldEmployee.email,
      timeStamp: currentDateTime,
    };

    // console.log(logData);

    if (updatelog.length > 0 || updatedUserRole.length > 0) {
      await ActivityLog.create(logData);
    }

    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

function getChangesInUserRole(oldUserRole, newUserRole) {
  let changes = [];
  if (oldUserRole.length !== newUserRole.length) {
    changes.push({
      path: "root.userRole",
      oldVal: oldUserRole,
      newVal: newUserRole,
    });
    return changes;
  } else {
    const tempOldVal = [];
    const tempNewVal = [];
    for (let i = 0; i < oldUserRole.length; i++) {
      let found = false;
      for (let j = 0; j < newUserRole.length; j++) {
        if (oldUserRole[i].toString() === newUserRole[j].toString()) {
          found = true;
          break; // Exit inner loop if a match is found
        }
      }
      if (!found) {
        tempOldVal.push(oldUserRole[i]);
        tempNewVal.push(newUserRole[i]);
      }
    }
    if (tempOldVal.length !== 0 && tempNewVal.length !== 0) {
      changes.push({
        path: `root.userRole`,
        oldVal: tempOldVal,
        newVal: tempNewVal,
      });
    }
    return changes;
  }
}

module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
};
