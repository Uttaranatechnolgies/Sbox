const Pool = require("pg").Pool;
const helper = require("../helper/helper")();
const common = require("../common")();
const Agent = require("../agent/agentController")();
const Address = require("../address/addressController")();

const { POSTGRESDBConfig, ERRORS } = require("../../config");

const pool = new Pool({
  user: POSTGRESDBConfig.user,
  host: POSTGRESDBConfig.host,
  database: POSTGRESDBConfig.database,
  password: POSTGRESDBConfig.password,
  port: POSTGRESDBConfig.port,
});

const OrderSchema = [
  { name: "ordernum", type: "string" },
  { name: "agentid", type: "string" },
  { name: "consignee", type: "string" },
  { name: "consigneenum", type: "string" },
  { name: "consignor", type: "string" },
  { name: "consignornum", type: "string" },
  { name: "senderid", type: "int" },
  { name: "sendertype", type: "int" },
  { name: "comments", type: "string" },
  { name: "createdon", type: "string" },
  { name: "orderstatusid", type: "int" },
];

const OrderSchemaU = [
  { name: "ordernum", type: "string" },
  { name: "consignee", type: "string" },
  { name: "consigneenum", type: "string" },
  { name: "consignor", type: "string" },
  { name: "consignornum", type: "string" },
  { name: "senderid", type: "int" },
  { name: "sendertype", type: "int" },
  { name: "comments", type: "string" },
  { name: "updatedon", type: "string" },
  { name: "orderstatusid", type: "int" },
];

