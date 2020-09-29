const express = require("express");
const router = express.Router();
const controller = require("./merchantController")();

const doGet = async (req, res, next) => {
  const result = await controller.GetList(req);
  res.send(result);
};

const doGetSelect = async (req, res, next) => {
  const result = await controller.GetSelect(req);
  res.send(result);
};

const doGetSingle = async (req, res, next) => {
  const result = await controller.Get(req);
  res.send(result);
};

const doAdd = async (req, res, next) => {
  const result = await controller.Insert(req);
  res.send(result);
};

const doDelete = async (req, res, next) => {
  const result = await controller.Delete(req);
  res.send(result);
};

const doUpdate = async (req, res, next) => {
  const result = await controller.Update(req);
  res.send(result);
};

router.route("/api/merchant").get(doGet);
router.route("/api/merchantselect").get(doGetSelect);
router.route("/api/merchant/:id").get(doGetSingle);
router.route("/api/merchant").post(doAdd);
router.route("/api/merchant").put(doUpdate);

module.exports = router;
