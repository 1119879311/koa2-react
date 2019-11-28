import React, { Component } from 'react'
import { Spin } from 'antd';
import  "./index.css"
export class index extends Component {
  render() {
    return (
        <div className="loading-main">
          <Spin size="large" tip="Loading..." />
           {/* <span>加载中...</span> */}
        </div>
     )
  }
}

export default index