const orderController = () => {
  var module = [];

  module.GetList = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select a.*,b.orderstatusname,
      (select count(oboxid) from agschema.orderbox where orderid=a.orderid) as NumOfBoxes,
      c.agentnum,c.agentname,c.mobile,a.senderid,
	    (CASE WHEN a.sendertype = 3 then e.partnername WHEN a.sendertype != 3 then d.merchantname end) as companyname
      from agschema.order a
      left join agschema.orderstatustype b on b.orderstatusid = a.orderstatusid	  
      left join agschema.agent c on c.agentid=a.agentid
	    left join agschema.merchant d on d.merchantid = a.senderid
	    left join agschema.partner e on e.partnerid = a.senderid
      order by a.orderid desc;`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }
      return resolve({
        status: ERRORS.SUCCESS,
        statusText: dbResult.statusText,
        data: dbResult.data,
      });
    });
  };

  module.GetBoxList = async (req) => {
    return new Promise(async (resolve) => {
      const input = { id: req.params.id };
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select a.mapid, b.barcode as Box, c.barcode as Controller, 
      c.controllerphonenumber as Phone,c.version from agschema.orderbox a
        left join agschema.boxcontroller b on b.mapid = a.mapid
        left join agschema.controller c on c.controllerid = b.controllerid
        where a.orderid = '${input.id}';`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }
      return resolve({
        status: ERRORS.SUCCESS,
        statusText: dbResult.statusText,
        data: dbResult.data,
      });
    });
  };

  module.Get = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      if (isNaN(model.id)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid input value",
        });
      }

      let id = parseInt(model.id);
      let query = `select a.*,b.orderstatusname,
      (select count(orderid) from agschema.orderbox where orderid = a.orderid) as noofboxes
      from agschema.order a left join agschema.orderstatustype b on b.orderstatusid = a.orderstatusid 
       where a.orderid=${id};`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }
      return resolve({
        status: ERRORS.SUCCESS,
        statusText: dbResult.statusText,
        data: dbResult.data,
      });
    });
  };

  module.GetByNumber = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      let query = `select orderid,consigneenum,orderstatusid from agschema.order where ordernum='${model.id}';`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: dbResult.statusText,
        data: dbResult.data,
      });
    });
  };

  module.GetOrderByBarcode = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      inValid = await helper.IsNull(model.id);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid Barcode",
        });
      }

      let dbResult = await IsValidBarcode(model.id);
      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let mapid = parseInt(dbResult.data);
      let query = `select o.orderid,o.ordernum,o.orderstatusid from agschema.order o
       left join agschema.orderbox b on b.orderid = o.orderid 
       where o.orderstatusid != 4 and o.orderstatusid != 5 and b.mapid='${mapid}';`;

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }

      if (dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: "No orders found",
          data: { mapid: mapid },
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: {
          mapid: mapid,
          orderid: dbResult.data[0].orderid,
          ordernum: dbResult.data[0].ordernum,
          statusid: dbResult.data[0].orderstatusid,
        },
      });
    });
  };

  module.AddBox = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      if (!model.orderid || model.orderid === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid OrderId",
        });
      }

      let dbResult = await IsValidBarcode(model.barcode);
      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let mapid = parseInt(dbResult.data);
      let query = `select o.orderid,o.ordernum,o.orderstatusid from agschema.order o
       left join agschema.orderbox b on b.orderid = o.orderid 
       where o.orderstatusid != 4 and o.orderstatusid != 5 and b.mapid='${mapid}';`;

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }

      if (dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: "Box is alreay in use",
        });
      }

      query = `insert into agschema.orderbox (orderid,mapid) values (${model.orderid},${mapid}) RETURNING oboxid`;
      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }

      if (dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new box",
        });
      }

      query = `update agschema.order set updatedon='${new Date().toUTCString()}',
      orderstatusid=2 where orderid='${model.orderid}';`;

      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  };

  module.Insert = async (req) => {
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
      model.requesttype = 0;

      model.agentid = user.agentid;

      let data = await PlaceOrder(model);
      return resolve(data);
    });
  };

  module.Cancel = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      if (isNaN(model.id)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid input value",
        });
      }

      let id = parseInt(model.id);

      let query = `update agschema.order set orderstatusid=2 where orderid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Cancelled the ${id} order successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No order found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to cancel the ${id} order`,
      });
    });
  };

  module.OrderStatus = async (req) => {
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
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      if (isNaN(model.id)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid input value",
        });
      }

      let id = parseInt(model.id);

      let query = `update agschema.order set orderstatusid=${input.statusid} where orderid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Updated the ${id} order successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No order found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to update the ${id} order`,
      });
    });
  };

  module.InsertApi = async (req) => {
    return new Promise(async (resolve) => {
      const input = req.body;
      let inValid = false;

      let authCode = undefined;

      if (req && req.headers && req.headers.authorization) {
        authCode = req.headers.authorization.substring(7);
      }

      inValid = await helper.IsNull(authCode);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid AccessKey",
        });
      }

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      if (!model.senderid || model.senderid === "") {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "SenderId is required",
        });
      }

      if (!parseInt(model.senderid) || parseInt(model.senderid) === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid SenderId",
        });
      }

      inValid = await helper.IsNull(model.sendertype);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Sender type is required",
        });
      }

      if (model.sendertype !== "M" && model.sendertype !== "P") {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Sender type is invalid",
        });
      }

      let senderType = model.sendertype;
      let senderid = parseInt(model.senderid);
      let dbResult = null;
      let keyId = senderid;

      if (senderType === "P") {
        dbResult = await common.IsRecordExist("partner", "partnerid", [
          {
            name: "partnerid",
            value: senderid,
          },
        ]);
        if (dbResult.status !== ERRORS.SUCCESS) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `SenderId does not exist`,
          });
        }

        if (!model.merchantid || model.merchantid === "") {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: "Merchantid is required",
          });
        }

        keyId = parseInt(model.merchantid);
        if (keyId === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: "Invalid Merchantid",
          });
        }

        dbResult = await common.IsRecordExist("merchantpartner", "mapid", [
          {
            name: "partnerid",
            value: senderid,
          },
          {
            name: "merchantid",
            value: keyId,
          },
        ]);
        if (dbResult.status !== ERRORS.SUCCESS) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Merchant is not subscribed with this partner`,
          });
        }
      }

      dbResult = await common.IsRecordExist("merchant", "merchantid", [
        {
          name: "merchantid",
          value: keyId,
        },
      ]);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText:
            senderType === "M"
              ? `SenderId does not exist`
              : `Merchant does not exist`,
        });
      }

      model.requesttype = 1;

      if (senderType === "M") {
        dbResult = await common.IsRecordExist("merchant", "merchantid", [
          {
            name: "merchantid",
            value: keyId,
          },
          {
            name: "merchantsecret",
            value: authCode,
          },
        ]);
      } else {
        dbResult = await common.IsRecordExist("partner", "partnerid", [
          {
            name: "partnerid",
            value: senderid,
          },
          {
            name: "partnersecret",
            value: authCode,
          },
        ]);
      }

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Invalid Authentication`,
        });
      }

      obj = await validateOrderAgentDetails(model);
      if (obj.status !== ERRORS.SUCCESS) {
        return resolve(obj);
      }

      let senderTypeId = 1;

      if (senderType === "M") senderTypeId = 2;
      if (senderType === "P") senderTypeId = 3;

      dbResult = await common.getAgentIdByMobile(model.agent.mobile);
      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      } else if (dbResult.status === ERRORS.NOTFOUND) {
        let insertObj = model.agent.address;
        insertObj.requestType = 1;
        let addressid = 0;
        inValid = await helper.IsEmptyObject(insertObj);
        if (!inValid) {
          obj = await Address.Insert(insertObj);
          if (obj.status !== ERRORS.SUCCESS) {
            return resolve(obj);
          }
          addressid = obj.data.addressid;
        }

        insertObj = model.agent;
        insertObj.addressid = addressid;
        insertObj.agenttype = senderTypeId;
        insertObj.companyid = senderid;
        insertObj.requestType = 1;
        obj = await Agent.Insert({ body: insertObj });
        if (obj.status !== ERRORS.SUCCESS) {
          return resolve(obj);
        }
        model.agentid = obj.data.agentid;
      } else {
        model.agentid = dbResult.data[0].agentid;
      }

      let data = await PlaceOrder(model);
      return resolve(data);
    });
  };

  async function deleteOrder(orderid) {
    let query = `delete from agschema.order where orderid=${orderid}`;
    await helper.ExecuteQuery(pool, query, "COUNT", true);
  }

  async function GetCompanyId(id, key) {
    return new Promise(async (resolve) => {
      let query = `select companyid from agschema.company where companyid=${id} and companysecret='${key}'`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({ status: 403, statusText: dbResult.statusText });
      }
      if (dbResult.data === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid Company Accesskey",
        });
      }
      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  }

  async function PlaceOrder(model) {
    return new Promise(async (resolve) => {
      let dataAgent = await common.getAgentById(model.agentid);
      if (dataAgent.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "No Agent details found",
        });
      }

      dataAgent = dataAgent.data;

      let dataAddress = {
        state: "",
        city: "",
        country: "",
      };

      if (dataAgent.addressid > 0) {
        dataAddress = await common.getAddressById(dataAgent.addressid);
        if (dataAddress.status !== ERRORS.SUCCESS) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: "No Address details found",
          });
        }
        dataAddress = dataAddress.data;
      }

      model.senderid = dataAgent.companyid;
      model.sendertype = dataAgent.agenttype;
      model.orderstatusid = 1;
      model.agent = {
        agentid: dataAgent.agentid,
        agentnum: dataAgent.agentnum,
        agentname: dataAgent.agentname,
        mobile: dataAgent.mobile,
        address: {
          state: dataAddress.state,
          city: dataAddress.city,
          country: dataAddress.country,
        },
      };

      let obj = await validateOrderCommonDetails(model);

      if (obj.status !== ERRORS.SUCCESS) {
        return resolve(obj);
      }

      obj = await validateOrderAgentDetails(model);
      if (obj.status !== ERRORS.SUCCESS) {
        return resolve(obj);
      }

      let filters = [
        { name: "ordernum", value: model.ordernum },
        { name: "senderid", value: model.senderid },
        { name: "sendertype", value: model.sendertype },
        { name: "agentid", value: model.agent.agentid },
      ];

      let dbResult = await common.IsRecordExist("order", "orderid", filters);

      if (dbResult.status !== ERRORS.NOTFOUND) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Order ${model.ordernum} already exist`,
        });
      }

      let query = await helper.GetInsertQuery(
        "order",
        "orderid",
        OrderSchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new order",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new order successful",
        data: {
          orderid: dbResult.data[0].orderid,
        },
      });
    });
  }

  async function validateOrderCommonDetails(model) {
    return new Promise(async (resolve) => {
      let inValid = false;

      inValid = await helper.IsNull(model.ordernum);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Order Number is required",
        });
      }

      inValid = await helper.IsNull(model.consignee);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Consignee Name is required",
        });
      }

      //inValid = await helper.IsNull(model.consigneenum);
      if (isNaN(model.consigneenum)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Consignee Phone Number is required",
        });
      }

      inValid = await helper.IsNull(model.consignor);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Consignor Name is required",
        });
      }

      //inValid = await helper.IsNull(model.consignornum);
      if (isNaN(model.consignornum)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Consignor Phone Number is required",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  }

  async function validateOrderAgentDetails(model) {
    return new Promise(async (resolve) => {
      let inValid = false;

      if (!model.agent) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Agent details are required",
        });
      }

      inValid = await helper.IsEmptyObject(model.agent);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Agent details are required",
        });
      }

      let agent = model.agent;

      inValid = await helper.IsNull(agent.agentnum);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Number is required",
        });
      }

      inValid = await helper.IsNull(agent.agentname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Name is required",
        });
      }

      inValid = await helper.IsNull(agent.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Phone Number is required",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  }

  async function IsOrderExist(ordernum, companyid) {
    return new Promise(async (resolve) => {
      let query = `select orderid from agschema.order where companyid='${companyid}' and ordernum='${ordernum}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching order details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No order details found for ${ordernum}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  }

  async function validateOrderExternalDetails(model) {
    return new Promise(async (resolve) => {
      let inValid = false;

      if (!model.agent) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Agent details are required",
        });
      }

      inValid = await helper.IsEmptyObject(model.agent);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Agent details are required",
        });
      }

      inValid = await helper.IsEmptyObject(model.agent.address);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Agent address details are required",
        });
      }

      let agent = model.agent;

      inValid = await helper.IsNull(agent.agentnum);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Id is required",
        });
      }

      inValid = await helper.IsNull(agent.agentname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Name is required",
        });
      }

      inValid = await helper.IsNull(agent.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Phone Number is required",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  }

  async function validateOrderInternalDetails(model) {
    return new Promise(async (resolve) => {
      let inValid = false;

      if (isNaN(model.mapid)) {
        inValid = await helper.IsNull(model.mapid);
        if (inValid) {
          return resolve({
            status: ERRORS.MANDATORY,
            statusText: "Barcode is required",
          });
        }
      } else {
        if (model.mapid <= 0) {
          return resolve({
            status: ERRORS.MANDATORY,
            statusText: "Barcode is required",
          });
        }
      }

      return resolve({
        status: ERRORS.SUCCESS,
      });
    });
  }

  async function IsValidBarcode(barcodeText) {
    return new Promise(async (resolve) => {
      let inValid = false;

      let query = `select mapid from agschema.boxcontroller where barcode='${barcodeText}';`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: 403,
          statusText: "Failed validating barcode",
        });
      } else {
        if (dbResult.data.length === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Barcode does not exist`,
          });
        }
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data[0].mapid,
      });
    });
  }

  return module;
};

module.exports = orderController;
