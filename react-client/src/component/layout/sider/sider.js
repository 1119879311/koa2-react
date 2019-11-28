import React, { Component } from 'react'
import { withRouter,Link } from 'react-router-dom'
import {Menu, Icon } from 'antd';
import "./sider.css"

const { SubMenu } = Menu;

// const menuData = [   
//   {"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0},
//   {"path":"/admin/cms","name":"cms","title":"内容管理","id":5,"pid":0,"children":
//       [
//           {"path":"/admin/cmsArticle","name":"article","title":"帖子管理","id":6,"pid":5,"children":[]},
//           {"path":"/admin/cmsCate","name":"cate","title":"分类管理","id":7,"pid":5,"children":[]},
//           {"path":"/admin/cmsTab","name":"tab","title":"标签管理","id":8,"pid":5,"children":[]}
//       ]
//   },
//   {"path":"/admin/rbac","name":"rbac","title":"系统管理","id":1,"pid":0,"children":
//       [
//           {"path":"/admin/rbacUser","name":"user","title":"管理员","id":2,"pid":1,"children":[]},
//           {"path":"/admin/rbacRole","name":"role","title":"角色管理","id":3,"pid":1,"children":[]},
//           {"path":"/admin/rbacAuth","name":"auth","title":"权限管理","id":4,"pid":1,"children":[]}
//       ],   
//   },
//   {"path":"/admin/populariz","name":"populariz","title":"推广管理","id":9,"pid":0,"children":
//       [
//           {"path":"/admin/distribWxnumber","name":"wxnumber","title":"分配微信号","id":10,"pid":9,"children":[]},
//       ],   
//   },
  
// ];
// const meunIndex = [{"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0}];

var menuItme = (itmeData)=>{
   return itmeData.map(itmes=>{
     if(itmes.children&&itmes.children.length){
     return <SubMenu
        key={itmes.name}
        title={
          <span>
            <Icon type="appstore" />
            <span>{itmes.title}</span>
          </span>
        }>
        {menuItme(itmes.children)}
    </SubMenu>
      // return menuTime(itmes)
     }else{
      return (
        <Menu.Item key={itmes.path}>
         <Link to={itmes.path}>
             <Icon type="appstore" />
             <span> {itmes.title}</span>
           </Link>
         </Menu.Item>
       )
     }
    
   })
}

// console.log(menuItme(menuData))

 class layoutSider extends Component {
  constructor(props){
    super(props)
    this.state =  {
      mode: 'inline',
      theme: 'dark',
      pathname: this.props.location.pathname,
      openKeys:[]
    };
  }
   // 展开一级，显示二级
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    this.setState({
      openKeys: latestOpenKey?[latestOpenKey]:[],
    });
    
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({pathname:nextProps.location.pathname})
    } 
 }
  render() {
     let {meunList} = this.props;
    //  let menuData = [...meunIndex,...meunList]
    let menuData = meunList;
    return (
      <div>
        <Menu
          defaultSelectedKeys={[this.state.pathname]}
          mode={this.state.mode}
          theme={this.state.theme}
          selectedKeys={[this.state.pathname]}
          openKeys={this.state.openKeys}
          onOpenChange={this.onOpenChange}
        >
        {menuItme(menuData)}
        </Menu>
      </div>
    );
  }
}

export default withRouter(layoutSider)