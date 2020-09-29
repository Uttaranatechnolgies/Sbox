import React, { useState, useEffect } from "react";
import "./common.css";

const ConfirmDialog = ({ show, popupHandler, body }) => {
  const [dialog, setDialog] = useState(show);

  useEffect(() => {
    setDialog(show);
  }, [show]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setDialog(false);
    popupHandler();
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        {body.danger ? (
          <div
            className="modal-dialog-header"
            style={{ backgroundColor: "brown" }}
          >
            Alert
          </div>
        ) : (
          <div className="modal-dialog-header">Alert</div>
        )}

        <div
          className="modal-dialog-body deleteIcon-body"
          style={{ fontWeight: "bold" }}
        >
          {body.msg}
        </div>
        <div className="modal-dialog-footer">
          <button
            className="modal-dialog-cancel"
            onClick={(event) => OnCancelClicked(event)}
          >
            Ok
          </button>
        </div>
      </section>
    </div>
  );
};

export default ConfirmDialog;
