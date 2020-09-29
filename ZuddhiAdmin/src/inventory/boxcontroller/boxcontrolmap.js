import React, { useState, useEffect } from "react";
import AddItem from "./add";
import EditItem from "./edit";
import { Get, Delete } from "../../services/boxcontollerApi";
import delicon from "../../assets/delete.png";
import ConfirmDialog from "../../common/confirmdlg";
import AlertDialog from "../../common/alertmsg";
import { Padding, IsArrayNull, FormatDate } from "../../helper";
import { Redirect } from "react-router-dom";
import { IsLoggedIn } from "../../session";
import MenuItem from "../../common/menuitem";

import "./boxcontrolmap.css";

const BoxController = () => {
  const [open, setOpen] = useState(false);
  const [copen, setConfirm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selecteditem, setSelectedItem] = useState(false);
  const [result, setResult] = useState(null);
  const [calert, setAlert] = useState(false);
  const [alerttype, setAlertType] = useState({
    msg: "",
    danger: false,
  });

  const alertHandler = async () => {
    setAlert(false);
    setAlertType({
      msg: "",
      danger: false,
    });
  };

  const popupHandler = async (type) => {
    setOpen(false);
    if (type === "Success") {
      await getDefaultResults();
    }
  };

  const deleteHandler = async (type, item) => {
    setConfirm(false);
    if (type === "Yes") {
      let rslt = await Delete(item.mapid);
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
    const rslt = await Get();
    if (rslt) setResult(rslt.data);
  };

  useEffect(() => {
    setOpen(false);
    setEdit(false);
    setConfirm(false);
    setAlert(false);
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
        <td>{item.areaname}</td>
        <td>{item.barcode}</td>
        <td>{item.controllerbarcode}</td>
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
              <ConfirmDialog
                show={copen}
                title={"Delete Controller and Box Mapping"}
                body={"Are you sure? You want to delete?"}
                item={selecteditem}
                popupHandler={deleteHandler}
              />
              <EditItem
                show={edit}
                popupHandler={editHandler}
                input={selecteditem}
              />
              <AddItem show={open} popupHandler={popupHandler} />
              <div className="row">
                <div className="navlocleft">Box and Controllers Mapping</div>
                <div className="navlocright">
                  <button className="button" onClick={() => setOpen(true)}>
                    Add New
                  </button>
                </div>
              </div>
              <table id="mapboxcontroller">
                <tbody>
                  <tr>
                    <th>Sl. No</th>
                    <th>Area Name</th>
                    <th>Box Barcode</th>
                    <th>Controller Barcode</th>
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
      )}
    </>
  );
};

export default BoxController;
