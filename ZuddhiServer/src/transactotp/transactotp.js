const express = require("express");
const router = express.Router();
const controller = require("./transactotpController")();

const doSendOTP = async (req, res, next) => {
  const result = await controller.SendOTP(req);
  res.send(result);
};

const doUnlock = async (req, res, next) => {
  const result = await controller.Unlock(req);
  res.send(result);
};

const doUnlockBox = async (req, res, next) => {
  const result = await controller.UnlockBox(req);
  res.send(result);
};

router.route("/api/sendotp").post(doSendOTP);
router.route("/api/unlock").post(doUnlock);
router.route("/api/unlock/:id").get(doUnlockBox);

module.exports = router;
