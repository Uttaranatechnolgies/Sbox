import React, { useState, useEffect } from "react";
import "./region.css";
import { IsNull } from "../../helper";
import { Add } from "../../services/regionApi";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setDialog(show);
    setName("");
  }, [show, setName]);

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
    if (IsNull(name)) {
      setError("Region name should be blank");
      return;
    }

    let data = {
      name: name,
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

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Add Region</div>
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
