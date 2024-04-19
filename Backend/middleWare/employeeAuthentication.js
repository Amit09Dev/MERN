const jwt = require("jsonwebtoken");
const jwt_secret_key = "YJDRetsrtcdyutoiUtv!cyuzsterQWerqwsrtxcyuvuiRyuoitxsERTwirytuev";

const authenticateEmployee = (req, res, next) => {
  const tokenHeader = req.headers.authorization;
  if (tokenHeader) {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, jwt_secret_key);
    const loginEmployeeId = decodedToken.loginEmployeeId;
    req.loginEmployeeId = loginEmployeeId;
    req.loginEmployeeEmail = decodedToken.loginEmployeeEmail;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

const verifyToken = async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];
      jwt.verify(token, jwt_secret_key, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }
        res.status(200).json({loginEmployeeId:decoded.loginEmployeeId, msg: "Token validation successful"});
      });
    } catch (error) {
      res.status(400).send({ success: false, msg: error.message });
    }
  };

module.exports = { authenticateEmployee, verifyToken };
