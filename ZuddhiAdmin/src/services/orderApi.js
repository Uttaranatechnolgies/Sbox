import API from "./api";
import { Retrieve } from "../session";

const GetHeader = async () => {
  const token = await Retrieve("userToken");
  return {
    "Content-Type": "application/json",
    Authorization: `bearer ${token}`,
  };
};

const Get = async () => {
  let token = await GetHeader();
  try {
    const res = await API.get("order", {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

const GetBox = async (boxid) => {
  let token = await GetHeader();
  try {
    const res = await API.get(`orderbox/${boxid}`, {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

const GetUnlock = async (boxid) => {
  let token = await GetHeader();
  try {
    const res = await API.get(`unlock/${boxid}`, {
      headers: token,
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

export { Get, GetBox, GetUnlock };
