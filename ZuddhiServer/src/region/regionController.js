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

const RegionSchema = [
  { name: "regionname", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const RegionSchemaU = [
  { name: "regionname", type: "string" },
  { name: "statusid", type: "int" },
];

const regionController = () => {
  var module = [];

  module.GetStatusList = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let dbResult = await common.getStatusList();
      return resolve(dbResult);
    });
  };

  module.GetList = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select a.*,b.statusname from agschema.region a
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

      let query = `select a.*,b.statusname from agschema.region a
      left join agschema.statustype b on b.statusid = a.statusid where a.regionid=${id};`;
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
      inValid = await helper.IsNull(model.name);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Region name is required",
        });
      }

      let dbResult = await common.getRegionByName(model.name, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Region ${model.name} already exist`,
        });
      }

      let regionObj = {
        regionname: model.name,
        statusid: 1,
      };

      let query = await helper.GetInsertQuery(
        "region",
        "regionid",
        RegionSchema,
        regionObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new region",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new region successful",
        data: {
          regionid: dbResult.data[0].regionid,
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
      if (isNaN(model.id)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid id value",
        });
      }

      inValid = await helper.IsNull(model.name);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Zone name is required",
        });
      }

      let id = parseInt(model.id);
      let dbResult = await common.getRegion(id);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getRegionByName(model.name, id);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Region ${model.name} already exist`,
        });
      }

      let regionObj = {
        regionname: model.name,
        statusid: model.statusid,
      };

      let query = await helper.GetUpdateQuery(
        "region",
        "regionid",
        id,
        "regionid",
        RegionSchemaU,
        regionObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Region details are updated successful`,
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

      // Check Is Agent is mapped to any orders
      let query = `select regionid from agschema.zone where regionid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data > 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Region cannot be deleted`,
          });
        }
      }

      query = `delete from agschema.region where regionid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} region successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No region found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} region`,
      });
    });
  };

  return module;
};

module.exports = regionController;
