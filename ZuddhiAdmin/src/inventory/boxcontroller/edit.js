import React, { useState, useEffect } from "react";
import "./boxcontrolmap.css";
import { IsNumber, InsertSelect } from "../../helper";
import { Get as GetBoxes } from "../../services/boxApi";
import { Get as GetControllers } from "../../services/controllerApi";
import { Get as GetAreas } from "../../services/areaApi";
import { Update } from "../../services/boxcontollerApi";
import { GetStatusTypes } from "../../services/commonApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, input }) => {
  const [dialog, setDialog] = useState(show);

  const [item, setItem] = useState({
    mapid: 0,
    boxid: 0,
    controllerid: 0,
    statusid: 1,
    areaid: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [statusTypes, setStatusTypes] = useState([]);
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

    let rslt4 = await GetStatusTypes();
    defaSelect = { statusid: 0, statusname: "Select" };
    rslt4 = InsertSelect(rslt4, defaSelect);
    setStatusTypes(rslt4);
  };

  useEffect(() => {
    setDialog(show);
    setItem({
      mapid: input ? input.mapid : 0,
      boxid: input ? input.boxid : 0,
      controllerid: input ? input.controllerid : 0,
      statusid: input ? input.statusid : 1,
      areaid: input ? input.areaid : 0,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultItems();
    }
    /* const objectState = async () => {
      let token = await Retrieve("userToken");
      if (token !== null && token.length > 0) {
        await getDefaultItems();
      }
    };
    return objectState; */
  }, [show, setItem, input]);

  const OnCancelClicked = (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setItem({
      mapid: 0,
      boxid: 0,
      controllerid: 0,
      statusid: 1,
      areaid: 0,
    });
    popupHandler("Cancel", input);
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

    if (!IsNumber(item.statusid)) {
      setError("Statis is not valid");
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

  return (
    <div className={dialog ? "modal display-block" : "modal display-none"}>
      <section className="modal-dialog">
        <div className="modal-dialog-header">
          Edit Box and Controller Mapping
        </div>
        <div className="modal-dialog-body">
          <div className="modal-popupbox">
            <div className="model-input-container">
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
                      <option
                        key={mitem.controllerid}
                        value={mitem.controllerid}
                      >
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
                      <option key={mitem.statusid} value={mitem.statusid}>
                        {mitem.statusname}
                      </option>
                    ))}
                </select>
              </div>
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
