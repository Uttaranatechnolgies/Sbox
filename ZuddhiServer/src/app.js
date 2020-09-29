const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Expose-Headers", "Content-Length");
  res.header(
    "Access-Control-Allow-Headers",
    "Accept, Authorization, Content-Type, X-Requested-With, Range"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } else {
    return next();
  }
});

app.use(require("./user/user"));
app.use(require("./region/region"));
app.use(require("./zone/zone"));
app.use(require("./area/area"));
app.use(require("./controller/controller"));
app.use(require("./box/box"));
app.use(require("./boxcontrol/boxcontrol"));
app.use(require("./agent/agent"));
app.use(require("./order/order"));
app.use(require("./transactotp/transactotp"));
app.use(require("./address/address"));
app.use(require("./agentpin/agentpin"));
app.use(require("./company/company"));
app.use(require("./merchant/merchant"));
app.use(require("./partner/partner"));
app.use(require("./merchantpartner/merchantpartner"));

module.exports = app;
