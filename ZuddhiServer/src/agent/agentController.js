const Pool = require("pg").Pool;
const helper = require("../helper/helper")();
const common = require("../common")();
const Address = require("../address/addressController")();

const { POSTGRESDBConfig, ERRORS } = require("../../config");

const pool = new Pool({
  user: POSTGRESDBConfig.user,
  host: POSTGRESDBConfig.host,
  database: POSTGRESDBConfig.database,
  password: POSTGRESDBConfig.password,
  port: POSTGRESDBConfig.port,
});

const AgentSchema = [
  { name: "agentnum", type: "string" },
  { name: "agentname", type: "string" },
  { name: "companyid", type: "int" },
  { name: "mobile", type: "string" },
  { name: "agenttype", type: "int" },
  { name: "agentverified", type: "string" },
  { name: "addressid", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const AgentSchemaU = [
  { name: "agentname", type: "string" },
  { name: "companyid", type: "int" },
  { name: "agenttype", type: "int" },
  { name: "mobile", type: "string" },
];

const agentController = () => {
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

      let query = `select a.agentid,a.agentname,a.agentnum,a.agenttype,a.mobile,a.createdon,
      b.statusid,b.statusname,c.addressid,c.line1,c.line2,c.line3,c.line4,c.city,c.state,a.companyid,
	    (CASE WHEN a.agenttype = 3 then e.partnername WHEN a.agenttype != 3 then d.merchantname end) as companyname ,
      c.country from agschema.agent a
      left join agschema.merchant d on d.merchantid = a.companyid
	    left join agschema.partner e on e.partnerid = a.companyid
      left join agschema.statustype b on b.statusid = a.statusid
      left join agschema.address c on c.addressid = a.addressid;`;
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
      let inValid = false;
      let input = { id: req.params.id };

      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }

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
      let query = `select a.agentid,a.agentname,a.agentnum,a.agenttype,a.mobile,a.createdon,
      b.statusid,b.statusname,c.addressid,c.line1,c.line2,c.line3,c.line4,c.city,c.state,a.companyid,d.companyname,
      c.country from agschema.agent a
      left join agschema.company d on d.companyid = a.companyid
      left join agschema.statustype b on b.statusid = a.statusid
      left join agschema.address c on c.addressid = a.addressid where a.agentid=${id};`;

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

  module.Insert = async (req) => {
    return new Promise(async (resolve) => {
      let inValid = false;

      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }

      let input = req.body;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      inValid = await helper.IsNull(model.agentname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent name is required",
        });
      }

      /* if (isNaN(model.agenttype)) {
        model.agenttype = 0;
      }
      if (model.agenttype === 1) {
        inValid = await helper.IsNull(model.agentnum);
        if (inValid) {
          return resolve({
            status: ERRORS.MANDATORY,
            statusText: "Agent Number is required",
          });
        }
      } */

      inValid = await helper.IsNull(model.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Mobile Number is required",
        });
      }

      let dbResult = await common.getAgentByMobile(model.mobile);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Agent ${model.mobile} already exist`,
        });
      }

      model.statusid = 1;

      let requestType = model.requestType ? model.requestType : 0;

      // Local Agent required to add address
      if (requestType === 0) {
        let addrModel = {
          line1: model.line1,
          line2: model.line2,
          line3: model.line3,
          line4: model.line4,
          city: model.city,
          state: model.state,
          country: model.country,
        };

        let addrStatus = await Address.Insert(addrModel);

        if (addrStatus.status !== ERRORS.SUCCESS) {
          return resolve(addrStatus);
        }

        model.addressid = addrStatus.data.addressid;
      }

      let query = await helper.GetInsertQuery(
        "agent",
        "agentid",
        AgentSchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new agent",
        });
      }

      let agentid = dbResult.data[0].agentid;

      // Set AgentId for local agents
      if (requestType === 0) {
        let keyName =
          model.agentname.replace(/ /g, "").substring(0, 2).toUpperCase() +
          helper.Padding(agentid, 5);

        query = `update agschema.agent set agentnum='${keyName}' where agentid='${agentid}';`;
        dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new agent successful",
        data: {
          agentid: agentid,
        },
      });
    });
  };

  module.Update = async (req) => {
    return new Promise(async (resolve) => {
      let inValid = false;
      let input = req.body;

      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
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
      if (isNaN(model.agentid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid agentid value",
        });
      }

      inValid = await helper.IsNull(model.agentname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent name is required",
        });
      }

      inValid = await helper.IsNull(model.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Agent Mobile Number is required",
        });
      }

      // Check for duplicate
      let dbResult = await common.getAgentByMobile(model.mobile, model.agentid);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Agent ${model.mobile} already exist`,
        });
      }

      let addrModel = {
        addressid: model.addressid,
        line1: model.line1,
        line2: model.line2,
        line3: model.line3,
        line4: model.line4,
        city: model.city,
        state: model.state,
        country: model.country,
      };

      let addrStatus = await Address.Update(addrModel);

      if (addrStatus.status !== ERRORS.SUCCESS) {
        return resolve(addrStatus);
      }

      let query = await helper.GetUpdateQuery(
        "agent",
        "agentid",
        model.agentid,
        "agentid",
        AgentSchemaU,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Agent details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating region details`,
      });
    });
  };

  module.Delete = async (req) => {
    return new Promise(async (resolve) => {
      let inValid = false;
      let input = { id: req.params.id };

      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
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

      // Check Is Agent is mapped to any orders
      let query = `select orderid from agschema.order where agentid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Agent cannot be deleted`,
          });
        }
      }

      query = `delete from agschema.address where addressid in 
      (select agentid from agschema.agent where agentid=${id});`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      query = `delete from agschema.agent where agentid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Agent deleted successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No Agent found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} agent`,
      });
    });
  };

  return module;
};

module.exports = agentController;
