import React from "react";
import "./register.css";

const SignUp = () => {
  return (
    <main>
      <div className="wrapper">
        <div className="form-wrapper">
          <h2>Create New Account</h2>
          <form noValidate>
            <div className="row">
              <div className="column">
                <div className="type">
                  <label htmlFor="type">Type of Customer</label>
                  <select name="type" defaultValue="Customer" noValidate>
                    <option value="Customer">Customer</option>
                    <option value="Delivery">Delivery Partner</option>
                    <option value="Resturant">Resturant</option>
                  </select>
                </div>
                <div className="fullName">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    autoComplete="off"
                    type="firstname"
                    name="firstname"
                    noValidate
                  />
                </div>
                <div className="email">
                  <label htmlFor="email">Email</label>
                  <input
                    autoComplete="off"
                    type="email"
                    name="email"
                    noValidate
                  />
                </div>
                <div className="phone">
                  <label htmlFor="phone">Phone</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="phone"
                    noValidate
                  />
                </div>
                <div className="address">
                  <label htmlFor="address">Address</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="address"
                    noValidate
                  />
                </div>
                <div className="state">
                  <label htmlFor="state">State</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="state"
                    noValidate
                  />
                </div>
              </div>
              <div className="column">
                <div className="fullName">
                  <label htmlFor="fullname">Full Name</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="fullname"
                    noValidate
                  />
                </div>

                <div className="fullName">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    autoComplete="off"
                    type="lastname"
                    name="lastname"
                    noValidate
                  />
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    autoComplete="off"
                    type="password"
                    name="password"
                    noValidate
                  />
                </div>
                <div className="zip">
                  <label htmlFor="zip">Zip Code</label>
                  <input autoComplete="off" type="text" name="zip" noValidate />
                </div>
                <div className="city">
                  <label htmlFor="city">City</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="city"
                    noValidate
                  />
                </div>
                <div className="country">
                  <label htmlFor="country">Country</label>
                  <input
                    autoComplete="off"
                    type="text"
                    name="country"
                    noValidate
                  />
                </div>
              </div>
            </div>
            <div className="submit">
              <button>Create</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
