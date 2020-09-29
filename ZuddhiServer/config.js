const POSTGRESDBConfig = {
  port: 5432,
  host: process.env.REDIS_HOST || "localhost",
  database: "ZuddhiAgDb",
  user: "postgres",
  password: "zuddhi",
};

const ERRORS = {
  SUCCESS: 100,
  DUPLICATE: 200,
  NOTFOUND: 300,
  MANDATORY: 400,
  FAILURE: 900,
  INVALIDTOKEN: 500,
  TOKENEXPIRED: 600,
};

const SECREATKEY =
  "WlVEREhJIEFHR1JFR0FUT1IgQVBQTElDQVRJT04gU0VSVkVSIEFORCBNT0JJTEUgSldU";

const SMSURL =
  "https://ogxm26srl9.execute-api.ap-south-1.amazonaws.com/api/Message/SendSMS";

module.exports = {
  POSTGRESDBConfig,
  SECREATKEY,
  ERRORS,
  SMSURL,
};
