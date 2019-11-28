import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Route,Switch } from 'react-router-dom'
import Layout from './pages/layout';
// import echarts from "echarts";
import {AsyncLogin,AsyncError} from './router';
import './index.css';
import {Provider} from 'react-redux';
import store from "./store"
// console.log(echarts);



ReactDOM.render((
  <Provider store={store}>
  <HashRouter>
    <Switch>
       <Route path="/login" exact component={AsyncLogin}></Route>
       {/* <Route path="/" component={Layout}></Route> */}
       <Route path="/admin" component={Layout}></Route>

       <Route component={AsyncError}></Route>

    </Switch>
  </HashRouter>
 </Provider>
), document.getElementById('root'));

