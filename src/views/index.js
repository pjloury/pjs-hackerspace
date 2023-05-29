import React from "react";
import Dashboard from './Dashboard/Dashboard';
import Home from './Home/Home';
import SaveText from './SaveText/SaveText';
import { Route, Switch } from "react-router-dom";

const Routes = () => (
    <Switch>
        <Route path="/home" exact component={Home}/>
        <Route path="/dashboard" exact component={Dashboard}/>
        <Route path="/text" exact component={SaveText}/>
    </Switch>
);

export default Routes;