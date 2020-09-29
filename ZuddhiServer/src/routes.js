const express = require("express");
const router = express.Router();

router.get("/", getHome);
router.get("/getList", getList);

module.exports = router;

function getHome(req, res, next) {
  res
    .status(200)
    .json({ status: 200, statusMsg: "I will be back for Home Page" });
}

function getList(req, res, next) {
  res
    .status(200)
    .json({ status: 200, statusMsg: "I will be back for List Page" });
}
