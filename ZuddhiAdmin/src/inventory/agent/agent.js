import React, { useState, useEffect } from "react";
import AddItem from "./add";
import EditItem from "./edit";
import { Get, Delete } from "../../services/agentApi";
import delicon from "../../assets/delete.png";
import ConfirmDialog from "../../common/confirmdlg";
import AlertDialog from "../../common/alertmsg";
import { Padding, IsArrayNull, FormatDate, GetAddress } from "../../helper";
import { Redirect } from "react-router-dom";
import { IsLoggedIn } from "../../session";
import MenuItem from "../../common/menuitem";
import Loader from "../../common/loader";
import "./agent.css";

const Agent = () => {
  const [open, setOpen] = useState(false);
  const [copen, setConfirm] = useState(false);
  const [calert, setAlert] = useState(false);

  const [edit, setEdit] = useState(false);
  const [selecteditem, setSelectedItem] = useState(null);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(false);
  const [alerttype, setAlertType] = useState({
    msg: "",
    danger: false,
  });

  const popupHandler = async (type) => {
    setOpen(false);
    if (type === "Success") {
      await getDefaultResults();
    }
  };

  const alertHandler = async () => {
    setAlert(false);
    setAlertType({
      msg: "",
      danger: false,
    });
  };

  const deleteHandler = async (type, item) => {
    setConfirm(false);
    if (type === "Yes") {
      let rslt = await Delete(item.agentid);
      if (rslt.status !== 100) {
        setAlertType({
          msg: rslt.statusText,
          danger: true,
        });
        setAlert(true);
      }
      getDefaultResults();
    }
  };

  const editHandler = async (type, item) => {
    setEdit(false);
    if (type === "Success") {
      await getDefaultResults();
    }
  };

  const getDefaultResults = async () => {
    setProgress(true);
    const rslt = await Get();
    if (rslt) setResult(rslt.data);
    setProgress(false);
  };

  useEffect(() => {
    setOpen(false);
    setEdit(false);
    setAlert(false);
    setConfirm(false);
    setAlertType({
      msg: "",
      danger: false,
    });
    if (IsLoggedIn("userToken")) {
      getDefaultResults();
    }
  }, []);

  const SelectedItem = (item) => {
    setSelectedItem(item);
  };

  /* function GetAddress(item) {
    if (IsNull(item.line1)) {
      return item.city + " " + item.state + "-" + item.country;
    }
    return item.line1 + "," + item.city + " " + item.state + "-" + item.country;
  } */

  const ItemRow = ({ number, item }) => {
    const numberCount = number + 1;
    return (
      <tr>
        <td
          className="linkitem"
          onClick={() => {
            setEdit(true);
            SelectedItem(item);
          }}
        >
          {Padding(numberCount, 5)}
        </td>
        <td>{item.agentnum}</td>
        <td>{item.agentname}</td>
        <td>{item.mobile}</td>
        <td>{GetAddress(item, ["line1", "city", "state", "country"])}</td>
        <td>{item.companyname}</td>
        <td>{item.agenttype === 3 ? "Partner" : "Merchant"}</td>
        <td>{FormatDate(item.createdon)}</td>
        <td>
          {item.statusname}
          <img
            className="deleteIcon"
            onClick={() => {
              setConfirm(true);
              SelectedItem(item);
            }}
            alt="Delete"
            src={delicon}
          />
        </td>
      </tr>
    );
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
                <ConfirmDialog
                  show={copen}
                  title={"Delete Zone"}
                  body={"Are you sure? You want to delete?"}
                  item={selecteditem}
                  popupHandler={deleteHandler}
                />

                <AlertDialog
                  show={calert}
                  popupHandler={alertHandler}
                  body={alerttype}
                />

                <EditItem
                  show={edit}
                  popupHandler={editHandler}
                  item={selecteditem}
                />
                <AddItem show={open} popupHandler={popupHandler} />
                <div className="row">
                  <div className="navlocleft">Agent</div>
                  <div className="navlocright">
                    <button className="button" onClick={() => setOpen(true)}>
                      Add New
                    </button>
                  </div>
                </div>
                <table id="agents">
                  <tbody>
                    <tr>
                      <th>Sl. No</th>
                      <th>Number</th>
                      <th>Name</th>
                      <th>Mobile</th>
                      <th>Address</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Created On</th>
                      <th>Status</th>
                    </tr>
                    {!IsArrayNull(result) ? (
                      result.map((item, index) => (
                        <ItemRow key={index} number={index} item={item} />
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: "center" }} colSpan="9">
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

export default Agent;
