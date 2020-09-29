const express = require("express");
const router = express.Router();
const controller = require("./partnerController")();

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

router.route("/api/partner").get(doGet);
router.route("/api/partnerselect").get(doGetSelect);
router.route("/api/partner/:id").get(doGetSingle);
router.route("/api/partner").post(doAdd);
router.route("/api/partner").put(doUpdate);

module.exports = router;
