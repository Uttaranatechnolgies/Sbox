import React, { useState, useEffect } from "react";
import "./popups.css";

const AddNew = ({ type, show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);

  const RegionChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="regname">Region</label>
          <input autoComplete="Off" type="text" name="regname" noValidate />
        </div>
      </div>
    );
  };

  const ZoneChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="zonename">Zone</label>
          <input autoComplete="Off" type="text" name="zonename" noValidate />
          <label htmlFor="regname">Region</label>
          <input autoComplete="Off" type="text" name="regname" noValidate />
        </div>
      </div>
    );
  };

  const AreaChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="areaname">Area</label>
          <input autoComplete="Off" type="text" name="areaname" noValidate />
          <label htmlFor="zonename">Zone</label>
          <input autoComplete="Off" type="text" name="zonename" noValidate />
        </div>
      </div>
    );
  };

  const BoxChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="boxname">Box Name</label>
          <input autoComplete="Off" type="text" name="boxname" noValidate />
          <label htmlFor="dor">Date of registration</label>
          <input autoComplete="Off" type="text" name="dor" noValidate />
        </div>
      </div>
    );
  };

  const ControllerChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="ctrlnumber">Controller Number</label>
          <input autoComplete="Off" type="text" name="ctrlnumber" noValidate />
          <label htmlFor="cdor">Date of registration</label>
          <input autoComplete="Off" type="text" name="cdor" noValidate />
          <label htmlFor="cver">Version</label>
          <input autoComplete="Off" type="text" name="cver" noValidate />
        </div>
      </div>
    );
  };

  const BoxControllerChild = () => {
    return (
      <div className="modal-region">
        <div className="model-input-container">
          <label htmlFor="cbox">Box Name</label>
          <input autoComplete="Off" type="text" name="cbox" noValidate />
          <label htmlFor="cctrl">Controller</label>
          <input autoComplete="Off" type="text" name="cctrl" noValidate />
          <label htmlFor="czone">Zone</label>
          <input autoComplete="Off" type="text" name="czone" noValidate />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setDialog(show);
  }, [show]);

  const ChildrenItem = () => {
    if (type === "Region") {
      return <RegionChild />;
    } else if (type === "Zone") {
      return <ZoneChild />;
    } else if (type === "Area") {
      return <AreaChild />;
    } else if (type === "Box") {
      return <BoxChild />;
    } else if (type === "Ctrl") {
      return <ControllerChild />;
    } else if (type === "CBox") {
      return <BoxControllerChild />;
    }
  };

  const ItemTitle = () => {
    if (type === "Region") {
      return "Add Region";
    } else if (type === "Zone") {
      return "Add Zone";
    } else if (type === "Area") {
      return "Add Area";
    } else if (type === "Box") {
      return "Add Secure Box";
    } else if (type === "Ctrl") {
      return "Add Controller";
    } else if (type === "CBox") {
      return "Box and Controller Mapping";
    }
  };

  const OnCancelClicked = () => {
    setDialog(false);
    popupHandler("Cancel");
  };

  const OnSubmitClicked = () => {
    setDialog(false);
    popupHandler("Submit");
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">
          <ItemTitle />
        </div>
        <div className="modal-dialog-body">
          <ChildrenItem />
        </div>
        <div className="modal-dialog-footer">
          <button className="modal-dialog-cancel" onClick={OnCancelClicked}>
            Cancel
          </button>
          <button className="modal-dialog-submit" onClick={OnSubmitClicked}>
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddNew;
