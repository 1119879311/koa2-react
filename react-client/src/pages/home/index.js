import React, { Component } from 'react'
import { Row, Col } from 'antd';

import  "./index.scss"

function  ListNav(){
  return (
    <div className="gutter-example">
    <div style={{"textAlign":"center",margin:"20px","fontSize":"20px"}}>欢迎来到管理后台</div>
    <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"background": "rgb(117, 109, 230)"}}>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"background": "#18cbd4"}}>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"background": "rgb(236, 140, 111)"}}>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"background": "rgb(69, 197, 157)"}}>
        </div>
      </Col>
    </Row>
  </div>

  )
}



export class index extends Component {



  render() {
    return (
      <div className="home-views">
    
        <ListNav/>
      </div>
    )
  }
}

export default index
