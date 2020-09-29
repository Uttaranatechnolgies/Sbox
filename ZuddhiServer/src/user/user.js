const express = require("express");
const router = express.Router();
const controller = require("./userController")();

const doLogin = async (req, res, next) => {
  const result = await controller.Login(req);
  res.send(result);
};

router.route("/api/login").post(doLogin);

module.exports = router;
