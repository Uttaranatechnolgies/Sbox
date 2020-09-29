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

const PartnerSchema = [
  { name: "partnername", type: "string" },
  { name: "partneraddress", type: "string" },
  { name: "partnercity", type: "string" },
  { name: "partnerstate", type: "string" },
  { name: "partnercountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const PartnerSchemaU = [
  { name: "partneraddress", type: "string" },
  { name: "partnercity", type: "string" },
  { name: "partnerstate", type: "string" },
  { name: "partnercountry", type: "string" },
  { name: "contactname", type: "string" },
  { name: "contactphone", type: "string" },
  { name: "statusid", type: "int" },
];

const fields = `a.partnerid,a.partnername,a.partneraddress,a.partnercity,
  a.partnerstate,a.partnercountry,a.contactname,
  a.contactphone,a.partnersecret,a.CreatedOn,a.statusid`;

const partnerController = () => {
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
      let query = `select partnerid,partnername from agschema.partner;`;
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
      let query = `select ${fields},b.statusname from agschema.partner a
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
      let query = `select ${fields},b.statusname from agschema.partner a
      left join agschema.statustype b on b.statusid = a.statusid
      where a.partnerid=${id};`;

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
      inValid = await helper.IsNull(model.partnername);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner name is required",
        });
      }

      inValid = await helper.IsNull(model.partneraddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Address is required",
        });
      }

      inValid = await helper.IsNull(model.partnercity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner City is required",
        });
      }

      inValid = await helper.IsNull(model.partnerstate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner State is required",
        });
      }

      inValid = await helper.IsNull(model.partnercountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Contact Phone is required",
        });
      }

      model.statusid = 1;

      let searchItems = [{ name: "partnername", value: model.partnername }];

      let dbResult = await common.IsRecordExist(
        "partner",
        "partnerid",
        searchItems
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Partner is already exist`,
        });
      }

      searchItems = [
        { name: "partnername", value: model.partnername },
        { name: "contactphone", value: model.contactphone },
      ];

      dbResult = await common.IsRecordExist(
        "partner",
        "partnerid",
        searchItems
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Partner and Contact phone is already exist`,
        });
      }

      let query = await helper.GetInsertQuery(
        "partner",
        "partnerid",
        PartnerSchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new partner",
        });
      }

      let partnerid = dbResult.data[0].partnerid;

      let keyStr = `${partnerid}${model.partnername}${model.partnercity}${model.contactname}${model.contactphone}`;

      const { secret, iv, timestamp } = await helper.GetSecretApiKey2(keyStr);

      query = `update agschema.partner set partnersecret='${secret}',
      partnertimestamp='${timestamp}', partneriv='${iv}' where partnerid='${partnerid}';`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new partner successful",
        data: {
          partnerid: partnerid,
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
      if (isNaN(model.partnerid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid partnerid value",
        });
      }

      inValid = await helper.IsNull(model.partneraddress);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Address is required",
        });
      }

      inValid = await helper.IsNull(model.partnercity);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner City is required",
        });
      }

      inValid = await helper.IsNull(model.partnerstate);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner State is required",
        });
      }

      inValid = await helper.IsNull(model.partnercountry);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Country is required",
        });
      }

      inValid = await helper.IsNull(model.contactname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Contact Name is required",
        });
      }

      if (isNaN(model.contactphone)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Contact Phone is required",
        });
      }

      let query = await helper.GetUpdateQuery(
        "partner",
        "partnerid",
        model.partnerid,
        "partnerid",
        PartnerSchemaU,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Partner details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating partner details`,
      });
    });
  };

  return module;
};

module.exports = partnerController;
