const { LoginEmployee, Employee, Role } = require("../models/EmployeeModel");
const jwt = require("jsonwebtoken");
const { all } = require("../routes/employeeLoginRoutes");
const jwt_secret_key =
  "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";

const newEmployeeAdd = async (req, res) => {
  try {
    const newEmpData = req.body;

    const existingEmail = await Employee.findOne({
      email: newEmpData.email,
      loginEmployeeId: getCurrentEmployeeLoggeedinId(req.headers.authorization),
    });

    if (existingEmail) {
      res.status(409).json({ message: "Email has already been used" });
    } else {
      newEmpData.loginEmployeeId = getCurrentEmployeeLoggeedinId(req.headers.authorization);
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
    const startIndex = (page * pageSize) - pageSize;

    const _loginEmployeeId = getCurrentEmployeeLoggeedinId(req.headers.authorization);

    let aggregationPipeline = [
      {
        $match: {
          loginEmployeeId: _loginEmployeeId,
        },
      }
    ];

    const fullName = req.query.fullName;
    if (fullName) {
      const [firstName, lastName] = fullName.split(" ");
      aggregationPipeline.push({
        $match: {
          $and: [
            { firstName: { $regex: new RegExp(firstName, 'i') } },
            { lastName: { $regex: new RegExp(lastName, 'i') } },
          ],
        },
      });
    }

    const userRoles = req.query.userRole;
    if (userRoles && userRoles.length > 0) {
      const roleMatches = userRoles.map(role => ({ userRole: role }));
      aggregationPipeline.push({
        $match: {
          $and: roleMatches
        }
      });
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
          loginEmployeeID: getCurrentEmployeeLoggeedinId(req.headers.authorization),
          pastExperience: req.body.pastExperience
        },
        { new: true }
      );
      res.status(200).json({ msg: "success" });
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
};

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

module.exports = {
  newEmployeeAdd,
  allEmployeeList,
  employeeById,
  deleteEmployee,
  updateEmployee,
  getUserRole
};
