const express = require("express");
const router = express.Router();
const controller = require("./addressController")();

const doGet = async (req, res, next) => {
  const result = await controller.GetList();
  res.send(result);
};

const doGetSingle = async (req, res, next) => {
  const result = await controller.Get({ id: req.params.id });
  res.send(result);
};

const doAdd = async (req, res, next) => {
  const result = await controller.Insert(req.body);
  res.send(result);
};

const doDelete = async (req, res, next) => {
  const result = await controller.Delete({ id: req.params.id });
  res.send(result);
};

const doUpdate = async (req, res, next) => {
  const result = await controller.Update(req.body);
  res.send(result);
};

router.route("/api/address/:id").get(doGetSingle);
router.route("/api/address").get(doGet);
router.route("/api/address").post(doAdd);
router.route("/api/address/:id").delete(doDelete);
router.route("/api/address").put(doUpdate);

module.exports = router;
