const express = require("express");
const router = express.Router();
const controller = require("./companyController")();

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

router.route("/api/company").get(doGet);
router.route("/api/company/:id").get(doGetSingle);
router.route("/api/company").post(doAdd);
router.route("/api/company").put(doUpdate);
/* router.route("/api/company/:id").delete(doDelete); */

module.exports = router;
