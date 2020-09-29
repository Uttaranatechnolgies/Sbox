import React, { useState, useEffect } from "react";
import "./merchantpartnermap.css";
import { IsNumber, InsertSelect } from "../../helper";
import { GetSelect as GetMerchants } from "../../services/merchantApi";
import { GetSelect as GetPartners } from "../../services/partnerApi";
import { Update } from "../../services/merchantpartnerApi";
import { IsLoggedIn } from "../../session";

const EditItem = ({ show, popupHandler, input }) => {
  const [dialog, setDialog] = useState(show);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [item, setItem] = useState({
    mapid: 0,
    partnerid: 0,
    merchantid: 0,
    statusid: 1,
  });

  const [partners, setPartners] = useState([]);
  const [merchants, setMerchants] = useState([]);

  const getDefaultItems = async () => {
    let rslt1 = await GetMerchants();
    let defaSelect = { merchantid: 0, merchantname: "Select" };
    rslt1 = InsertSelect(rslt1, defaSelect);
    setMerchants(rslt1);

    let rslt2 = await GetPartners();
    defaSelect = { partnerid: 0, partnername: "Select" };
    rslt2 = InsertSelect(rslt2, defaSelect);
    setPartners(rslt2);
  };

  useEffect(() => {
    setDialog(show);
    setItem({
      mapid: input ? input.mapid : 0,
      partnerid: input ? input.partnerid : 0,
      merchantid: input ? input.merchantid : 0,
      statusid: input ? input.statusid : 1,
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
      partnerid: 0,
      merchantid: 0,
      statusid: 1,
    });
    popupHandler("Cancel", input);
  };

  const OnSubmitClicked = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!IsNumber(item.partnerid) || item.partnerid <= 0) {
      setError("Partner is not valid");
      return;
    }

    if (!IsNumber(item.merchantid) || item.merchantid <= 0) {
      setError("Merchant is not valid");
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
          Edit Merchant and Partner Mapping
        </div>
        <div className="modal-dialog-body">
          <div className="modal-popupbox">
            <div className="model-input-container">
              <div className="type">
                <label htmlFor="partnerid">Partner</label>
                <select
                  name="partnerid"
                  onChange={(event) => onHandleChanged(event)}
                  value={item.partnerid}
                  noValidate
                >
                  {partners &&
                    partners.map((mitem, index) => (
                      <option key={index} value={mitem.partnerid}>
                        {mitem.partnername}
                      </option>
                    ))}
                </select>
              </div>
              <div className="type">
                <label htmlFor="merchantid">Merchant</label>
                <select
                  name="merchantid"
                  onChange={(event) => onHandleChanged(event)}
                  value={item.merchantid}
                  noValidate
                >
                  {merchants &&
                    merchants.map((mitem, index) => (
                      <option key={index} value={mitem.merchantid}>
                        {mitem.merchantname}
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
