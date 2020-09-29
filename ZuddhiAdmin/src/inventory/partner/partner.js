import React, { useState, useEffect } from "react";
import AddItem from "./add";
import EditItem from "./edit";
import { Get } from "../../services/partnerApi";
import { Padding, IsArrayNull, FormatDate, GetAddress } from "../../helper";
import { Redirect } from "react-router-dom";
import { IsLoggedIn } from "../../session";
import MenuItem from "../../common/menuitem";
import Loader from "../../common/loader";
import "./partner.css";

const Partner = () => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selecteditem, setSelectedItem] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(false);

  const popupHandler = async (type) => {
    setOpen(false);
    if (type === "Success") {
      await getDefaultResults();
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
    setProgress(false);
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
        <td>{item.partnerid}</td>
        <td>{item.partnername}</td>
        <td>
          {GetAddress(item, [
            "partneraddress",
            "partnercity",
            "partnerstate",
            "partnercountry",
          ])}
        </td>
        <td>{item.contactname}</td>
        <td>{item.contactphone}</td>
        <td>{item.partnersecret}</td>
        <td>{FormatDate(item.createdon)}</td>
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
                <EditItem
                  show={edit}
                  popupHandler={editHandler}
                  item={selecteditem}
                />
                <AddItem show={open} popupHandler={popupHandler} />
                <div className="row">
                  <div className="navlocleft">Partners</div>
                  <div className="navlocright">
                    <button className="button" onClick={() => setOpen(true)}>
                      Add New
                    </button>
                  </div>
                </div>
                <table id="partner">
                  <tbody>
                    <tr>
                      <th>Sl. No</th>
                      <th>Id</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Contact Name</th>
                      <th>Contact Phone</th>
                      <th>ApiKey</th>
                      <th>Created On</th>
                    </tr>
                    {!IsArrayNull(result) ? (
                      result.map((item, index) => (
                        <ItemRow key={index} number={index} item={item} />
                      ))
                    ) : (
                      <tr>
                        <td style={{ textAlign: "center" }} colSpan="8">
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

export default Partner;
