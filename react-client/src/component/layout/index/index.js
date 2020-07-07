
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

import LayoutHeader from '../header/header'
import LayoutSider from '../sider/sider'
import LayoutTabs from '../tabs/tabs'

import axios from '../../../api/axios';
import {recurOne} from "../../../util"
import { connect } from 'react-redux';
import {UpdateUserInfo} from "@/store/action"
import { Layout, Icon,message } from 'antd';
import './index.css';

const { Header, Sider, Content } = Layout;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
     collapsed: false,
     meunList:[],
     userInfo:{}, 
    }
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  // 获取登录用户的菜单和权限
  getManagerRole(){
    axios.POST("getManagerRole").then(result=>{
      var  {status,data,mssage} = result.data;
      if(status){
        this.setState({meunList:data.meunList,userInfo:data.userInfo}) 
        let userInfo=data.userInfo;
        userInfo['meunList'] = recurOne(JSON.parse(JSON.stringify(data.meunList)));
        let authList = {}; //处理权限
        data.authList.forEach(itme => {
          authList[itme.identName] = itme.name;
        });
        userInfo['authList'] = authList; 
        // sessionStorage.setItem("userInfo",JSON.stringify(userInfo));  
        this.props.UpdateUserInfo(userInfo)  
      }else{
        message.error(mssage);
      }
    }).catch(error=>{
      console.log(error)
    })
  }

  componentWillMount(){
  
    if(this.props.app_token){
      this.getManagerRole();
    }
  }
  render() {
    // logo 
    var layoutLogo = (
      <div className="logo"> system </div>
    )
    let {collapsed} = this.state
    return (
      <Layout style={{height:"100%"}}>
       <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
        {layoutLogo}
        <LayoutSider  meunList={this.state.meunList}/>
      </Sider>
      <Layout>
        <Header className="layout-header" style={{"left":collapsed?"80px":"200px"}} >
          <Icon
            className="trigger"
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
          <LayoutHeader/>
        </Header>
        <Content className="layout-contents" >
            <LayoutTabs/>
           {this.props.children}
        </Content>
      </Layout>
    </Layout>
     
    )
  }
}

export default connect(
  state=>({
     userInfo:state.UserInfo,
     app_token:state.AppToken
  }),
  { UpdateUserInfo}
)(withRouter(App))

