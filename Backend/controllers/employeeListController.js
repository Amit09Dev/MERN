const { Employee, Role } = require("../models/EmployeeModel");
const mongoose = require("mongoose");

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
          userRole: { $reduce: { input: "$userRole", initialValue: [], in: { $concatArrays: ["$$value", "$$this"] } } }, // Convert array of arrays to a single array
        },
      },
    ];

    const filters = [];

    const fullName = req.query.fullName;
    console.log(req.query);
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

      const roleMatches = userRoles.map((role) => ({ userRole:role }));
      filters.push({
        $match: {
          $and: roleMatches
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
            userRole: { $first: "$userRole" },
            color: { $first: "$color" },
            loginEmployeeId: { $first: "$loginEmployeeId" },
            pastExperience: { $push: "$pastExperience" },
          },
        }
      );
    }

    const countPipeline = [
      { $match: { loginEmployeeId: _loginEmployeeId } },
      ...filters,
      { $count: "total" },
    ];

    const totalEmployees = await Employee.aggregate(countPipeline).exec();
    const totalDocuments =
      totalEmployees.length > 0 ? totalEmployees[0].total : 0;

    const page = parseInt(req.query.page) || 1;
    const startIndex = page * pageSize - pageSize;

    aggregationPipeline.push(...filters);

    aggregationPipeline.push({ $skip: startIndex }, { $limit: pageSize });

    const employees = await Employee.aggregate(aggregationPipeline).exec();
    const data = {
      data: employees,
      totalRecords: totalDocuments,
    };
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, msg: error.message });
  }
};











// const allEmployeeList = async (req, res) => {
//   try {
//     const pageSize = parseInt(req.query.pageSize);
//     const _loginEmployeeId = req.loginEmployeeId;
//     let aggregationPipeline = [
//       {
//         $match: {
//           loginEmployeeId: _loginEmployeeId,
//         },
//       },
//       {
//         $unwind: "$userRole",
//       },
//       {
//         $lookup: {
//           from: "roles",
//           localField: "userRole",
//           foreignField: "_id",
//           as: "Uroles",
//         },
//       },
//       {
//         $group: {
//           _id: "$_id",
//           firstName: { $first: "$firstName" },
//           lastName: { $first: "$lastName" },
//           email: { $first: "$email" },
//           address: { $first: "$address" },
//           state: { $first: "$state" },
//           city: { $first: "$city" },
//           zip: { $first: "$zip" },
//           jobRole: { $first: "$jobRole" },
//           userRole: { $push: "$Uroles.role" },
//           color: { $first: "$color" },
//           loginEmployeeId: { $first: "$loginEmployeeId" },
//           pastExperience: { $first: "$pastExperience" },
//         },
//       },
//       {
//         $project: {
//           _id: 1,
//           firstName: 1,
//           lastName: 1,
//           email: 1,
//           address: 1,
//           state: 1,
//           city: 1,
//           zip: 1,
//           jobRole: 1,
//           color: 1,
//           loginEmployeeId: 1,
//           pastExperience: 1,
//           userRole: 1,
//         },
//       },
//     ];

//     const filters = [];

//     const fullName = req.query.fullName;
//     if (fullName) {
//       const [firstName, lastName] = fullName.split(" ");
//       filters.push({
//         $match: {
//           $and: [
//             { firstName: { $regex: new RegExp(firstName, "i") } },
//             { lastName: { $regex: new RegExp(lastName, "i") } },
//           ],
//         },
//       });
//     }

//     const userRoles = req.query.userRole;
//     console.log(userRoles);
//     if (userRoles && userRoles.length > 0) {

//       // const roleMatches = userRoles.map((role) => new mongoose.Types.ObjectId(role));
//       // console.log(roleMatches);
//       filters.push({
//         $match: {
//           $and: [{userRole: { $in: userRoles }}],
//         },
//       });
//     }

//     const startDateStr = req.query.startDate;
//     const endDateStr = req.query.endDate;

//     if (startDateStr && endDateStr) {
//       const startDate = new Date(startDateStr).toISOString();
//       const endDate = new Date(endDateStr).toISOString();
//       filters.push(
//         { $unwind: "$pastExperience" },
//         {
//           $match: {
//             "pastExperience.startDate": {
//               $gte: startDate,
//               $lte: endDate,
//             },
//           },
//         },
//         {
//           $group: {
//             _id: "$_id",
//             firstName: { $first: "$firstName" },
//             lastName: { $first: "$lastName" },
//             email: { $first: "$email" },
//             address: { $first: "$address" },
//             state: { $first: "$state" },
//             city: { $first: "$city" },
//             zip: { $first: "$zip" },
//             jobRole: { $first: "$jobRole" },
//             userRole: { $first: "$userRole" },
//             color: { $first: "$color" },
//             loginEmployeeId: { $first: "$loginEmployeeId" },
//             pastExperience: { $push: "$pastExperience" },
//           },
//         }
//       );
//     }

//     const countPipeline = [
//       { $match: { loginEmployeeId: _loginEmployeeId } },
//       ...filters,
//       { $count: "total" },
//     ];

//     const totalEmployees = await Employee.aggregate(countPipeline).exec();
//     const totalDocuments =
//       totalEmployees.length > 0 ? totalEmployees[0].total : 0;

//     const page = parseInt(req.query.page) || 1;
//     const startIndex = page * pageSize - pageSize;


//     // let testEmployees = await Employee.aggregate(aggregationPipeline).exec();

//     // testEmployees.userRole = testEmployees.map((employee) => {
//     //   employee.userRole = employee.userRole.map((role) => role[0]);
//     // });

//     aggregationPipeline.push(...filters);

//     aggregationPipeline.push({ $skip: startIndex }, { $limit: pageSize });


//     const employees = await Employee.aggregate(aggregationPipeline).exec();
//     const data = {
//       data: employees,
//       totalRecords: totalDocuments,
//     };
//     res.status(200).json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(400).send({ success: false, msg: error.message });
//   }
// };

const employeeById = async (req, res) => {
  try {
    let employee = await Employee.findById({ _id: req.params.id });

    employee = await Employee.aggregate([
      {
        $match: { _id: employee._id }
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
        },
      },
    ]);

    employee[0].userRole = employee[0].userRole.map((role) => {
      return {value : role.value[0].toString(), label : role.label[0]}
    })
    res.status(200).json(...employee);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    await Employee.findOneAndDelete({ _id: req.params.id });
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
      },
      { new: true }
    );
    res.status(200).json({ msg: "success" });
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
  getUserRole,
};
