import React from "react";
import { Switch, Route } from "react-router-dom";

import "./common.css";

import SignUp from "../register/signup";
import SignIn from "../register/signin";
import Region from "../inventory/region/region";
import Zone from "../inventory/zone/zone";
import Area from "../inventory/area/area";
import Box from "../inventory/box/box";
import Controller from "../inventory/controller/controller";
import BoxController from "../inventory/boxcontroller/boxcontrolmap";
import Order from "../inventory/order/order";
import Agent from "../inventory/agent/agent";
import Company from "../inventory/company/company";
import Merchant from "../inventory/merchant/merchant";
import Partner from "../inventory/partner/partner";
import MerchantPartner from "../inventory/merchantpartner/merchantpartnermap";

const Routers = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/siginup" component={SignUp} />
      <Route path="/region" component={Region} />
      <Route path="/zone" component={Zone} />
      <Route path="/area" component={Area} />
      <Route path="/box" component={Box} />
      <Route path="/controller" component={Controller} />
      <Route path="/boxcontroller" component={BoxController} />
      <Route path="/order" component={Order} />
      <Route path="/agent" component={Agent} />
      <Route path="/company" component={Company} />
      <Route path="/merchant" component={Merchant} />
      <Route path="/partner" component={Partner} />
      <Route path="/merchantpartner" component={MerchantPartner} />
    </Switch>
  );
};

const LoginRouter = () => {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
    </Switch>
  );
};

export { LoginRouter, Routers };
