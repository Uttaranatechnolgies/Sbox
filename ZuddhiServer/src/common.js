const Pool = require("pg").Pool;
const helper = require("./helper/helper")();

const { POSTGRESDBConfig, ERRORS } = require("../config");

const pool = new Pool({
  user: POSTGRESDBConfig.user,
  host: POSTGRESDBConfig.host,
  database: POSTGRESDBConfig.database,
  password: POSTGRESDBConfig.password,
  port: POSTGRESDBConfig.port,
});

const commonController = () => {
  var module = [];

  module.getAddress = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select addressid from agschema.address where addressid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching address details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No address details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getAddressById = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select city,state,country from agschema.address where addressid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching address details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No address details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data[0],
      });
    });
  };

  module.getOrder = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select orderid from agschema.order where orderid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching order details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No order details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getAgentByMobile = async (id, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select agentid from agschema.agent where mobile='${id}';`;
      if (excludeid) {
        query = `select agentid from agschema.agent where mobile='${id}' and agentid != ${excludeid};`;
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getAgentById = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select agentid,agenttype,agentnum,agentname,mobile,addressid,companyid from agschema.agent where agentid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data[0],
      });
    });
  };

  module.getAgentIdByMobile = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select agentid from agschema.agent where mobile='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching agent details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No agent details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getOrderByNumber = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select orderid from agschema.order where ordernum='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching order details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No order details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getOrderByNums = async (ordernum, companyid) => {
    return new Promise(async (resolve) => {
      let query = `select orderid from agschema.order where companyid='${companyid}' and ordernum='${ordernum}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching order details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No order details found for ${ordernum}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getArea = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select areaid from agschema.area where areaid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching area details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No area details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getAreaByname = async (name, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select areaid from agschema.area where areaname='${name}';`;

      if (excludeid) {
        query = `select areaid from agschema.area where areaid != '${excludeid}' and areaname='${name}';`;
      }

      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching area details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No area details found for ${name}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getMapping = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select mapid from agschema.boxcontroller where mapid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching box and controller mapping details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No box and controller mapping details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getController = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select controllerid from agschema.controller where controllerid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching controller details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No controller details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getControllerByName = async (number, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select controllerid from agschema.controller 
      where controllerphonenumber='${number}';`;
      if (excludeid) {
        query = `select controllerid from agschema.controller 
        where controllerid != '${excludeid}' and controllerphonenumber='${number}';`;
      }

      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching controller details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No controller details found for ${number}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getRegion = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select regionid from agschema.region where regionid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching region details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No region details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getRegionByName = async (name, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select regionid from agschema.region where regionname='${name}';`;
      if (excludeid) {
        query = `select regionid from agschema.region where regionid != '${excludeid}' and regionname='${name}';`;
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching region details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No region details found for ${name}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getBox = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select boxid,barcode from agschema.securebox where boxid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "TABLE", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching box details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data.length === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No box details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getBoxByName = async (name, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select boxid from agschema.securebox where boxname='${name}';`;
      if (excludeid) {
        query = `select boxid from agschema.securebox where boxid != '${excludeid}' and boxname='${name}';`;
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching box details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No box details found for ${name}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getZone = async (id) => {
    return new Promise(async (resolve) => {
      let query = `select zoneid from agschema.zone where zoneid='${id}';`;
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching zone details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No zone details found for ${id}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getZoneByName = async (name, excludeid) => {
    return new Promise(async (resolve) => {
      let query = `select zoneid from agschema.zone where zonename='${name}';`;
      if (excludeid) {
        query = `select zoneid from agschema.zone where zoneid != '${excludeid}' and zonename='${name}';`;
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching zone details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No zone details found for ${name}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.IsMappingExist = async (boxid, controllerid, areaid, mapid) => {
    return new Promise(async (resolve) => {
      let query = `select mapid from agschema.boxcontroller 
      where boxid='${boxid}' and controllerid='${controllerid}';`;
      if (mapid) {
        query = `select mapid from agschema.boxcontroller 
        where mapid !='${mapid}' and controllerid='${controllerid}' and boxid='${boxid}';`;
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching mapping details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No mapping details found for Box:${boxid} Controller:${controllerid} Area:${areaid}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.IsCompanyExist = async (name, phone, companyid) => {
    return new Promise(async (resolve) => {
      let query = `select companyid from agschema.company 
      where companyname='${name}'`;
      if (companyid) {
        query = `select companyid from agschema.boxcontroller 
        where companyid !='${companyid}' and companyname='${name}'`;
      }

      if (phone) {
        query = query + ` and contactphone='${phone}'`;
      } else {
        query = query + ";";
      }
      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching company details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No company details found for Company Name:${name} Contact Phone:${phone}`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.IsRecordExist = async (table, keyName, items) => {
    return new Promise(async (resolve) => {
      let select = `select ${keyName} from agschema.${table}`;
      let where = "";
      for (var item in items) {
        const { name, value, excluded } = items[item];
        let tag = excluded ? " != " : " = ";
        if (where === "") {
          where = ` where ${name}${tag}'${value}'`;
        } else {
          where = `${where} and ${name}${tag}'${value}'`;
        }
      }
      let query = `${select}${where};`;

      let dbResult = await helper.ExecuteQuery(pool, query, "COUNT", true);
      if (dbResult.status === 1) {
        return resolve({
          status: ERRORS.FAILURE,
          statusText: `Failed fetching details`,
        });
      }
      if (dbResult.status === 0 && dbResult.data === 0) {
        return resolve({
          status: ERRORS.NOTFOUND,
          statusText: `No details found`,
        });
      }

      return resolve({
        status: ERRORS.SUCCESS,
        data: dbResult.data,
      });
    });
  };

  module.getStatusList = async () => {
    return new Promise(async (resolve) => {
      let query = `select * from agschema.statustype;`;
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

  return module;
};

module.exports = commonController;
