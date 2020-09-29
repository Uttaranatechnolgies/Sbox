import React, { useState, useEffect } from "react";
import "./common.css";

const ConfirmDialog = ({ show, popupHandler, title, body, item }) => {
  const [dialog, setDialog] = useState(show);

  useEffect(() => {
    setDialog(show);
  }, [show]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setDialog(false);
    popupHandler("No", item);
  };

  const OnSubmitClicked = (e) => {
    e.preventDefault();
    setDialog(false);
    popupHandler("Yes", item);
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">{title}</div>
        <div className="modal-dialog-body deleteIcon-body">{body}</div>
        <div className="modal-dialog-footer">
          <button
            className="modal-dialog-cancel"
            onClick={(event) => OnCancelClicked(event)}
          >
            No
          </button>
          <button
            className="modal-dialog-submit"
            onClick={(event) => OnSubmitClicked(event)}
          >
            Yes
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
