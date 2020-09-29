import React, { useState, useEffect } from "react";
import "./zone.css";
import { IsNull, IsArrayNull } from "../../helper";
import { Add } from "../../services/zoneApi";
import { Get as RegionGet } from "../../services/regionApi";
import { IsLoggedIn } from "../../session";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [name, setName] = useState("");
  const [regionid, setRegionId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [region, setRegions] = useState([]);

  const getDefaultRegions = async () => {
    let rslt = await RegionGet();
    let defaSelect = { regionid: 0, regionname: "Select" };
    if (IsArrayNull(rslt.data)) {
      rslt = {
        data: defaSelect,
      };
    } else {
      rslt.data.splice(0, 0, defaSelect);
    }
    setRegions(rslt.data);
  };

  useEffect(() => {
    setDialog(show);
    setName("");
    setRegionId(0);
    if (IsLoggedIn("userToken")) {
      getDefaultRegions();
    }
  }, [show, setName, setRegionId]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setRegionId(0);
    popupHandler("Cancel");
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (IsNull(name)) {
      setError("Zone name should not be blank");
      return;
    }

    if (regionid === 0) {
      setError("Region should not be blank");
      return;
    }

    let data = {
      name: name,
      regionid: regionid,
    };
    const rslt = await Add(data);
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
    setName(e.target.value);
  };

  const onSelectChanged = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setRegionId(e.target.value);
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Add Region</div>
        <div className="modal-dialog-body">
          <div className="modal-region">
            <div className="model-input-container">
              <label htmlFor="zonename">Zone</label>
              <input
                autoComplete="Off"
                type="text"
                name="zonename"
                value={name}
                noValidate
                onChange={(event) => handleChange(event)}
              />
              <div className="type">
                <label htmlFor="type">Region</label>
                <select
                  name="type"
                  onChange={(event) => onSelectChanged(event)}
                  value={regionid}
                  noValidate
                >
                  {!IsArrayNull(region) &&
                    region.map((item, index) => (
                      <option key={item.regionid} value={item.regionid}>
                        {item.regionname}
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

export default AddItem;
