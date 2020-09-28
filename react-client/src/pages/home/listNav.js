import React from 'react'
import { Row, Col } from 'antd';
import {randomColor} from "../../util/index"
function boxShaow(){
    return "0 0 10px 0 " +randomColor()
}
function getRandomNum(){
    return parseInt(Math.random() * (1000 - 50) + 50)
}

export default function  ListNav(){
  return (
    <div className="gutter-example">
    {/* <div style={{"textAlign":"center",margin:"20px","fontSize":"20px"}}>欢迎来到管理后台</div> */}
    <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"boxShadow": boxShaow()}}>
            <div className="box-title">帖子总数(条)</div>
            <div className="box-text">{getRandomNum()}</div>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"boxShadow": boxShaow()}}>
            <div className="box-title">会员总数(个)</div>
            <div className="box-text">{getRandomNum()}</div>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"boxShadow": boxShaow()}}>
            <div className="box-title">当天新增订单数(条)</div>
            <div className="box-text">{getRandomNum()}</div>
        </div>
      </Col>
      <Col className="gutter-row" span={6}>
        <div className="gutter-box" style={{"boxShadow": boxShaow()}}>
            <div className="box-title">今天收入(元)</div>
            <div className="box-text">{getRandomNum()}</div>
        </div>
      </Col>
    </Row>
  </div>

  )
}
