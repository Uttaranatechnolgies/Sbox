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

  module.GetList = async (req) => {
    return new Promise(async (resolve) => {
      const { status, statusText, user } = await helper.ValidateToken(req);
      if (status == ERRORS.INVALIDTOKEN || status == ERRORS.TOKENEXPIRED) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: statusText,
        });
      }
      let query = `select a.*,b.statusname,c.regionname from agschema.zone a
                  left join agschema.statustype b on b.statusid=a.statusid
                  left join agschema.region c on c.regionid=a.regionid;`;
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

      let query = `select a.*,b.statusname,c.regionname from agschema.zone a
                  left join agschema.statustype b on b.statusid=a.statusid
                  left join agschema.region c on c.regionid=a.regionid
                   where a.zoneid=${id};`;

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
          statusText: "Zone name is required",
        });
      }

      if (!model.regionid || isNaN(model.regionid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Region Id is required",
        });
      }

      let dbResult = await common.getRegion(model.regionid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getZoneByName(model.name, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Zone ${model.name} already exist`,
        });
      }

      let zoneObj = {
        zonename: model.name,
        regionid: model.regionid,
        statusid: 1,
      };

      let query = await helper.GetInsertQuery(
        "zone",
        "zoneid",
        ZoneSchema,
        zoneObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new zone",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new zone successful",
        data: {
          zoneid: dbResult.data[0].zoneid,
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

      if (!model.regionid || isNaN(model.regionid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Region Id is required",
        });
      }

      let dbResult = await common.getRegion(model.regionid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let id = parseInt(model.id);

      dbResult = await common.getZone(id);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getZoneByName(model.name, id);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Zone ${model.name} already exist`,
        });
      }

      let zoneObj = {
        zonename: model.name,
        regionid: model.regionid,
        statusid: model.statusid,
      };

      let query = await helper.GetUpdateQuery(
        "zone",
        "zoneid",
        id,
        "zoneid",
        ZoneSchemaU,
        zoneObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Zone details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating zone details`,
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

      let query = `select zoneid from agschema.area where zoneid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data > 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Zone cannot be deleted`,
          });
        }
      }

      query = `delete from agschema.zone where zoneid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} zone successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No zone found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} zone`,
      });
    });
  };

  return module;
};

module.exports = zoneController;
