// 权限拦截路由跳转

import React, { Component } from 'react'
import { withRouter  } from 'react-router-dom'
import ErrorNoAuth from "../error"
import { connect } from 'react-redux';

export class AuthRouter extends Component {
 state = {
   isAuth:true,
 }
  componentWillMount(){
    try {
      if(this.props.route.name==="adminindex"){
        return this.setState({isAuth:true})
      }
      // let userInfo = JSON.parse(sessionStorage.getItem("USER_INFO"));//获取用户信息
      let {userInfo} = this.props;
      console.log(userInfo)
      if(userInfo&&userInfo.user_type===1){ //超级用户 不用授权
        this.setState({isAuth:true})
      }else if(userInfo&&userInfo.meunList){
        let pahtAuthName = this.props.route.isAuthName;
        if(pahtAuthName){
          // 菜单列表
          let resAuth = userInfo.meunList.find(itme=>itme.name.toLowerCase()===pahtAuthName.toLowerCase());
          // 权限列表
          resAuth = resAuth?true:(userInfo.authList[pahtAuthName.toLowerCase()]?true:false)
          this.setState({isAuth:resAuth?true:false})
        }else{
         this.setState({isAuth:true})
        }
      }else{
        this.setState({isAuth:false})
      }

    } catch (error) {
      
    }
  }

  render() {
    let {route} = this.props;
    let {isAuth} = this.state;
    return (
      isAuth?<route.component {...this.props}/>:<ErrorNoAuth {...this.props}/>
    )
  }
}

export default connect(
  state=>({
     userInfo:state.UserInfo,
  })
)(withRouter(AuthRouter))
// export default withRouter(AuthRouter)

