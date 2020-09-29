import React, { useState, useEffect } from "react";
import "./controller.css";
import { IsNull, ToDate, IsNumber } from "../../helper";
import { Update } from "../../services/controllerApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditItem = ({ show, popupHandler, input }) => {
  const [dialog, setDialog] = useState(show);

  const [item, setItem] = useState({
    controllerid: 0,
    number: "",
    version: "",
    dor: "",
    statusid: 1,
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
    setItem({
      controllerid: input ? input.controllerid : 0,
      number: input ? input.controllerphonenumber : "",
      version: input ? input.version : "",
      dor: input ? input.dateofregistered : "",
      statusid: input ? input.statusid : 1,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultTypes();
    }
  }, [show, setItem, input]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    popupHandler("Cancel", input);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (IsNull(item.number) || !IsNumber(item.number)) {
      setError("Controller Number is not valid");
      return;
    }

    if (IsNull(item.dor)) {
      setError("Date Of Registration should not be blank");
      return;
    }

    if (IsNull(item.version)) {
      setError("Version should not be blank");
      return;
    }

    const rslt = await Update(item);
    if (rslt.status === 100) {
      popupHandler("Success", input);
    } else {
      setError(rslt.statusText);
    }
  };

  const onHandleChanged = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const OnDateChange = (e) => {
    const name = "dor";
    setError("");
    setItem({
      ...item,
      [name]: e,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Edit Controller</div>
        <div className="modal-dialog-body">
          <div className="modal-popupbox">
            <div className="model-input-container">
              <label htmlFor="number">Controller Phone Number</label>
              <input
                autoComplete="Off"
                type="text"
                name="number"
                value={item.number}
                noValidate
                onChange={(event) => onHandleChanged(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="dor">Date Of Registration</label>{" "}
              <DatePicker
                dateFormat="yyyy-MMM-dd"
                selected={ToDate(item.dor)}
                onChange={(event) => OnDateChange(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="version">Version</label>
              <input
                autoComplete="Off"
                type="text"
                name="version"
                value={item.version}
                noValidate
                onChange={(event) => onHandleChanged(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="statusid">Status Type</label>
              <select
                name="statusid"
                onChange={(event) => onHandleChanged(event)}
                value={item.statusid}
                noValidate
              >
                {statusTypes &&
                  statusTypes.map((mitem, index) => (
                    <option key={index} value={mitem.statusid}>
                      {mitem.statusname}
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
