import React, { useState, useEffect } from "react";
import "./company.css";
import { IsNull } from "../../helper";
import { Update } from "../../services/companyApi";

const EditItem = ({ show, popupHandler, item }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [company, setCompany] = useState({
    companyid: 0,
    companyaddress: "",
    companycity: "",
    companystate: "",
    companycountry: "",
    contactname: "",
    contactphone: "",
    statusid: 0,
  });

  useEffect(() => {
    setDialog(show);
    if (!IsNull(item)) {
      setCompany(item);
    }
  }, [show, item]);

  function CleanUp(obj) {
    setSuccess("");
    setError("");
    setCompany({
      companyid: 0,
      companyaddress: "",
      companycity: "",
      companystate: "",
      companycountry: "",
      contactname: "",
      contactphone: "",
      statusid: 0,
    });
  }

  const OnCancelClicked = (e) => {
    e.preventDefault();
    CleanUp(null);
    popupHandler("Cancel", item);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (IsNull(company.contactname)) {
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

    const rslt = await Update(company);
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
      <section className="modal-dialog" style={{ left: "30%", top: "15%" }}>
        <div className="modal-dialog-header">Edit Merchant</div>
        <div className="modal-dialog-body">
          <div className="modal-company">
            <div className="model-input-container">
              <table id="companyinput">
                <tbody>
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
                        value={company.contactname ? company.contactname : ""}
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
                        value={company.contactphone ? company.contactphone : ""}
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
                        value={
                          company.companyaddress ? company.companyaddress : ""
                        }
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
                        value={company.companycity ? company.companycity : ""}
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
                        value={company.companystate ? company.companystate : ""}
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
                        value={
                          company.companycountry ? company.companycountry : ""
                        }
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

export default EditItem;
