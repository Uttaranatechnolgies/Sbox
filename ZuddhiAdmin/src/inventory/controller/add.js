import React, { useState, useEffect } from "react";
import "./controller.css";
import { IsNull, IsNumber } from "../../helper";
import { Add } from "../../services/controllerApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [item, setItem] = useState({
    number: "",
    version: "",
    dor: "",
    statusid: 1,
  });

  useEffect(() => {
    setDialog(show);
    setItem({
      number: "",
      version: "",
      dor: "",
      statusid: 1,
    });
  }, [show, setItem]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setItem({
      number: "",
      version: "",
      dor: "",
      statusid: 1,
    });
    popupHandler("Cancel");
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

    const rslt = await Add(item);
    if (rslt.status === 100) {
      popupHandler("Success");
    } else {
      setError(rslt.statusText);
    }
  };

  const OnHandleChange = (e) => {
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
        <div className="modal-dialog-header">Add Controller</div>
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
                onChange={(event) => OnHandleChange(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="dor">Date Of Registered</label>
              <DatePicker
                dateFormat="yyyy-MMM-dd"
                selected={item.dor}
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
                onChange={(event) => OnHandleChange(event)}
              />
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
