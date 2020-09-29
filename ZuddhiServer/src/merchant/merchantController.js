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

const MerchantSchema = [
  { name: "merchantname", type: "string" },
  { name: "merchantaddress", type: "string" },
  { name: "merchantcity", type: "string" },
  { name: "merchantstate", type: "string" },
  { name: "merchantcountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const MerchantSchemaU = [
  { name: "merchantaddress", type: "string" },
  { name: "merchantcity", type: "string" },
  { name: "merchantstate", type: "string" },
  { name: "merchantcountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "statusid", type: "int" },
];

const fields = `a.merchantid,a.merchantname,a.merchantaddress,a.merchantcity,
  a.merchantstate,a.merchantcountry,a.contactname,
  a.contactphone,a.merchantsecret,a.CreatedOn,a.statusid`;

const merchantController = () => {
  var module = [];

  module.GetSelect = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      status == ERRORS.SUCCESS;
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select merchantid,merchantname from agschema.merchant;`;
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
      let query = `select ${fields},b.statusname from agschema.merchant a
      left join agschema.statustype b on b.statusid = a.statusid;`;
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
      let query = `select ${fields},b.statusname from agschema.merchant a
      left join agschema.statustype b on b.statusid = a.statusid
      where a.merchantid=${id};`;

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
      inValid = await helper.IsNull(model.merchantname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant name is required",
        });
      }

      inValid = await helper.IsNull(model.merchantaddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Address is required",
        });
      }

      inValid = await helper.IsNull(model.merchantcity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant City is required",
        });
      }

      inValid = await helper.IsNull(model.merchantstate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant State is required",
        });
      }

      inValid = await helper.IsNull(model.merchantcountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Contact Phone is required",
        });
      }

      model.statusid = 1;

      let searchItems = [{ name: "merchantname", value: model.merchantname }];

      let dbResult = await common.IsRecordExist(
        "merchant",
        "merchantid",
        searchItems
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Merchant is already exist`,
        });
      }

      searchItems = [
        { name: "merchantname", value: model.merchantname },
        { name: "contactphone", value: model.contactphone },
      ];

      dbResult = await common.IsRecordExist(
        "merchant",
        "merchantid",
        searchItems
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Merchant and Contact phone is already exist`,
        });
      }

      let query = await helper.GetInsertQuery(
        "merchant",
        "merchantid",
        MerchantSchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new merchant",
        });
      }

      let merchantid = dbResult.data[0].merchantid;

      let keyStr = `${merchantid}${model.merchantname}${model.merchantcity}${model.contactname}${model.contactphone}`;

      const { secret, iv, timestamp } = await helper.GetSecretApiKey2(keyStr);

      query = `update agschema.merchant set merchantsecret='${secret}',
      merchanttimestamp='${timestamp}', merchantiv='${iv}' where merchantid='${merchantid}';`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new merchant successful",
        data: {
          merchantid: merchantid,
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
      if (isNaN(model.merchantid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid merchantid value",
        });
      }

      inValid = await helper.IsNull(model.merchantaddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Address is required",
        });
      }

      inValid = await helper.IsNull(model.merchantcity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant City is required",
        });
      }

      inValid = await helper.IsNull(model.merchantstate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant State is required",
        });
      }

      inValid = await helper.IsNull(model.merchantcountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Contact Phone is required",
        });
      }

      let query = await helper.GetUpdateQuery(
        "merchant",
        "merchantid",
        model.merchantid,
        "merchantid",
        MerchantSchemaU,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Merchant details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating merchant details`,
      });
    });
  };

  return module;
};

module.exports = merchantController;
