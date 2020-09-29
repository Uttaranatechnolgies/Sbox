import React, { useState, useEffect } from "react";
import "./zone.css";
import { IsNull, IsArrayNull } from "../../helper";
import { Update } from "../../services/zoneApi";
import { Get as RegionGet } from "../../services/regionApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, item }) => {
  const [dialog, setDialog] = useState(show);
  const [zone, setZone] = useState({
    id: item.zoneid,
    name: "",
    regionid: "",
    statusid: 0,
  });
  const [region, setRegions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusTypes, setStatusTypes] = useState([]);

  const getDefaultTypes = async () => {
    const rslt = await GetStatusTypes();
    setStatusTypes(rslt.data);
  };

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
    setZone({
      name: item ? item.zonename : "",
      regionid: parseInt((item && item.regionid) || 0),
      statusid: parseInt((item && item.statusid) || 0),
      id: item.zoneid,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultTypes();
      getDefaultRegions();
    }
  }, [show, setZone, item]);

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
    if (IsNull(zone.name)) {
      setError("Zone name should be blank");
      return;
    }

    if (parseInt(zone.regionid) === 0) {
      setError("Region name should be blank");
      return;
    }
    const rslt = await Update(zone);
    if (rslt.status === 100) {
      popupHandler("Success", item);
    } else {
      setError(rslt.statusText);
    }
  };

  const onHandleChanged = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setZone({
      ...zone,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Edit Zone</div>
        <div className="modal-dialog-body">
          <div className="modal-zone">
            <div className="model-input-container">
              <label htmlFor="name">Zone</label>
              <input
                autoComplete="Off"
                type="text"
                name="name"
                value={zone.name}
                noValidate
                onChange={(event) => onHandleChanged(event)}
              />
              <div className="type">
                <label htmlFor="regionid">Region</label>
                <select
                  name="regionid"
                  onChange={(event) => onHandleChanged(event)}
                  value={zone.regionid}
                  noValidate
                >
                  {!IsArrayNull(region) &&
                    region.map((ritem, index) => (
                      <option key={ritem.regionid} value={ritem.regionid}>
                        {ritem.regionname}
                      </option>
                    ))}
                </select>
              </div>
              <div className="type">
                <label htmlFor="statusid">Status Type</label>
                <select
                  name="statusid"
                  onChange={(event) => onHandleChanged(event)}
                  defaultValue={item.statusid}
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
