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

const BoxSchema = [
  { name: "boxname", type: "string" },
  { name: "dateofregistered", type: "string" },
  { name: "createdon", type: "string" },
  { name: "statusid", type: "int" },
];

const BoxSchemaU = [
  { name: "boxname", type: "string" },
  { name: "dateofregistered", type: "string" },
  { name: "statusid", type: "int" },
];

const boxController = () => {
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

      let query = `select a.*,b.statusname from agschema.securebox a
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
      let query = `select a.*,b.statusname from agschema.securebox a
      left join agschema.statustype b on b.statusid=a.statusid where boxid=${id};`;

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
      inValid = await helper.IsNull(model.boxname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Box name is required",
        });
      }

      inValid = await helper.IsNull(model.dor);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Box DateOfRegistration is required",
        });
      }

      let dbResult = await common.getBoxByName(model.boxname, null);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Box ${model.boxname} already exist`,
        });
      }

      let boxObj = {
        boxname: model.boxname,
        dateofregistered: model.dor,
        statusid: model.statusid,
      };

      let query = await helper.GetInsertQuery(
        "securebox",
        "boxid",
        BoxSchema,
        boxObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new box",
        });
      }

      let keyId = dbResult.data[0].boxid;

      let barcode = ("0".repeat(5) + keyId).slice(-5);

      query = `update agschema.securebox set barcode='B${barcode}X' where boxid='${keyId}';`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new box successful",
        data: {
          boxid: keyId,
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
      if (isNaN(model.boxid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid id value",
        });
      }

      inValid = await helper.IsNull(model.boxname);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Box name is required",
        });
      }

      inValid = await helper.IsNull(model.dor);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Box DateOfRegistration is required",
        });
      }

      let id = parseInt(model.boxid);

      let dbResult = await common.getBox(model.boxid);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      dbResult = await common.getBoxByName(model.boxname, model.boxid);

      if (dbResult.status === ERRORS.FAILURE) {
        return resolve(dbResult);
      }

      if (dbResult.status === ERRORS.SUCCESS) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: `Box ${model.boxname} already exist`,
        });
      }

      let boxObj = {
        boxname: model.boxname,
        boxid: model.boxid,
        statusid: model.statusid,
        dateofregistered: model.dor,
      };

      let query = await helper.GetUpdateQuery(
        "securebox",
        "boxid",
        id,
        "boxid",
        BoxSchemaU,
        boxObj
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Box details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating box details`,
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

      let query = `select boxid from agschema.boxcontroller where boxid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data > 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `Secure Box cannot be deleted`,
          });
        }
      }

      query = `delete from agschema.securebox where boxid=${id};`;
      dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} box successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No box found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} box`,
      });
    });
  };

  return module;
};

module.exports = boxController;
