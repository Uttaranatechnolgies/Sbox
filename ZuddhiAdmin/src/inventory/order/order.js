import React, { useState, useEffect } from "react";
import { Get, GetBox, GetUnlock } from "../../services/orderApi";
import AlertDialog from "../../common/alertmsg";
import { Padding, IsArrayNull, FormatDate } from "../../helper";
import { Redirect } from "react-router-dom";
import { IsLoggedIn } from "../../session";
import MenuItem from "../../common/menuitem";
import Loader from "../../common/loader";

import "./order.css";

const Order = () => {
  const [rows, setRows] = useState([]);
  const [orgresult, setOrgResult] = useState(null);
  const [result, setResult] = useState(null);
  const [expandedRow, setExpandedRow] = useState(0);
  const [calert, setAlert] = useState(false);
  const [progress, setProgress] = useState(false);
  const [alerttype, setAlertType] = useState({
    msg: "",
    danger: false,
  });

  const statusTypes = [
    { statusid: 0, statusname: "Default" },
    { statusid: 1, statusname: "Ready To Pickup" },
    { statusid: 2, statusname: "Picked Up" },
    { statusid: 3, statusname: "In-Transit" },
    { statusid: 4, statusname: "Delivered" },
    { statusid: 5, statusname: "Cancelled" },
  ];

  const [statusid, setStatusid] = useState(0);

  const getDefaultResults = async () => {
    const rslt = await Get();
    if (rslt) setResult(rslt.data);
    if (rslt) setOrgResult(rslt.data);
  };

  const getBoxResults = async (boxid) => {
    let rslt = null;
    if (boxid) {
      rslt = await GetBox(boxid);
      rslt = rslt.data;
    }
    setRows(rslt);
  };

  useEffect(() => {
    if (IsLoggedIn("userToken")) {
      getDefaultResults();
    }
  }, []);

  const ItemExpanded = async (id) => {
    const currentExpandedRow = expandedRow;
    const newRow = id === currentExpandedRow ? null : id;
    setExpandedRow(newRow);
    setProgress(true);
    await getBoxResults(newRow);
    setProgress(false);
  };

  const alertHandler = async () => {
    setAlert(false);
    setAlertType({
      msg: "",
      danger: false,
    });
  };

  const OnUnlockBoxClicked = async (e, id) => {
    e.preventDefault();
    setProgress(true);
    let rslt = await GetUnlock(id);
    setAlertType({
      msg: rslt.statusText,
      danger: false,
    });
    setProgress(false);
    setAlert(true);
  };

  const ItemRow = ({ number, item }) => {
    const numberCount = number + 1;
    const clickCallback = () => ItemExpanded(item.orderid);
    return (
      <>
        <tr>
          <td>{Padding(numberCount, 5)}</td>
          <td className="linkitem" onClick={clickCallback}>
            {(expandedRow === item.orderid ? "(-) " : "(+) ") + item.ordernum}
          </td>
          <td>{item.companyname}</td>
          <td>{item.sendertype === 3 ? "Partner" : "Merchant"}</td>
          <td>{item.consignee}</td>
          <td>{item.consignor}</td>
          <td>{item.agentname}</td>
          <td>{item.mobile}</td>
          <td>{FormatDate(item.createdon)}</td>
          <td>{item.orderstatusname}</td>
        </tr>
        {expandedRow === item.orderid ? (
          <tr>
            <td colSpan="10" style={{ backgroundColor: "lightgrey" }}>
              <table className="orderinfo" style={{ backgroundColor: "white" }}>
                <tbody>
                  <tr style={{ backgroundColor: "white" }}>
                    <td style={{ width: "20%", fontWeight: "bold" }}>
                      Consignor (Sender)
                    </td>
                    <td style={{ width: "15%", textAlign: "left" }}>
                      {item.consignor}
                    </td>
                    <td style={{ width: "20%", fontWeight: "bold" }}>
                      Consignee (Receiver)
                    </td>
                    <td style={{ width: "15%", textAlign: "left" }}>
                      {item.consignee}
                    </td>
                    <td style={{ width: "10%", fontWeight: "bold" }}>
                      Agent Name
                    </td>
                    <td style={{ width: "auto", textAlign: "left" }}>
                      {item.agentname}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "white" }}>
                    <td style={{ fontWeight: "bold" }}>
                      Consignor (Sender) Number
                    </td>
                    <td style={{ textAlign: "left" }}>{item.consignornum}</td>
                    <td style={{ fontWeight: "bold" }}>
                      Consignee (Receiver) Number
                    </td>
                    <td style={{ textAlign: "left" }}>{item.consigneenum}</td>
                    <td style={{ fontWeight: "bold" }}>Agent Number</td>
                    <td style={{ textAlign: "left" }}>{item.agentnum}</td>
                  </tr>
                  <tr style={{ backgroundColor: "white" }}>
                    <td style={{ fontWeight: "bold" }}>Agent Mobile</td>
                    <td style={{ textAlign: "left" }}>{item.mobile}</td>
                    <td style={{ fontWeight: "bold" }}>Number Of Boxes</td>
                    <td style={{ textAlign: "left" }}>{item.numofboxes}</td>
                    <td style={{ fontWeight: "bold" }}>Last Updated</td>
                    <td style={{ textAlign: "left" }}>
                      {FormatDate(item.updatedon)}
                    </td>
                  </tr>
                  {item.numofboxes > 0 ? (
                    <tr style={{ backgroundColor: "white" }}>
                      <td colSpan="6">
                        <table className="orderinfo">
                          <tbody>
                            <tr>
                              <td
                                colSpan="5"
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  backgroundColor: "#134c7d",
                                  color: "white",
                                }}
                              >
                                Secure Box Details
                              </td>
                            </tr>
                            <tr style={{ backgroundColor: "white" }}>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  width: "20%",
                                  textAlign: "left",
                                }}
                              >
                                Box Barcode
                              </td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  width: "20%",
                                  textAlign: "left",
                                }}
                              >
                                Controller Barcode
                              </td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  width: "20%",
                                  textAlign: "left",
                                }}
                              >
                                Controller Phone
                              </td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  width: "20%",
                                  textAlign: "left",
                                }}
                              >
                                Controller Version
                              </td>
                              <td
                                style={{
                                  fontWeight: "bold",
                                  width: "20%",
                                  textAlign: "left",
                                }}
                              >
                                &nbsp;
                              </td>
                            </tr>

                            {!IsArrayNull(rows)
                              ? rows.map((row, index) => (
                                  <tr
                                    key={index}
                                    style={{ backgroundColor: "white" }}
                                  >
                                    <td style={{ textAlign: "left" }}>
                                      {row.box}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      {row.controller}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      {row.phone}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      {row.version}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                      <button
                                        className="button"
                                        style={{ minWidth: 125 }}
                                        onClick={(event) =>
                                          OnUnlockBoxClicked(event, row.mapid)
                                        }
                                      >
                                        Unlock Box
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              : null}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </td>
          </tr>
        ) : null}
      </>
    );
  };

  const onStatusChanged = async (e) => {
    e.preventDefault();

    setStatusid(e.target.value);
    const selectedValue = parseInt(e.target.value);

    if (selectedValue === 0) {
      setResult(orgresult);
    } else {
      let filteredItems = orgresult.filter(
        (item) => item.orderstatusid === selectedValue
      );
      setResult(filteredItems);
    }
  };

  return (
    <>
      {!IsLoggedIn("userToken") ? (
        <Redirect to="/" />
      ) : (
        <>
          <Loader show={progress} />
          <div className="leftMenu">
            <div className="menuColumn">
              <MenuItem />
            </div>
            <div className="workColumn">
              <main>
                <AlertDialog
                  show={calert}
                  popupHandler={alertHandler}
                  body={alerttype}
                />
                <div className="row">
                  <div className="navlocleft" style={{ width: "75%" }}>
                    Orders
                  </div>
                  <div className="navlocright" style={{ width: "auto" }}>
                    <label htmlFor="statusid" style={{ marginRight: 5 }}>
                      Status Type
                    </label>
                    <select
                      name="statusid"
                      onChange={(event) => onStatusChanged(event)}
                      value={statusid}
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
                </div>
                <table id="order">
                  <tbody>
                    <tr>
                      <th>Sl. No</th>
                      <th>Order Number</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Consignee</th>
                      <th>Consignor</th>
                      <th>Agent Name</th>
                      <th>Agent Mobile</th>
                      <th>Created On</th>
                      <th>Status</th>
                    </tr>
                    {!IsArrayNull(result) ? (
                      result.map((item, index) => (
                        <ItemRow key={index} number={index} item={item} />
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: "center" }} colSpan="10">
                          No Details found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Order;
