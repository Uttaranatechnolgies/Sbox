import React, { useState, useEffect } from "react";
import "./box.css";
import { IsNull } from "../../helper";
import { Add } from "../../services/boxApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [box, setBox] = useState({
    boxname: "",
    dor: "",
    statusid: 1,
  });

  useEffect(() => {
    setDialog(show);
    setBox({
      boxname: "",
      dor: "",
      statusid: 1,
    });
  }, [show, setBox]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setBox({
      boxname: "",
      dor: "",
      statusid: 1,
    });
    popupHandler("Cancel");
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (IsNull(box.boxname)) {
      setError("Secure Box name should not be blank");
      return;
    }

    if (IsNull(box.dor)) {
      setError("Date Of Registration should not be blank");
      return;
    }
    const rslt = await Add(box);
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
        <div className="modal-dialog-header">Add Secure Box</div>
        <div className="modal-dialog-body">
          <div className="modal-box">
            <div className="model-input-container">
              <label htmlFor="boxname">Name</label>
              <input
                autoComplete="Off"
                type="text"
                name="boxname"
                value={box.boxname}
                noValidate
                onChange={(event) => OnHandleChange(event)}
              />
            </div>
            <div className="type">
              <label htmlFor="dor">Date Of Registered</label>
              <DatePicker
                selected={box.dor}
                dateFormat="yyyy-MMM-dd"
                onChange={(event) => OnDateChange(event)}
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
