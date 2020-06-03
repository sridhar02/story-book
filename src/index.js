import React from "react";
import ReactDOM from "react-dom";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import Stories from "./components/stories";
import Story from "./components/story";
import CreateStory from "./components/createStory";
import Login from "./components/login";


function Main() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} exact />
        <Route path="/stories" component={Stories} exact />
        <Route path="/story/new" component={CreateStory} exact />
        <Route path="/story/:id" component={Story} exact />
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
