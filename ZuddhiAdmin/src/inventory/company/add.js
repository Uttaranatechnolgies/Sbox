import React, { useState, useEffect } from "react";
import "./company.css";
import { IsNull } from "../../helper";
import { Add } from "../../services/companyApi";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [company, setCompany] = useState({
    companyname: "",
    companyaddress: "",
    companycity: "",
    companystate: "",
    companycountry: "",
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
    setCompany({
      companyname: "",
      companyaddress: "",
      companycity: "",
      companystate: "",
      companycountry: "",
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

    if (IsNull(company.companyname)) {
      setError("Name should not be blank");
      return;
    } else if (IsNull(company.contactname)) {
      setError("Contact Name should be blank");
      return;
    } else if (IsNull(company.contactphone) || isNaN(company.contactphone)) {
      setError("Contact Phone should be 10 digits");
      return;
    } else if (IsNull(company.companyaddress)) {
      setError("Address should not be blank");
      return;
    } else if (IsNull(company.companycity)) {
      setError("City should not be blank");
      return;
    } else if (IsNull(company.companystate)) {
      setError("State should not be blank");
      return;
    } else if (IsNull(company.companycountry)) {
      setError("Country should not be blank");
      return;
    }

    const rslt = await Add(company);
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
    setCompany({
      ...company,
      [target.name]: target.value,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog" style={{ left: "35%", top: "15%" }}>
        <div className="modal-dialog-header">Add Merchant</div>
        <div className="modal-dialog-body">
          <div className="modal-company">
            <div className="model-input-container">
              <table id="companyinput">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="companyname">Name</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="companyname"
                        value={company.companyname}
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
                        value={company.contactname}
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
                        value={company.contactphone}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="companyaddress">Address</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="companyaddress"
                        value={company.companyaddress}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="companycity">City</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="companycity"
                        value={company.companycity}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                    <td>
                      <label htmlFor="companystate">State</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="companystate"
                        value={company.companystate}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="companycountry">Country</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={2}
                        autoComplete="Off"
                        type="text"
                        name="companycountry"
                        value={company.companycountry}
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
