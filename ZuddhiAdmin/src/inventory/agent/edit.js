import React, { useState, useEffect } from "react";
import "./agent.css";
import { IsNull, InsertSelect, IsArrayNull } from "../../helper";
import { Update } from "../../services/agentApi";
import { GetSelect as GetMerchants } from "../../services/merchantApi";
import { GetSelect as GetPartners } from "../../services/partnerApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, item }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [typeId, setType] = useState({
    companytype: item ? item.agenttype : 2,
  });

  const [agent, setAgent] = useState({
    agentid: 0,
    addressid: 0,
    agenttype: 0,
    agentnum: "",
    agentname: "",
    mobile: "",
    line1: "",
    line2: "",
    line3: "",
    line4: "",
    city: "",
    state: "",
    country: "",
    statusid: 0,
    companyid: 0,
  });

  const [partners, setPartners] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const getDefaultValues = async () => {
    let rslt1 = await GetMerchants();
    let defaSelect = { merchantid: 0, merchantname: "Select" };
    rslt1 = InsertSelect(rslt1, defaSelect);
    setMerchants(rslt1);

    let rslt2 = await GetPartners();
    defaSelect = { partnerid: 0, partnername: "Select" };
    rslt2 = InsertSelect(rslt2, defaSelect);
    setPartners(rslt2);
  };

  useEffect(() => {
    setDialog(show);
    if (!IsNull(item)) {
      setAgent(item);
      setType({
        companytype: parseInt(item.agenttype),
      });
    }
    if (IsLoggedIn("userToken")) {
      getDefaultValues();
    }
  }, [show, item]);

  function CleanUp(obj) {
    setSuccess("");
    setError("");
    setAgent({
      agentid: 0,
      addressid: 0,
      agenttype: 0,
      agentnum: "",
      agentname: "",
      mobile: "",
      line1: "",
      line2: "",
      line3: "",
      line4: "",
      city: "",
      state: "",
      country: "",
      statusid: 0,
      companyid: 0,
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

    if (IsNull(agent.agentname)) {
      setError("Name should not be blank");
      return;
    } else if (IsNull(agent.mobile)) {
      setError("Mobile Number should not be blank");
      return;
    } else if (isNaN(agent.mobile)) {
      setError("Mobile Number should be 10 digits");
      return;
    } else if (parseInt(agent.companyid) === 0) {
      setError("Company name should not be blank");
      return;
    } else if (IsNull(agent.line1)) {
      setError("Address Line1 should not be blank");
      return;
    } else if (IsNull(agent.city)) {
      setError("City should not be blank");
      return;
    } else if (IsNull(agent.state)) {
      setError("State should not be blank");
      return;
    } else if (IsNull(agent.country)) {
      setError("Country should not be blank");
      return;
    }

    agent.agenttype = typeId.companytype;

    const rslt = await Update(agent);
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
    setAgent({
      ...agent,
      [target.name]: target.value,
    });
  };

  const OnCompanyTypeChanged = (event) => {
    setType({
      companytype: parseInt(event.target.value),
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog" style={{ left: "30%", top: "15%" }}>
        <div className="modal-dialog-header">Edit Agent</div>
        <div className="modal-dialog-body">
          <div className="modal-agent">
            <div className="model-input-container">
              <table id="agentinput">
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="agentname">Name</label>
                    </td>
                    <td>
                      <input
                        maxLength={25}
                        autoComplete="Off"
                        type="text"
                        name="agentname"
                        value={agent.agentname ? agent.agentname : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                    <td>
                      <label htmlFor="mobile">Mobile</label>
                    </td>
                    <td>
                      <input
                        maxLength={10}
                        autoComplete="Off"
                        type="text"
                        name="mobile"
                        value={agent.mobile ? agent.mobile : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Company</td>
                    <td>
                      <input
                        type="radio"
                        id="merchanttype"
                        name="type"
                        value={2}
                        checked={typeId.companytype === 2}
                        onChange={OnCompanyTypeChanged}
                      />
                      <label htmlFor="merchanttype">Merchants</label>
                      <input
                        type="radio"
                        id="partnertype"
                        name="type"
                        value={3}
                        checked={typeId.companytype === 3}
                        onChange={OnCompanyTypeChanged}
                      />
                      <label htmlFor="partnertype">Partners</label>
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    {typeId.companytype === 2 ? (
                      <td>
                        <select
                          style={{ width: "100%" }}
                          name="companyid"
                          onChange={(event) => handleChange(event)}
                          value={agent.companyid}
                          noValidate
                        >
                          {!IsArrayNull(merchants) &&
                            merchants.map((item, index) => (
                              <option key={index} value={item.merchantid}>
                                {item.merchantname}
                              </option>
                            ))}
                        </select>
                      </td>
                    ) : (
                      <td>
                        <select
                          style={{ width: "100%" }}
                          name="companyid"
                          onChange={(event) => handleChange(event)}
                          value={agent.companyid}
                          noValidate
                        >
                          {!IsArrayNull(partners) &&
                            partners.map((item, index) => (
                              <option key={index} value={item.partnerid}>
                                {item.partnername}
                              </option>
                            ))}
                        </select>
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="line1">Address Line1</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="line1"
                        value={agent.line1 ? agent.line1 : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="line2">Address Line2</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="line2"
                        value={agent.line2 ? agent.line2 : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="line3">Address Line3</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="line3"
                        value={agent.line3 ? agent.line3 : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="line4">Address Line4</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={50}
                        style={{ width: "95%" }}
                        autoComplete="Off"
                        type="text"
                        name="line4"
                        value={agent.line4 ? agent.line4 : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label htmlFor="city">City</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="city"
                        value={agent.city ? agent.city : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                    <td>
                      <label htmlFor="state">State</label>
                    </td>
                    <td>
                      <input
                        maxLength={50}
                        autoComplete="Off"
                        type="text"
                        name="state"
                        value={agent.state ? agent.state : ""}
                        noValidate
                        onChange={(event) => handleChange(event)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <label htmlFor="country">Country</label>
                    </td>
                    <td colSpan="3">
                      <input
                        maxLength={2}
                        autoComplete="Off"
                        type="text"
                        name="country"
                        value={agent.country ? agent.country : ""}
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
