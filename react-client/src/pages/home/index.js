import React, { Component } from 'react'
import { Divider } from 'antd';
import LineChartStatias from "./line-statias"
import BarChartStatias from "./bar-statias"
import ListNav from "./listNav"
import  "./index.css"

export class index extends Component {

  render() {
    return (
      <div className="home-views">
        <ListNav/>
        <Divider />
        <LineChartStatias/>
        <Divider />
        <BarChartStatias/>
        <Divider />
      </div>
    )
  }
}

export default index
