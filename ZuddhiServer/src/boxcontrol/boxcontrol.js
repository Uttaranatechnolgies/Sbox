const express = require("express");
const router = express.Router();
const controller = require("./boxControlController")();

const doGet = async (req, res, next) => {
  const result = await controller.GetList(req);
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

router.route("/api/boxcontrol").get(doGet);
router.route("/api/boxcontrol/:id").get(doGetSingle);
router.route("/api/boxcontrol").post(doAdd);
router.route("/api/boxcontrol/:id").delete(doDelete);
router.route("/api/boxcontrol").put(doUpdate);

module.exports = router;
