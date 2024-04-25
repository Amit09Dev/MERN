const { Employee } = require("../models/EmployeeModel");
const { ActivityLog } = require("../models/activityLogModel");
const { Role } = require("../models/userRoleModel");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const _ = require("lodash");
const { json } = require("body-parser");

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
      const _actionOnEmp = await Employee.findOne({ email: _newEmpData.email })
      let _actionOnId = (_actionOnEmp._id).toString()
      // _actionOnId.toString()
      // console.log(_actionOnId);
      const addLogData = {
        loginEmployeeEmail: req.loginEmployeeEmail,
        page: "/userform",
        action: "Employe Added",
        data: "",
        actionOnId: _actionOnId,
        actionOnEmail: _newEmpData.email,
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
    const pageSize = parseInt(req.query.pageSize);
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
    const startIndex = (page * pageSize) - pageSize;

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
    const employeeEmail = employee.email
    console.log(employeeEmail);
    const deleteLogData = {
      loginEmployeeEmail: req.loginEmployeeEmail,
      page: "/userlist",
      action: "Employe Deleted",
      data: "",
      actionOnId: req.params.id,
      actionOnEmail: employeeEmail,
    };
    console.log(deleteLogData);
    await Employee.findOneAndDelete({ _id: req.params.id });
    await ActivityLog.create(deleteLogData);

    res.status(200).json({ msg: "deleted" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    console.log(req.body.userRole);
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

    };

    let newEmployee = req.body;
    newEmployee.userRole = newUserRole;

    // const updatelog = diff(oldEmployee, req.body);

    const updatelog = logChanges(oldEmployee, newEmployee);



    // console.log(oldEmployee.pastExperience);

    // console.log(updatelog);
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
        additionalInfo: req.body.additionalInfo
      },
      { new: true }
    );

    let logData = {
      loginEmployeeEmail: req.loginEmployeeEmail,
      page: "/userform",
      action: "Employe Edited",
      data: updatelog,
      actionOnId: req.params.id,
      actionOnEmail: oldEmployee.email,
    };


// console.log("elog",logData.data);

    const tempLogData = delete logData.data.additionalInfo;
    // console.log("temp",logData);
    await ActivityLog.create(logData);

    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

