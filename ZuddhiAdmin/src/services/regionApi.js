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
    const res = await API.get("region", {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

const Add = async (input) => {
  let token = await GetHeader();
  try {
    const res = await API.post("region", input, {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

const Delete = async (input) => {
  let token = await GetHeader();
  try {
    const res = await API.delete(`region/${input}`, {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

const Update = async (input) => {
  let token = await GetHeader();
  try {
    const res = await API.put("region", input, {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

export { Get, Add, Delete, Update };
