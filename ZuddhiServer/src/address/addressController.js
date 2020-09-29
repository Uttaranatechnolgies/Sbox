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
  { name: "line1", type: "string" },
  { name: "line2", type: "string" },
  { name: "line3", type: "string" },
  { name: "line4", type: "string" },
  { name: "city", type: "string" },
  { name: "state", type: "string" },
  { name: "country", type: "string" },
  { name: "createdon", type: "string" },
];

const RegionSchemaU = [
  { name: "line1", type: "string" },
  { name: "line2", type: "string" },
  { name: "line3", type: "string" },
  { name: "line4", type: "string" },
  { name: "city", type: "string" },
  { name: "state", type: "string" },
  { name: "country", type: "string" },
  { name: "createdon", type: "string" },
];

const addressController = () => {
  var module = [];

  module.GetList = async () => {
    return new Promise(async (resolve) => {
      let query = `select * from agschema.address;`;
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

  module.Get = async (input) => {
    return new Promise(async (resolve) => {
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

      let query = `select * from agschema.address where addressid=${id};`;
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

  module.Insert = async (input) => {
    return new Promise(async (resolve) => {
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid JSON object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));

      let requestType = model.requestType ? model.requestType : 0;

      inValid = await helper.IsNull(model.city);
      if (inValid && requestType === 0) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address city is required",
        });
      }

      inValid = await helper.IsNull(model.state);
      if (inValid && requestType === 0) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address state is required",
        });
      }

      inValid = await helper.IsNull(model.country);
      if (inValid && requestType === 0) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address country is required",
        });
      }

      let query = await helper.GetInsertQuery(
        "address",
        "addressid",
        RegionSchema,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);

      if (dbResult.status === 1)
        return resolve({ status: 403, statusText: dbResult.statusText });

      if (dbResult.data && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Failed adding new address",
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        statusText: "Created new address successful",
        data: {
          addressid: dbResult.data[0].addressid,
        },
      });
    });
  };

  module.Update = async (input) => {
    return new Promise(async (resolve) => {
      let inValid = false;

      inValid = await helper.IsEmptyObject(input);

      if (inValid) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid input object",
        });
      }

      let model = JSON.parse(JSON.stringify(input));
      if (isNaN(model.addressid)) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: "Invalid id value",
        });
      }

      inValid = await helper.IsNull(model.city);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address city is required",
        });
      }

      inValid = await helper.IsNull(model.state);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address state is required",
        });
      }

      inValid = await helper.IsNull(model.country);
      if (inValid) {
        return resolve({
          status: ERRORS.MANDATORY,
          statusText: "Address country is required",
        });
      }

      let id = parseInt(model.addressid);
      let dbResult = await common.getAddress(id);

      if (dbResult.status !== ERRORS.SUCCESS) {
        return resolve(dbResult);
      }

      let query = await helper.GetUpdateQuery(
        "address",
        "addressid",
        id,
        "addressid",
        RegionSchemaU,
        model
      );

      dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 0 && dbResult.data && dbResult.data.length > 0) {
        return resolve({
          status: ERRORS.SUCCESS,
          statusText: `Address details are updated successful`,
        });
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Failed updating Address details`,
      });
    });
  };

  module.Delete = async (input) => {
    return new Promise(async (resolve) => {
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

      let query = `delete from agschema.address where addressid=${id};`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);

      if (dbResult.status === 0) {
        if (dbResult.data === 1) {
          return resolve({
            status: ERRORS.SUCCESS,
            statusText: `Deleted ${id} Address successful`,
          });
        } else if (dbResult.data === 0) {
          return resolve({
            status: ERRORS.FAILURE,
            statusText: `No Address found with ${id}`,
          });
        }
      }

      return resolve({
        status: ERRORS.FAILURE,
        statusText: `Unable to delete ${id} Address`,
      });
    });
  };

  return module;
};

module.exports = addressController;
