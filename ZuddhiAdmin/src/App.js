import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Routers } from "./common/routers";

import "./App.css";
import Header from "./common/header";
import Footer from "./common/footer";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <div className="container">
          <Header />
          <Routers />
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
