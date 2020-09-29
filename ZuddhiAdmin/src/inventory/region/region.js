import React, { useState, useEffect } from "react";
import AddItem from "./add";
import EditItem from "./edit";
import { Get, Delete } from "../../services/regionApi";
import delicon from "../../assets/delete.png";
import ConfirmDialog from "../../common/confirmdlg";
import AlertDialog from "../../common/alertmsg";
import { Padding, IsArrayNull, FormatDate } from "../../helper";
import { Redirect } from "react-router-dom";
import { IsLoggedIn } from "../../session";
import MenuItem from "../../common/menuitem";
import Loader from "../../common/loader";
import "./region.css";

const Region = () => {
  const [open, setOpen] = useState(false);
  const [copen, setConfirm] = useState(false);
  const [calert, setAlert] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selecteditem, setSelectedItem] = useState(false);
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
      let rslt = await Delete(item.regionid);
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
    setProgress(false);
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
        <td>{item.regionname}</td>
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
                  title={"Delete Region"}
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
                  <div className="navlocleft">Region</div>
                  <div className="navlocright">
                    <button className="button" onClick={() => setOpen(true)}>
                      Add New
                    </button>
                  </div>
                </div>
                <table id="regions">
                  <tbody>
                    <tr>
                      <th>Sl.No</th>
                      <th>Name</th>
                      <th>Created On</th>
                      <th>Status</th>
                    </tr>
                    {!IsArrayNull(result) ? (
                      result.map((item, index) => (
                        <ItemRow key={index} number={index} item={item} />
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: "center" }} colSpan="4">
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

export default Region;
