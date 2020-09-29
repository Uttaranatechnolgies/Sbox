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

const AreaSchema = [
  { name: "areaname", type: "string" },
  { name: "zoneid", type: "int" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const AreaSchemaU = [
  { name: "areaname", type: "string" },
  { name: "zoneid", type: "int" },
  { name: "statusid", type: "int" },
];

const areaController = () => {
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

      let query = `select a.*,c.zonename,d.regionid,d.regionname,b.statusname from agschema.area a
      left join agschema.statustype b on b.statusid=a.statusid
      left join agschema.zone c on c.zoneid=a.zoneid
      left join agschema.region d on d.regionid=c.regionid;`;
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
      let query = `select a.*,c.zonename,d.regionid,d.regionname,b.statusname from agschema.area a
      left join agschema.statustype b on b.statusid=a.statusid
      left join agschema.zone c on c.zoneid=a.zoneid
      left join agschema.region d on d.regionid=c.regionid where a.areaid=${id};`;

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
      inValid = await helper.IsNull(model.areaname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Area name is required",
        });
      }

      if (!model.zoneid || isNaN(model.zoneid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Zone Id is required",
        });
      }

      let dbResult = await common.getZone(model.zoneid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getAreaByname(model.areaname, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Area ${model.areaname} already exist`,
        });
      }

      let areaObj = {
        areaname: model.areaname,
        zoneid: model.zoneid,
        statusid: 1,
      };

      let query = await helper.GetInsertQuery(
        "area",
        "areaid",
        AreaSchema,
        areaObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new area",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new area successful",
        data: {
          areaid: dbResult.data[0].areaid,
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
      if (isNaN(model.areaid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid id value",
        });
      }

      if (isNaN(model.zoneid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Zone Id is required",
        });
      }

      inValid = await helper.IsNull(model.areaname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Area ${model.areaname} name is required`,
        });
      }

      let dbResult = await common.getZone(model.zoneid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getArea(model.areaid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getAreaByname(model.areaname, model.areaid);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Area ${model.areaname} already exist`,
        });
      }

      let id = parseInt(model.areaid);

      let areaObj = {
        areaname: model.areaname,
        zoneid: model.zoneid,
        statusid: model.statusid,
      };

      let query = await helper.GetUpdateQuery(
        "area",
        "areaid",
        id,
        "areaid",
        AreaSchemaU,
        areaObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Area details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating area details`,
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

      let query = `select areaid from agschema.boxcontroller where areaid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data > 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Area cannot be deleted`,
          });
        }
      }

      query = `delete from agschema.area where areaid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} area successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No area found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} area`,
      });
    });
  };

  return module;
};

module.exports = areaController;
