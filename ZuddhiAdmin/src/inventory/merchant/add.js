import React, { useState, useEffect } from "react";
import "./merchant.css";
import { IsNull } from "../../helper";
import { Add } from "../../services/merchantApi";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [merchant, setMerchant] = useState({
    merchantname: "",
    merchantaddress: "",
    merchantcity: "",
    merchantstate: "",
    merchantcountry: "",
    contactname: "",
    contactphone: "",
  });

  useEffect(() => {
    setDialog(show);
    CleanUp();
  }, [show]);

  function CleanUp() {
    setSuccess("");
    setError("");
    setMerchant({
      merchantname: "",
      merchantaddress: "",
      merchantcity: "",
      merchantstate: "",
      merchantcountry: "",
      contactname: "",
      contactphone: "",
    });
  }
  const OnCancelClicked = (e) => {
    e.preventDefault();
    CleanUp();
    popupHandler("Cancel");
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (IsNull(merchant.merchantname)) {
      setError("Name should not be blank");
      return;
    } else if (IsNull(merchant.contactname)) {
      setError("Contact Name should be blank");
      return;
    } else if (IsNull(merchant.contactphone) || isNaN(merchant.contactphone)) {
      setError("Contact Phone should be 10 digits");
      return;
    } else if (IsNull(merchant.merchantaddress)) {
      setError("Address should not be blank");
      return;
    } else if (IsNull(merchant.merchantcity)) {
      setError("City should not be blank");
      return;
    } else if (IsNull(merchant.merchantstate)) {
      setError("State should not be blank");
      return;
    } else if (IsNull(merchant.merchantcountry)) {
      setError("Country should not be blank");
      return;
    }

    const rslt = await Add(merchant);
    if (rslt.status === 100) {
      popupHandler("Success");
    } else {
      setError(rslt.statusText);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    let target = e.target;
    setMerchant({
      ...merchant,
      [target.name]: target.value,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog" style={{ left: "35%", top: "15%" }}>
        <div className="modal-dialog-header">Add Merchant</div>
        <div className="modal-dialog-body">
          <div className="modal-merchant">
            <div className="model-input-container">
              <table id="merchantinput">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="merchantname">Name</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="merchantname"
                        value={merchant.merchantname}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="contactname">Contact Name</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="contactname"
                        value={merchant.contactname}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="contactphone">Contact Phone</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={10}
                        autoComplete="Off"
                        type="text"
                        name="contactphone"
                        value={merchant.contactphone}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="merchantaddress">Address</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="merchantaddress"
                        value={merchant.merchantaddress}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="merchantcity">City</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="merchantcity"
                        value={merchant.merchantcity}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                    <td>
                      <label htmlFor="merchantstate">State</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="merchantstate"
                        value={merchant.merchantstate}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="merchantcountry">Country</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={2}
                        autoComplete="Off"
                        type="text"
                        name="merchantcountry"
                        value={merchant.merchantcountry}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {error && (
              <div
                className="model-input-error"
                style={{ textAlign: "center" }}
              >
                {error}
              </div>
            )}
            {success && (
              <div
                className="model-input-success"
                style={{ textAlign: "center" }}
              >
                {success}
              </div>
            )}
          </div>
        </div>
        <div className="modal-dialog-footer">
          <button
            className="modal-dialog-cancel"
            onClick={(event) => OnCancelClicked(event)}
          >
            Cancel
          </button>
          <button
            className="modal-dialog-submit"
            onClick={(event) => OnSubmitClicked(event)}
          >
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddItem;
