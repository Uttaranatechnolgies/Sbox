import React, { useState, useEffect } from "react";
import "./box.css";
import { IsNull, ToDate } from "../../helper";
import { Update } from "../../services/boxApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditItem = ({ show, popupHandler, item }) => {
  const [dialog, setDialog] = useState(show);
  const [box, setBox] = useState({
    boxid: 0,
    boxname: "",
    dor: "",
    statusid: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusTypes, setStatusTypes] = useState([]);

  const getDefaultTypes = async () => {
    const rslt = await GetStatusTypes();
    setStatusTypes(rslt.data);
  };

  useEffect(() => {
    setDialog(show);
    setBox({
      boxid: item.boxid,
      boxname: item ? item.boxname : "",
      dor: item.dateofregistered,
      statusid: item.statusid,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultTypes();
    }
  }, [show, setBox, item]);

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

    if (IsNull(box.boxname)) {
      setError("Box name should not be blank");
      return;
    }

    if (IsNull(box.dor)) {
      setError("Date of Registration should not be blank");
      return;
    }

    if (parseInt(box.statusid) === 0) {
      setError("Status type should not be blank");
      return;
    }
    const rslt = await Update(box);
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
    setBox({
      ...box,
      [e.target.name]: e.target.value,
    });
  };

  const OnDateChange = (e) => {
    const name = "dor";
    setError("");
    setBox({
      ...box,
      [name]: e,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Edit Secure Box</div>
        <div className="modal-dialog-body">
          <div className="modal-box">
            <div className="model-input-container">
              <label htmlFor="boxname">Box Name</label>
              <input
                autoComplete="Off"
                type="text"
                name="boxname"
                value={box.boxname}
                noValidate
                onChange={(event) => onHandleChanged(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="dor">Date Of Registration</label>
              <DatePicker
                dateFormat="yyyy-MMM-dd"
                selected={ToDate(box.dor)}
                onChange={(event) => OnDateChange(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="statusid">Status Type</label>
              <select
                name="statusid"
                onChange={(event) => onHandleChanged(event)}
                value={box.statusid}
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
