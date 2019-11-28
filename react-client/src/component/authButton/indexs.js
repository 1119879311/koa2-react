import React from 'react'
import { Button } from "antd";
import { connect } from 'react-redux';
// auth_show_type : 权限按钮显示方式：1.false=>隐藏;2.true=>禁用状态


function getAtts(props){
  var attrs={};
  var keys=['onClick',"size","type","className"];
  keys.forEach(val=>{
    if(props[val]){
      attrs[val]=props[val]
    }
  })
  return attrs;
}

const verifyAuth = (userInfo,authName)=>{
  let {user_type,authList} = userInfo;
  return user_type===1||authList[authName];
}

const AuthBTn = (props)=>{
   let {user_info,authname,auth_show_type,mydisabled=false} = props;
   let isAuth = verifyAuth(user_info,authname);
    // mydisabled = mydisabled==='false'?false:true;
    if(mydisabled==='false') mydisabled=false
    if(mydisabled==='true') mydisabled=true
    var attrs = getAtts(props);
     // 隐藏
    if(!auth_show_type){
      return isAuth?<Button {...attrs} disabled={mydisabled}>{props.children}</Button>:""
    // 禁用
    }else{
      return (
        isAuth?<Button {...attrs} disabled={mydisabled}>{props.children}</Button>
        :<Button {...attrs} disabled={true}>{props.children}</Button>
      )
    }
}

export default connect(state=>({
  user_info:state.UserInfo,
  auth_show_type:state.AuthShowType
}))(AuthBTn)