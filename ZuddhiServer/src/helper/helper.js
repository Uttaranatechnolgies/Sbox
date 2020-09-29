const axios = require("axios");
const { SMSURL } = require("../../config");
const secretKey = require("secret-key");
const jwt = require("jsonwebtoken");
const { SECREATKEY, ERRORS } = require("../../config");

module.exports = function () {
  var module = {};

  const validEmailRegex = RegExp(
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  );

  module.IsNull = async (input) => {
    return new Promise((resolve) => {
      if (input) {
        if (typeof input === "string") {
          if (input.replace(/ /g, "") !== "") {
            return resolve(false);
          }
        } else {
          return resolve(true);
        }
      }
      return resolve(true);
    });
  };

  module.IsEmptyObject = async (input) => {
    return new Promise((resolve) => {
      for (var key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key)) {
          return resolve(false);
        }
      }
      return resolve(true);
    });
  };

  module.IsEmailValid = async (input) => {
    return new Promise((resolve) => {
      if (input) {
        if (validEmailRegex.test(input)) return resolve(true);
      }
      resolve(false);
    });
  };

  module.ToDBValueAsync = async (arr, val, type, dt) => {
    return new Promise((resolve) => {
      let value = arr[val] || null;

      if (value !== null) {
        if (isNaN(value)) {
          return resolve(
            "'" + value.replace(/"/g, '\\"').replace(/'/g, "\\'") + "'"
          );
        } else {
          if (type === "string") {
            return resolve("'" + value + "'");
          }
        }
      }
      if (dt) value = `'${new Date().toUTCString()}'`;
      return resolve(value);
    });
  };

  module.ToDBValue = (arr, val, type, dt) => {
    let value = arr[val] || null;

    if (value === null) {
      if (type === "int" && !arr[val]) {
        value = arr[val];
      }
    }
    let rtnValue = null;

    if (value !== null) {
      if (isNaN(value)) {
        //rtnValue = "'" + value.replace(/"/g, '\\"').replace(/'/g, "\\'") + "'";
        rtnValue = "E'" + value.replace(/'/g, "\\'") + "'";
      } else {
        if (type === "string") {
          rtnValue = "E'" + value + "'";
        } else if (type === "int") {
          rtnValue = value;
        }
      }
    }
    if (dt) rtnValue = `'${new Date().toUTCString()}'`;
    return rtnValue;
  };

  module.ValidateToken = async (req) => {
    return new Promise(async (resolve) => {
      let authCode = undefined;

      if (req && req.headers && req.headers.authorization) {
        authCode = req.headers.authorization.substring(7);
      }

      let success = ERRORS.FAILURE;
      let statusText = "Bad Request";
      let user = undefined;

      if (authCode) {
        try {
          var decoded = jwt.verify(authCode, SECREATKEY);
          if (Date.now() >= decoded.exp * 1000) {
            success = ERRORS.TOKENEXPIRED;
            statusText = "Session Expired";
          } else {
            user = decoded.user;
            success = ERRORS.SUCCESS;
            statusText = "Active";
          }
        } catch (err) {
          success = ERRORS.INVALIDTOKEN;
          statusText = "Bad Request";
          console.log("Invalid Token Received");
        }
      }

      return resolve({
        status: success,
        statusText: statusText,
        user: user,
      });
    });
  };

  /* DataBase related methods */

  async function DbPool(pool) {
    return new Promise(async (resolve) => {
      const client = await pool.connect().catch((err) => {
        return resolve({ error: err, object: null });
      });
      return resolve({ error: null, object: client });
    });
  }

  function setType(name) {
    if (name === "createdon" || name === "updatedon") return "DATE";
    return undefined;
  }

  module.GetInsertQuery = async (tableName, returnKey, rFields, rValues) => {
    return new Promise(async (resolve) => {
      let values = "";
      let fields = "";

      rFields.forEach((item) => {
        let dtType = setType(item.name);
        let val = module.ToDBValue(rValues, item.name, item.type, dtType);

        if (values === "") {
          values = val;
        } else {
          values = values + "," + val;
        }

        if (fields === "") {
          fields = item.name;
        } else {
          fields = fields + "," + item.name;
        }
      });

      return resolve(
        `INSERT INTO agschema.${tableName} (${fields}) VALUES (${values}) RETURNING ${returnKey};`
      );
    });
  };

  module.GetUpdateQuery = async (
    tableName,
    keyName,
    keyValue,
    returnKey,
    rFields,
    rValues
  ) => {
    return new Promise(async (resolve) => {
      let values = "";
      let fields = "";

      rFields.forEach((item) => {
        let dtType = setType(item.name);
        let val = module.ToDBValue(rValues, item.name, item.type, dtType);

        if (fields === "") {
          fields = item.name + "=" + val;
        } else {
          fields = fields + "," + item.name + "=" + val;
        }
      });

      return resolve(
        `UPDATE agschema.${tableName} SET ${fields} WHERE ${keyName} = ${keyValue} RETURNING ${returnKey};`
      );
    });
  };

  module.ExecuteQuery = async (pool, query, returnType, closePool) => {
    return new Promise(async (resolve) => {
      const dbPool = await DbPool(pool);
      if (!dbPool) return resolve(dbPool.error);
      const client = dbPool.object;
      if (client) {
        await client.query(query, (error, res) => {
          if (error || !res || !client.readyForQuery) {
            if (error) console.log(error);
            if (client) client.release();
            return resolve({ status: 1, statusText: "Error Executing Query" });
          }
          rowCount = 0;
          let results = res;
          if (closePool) client.release();
          if (returnType === "COUNT") {
            return resolve({ status: 0, data: results.rowCount });
          } else {
            return resolve({ status: 0, data: results.rows });
          }
        });
      } else {
        return resolve({ status: 1, statusText: "Error Executing Query" });
      }
    });
  };

  module.SendSMS = async (input) => {
    return new Promise(async (resolve) => {
      await axios
        .post(SMSURL, input)
        .then((response) => {
          if (response.data.status) {
            return resolve(true);
          }
        })
        .catch((error) => {
          return resolve(false);
        });
    });
  };

  module.GetRandomNumber = async (min, max) => {
    return new Promise(async (resolve) => {
      const num = Math.floor(Math.random() * (max - min) + min);
      return resolve(num);
    });
  };

  module.GetSecretApiKey = async (keystr) => {
    return new Promise(async (resolve) => {
      const keyItem = `${SECREATKEY}${keystr}`;
      const { secret } = secretKey.create(keyItem);
      return resolve(secret);
    });
  };

  module.GetSecretApiKey2 = async (keystr) => {
    return new Promise(async (resolve) => {
      const keyItem = `${SECREATKEY}${keystr}`;
      return resolve(secretKey.create(keyItem));
    });
  };

  module.Padding = (val, len) => {
    return ("0".repeat(len) + val).slice(-len);
  };

  return module;
};
