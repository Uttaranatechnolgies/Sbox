import React from "react";
import loading from "../assets/loading.gif";

const Loader = ({ show }) => {
  const showHideClassName = show
    ? "loader display-block"
    : "loader display-none";

  return (
    <div className={showHideClassName}>
      <section className="loader-modal">
        <img src={loading} alt="Loading" />
        <div style={{ color: "white", fontWeight: "bold" }}>Loading...</div>
      </section>
    </div>
  );
};

export default Loader;