function logChanges(oldData, newData) {
  let oldDataCopy = _.cloneDeep(oldData);
  let newDataCopy = _.cloneDeep(newData);
  const changes = {};

  // function compareArrays(oldArray, newArray, key) {
  //   let hasChanges = false;

  //   if (oldArray.length !== newArray.length) {
  //     hasChanges = true;
  //   } else {
  //     for (let i = 0; i < oldArray.length; i++) {
  //       if (oldArray[i] instanceof ObjectId && newArray[i] instanceof ObjectId) {
  //           if (oldArray[i].toString() !== newArray[i].toString()) {
  //               hasChanges = true;
  //               break;
  //           }
  //       } else {
  //           if (oldArray[i] !== newArray[i]) {
  //               hasChanges = true;
  //               break;
  //           }
  //       }
  //   }
  //   }

  //   if (hasChanges) {
  //     changes[key] = { old: oldArray, new: newArray };
  //   }
  // }

  // function compareArrays(oldArray, newArray, key) {
  //   let hasChanges = false;

  //   if (oldArray.length !== newArray.length) {
  //     hasChanges = true;
  //   } else {
  //     for (let i = 0; i < oldArray.length; i++) {
  //       const oldElement = oldArray[i];
  //       const newElement = newArray[i];

  //       // Check if the elements are objects
  //       if (typeof oldElement === "object" && typeof newElement === "object") {
  //         // Compare objects
  //         const oldKeys = Object.keys(oldElement);
  //         const newKeys = Object.keys(newElement);

  //         if (
  //           oldKeys.length !== newKeys.length ||
  //           !oldKeys.every((key) => newKeys.includes(key))
  //         ) {
  //           hasChanges = true;
  //           break;
  //         }

  //         // Compare the properties of the objects
  //         for (const prop of oldKeys) {
  //           if (oldElement[prop] !== newElement[prop]) {
  //             hasChanges = true;
  //             break;
  //           }
  //         }
  //       } else {
  //         // Compare other types of elements
  //         if (oldElement !== newElement) {
  //           hasChanges = true;
  //           break;
  //         }
  //       }

  //       if (hasChanges) {
  //         break;
  //       }
  //     }
  //   }

  //   if (hasChanges) {
  //     changes[key] = { old: oldArray, new: newArray };
  //   }
  // }



  function compareArrays(oldArray, newArray, key) {
    let hasChanges = false;

    if (oldArray.length !== newArray.length) {
      hasChanges = true;
      hasChanges = true;
    } else {
      for (let i = 0; i < oldArray.length; i++) {
        const oldElement = oldArray[i];
        const newElement = newArray[i];
        for (let i = 0; i < oldArray.length; i++) {
          const oldElement = oldArray[i];
          const newElement = newArray[i];

          // Check if the elements are MongoDB ObjectId instances
          if (oldElement instanceof ObjectId && newElement instanceof ObjectId) {
            if (oldElement.toString() !== newElement.toString()) {
              hasChanges = true;
              break;
            }
          } else if (typeof oldElement === 'object' && typeof newElement === 'object') {
            // Compare objects
            const oldKeys = Object.keys(oldElement);
            const newKeys = Object.keys(newElement);
            // Check if the elements are MongoDB ObjectId instances
            if (oldElement instanceof ObjectId && newElement instanceof ObjectId) {
              if (oldElement.toString() !== newElement.toString()) {
                hasChanges = true;
                break;
              }
            } else if (typeof oldElement === 'object' && typeof newElement === 'object') {
              // Compare objects
              const oldKeys = Object.keys(oldElement);
              const newKeys = Object.keys(newElement);

              if (oldKeys.length !== newKeys.length || !oldKeys.every(key => newKeys.includes(key))) {
                hasChanges = true;
                break;
              }
              if (oldKeys.length !== newKeys.length || !oldKeys.every(key => newKeys.includes(key))) {
                hasChanges = true;
                break;
              }

              // Compare the properties of the objects
              for (const prop of oldKeys) {
                if (oldElement[prop] !== newElement[prop]) {
                  hasChanges = true;
                  break;
                }
              }
            } else {
              // Compare other types of elements
              if (oldElement !== newElement) {
                hasChanges = true;
                break;
              }
            }
            // Compare the properties of the objects
            for (const prop of oldKeys) {
              if (oldElement[prop] !== newElement[prop]) {
                hasChanges = true;
                break;
              }
            }
          } else {
            // Compare other types of elements
            if (oldElement !== newElement) {
              hasChanges = true;
              break;
            }
          }

          if (hasChanges) {
            break;
          }
        }
        if (hasChanges) {
          break;
        }
      }
    }

    if (hasChanges) {
      changes[key] = { old: oldArray, new: newArray };
      changes[key] = { old: oldArray, new: newArray };
    }
  }



function compareObjects(oldObj, newObj) {
  Object.keys(newObj).forEach((key) => {
    if (Array.isArray(oldObj[key]) && Array.isArray(newObj[key])) {
      compareArrays(oldObj[key], newObj[key], key);
    } else if (
      typeof oldObj[key] === "object" &&
      typeof newObj[key] === "object"
    ) {
      compareObjects(oldObj[key], newObj[key]);
    } else {
      if (oldObj[key] !== newObj[key]) {
        changes[key] = { old: oldObj[key], new: newObj[key] };
      }
    }
  });
}

compareObjects(oldDataCopy, newDataCopy);

return changes;
}

// function logChanges(oldData, newData) {
//   const changes = {};

//   // Iterate over keys in the new data
//   Object.keys(newData).forEach(key => {
//       if (key in oldData) {
//           // If the key exists in both old and new data
//           if (oldData[key] !== newData[key]) {
//               changes[key] = { old: oldData[key], new: newData[key] };
//           }
//       } else {
//           // If the key is only in the new data
//           changes[key] = { old: null, new: newData[key] };
//       }
//   });

//   // Iterate over keys in the old data to find deleted keys
//   Object.keys(oldData).forEach(key => {
//       if (!(key in newData)) {
//           // If the key is in old data but not in new data
//           changes[key] = { old: oldData[key], new: null };
//       }
//   });

//   return changes;
// }

module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
};
