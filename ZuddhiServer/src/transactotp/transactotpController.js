const Pool = require("pg").Pool;
const helper = require("../helper/helper")();
const common = require("../common")();

const { POSTGRESDBConfig, ERRORS } = require("../../config");

const pool = new Pool({
  user: POSTGRESDBConfig.user,
  host: POSTGRESDBConfig.host,
  database: POSTGRESDBConfig.database,
  password: POSTGRESDBConfig.password,
  port: POSTGRESDBConfig.port,
});

const OtpTranstSchema = [
  { name: "orderid", type: "int" },
  { name: "otpcode", type: "int" },
  { name: "requestedby", type: "int" },
  { name: "requestedfor", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const transactController = () => {
  var module = [];

  module.SendOTP = async (req) => {
    return new Promise(async (resolve) => {
      const input = req.body;
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      if (model.orderid <= 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid OrderId",
        });
      }

      inValid = await helper.IsNull(model.type);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Type of unlock is required",
        });
      }

      if (model.type !== "consignee" && model.type !== "consignor") {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid type of unlock",
        });
      }

      let tNum = model.type === "consignee" ? "consigneenum" : "consignornum";
      let query = `select ${tNum} from agschema.order where orderid=${model.orderid}`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Order details not found",
        });
      }

      const mobile = dbResult.data[0][tNum];

      query = `update agschema.otptransct set statusid=1 where orderid=${model.orderid} and requestedfor='${tNum}'`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      const otpNum = await helper.GetRandomNumber(111111, 999999);
      const sBody = `Dear Sir, %0A${otpNum} is your box unlocking code.`;

      const transact = {
        orderid: model.orderid,
        otpcode: otpNum,
        requestedby: 1,
        requestedfor: tNum,
        statusid: 0,
      };

      query = await helper.GetInsertQuery(
        "otptransct",
        "otpid",
        OtpTranstSchema,
        transact
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed updating transaction details",
        });
      }

      const smsMsg = {
        Body: sBody,
        Number: mobile,
        Sender: "HIREGT",
      };

      const rslt = await helper.SendSMS(smsMsg);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: `OTP has sent to ${tNum}`,
      });
    });
  };

  module.Unlock = async (req) => {
    return new Promise(async (resolve) => {
      const input = req.body;
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      if (model.orderid <= 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid OrderId",
        });
      }

      inValid = await helper.IsNull(model.type);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Type of unlock is required",
        });
      }

      if (model.type !== "consignee" && model.type !== "consignor") {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid type of unlock",
        });
      }

      if (!model.otpcode || model.otpcode <= 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "OTP Required",
        });
      }

      let tNum = model.type === "consignee" ? "consigneenum" : "consignornum";
      let query = `select otpid from agschema.otptransct where statusid=0 and orderid=${model.orderid} and otpcode=${model.otpcode} and requestedfor='${tNum}'`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Un-Authorized Request",
        });
      }

      const otpid = dbResult.data[0].otpid;

      query = `update agschema.otptransct set statusid=1 where otpid=${otpid}`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      query = `select c.controllerphonenumber from agschema.orderbox a
      left join agschema.boxcontroller b on b.mapid = a.mapid
      left join agschema.controller c on c.controllerid = b.controllerid
      where a.orderid=${model.orderid}`;

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Un-Authorized Request",
        });
      }

      dbResult.data.forEach(async (item) => {
        const mobile = item.controllerphonenumber;
        const smsMsg = {
          Body: "UNLOCK",
          Number: mobile,
          Sender: "HIREGT",
        };
        const rslt = await helper.SendSMS(smsMsg);
      });

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: `UNLOCK has sent for ${tNum}`,
      });
    });
  };

  module.UnlockBox = async (req) => {
    return new Promise(async (resolve) => {
      const input = { id: req.params.id };
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      if (model.id <= 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid box id",
        });
      }

      model.type = "admin";

      query = `select b.controllerphonenumber from agschema.boxcontroller a
      left join agschema.controller b on b.controllerid = a.controllerid
      where a.mapid='${model.id}';`;

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Un-Authorized Request",
        });
      }

      const mobile = dbResult.data[0].controllerphonenumber;
      const smsMsg = {
        Body: "UNLOCK",
        Number: mobile,
        Sender: "HIREGT",
      };

      const rslt = await helper.SendSMS(smsMsg);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: `UNLOCK has sent for ${mobile}`,
      });
    });
  };

  return module;
};

module.exports = transactController;
