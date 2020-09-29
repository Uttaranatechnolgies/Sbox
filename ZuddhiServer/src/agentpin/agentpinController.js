const Pool = require("pg").Pool;
const helper = require("../helper/helper")();
const common = require("../common")();
const jwt = require("jsonwebtoken");

const { POSTGRESDBConfig, ERRORS, SECREATKEY } = require("../../config");

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
  { name: "mobile", type: "string" },
  { name: "agenttype", type: "string" },
  { name: "agentverified", type: "string" },
  { name: "addressid", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const AgentSchemaU = [
  { name: "agentnum", type: "string" },
  { name: "agentname", type: "string" },
  { name: "mobile", type: "string" },
  { name: "agenttype", type: "string" },
  { name: "agentverified", type: "string" },
  { name: "addressid", type: "int" },
  { name: "statusid", type: "int" },
];

const agentController = () => {
  var module = [];

  module.Validate = async (input) => {
    return new Promise(async (resolve) => {
      let inValid = false;
      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      inValid = await helper.IsNull(model.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Mobile number is required",
        });
      }

      inValid = await helper.IsNull(model.mpin);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Mobile MPin is required",
        });
      }

      let dbResult = await getAgentDetailsByMobile(model.mobile);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let agent = dbResult.data[0];
      let token = "";

      if (agent.mpin !== parseInt(model.mpin)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid MPIN Number",
        });
      } else {
        token = await getJwtToken(agent, "1d");
        return resolve({
          status: ERRORS.SUCCESS,
          data: { token: token },
        });
      }
    });
  };

  module.NewPinRequest = async (req) => {
    return new Promise(async (resolve) => {
      let inValid = false;
      const input = req.body;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      inValid = await helper.IsNull(model.mobile);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Mobile number is required",
        });
      }

      let dbResult = await getAgentDetailsByMobile(model.mobile);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let agent = dbResult.data[0];

      let mpinVal = await helper.IsNull(model.mpin);
      let otpVal = await helper.IsNull(model.otp);

      let results = null;

      if (mpinVal && otpVal) {
        results = await doSendOTP(agent);
        return resolve(results);
      } else if (mpinVal && !otpVal) {
        if (agent.otp !== parseInt(model.otp)) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: "Invalid OTP Number",
          });
        }
        results = await doValidOTP(req, agent);
        return resolve(results);
      } else if (!mpinVal && otpVal) {
        agent.mpin = model.mpin;
        results = await doSetMPIN(req, agent);
        return resolve(results);
      }
    });
  };

  async function doValidOTP(req, agent) {
    return new Promise(async (resolve) => {
      await setAgentMpin(agent.mobile, null);

      const { status, statusText, user } = await helper.ValidateToken(req);

      if (status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }

      let token = await getJwtToken(agent, 600000);
      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Generate new MPIN",
        data: { token: token },
      });
    });
  }

  async function doSetMPIN(req, agent) {
    return new Promise(async (resolve) => {
      await setAgentMpin(agent.mobile, null);

      const { status, statusText, user } = await helper.ValidateToken(req);

      if (status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }

      await setAgentMpin(agent.mobile, agent.mpin);
      let token = await getJwtToken(agent, "1d");
      return resolve({
        status: ERRORS.SUCCESS,
        data: { token: token },
      });
    });
  }

  async function doSendOTP(agent) {
    return new Promise(async (resolve) => {
      let token = null;
      const otp = await helper.GetRandomNumber(111111, 999999);
      await setAgentOTP(agent.mobile, otp);
      token = await getJwtToken(agent, 600000);

      const sBody = `Dear Sir, %0A${otp} is OTP code to create new MPIN.`;
      const smsMsg = {
        Body: sBody,
        Number: agent.mobile,
        Sender: "HIREGT",
      };

      const rslt = await helper.SendSMS(smsMsg);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "OTP has sent to registered mobile",
        data: { token: token },
      });
    });
  }

  async function getJwtToken(input, expired) {
    return new Promise(async (resolve) => {
      const data = {
        user: {
          agentid: input.agentid,
          agentnum: input.agentnum,
          agentname: input.agentname,
          companyid: input.companyid,
        },
      };

      const token = jwt.sign(data, SECREATKEY, {
        algorithm: "HS256",
        subject: input.agentid.toString(),
        expiresIn: expired,
      });

      return resolve(token);
    });

    return resolve(null);
  }

  async function getAgentDetailsByMobile(id) {
    return new Promise(async (resolve) => {
      let query = `select agentid,agentnum,agentname,agentverified,mpin,otp,mobile from agschema.agent where mobile='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `Number is not registered`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  }

  async function setAgentOTP(id, otp) {
    return new Promise(async (resolve) => {
      let query = `update agschema.agent set otp='${otp}' where mobile='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }

      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  }

  async function setAgentMpin(id, mpin) {
    return new Promise(async (resolve) => {
      let query = `update agschema.agent set otp=null, mpin='${mpin}' where mobile='${id}';`;
      if (mpin === null) {
        query = `update agschema.agent set otp=null, mpin=null where mobile='${id}';`;
      }

      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }

      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  }

  async function setAgentVerified(id) {
    return new Promise(async (resolve) => {
      let query = `update agschema.agent set agentverified=1 where mobile='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }

      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  }

  return module;
};

module.exports = agentController;
