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

const BoxControlSchema = [
  { name: "boxid", type: "int" },
  { name: "controllerid", type: "int" },
  { name: "areaid", type: "int" },
  { name: "barcode", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const BoxControlSchemaU = [
  { name: "boxid", type: "int" },
  { name: "controllerid", type: "int" },
  { name: "areaid", type: "int" },
  { name: "barcode", type: "string" },
  { name: "updatedon", type: "string" },
  { name: "statusid", type: "int" },
];

const boxControlController = () => {
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
      let query = `select a.mapid,a.createdon,a.updatedon,
      b.boxid,b.boxname,c.controllerid,c.barcode as ControllerBarcode,c.version,
      d.statusid,d.statusname,e.areaid,e.areaname,a.barcode from agschema.boxcontroller a
      left join agschema.securebox b on b.boxid = a.boxid
      left join agschema.controller c on c.controllerid = a.controllerid
      left join agschema.statustype d on d.statusid = a.statusid
      left join agschema.area e on e.areaid = a.areaid;`;

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
      let query = `select a.mapid,a.createdon,a.updatedon,
      b.boxid,b.boxname,c.controllerid,c.controllerphonenumber,c.version,
      d.statusid,d.statusname,e.areaid,e.areaname,a.barcode from agschema.boxcontroller a
      left join agschema.securebox b on b.boxid = a.boxid
      left join agschema.controller c on c.controllerid = a.controllerid
      left join agschema.statustype d on d.statusid = a.statusid
      left join agschema.area e on e.areaid = a.areaid where a.mapid=${id};`;

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
      if (isNaN(model.boxid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "BoxId is required",
        });
      }

      if (isNaN(model.controllerid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "ControllerId is required",
        });
      }

      if (isNaN(model.areaid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "AreaId is required",
        });
      }

      let dbResult = await common.getBox(model.boxid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      const boxBarcode = dbResult.data[0].barcode;

      dbResult = await common.getController(model.controllerid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getArea(model.areaid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.IsMappingExist(
        model.boxid,
        model.controllerid,
        model.areaid,
        null
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Box,Area and Contoller mapping is already exist`,
        });
      }

      let boxObj = {
        boxid: model.boxid,
        controllerid: model.controllerid,
        areaid: model.areaid,
        statusid: model.statusid,
        barcode: boxBarcode,
      };

      let query = await helper.GetInsertQuery(
        "boxcontroller",
        "mapid",
        BoxControlSchema,
        boxObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed mapping box and controller",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new mapping for box and controller successful",
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
          statusText: "Mapping id is required",
        });
      }

      if (isNaN(model.boxid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "BoxId is required",
        });
      }

      if (isNaN(model.controllerid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "ControllerId is required",
        });
      }

      if (isNaN(model.areaid)) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "AreaId is required",
        });
      }

      let dbResult = await common.getBox(model.boxid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      const boxBarcode = dbResult.data[0].barcode;

      dbResult = await common.getController(model.controllerid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getArea(model.areaid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let id = parseInt(model.mapid);

      dbResult = await common.getMapping(id);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.IsMappingExist(
        model.boxid,
        model.controllerid,
        model.areaid,
        id
      );

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Box,Area and Contoller mapping is already exist`,
        });
      }

      let boxObj = {
        boxid: model.boxid,
        controllerid: model.controllerid,
        areaid: model.areaid,
        statusid: model.statusid,
        barcode: boxBarcode,
      };

      let query = await helper.GetUpdateQuery(
        "boxcontroller",
        "mapid",
        id,
        "mapid",
        BoxControlSchemaU,
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

module.exports = boxControlController;
