const { Role } = require("../models/userRoleModel");

const getUserRole = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    console.log("getUserRole");
    res.status(400).send({ success: false, msg: error.message });
  }
};

module.exports = { getUserRole };
