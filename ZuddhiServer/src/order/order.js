const express = require("express");
const router = express.Router();
const controller = require("./orderController")();

const doGet = async (req, res, next) => {
  const result = await controller.GetList(req);
  res.send(result);
};

const doGetSingle = async (req, res, next) => {
  const result = await controller.Get(req);
  res.send(result);
};

const doGetBarcode = async (req, res, next) => {
  const result = await controller.GetOrderByBarcode(req);
  res.send(result);
};

const doAdd = async (req, res, next) => {
  const result = await controller.Insert(req);
  res.send(result);
};

const doAddApi = async (req, res, next) => {
  const result = await controller.InsertApi(req);
  res.send(result);
};

const doAddBox = async (req, res, next) => {
  const result = await controller.AddBox(req);
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

const doGetByNum = async (req, res, next) => {
  const result = await controller.GetByNumber(req);
  res.send(result);
};

const doCancel = async (req, res, next) => {
  const result = await controller.Cancel(req);
  res.send(result);
};

const doOrderStatus = async (req, res, next) => {
  const result = await controller.OrderStatus(req);
  res.send(result);
};

const doGetBoxList = async (req, res, next) => {
  const result = await controller.GetBoxList(req);
  res.send(result);
};

router.route("/api/ordernum/:id").get(doGetByNum);
router.route("/api/order/:id").get(doGetSingle);
router.route("/api/order").get(doGet);
router.route("/api/orderbycode/:id").get(doGetBarcode);
router.route("/api/order").post(doAdd);
router.route("/api/addbox").post(doAddBox);
router.route("/api/order/:id").delete(doDelete);
router.route("/api/cancelorder/:id").get(doCancel);
router.route("/api/orderstatus").post(doOrderStatus);
router.route("/api/orderapi").post(doAddApi);
router.route("/api/orderbox/:id").get(doGetBoxList);

module.exports = router;
