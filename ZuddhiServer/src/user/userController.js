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

const ZoneSchema = [
  { name: "zonename", type: "string" },
  { name: "regionid", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const ZoneSchemaU = [
  { name: "zonename", type: "string" },
  { name: "regionid", type: "int" },
  { name: "statusid", type: "int" },
];

const zoneController = () => {
  var module = [];

  module.Login = async (req) => {
    return new Promise(async (resolve) => {
      const input = req.body;
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid input value",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      inValid = await helper.IsNull(model.email);
      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid email value",
        });
      }

      inValid = await helper.IsNull(model.password);
      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid password value",
        });
      }

      let query = `select * from agschema.user where username='${model.email}' 
      and password='${model.password}' and statusid=0;`;

      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Unable to fetch results`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Invalid Credentials`,
        });
      }

      let token = await getJwtToken(dbResult.data[0], "1d");

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: dbResult.statusText,
        data: { token: token },
      });
    });
  };

  async function getJwtToken(input, expired) {
    return new Promise(async (resolve) => {
      const data = {
        user: {
          agentid: input.userid,
          agentnum: input.fullname,
          agentname: input.username,
        },
      };

      const token = jwt.sign(data, SECREATKEY, {
        algorithm: "HS256",
        subject: input.userid.toString(),
        expiresIn: expired,
      });

      return resolve(token);
    });

    return resolve(null);
  }

  return module;
};

module.exports = zoneController;
