import React, { useState, useEffect } from "react";
import "./area.css";
import { IsNull, IsArrayNull, InsertSelect } from "../../helper";
import { Add } from "../../services/areaApi";
import { Get as RegionGet } from "../../services/regionApi";
import { Get as ZoneGet } from "../../services/zoneApi";
import { IsLoggedIn } from "../../session";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [zone, setZones] = useState([]);
  const [zonefilter, setFilterZones] = useState([]);
  const [region, setRegions] = useState([]);
  const [area, setArea] = useState({
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
    setFilterZones([]);
  };

  useEffect(() => {
    setDialog(show);
    setArea({
      areaname: "",
      regionid: 0,
      zoneid: 0,
      statusid: 1,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultValues();
    }
  }, [show, setArea]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    popupHandler("Cancel");
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (IsNull(area.areaname)) {
      setError("Area name should not be blank");
      return;
    }

    if (parseInt(area.regionid) === 0) {
      setError("Region should not be blank");
      return;
    }

    if (parseInt(area.zoneid) === 0) {
      setError("Zone name should not be blank");
      return;
    }

    const rslt = await Add(area);
    if (rslt.status === 100) {
      popupHandler("Success");
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
    if (e.target.name === "regionid") {
      const name = "zoneid";
      setArea({
        ...area,
        [e.target.name]: e.target.value,
        [name]: 0,
      });
      let filteredItems = zone.filter(
        (item) => item.regionid === e.target.value
      );
      let defaSelect = { zoneid: 0, zonename: "Select" };
      filteredItems = InsertSelect(filteredItems, defaSelect);
      setFilterZones(filteredItems);
    }
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Add Area</div>
        <div className="modal-dialog-body">
          <div className="modal-region">
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
                    <option key={index} value={item.regionid}>
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
                {!IsArrayNull(zonefilter) &&
                  zonefilter.map((item, index) => (
                    <option key={index} value={item.zoneid}>
                      {item.zonename}
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

export default AddItem;
