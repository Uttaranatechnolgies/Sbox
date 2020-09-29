import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./common.css";

const standardItems = [
  { name: "/region", title: "Regions" },
  { name: "/zone", title: "Zones" },
  { name: "/area", title: "Areas" },
  { name: "/box", title: "Secure Boxes" },
  { name: "/controller", title: "Controllers" },
  { name: "/boxcontroller", title: "Box and Controllers" },
  { name: "/merchant", title: "Merchants" },
  { name: "/partner", title: "Delivery Partners" },
  { name: "/merchantpartner", title: "Partners and Merchants" },
  { name: "/agent", title: "Agents" },
  { name: "/order", title: "Orders" },
  { name: "/signout", title: "Sign Out" },
];

const signOut = () => {
  sessionStorage.removeItem("userToken");
  sessionStorage.removeItem("user");
  window.location.reload(false);
};

const getLink = (pathname, item, index) => {
  if (item.name === "/signout") {
    return (
      <Link
        key={index}
        className={pathname === item.name ? "active" : ""}
        to={item.name}
        onClick={() => signOut()}
      >
        {item.title}
      </Link>
    );
  } else {
    return (
      <Link
        key={index}
        className={pathname === item.name ? "active" : ""}
        to={item.name}
      >
        {item.title}
      </Link>
    );
  }
};

const MenuItem = () => {
  const { pathname } = useLocation();
  return (
    <div className="mnucontainer">
      <div className="sidebar">
        {standardItems.map((item, index) => getLink(pathname, item, index))}
      </div>
    </div>
  );
};

export default MenuItem;
