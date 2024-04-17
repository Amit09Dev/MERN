const express = require("express");
const body_parser = require("body-parser");
const {companyData} = require("../controllers/companyDataController");

const companyDataRoutes = express();
companyDataRoutes.use(body_parser.json());
companyDataRoutes.use(body_parser.urlencoded({ extended: true }));

companyDataRoutes.post("/companyData", companyData)

module.exports = companyDataRoutes;