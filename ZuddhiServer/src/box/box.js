const express = require("express");
const router = express.Router();
const controller = require("./boxController")();

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

router.route("/api/box").get(doGet);
router.route("/api/box/:id").get(doGetSingle);
router.route("/api/box").post(doAdd);
router.route("/api/box/:id").delete(doDelete);
router.route("/api/box").put(doUpdate);

module.exports = router;
