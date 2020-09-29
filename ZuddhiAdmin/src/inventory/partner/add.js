import React, { useState, useEffect } from "react";
import "./partner.css";
import { IsNull } from "../../helper";
import { Add } from "../../services/partnerApi";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [partner, setPartner] = useState({
    partnername: "",
    partneraddress: "",
    partnercity: "",
    partnerstate: "",
    partnercountry: "",
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
    setPartner({
      partnername: "",
      partneraddress: "",
      partnercity: "",
      partnerstate: "",
      partnercountry: "",
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

    if (IsNull(partner.partnername)) {
      setError("Name should not be blank");
      return;
    } else if (IsNull(partner.contactname)) {
      setError("Contact Name should be blank");
      return;
    } else if (IsNull(partner.contactphone) || isNaN(partner.contactphone)) {
      setError("Contact Phone should be 10 digits");
      return;
    } else if (IsNull(partner.partneraddress)) {
      setError("Address should not be blank");
      return;
    } else if (IsNull(partner.partnercity)) {
      setError("City should not be blank");
      return;
    } else if (IsNull(partner.partnerstate)) {
      setError("State should not be blank");
      return;
    } else if (IsNull(partner.partnercountry)) {
      setError("Country should not be blank");
      return;
    }

    const rslt = await Add(partner);
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
    setPartner({
      ...partner,
      [target.name]: target.value,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog" style={{ left: "35%", top: "15%" }}>
        <div className="modal-dialog-header">Add Partner</div>
        <div className="modal-dialog-body">
          <div className="modal-partner">
            <div className="model-input-container">
              <table id="partnerinput">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="partnername">Name</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="partnername"
                        value={partner.partnername}
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
                        value={partner.contactname}
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
                        value={partner.contactphone}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="partneraddress">Address</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="partneraddress"
                        value={partner.partneraddress}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="partnercity">City</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="partnercity"
                        value={partner.partnercity}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                    <td>
                      <label htmlFor="partnerstate">State</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="partnerstate"
                        value={partner.partnerstate}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="partnercountry">Country</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={2}
                        autoComplete="Off"
                        type="text"
                        name="partnercountry"
                        value={partner.partnercountry}
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
