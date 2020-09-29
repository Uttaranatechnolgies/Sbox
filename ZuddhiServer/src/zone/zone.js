const express = require("express");
const router = express.Router();
const controller = require("./zoneController")();

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

router.route("/api/zone").get(doGet);
router.route("/api/zone/:id").get(doGetSingle);
router.route("/api/zone").post(doAdd);
router.route("/api/zone/:id").delete(doDelete);
router.route("/api/zone").put(doUpdate);

module.exports = router;
