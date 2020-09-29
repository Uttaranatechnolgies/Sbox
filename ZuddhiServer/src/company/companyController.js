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

const CompanySchema = [
  { name: "companyname", type: "string" },
  { name: "companyaddress", type: "string" },
  { name: "companycity", type: "string" },
  { name: "companystate", type: "string" },
  { name: "companycountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const CompanySchemaU = [
  { name: "companyaddress", type: "string" },
  { name: "companycity", type: "string" },
  { name: "companystate", type: "string" },
  { name: "companycountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "statusid", type: "int" },
];

const companyController = () => {
  var module = [];

  module.GetList = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      status == ERRORS.SUCCESS;
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select a.*,b.statusname from agschema.company a
      left join agschema.statustype b on b.statusid = a.statusid;;`;
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
      let query = `select a.*,b.statusname from agschema.company a
      left join agschema.statustype b on b.statusid = a.statusid
      where a.companyid=${id};`;

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
      inValid = await helper.IsNull(model.companyname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company name is required",
        });
      }

      inValid = await helper.IsNull(model.companyaddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Address is required",
        });
      }

      inValid = await helper.IsNull(model.companycity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company City is required",
        });
      }

      inValid = await helper.IsNull(model.companystate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company State is required",
        });
      }

      inValid = await helper.IsNull(model.companycountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Contact Phone is required",
        });
      }

      model.statusid = 1;

      let dbResult = await common.IsCompanyExist(model.companyname, null, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Company is already exist`,
        });
      }

      dbResult = await common.IsCompanyExist(
        model.companyname,
        model.contactphone,
        null
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Company and Contact phone is already exist`,
        });
      }

      let query = await helper.GetInsertQuery(
        "company",
        "companyid",
        CompanySchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new company",
        });
      }

      let companyid = dbResult.data[0].companyid;

      let keyStr = `${companyid}${model.companyname}${model.companycity}${model.contactname}${model.contactphone}`;

      const accessKey = await helper.GetSecretApiKey(keyStr);

      query = `update agschema.company set companysecret='${accessKey}' where companyid='${companyid}';`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new company successful",
        data: {
          companyid: companyid,
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
      if (isNaN(model.companyid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid companyid value",
        });
      }

      inValid = await helper.IsNull(model.companyaddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Address is required",
        });
      }

      inValid = await helper.IsNull(model.companycity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company City is required",
        });
      }

      inValid = await helper.IsNull(model.companystate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company State is required",
        });
      }

      inValid = await helper.IsNull(model.companycountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Company Contact Phone is required",
        });
      }

      let query = await helper.GetUpdateQuery(
        "company",
        "companyid",
        model.companyid,
        "companyid",
        CompanySchemaU,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Company details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating Company details`,
      });
    });
  };

  return module;
};

module.exports = companyController;
