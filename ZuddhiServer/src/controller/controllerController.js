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

const ControllerSchema = [
  { name: "dateofregistered", type: "string" },
  { name: "controllerphonenumber", type: "string" },
  { name: "version", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const ControllerSchemaU = [
  { name: "dateofregistered", type: "string" },
  { name: "controllerphonenumber", type: "string" },
  { name: "version", type: "string" },
  { name: "statusid", type: "int" },
];

const controllerController = () => {
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
      let query = `select a.*,b.statusname from agschema.controller a
      left join agschema.statustype b on b.statusid=a.statusid;`;
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

      let query = `select a.*,b.statusname from agschema.controller a
      left join agschema.statustype b on b.statusid=a.statusid where a.controllerid=${id};`;

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
      inValid = await helper.IsNull(model.number);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Controller number is required",
        });
      }

      inValid = await helper.IsNull(model.dor);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Controller DateOfRegistration is required",
        });
      }

      let dbResult = await common.getControllerByName(model.number, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Controller ${model.number} already exist`,
        });
      }

      let controllerObj = {
        controllerphonenumber: model.number,
        version: model.version,
        dateofregistered: model.dor,
        statusid: model.statusid,
      };

      let query = await helper.GetInsertQuery(
        "controller",
        "controllerid",
        ControllerSchema,
        controllerObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new controller",
        });
      }

      let keyId = dbResult.data[0].controllerid;

      let barcode = ("0".repeat(5) + keyId).slice(-5);

      query = `update agschema.controller set barcode='C${barcode}T' where controllerid='${keyId}';`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new controller successful",
        data: {
          controllerid: keyId,
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
      if (isNaN(model.controllerid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid id value",
        });
      }

      inValid = await helper.IsNull(model.number);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Controller number is required",
        });
      }

      inValid = await helper.IsNull(model.dor);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Controller DateOfRegistration is required",
        });
      }

      let id = parseInt(model.controllerid);
      let dbResult = await common.getController(id);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.NOTFOUND) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No controller details found for boxid: ${id}`,
        });
      }

      dbResult = await common.getControllerByName(model.number, id);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Controller ${model.number} already exist`,
        });
      }

      let controllerObj = {
        controllerphonenumber: model.number,
        version: model.version,
        dateofregistered: model.dor,
        statusid: model.statusid,
      };

      let query = await helper.GetUpdateQuery(
        "controller",
        "controllerid",
        id,
        "controllerid",
        ControllerSchemaU,
        controllerObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Controller details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating Controller details`,
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

      let query = `select controllerid from agschema.boxcontroller where controllerid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0 && dbResult.data > 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Controller cannot be deleted`,
        });
      }

      query = `delete from agschema.controller where controllerid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} controller successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No controller found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} controller`,
      });
    });
  };

  return module;
};

module.exports = controllerController;
