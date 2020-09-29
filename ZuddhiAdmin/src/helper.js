import * as moment from "moment";
const IsNull = (input) => {
  if (input) {
    if (typeof input === "string") {
      if (input.replace(/ /g, "") !== "") {
        return false;
      }
    }
    return false;
  }
  return true;
};

const IsNumber = (input) => {
  if (input && isNaN(input)) {
    return false;
  }
  return true;
};

const IsArrayNull = (input) => {
  if (input && input.length > 0) {
    return false;
  }
  return true;
};

const InsertSelect = (input, item) => {
  if (IsNull(input) || IsArrayNull(input.data)) {
    return [item];
  } else {
    input.data.splice(0, 0, item);
    return input.data;
  }
};

const Padding = (val, len) => {
  return ("0".repeat(len) + val).slice(-len);
};

const FormatDate = (dt) => {
  if (dt) {
    return moment(dt).format("YYYY-MMM-DD");
  }
  return "";
};

const ToDate = (dt) => {
  if (dt) {
    return moment(dt).toDate();
  }
  return "";
};

const GetAddress = (source, columns) => {
  let address = "";

  columns.forEach(function (item) {
    let value = source[item];
    if (!IsNull(value)) {
      if (address === "") {
        address = source[item];
      } else {
        address = address + ", " + source[item];
      }
    }
  });
  return address;
};

export {
  IsNull,
  Padding,
  IsArrayNull,
  InsertSelect,
  FormatDate,
  ToDate,
  IsNumber,
  GetAddress,
};
