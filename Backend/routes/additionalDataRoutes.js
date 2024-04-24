const express = require("express");
const body_parser = require("body-parser");
const {
  additionalFieldsData, additionalFields, deleteAdditionalFields
} = require("../controllers/additionalDataController");

const additionalDataRoutes = express();
additionalDataRoutes.use(body_parser.json());
additionalDataRoutes.use(body_parser.urlencoded({ extended: true }));

additionalDataRoutes.post("/additionalFields", additionalFieldsData);
additionalDataRoutes.get("/additionalFields", additionalFields);
additionalDataRoutes.delete("/deleteFields/:id", deleteAdditionalFields)

module.exports = additionalDataRoutes;
