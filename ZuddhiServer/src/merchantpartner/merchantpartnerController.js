const Pool = require("pg").Pool;
const helper = require("../helper/helper")();
const common = require("../common")();

const { POSTGRESDBConfig, ERRORS } = require("../../config");
const { query } = require("express");

const pool = new Pool({
  user: POSTGRESDBConfig.user,
  host: POSTGRESDBConfig.host,
  database: POSTGRESDBConfig.database,
  password: POSTGRESDBConfig.password,
  port: POSTGRESDBConfig.port,
});

const PartnerMapSchema = [
  { name: "merchantid", type: "int" },
  { name: "partnerid", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const PartnerMapSchemaU = [
  { name: "merchantid", type: "int" },
  { name: "partnerid", type: "int" },
  { name: "updatedon", type: "string" },
  { name: "statusid", type: "int" },
];

const merchantpartnerController = () => {
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
      let query = `select a.*,b.merchantname,b.contactname as name1,b.contactphone as phone1,
      c.partnername,c.contactname as name2,c.contactphone as phone2,d.statusid,d.statusname
      from agschema.merchantpartner a
      left join agschema.merchant b on b.merchantid = a.merchantid
      left join agschema.partner c on c.partnerid = a.partnerid
      left join agschema.statustype d on d.statusid = a.statusid;`;

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
      let query = `select a.*,b.merchantname,b.contactname as name1,b.contactphone as phone1,
      c.partnername,c.contactname as name2,c.contactphone as phone2,d.statusid,d.statusname
      from agschema.merchantpartner a
      left join agschema.merchant b on b.merchantid = a.merchantid
      left join agschema.partner c on c.partnerid = a.partnerid
      left join agschema.statustype d on d.statusid = a.statusid where a.mapid=${id};`;

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
      if (isNaN(model.merchantid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Id is required",
        });
      }

      if (isNaN(model.partnerid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Id is required",
        });
      }

      let dbResult = await common.IsRecordExist("merchant", "merchantid", [
        {
          name: "merchantid",
          value: model.merchantid,
        },
      ]);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Merchant details not found`,
        });
      }

      dbResult = await common.IsRecordExist("partner", "partnerid", [
        {
          name: "partnerid",
          value: model.partnerid,
        },
      ]);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Partner details not found`,
        });
      }

      dbResult = await common.IsRecordExist("merchantpartner", "mapid", [
        {
          name: "partnerid",
          value: model.partnerid,
        },
        {
          name: "merchantid",
          value: model.merchantid,
        },
      ]);

      if (dbResult.status === ERRORS.ERRORS) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Partner and Merchant mapping is already exist`,
        });
      }

      let boxObj = {
        merchantid: model.merchantid,
        partnerid: model.partnerid,
        statusid: model.statusid,
      };

      let query = await helper.GetInsertQuery(
        "merchantpartner",
        "mapid",
        PartnerMapSchema,
        boxObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed mapping partner and merchant",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new mapping for partner and merchant successful",
        data: {
          mapid: dbResult.data[0].mapid,
        },
      });
    });
  };

  module.Update = async (req) => {
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
          statusText: "Invalid input object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      if (isNaN(model.mapid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Id is required",
        });
      }

      if (isNaN(model.merchantid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Merchant Id is required",
        });
      }

      if (isNaN(model.partnerid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Partner Id is required",
        });
      }

      let dbResult = await common.IsRecordExist("merchant", "merchantid", [
        {
          name: "merchantid",
          value: model.merchantid,
        },
      ]);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Merchant details not found`,
        });
      }

      dbResult = await common.IsRecordExist("partner", "partnerid", [
        {
          name: "partnerid",
          value: model.partnerid,
        },
      ]);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Partner details not found`,
        });
      }

      dbResult = await common.IsRecordExist("merchantpartner", "mapid", [
        {
          name: "partnerid",
          value: model.partnerid,
        },
        {
          name: "merchantid",
          value: model.merchantid,
        },
        {
          name: "mapid",
          value: model.mapid,
          excluded: true,
        },
      ]);

      if (dbResult.status === ERRORS.ERRORS) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Partner and Merchant mapping is already exist`,
        });
      }

      let boxObj = {
        merchantid: model.merchantid,
        partnerid: model.partnerid,
        statusid: model.statusid,
      };

      let query = await helper.GetUpdateQuery(
        "merchantpartner",
        "mapid",
        model.mapid,
        "mapid",
        PartnerMapSchemaU,
        boxObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Mapping details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating mapping details`,
      });
    });
  };

  module.Delete = async (req) => {
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

      let query = `select mapid from agschema.orderbox where mapid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0 && dbResult.data > 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Mapping cannot be deleted`,
        });
      }

      query = `delete from agschema.boxcontroller where mapid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} boxcontrol successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No boxcontrol found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} boxcontrol`,
      });
    });
  };

  return module;
};

module.exports = merchantpartnerController;
