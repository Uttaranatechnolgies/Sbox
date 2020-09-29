const express = require("express");
const router = express.Router();
const controller = require("./regionController")();

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

const doGetStatusTypes = async (req, res, next) => {
  const result = await controller.GetStatusList(req);
  res.send(result);
};

router.route("/api/region/:id").get(doGetSingle);
router.route("/api/region").get(doGet);
router.route("/api/region").post(doAdd);
router.route("/api/region/:id").delete(doDelete);
router.route("/api/region").put(doUpdate);
router.route("/api/statustypes").get(doGetStatusTypes);

module.exports = router;
