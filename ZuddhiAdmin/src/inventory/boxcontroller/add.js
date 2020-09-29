import React, { useState, useEffect } from "react";
import "./boxcontrolmap.css";
import { IsNumber, InsertSelect } from "../../helper";
import { Get as GetBoxes } from "../../services/boxApi";
import { Get as GetControllers } from "../../services/controllerApi";
import { Get as GetAreas } from "../../services/areaApi";
import { Add } from "../../services/boxcontollerApi";
import { IsLoggedIn } from "../../session";

const AddItem = ({ show, popupHandler }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [item, setItem] = useState({
    boxid: 0,
    controllerid: 0,
    areaid: 0,
    statusid: 1,
  });

  const [boxes, setBoxes] = useState([]);
  const [controllers, setControllers] = useState([]);
  const [areas, setAreas] = useState([]);

  const getDefaultItems = async () => {
    let rslt1 = await GetBoxes();
    let defaSelect = { boxid: 0, boxname: "Select" };
    rslt1 = InsertSelect(rslt1, defaSelect);
    setBoxes(rslt1);

    let rslt2 = await GetControllers();
    defaSelect = { controllerid: 0, barcode: "Select" };
    rslt2 = InsertSelect(rslt2, defaSelect);
    setControllers(rslt2);

    let rslt3 = await GetAreas();
    defaSelect = { areaid: 0, areaname: "Select" };
    rslt3 = InsertSelect(rslt3, defaSelect);
    setAreas(rslt3);
  };

  useEffect(() => {
    setDialog(show);
    setItem({
      boxid: 0,
      controllerid: 0,
      statusid: 1,
      areaid: 0,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultItems();
    }
  }, [show, setItem]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setItem({
      boxid: 0,
      areaid: 0,
      controllerid: 0,
      statusid: 1,
    });
    popupHandler("Cancel");
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!IsNumber(item.controllerid)) {
      setError("Controller is not valid");
      return;
    }

    if (!IsNumber(item.boxid)) {
      setError("Secure Box is not valid");
      return;
    }

    if (!IsNumber(item.areaid)) {
      setError("Area is not valid");
      return;
    }

    const rslt = await Add(item);
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
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">Map Box and Controller</div>
        <div className="modal-dialog-body">
          <div className="modal-popupbox">
            <div className="type">
              <label htmlFor="controllerid">Controller</label>
              <select
                name="controllerid"
                onChange={(event) => onHandleChanged(event)}
                value={item.controllerid}
                noValidate
              >
                {controllers &&
                  controllers.map((mitem, index) => (
                    <option key={mitem.controllerid} value={mitem.controllerid}>
                      {mitem.barcode}
                    </option>
                  ))}
              </select>
            </div>

            <div className="type">
              <label htmlFor="boxid">Secure Box</label>
              <select
                name="boxid"
                onChange={(event) => onHandleChanged(event)}
                value={item.boxid}
                noValidate
              >
                {boxes &&
                  boxes.map((mitem, index) => (
                    <option key={mitem.boxid} value={mitem.boxid}>
                      {mitem.boxname}
                    </option>
                  ))}
              </select>
            </div>

            <div className="type">
              <label htmlFor="areaid">Area</label>
              <select
                name="areaid"
                onChange={(event) => onHandleChanged(event)}
                value={item.areaid}
                noValidate
              >
                {areas &&
                  areas.map((mitem, index) => (
                    <option key={mitem.areaid} value={mitem.areaid}>
                      {mitem.areaname}
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
