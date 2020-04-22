import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import App from "./App";
import Country from "./country";

const Root = ({ store }) => (
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/country" component={Country} />
      <Route path="*" component={App} />
    </Switch>
  </Router>
);

export default Root;
