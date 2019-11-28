import React, { Component } from 'react'
import  "./index.css"
import { Form, Icon, Input, Button,message } from 'antd';
import axios from '../../api/axios';
import { connect } from 'react-redux';
import {UpdateUserInfo,UpdateAppToken} from "../../store/action"
class index extends Component {
  // 判断是否已登录，重定向 到/admin
  componentDidMount(){
    sessionStorage.clear();
    // var {history:{replace}} = this.props;
    // var token = sessionStorage.getItem("token");
    // if(token){
    //  replace("/admin")
    // }
  }
  // 提交登录数据
  handleSubmit = e => {
    e.preventDefault();
    var {history:{replace}} = this.props;
    this.props.form.validateFields((err, {username,password}) => {
      if (!err) {
        var postData = {name:username,password}
        message.success("正在登陆中...")
        axios.POST("adminLogin",postData).then(result=>{
          // isRoot:res.isRoot,username:res.name,userId:token
          var {data,status,mssage} = result.data;
          if(status){
            // sessionStorage.setItem("token",data.token);
            var userInfo = {username:data.username,userId:data.userId,user_type:data.user_type};
            // sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
            this.props.UpdateUserInfo(userInfo)
            this.props.UpdateAppToken(data.token)
            message.success("登录成功,正在跳转中...")
            setTimeout(() => {
              replace("/admin")
            }, 1000);

          }else{
            message.error(mssage||"登录失败")
          }
        }).catch(error=>{
          console.log(error)
        })

      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-warp">
         <div className="login-main">
         <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item className="itme-login-button">
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>

         </div>
      </div>
    )
  }
}

export default connect(
  null,
  {UpdateUserInfo,UpdateAppToken}
)(Form.create({ name: 'normal_login' })(index));
