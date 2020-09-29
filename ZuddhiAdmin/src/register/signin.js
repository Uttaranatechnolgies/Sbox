import React, { useState } from "react";
import { IsNull } from "../helper";
import { Login } from "../services/loginApi";
import "./register.css";
import { Store } from "../session";
import Loader from "../common/loader";

const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const SignIn = ({ history }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [progress, setProgress] = useState(false);

  const [error, setError] = useState("");

  const OnLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setProgress(true);
    let status = false;
    if (IsNull(data.email)) {
      setError("Enter valid email");
      setProgress(false);
    } else if (!validEmailRegex.test(data.email)) {
      setError("Enter valid email");
      setProgress(false);
    } else if (IsNull(data.password)) {
      setError("Enter valid password");
      setProgress(false);
    } else {
      const rslt = await Login(data);
      if (rslt && rslt.status === 100) {
        let token = rslt.data.token;
        await Store("userToken", token);
        await Store("user", "Administrator");
        setProgress(false);
        history.push("/region");
      } else {
        let msg = (rslt && rslt.statusText) || "Unable to connect server";
        setError(msg);
        setProgress(false);
      }
    }

    return status;
  };

  const OnChangeText = (val) => {
    setError("");
    setData({
      ...data,
      [val.target.name]: val.target.value,
    });
  };

  return (
    <>
      <Loader show={progress} />
      <div className="workFullColumn">
        <div className="loginmain">
          <div className="wrapper">
            <div className="signin-form-wrapper">
              <h2>Login to Account</h2>
              <form style={{ marginTop: 20 }} noValidate>
                <div className="email">
                  <label htmlFor="email">Email</label>
                  <input
                    onChange={(text) => OnChangeText(text)}
                    autoComplete="Off"
                    type="email"
                    name="email"
                    value={data.email}
                    noValidate
                  />
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    autoComplete="Off"
                    type="password"
                    name="password"
                    value={data.password}
                    noValidate
                    onChange={(text) => OnChangeText(text)}
                  />
                </div>

                {error !== "" ? (
                  <div className="model-input-error">{error} </div>
                ) : null}

                <div className="submit">
                  <button onClick={(event) => OnLoginSubmit(event)}>
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
