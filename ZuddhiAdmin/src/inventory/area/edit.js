import React, { useState, useEffect } from "react";
import "./area.css";
import { IsNull, IsArrayNull, InsertSelect } from "../../helper";
import { Update } from "../../services/areaApi";
import { Get as ZoneGet } from "../../services/zoneApi";
import { Get as RegionGet } from "../../services/regionApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, item }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [zone, setZones] = useState([]);
  const [region, setRegions] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);

  const [area, setArea] = useState({
    areaid: 0,
    areaname: "",
    regionid: 0,
    zoneid: 0,
    statusid: 1,
  });

  const getDefaultValues = async () => {
    let rslt = await RegionGet();
    let defaSelect = { regionid: 0, regionname: "Select" };
    rslt = InsertSelect(rslt, defaSelect);
    setRegions(rslt);

    let rslt2 = await ZoneGet();
    defaSelect = { zoneid: 0, zonename: "Select" };
    rslt2 = InsertSelect(rslt2, defaSelect);
    setZones(rslt2);

    let rslt3 = await GetStatusTypes();
    defaSelect = { statusid: 0, statusname: "Select" };
    rslt3 = InsertSelect(rslt3, defaSelect);
    setStatusTypes(rslt3);
  };

  useEffect(() => {
    setDialog(show);
    setArea({
      areaid: item ? item.areaid : 0,
      areaname: item ? item.areaname : "",
      regionid: item ? item.regionid : 0,
      zoneid: item ? item.zoneid : 0,
      statusid: item ? item.statusid : 0,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultValues();
    }
  }, [show, setArea, item]);

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

    if (IsNull(area.areaname)) {
      setError("Area name should be blank");
      return;
    }

    if (parseInt(area.regionid) === 0) {
      setError("Region name should be blank");
      return;
    }

    if (parseInt(area.zoneid) === 0) {
      setError("Zone name should be blank");
      return;
    }

    if (parseInt(area.statusid) === 0) {
      setError("Status name should be blank");
      return;
    }

    const rslt = await Update(area);
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
    setArea({
      ...area,
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
              <label htmlFor="areaname">Area</label>
              <input
                autoComplete="Off"
                type="text"
                name="areaname"
                value={area.areaname}
                noValidate
                onChange={(event) => onHandleChanged(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="regionid">Region</label>
              <select
                name="regionid"
                onChange={(event) => onHandleChanged(event)}
                value={area.regionid}
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
            <div className="type">
              <label htmlFor="zoneid">Zone</label>
              <select
                name="zoneid"
                onChange={(event) => onHandleChanged(event)}
                value={area.zoneid}
                noValidate
              >
                {!IsArrayNull(zone) &&
                  zone.map((item, index) => (
                    <option key={item.zoneid} value={item.zoneid}>
                      {item.zonename}
                    </option>
                  ))}
              </select>
            </div>
            <div className="type">
              <label htmlFor="statusid">Status Type</label>
              <select
                name="statusid"
                onChange={(event) => onHandleChanged(event)}
                value={area.statusid}
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
