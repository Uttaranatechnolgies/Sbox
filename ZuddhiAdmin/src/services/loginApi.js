import API from "./api";

const Login = async (input) => {
  try {
    const res = await API.post("login", input);
    return res.data;
  } catch (err) {
    return { statusText: "Could not connect to server", status: 900 };
  }
};

export { Login };
