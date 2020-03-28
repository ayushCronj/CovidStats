import React from "react";
// import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import Login from "../containers/Login"
// import Forget from "../containers/ForgetPassword"
// import Registration from '../containers/Registration'
// import Header from '../containers/Header'
// import GeneralInfo from "../containers/GeneralInfo"
import App from "./App";
import Country from "./country";

const Root = ({ store }) => (
  //   <Provider store={store}>
  <Router>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/country" component={Country} />
      {/* <Route exact path="/forget" component={Forget} />
      <Route exact path="/registration" component={Registration} />
      <Route exact path="/header" component={Header} /> */}
      <Route path="*" component={App} />

      {/* <Route exact path="/general" component={GeneralInfo} /> */}
    </Switch>
  </Router>
  //   </Provider>
);

export default Root;
