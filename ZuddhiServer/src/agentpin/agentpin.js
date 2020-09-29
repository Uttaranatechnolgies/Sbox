const express = require("express");
const router = express.Router();
const controller = require("./agentpinController")();

const doMobilePin = async (req, res, next) => {
  const result = await controller.Validate(req.body);
  res.send(result);
};

const doMobileNewPin = async (req, res, next) => {
  const result = await controller.NewPinRequest(req);
  res.send(result);
};

router.route("/api/agentpin").post(doMobilePin);
router.route("/api/agentnpin").post(doMobileNewPin);

module.exports = router;
