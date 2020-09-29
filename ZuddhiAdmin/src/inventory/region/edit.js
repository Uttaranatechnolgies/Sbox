import React, { useState, useEffect } from "react";
import "./region.css";
import { IsNull } from "../../helper";
import { Update } from "../../services/regionApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, item }) => {
  const defaName = item ? item.regionname : "";

  const [dialog, setDialog] = useState(show);
  const [name, setName] = useState(defaName);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusTypes, setStatusTypes] = useState([]);

  const getDefaultTypes = async () => {
    const rslt = await GetStatusTypes();
    setStatusTypes(rslt.data);
  };

  useEffect(() => {
    setDialog(show);
    setName(defaName);
    if (IsLoggedIn("userToken")) {
      getDefaultTypes();
    }
  }, [show, defaName, setName]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    popupHandler("Cancel", item);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (IsNull(name)) {
      setError("Region name should be blank");
      return;
    }

    let data = {
      name: name,
      id: item.regionid,
      statusid: item.statusid,
    };

    const rslt = await Update(data);
    if (rslt.status === 100) {
      popupHandler("Success", item);
    } else {
      setError(rslt.statusText);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setName(e.target.value);
  };

  const onSelectChanged = (e) => {
    e.preventDefault();
    item.statusid = e.target.value;
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Edit Region</div>
        <div className="modal-dialog-body">
          <div className="modal-region">
            <div className="model-input-container">
              <label htmlFor="regname">Region</label>
              <input
                autoComplete="Off"
                type="text"
                name="regname"
                value={name}
                noValidate
                onChange={(event) => handleChange(event)}
              />
              <div className="type">
                <label htmlFor="type">Status Type</label>

                <select
                  name="type"
                  onChange={(event) => onSelectChanged(event)}
                  value={item.statusid}
                  noValidate
                >
                  {statusTypes &&
                    statusTypes.map((item, index) => (
                      <option key={item.statusid} value={item.statusid}>
                        {item.statusname}
                      </option>
                    ))}
                </select>
              </div>
              {error && <div className="model-input-error">{error}</div>}
              {success && <div className="model-input-success">{success}</div>}
            </div>
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
