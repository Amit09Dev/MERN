<<<<<<< HEAD
const { Employee } = require("../models/EmployeeModel");
=======
const { LoginEmployee, Employee, Role } = require("../models/EmployeeModel");
>>>>>>> 5604ee7bd2055612e718045e1fbdf86cb62228ae
const jwt = require("jsonwebtoken");

const newEmployeeAdd = async (req, res) => {
  try {
    const newEmpData = req.body;

    const existingEmail = await Employee.findOne({
      email: newEmpData.email,
      loginEmployeeId: req.loginEmployeeId,
    });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      newEmpData.loginEmployeeId = req.loginEmployeeId;
      const _newEmpData = await Employee.create(newEmpData);
      res.status(200).json(_newEmpData);
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

const allEmployeeList = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const startIndex = page * pageSize - pageSize;

    const _loginEmployeeId = req.loginEmployeeId;

    let aggregationPipeline = [
      {
        $match: {
          loginEmployeeId: _loginEmployeeId,
        },
      },
    ];

    const fullName = req.query.fullName;
    if (fullName) {
      const [firstName, lastName] = fullName.split(" ");
      aggregationPipeline.push({
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
      const roleMatches = userRoles.map((role) => ({ userRole: role }));
      aggregationPipeline.push({
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
      aggregationPipeline.push(
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

    aggregationPipeline.push(
      {
        $skip: startIndex,
      },
      {
        $limit: pageSize,
      }
    );

    const employees = await Employee.aggregate(aggregationPipeline).exec();
    const pages = Math.ceil(employees.length / pageSize)
    console.log(employees.length / pageSize);
    const data = {

      "data": employees,
      "pages": pages
    }
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(400).send({ success: false, msg: error.message });
  }
};

const employeeById = async (req, res) => {
  try {
    const employee = await Employee.findById({ _id: req.params.id });
    res.status(200).json(employee);
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
    const employee = req.body;
    const existingEmail = await Employee.findOne({
      $and: [{ email: employee.email }, { _id: { $ne: req.params.id } }],
    });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
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
          userRole: req.body.userRole,
          loginEmployeeID: req.loginEmployeeId,
          pastExperience: req.body.pastExperience,
        },
        { new: true }
      );
      res.status(200).json({ msg: "success" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

<<<<<<< HEAD
=======
function getCurrentEmployeeLoggeedinId(authorization) {
  const token = authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, jwt_secret_key);
  const loginEmployeeId = decodedToken.loginEmployeeId;
  return loginEmployeeId;
}

const getUserRole = async (req, res) => {
  try {
    console.log('Fetching roles...')
    const roles = await Role.find({});
    console.log("Roles", roles)
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

>>>>>>> 5604ee7bd2055612e718045e1fbdf86cb62228ae
module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
  getUserRole
};
