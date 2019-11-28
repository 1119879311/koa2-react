import React, { Component } from 'react'
import { Avatar ,Menu, Dropdown,Modal,Input ,Button,message,Switch} from 'antd'
import { withRouter } from 'react-router-dom'
import  "./header.css"
import axios from '../../../api/axios';
import { connect } from 'react-redux';
import {UpdateUserInfo,UpdateAppToken,ToggleAuthShowType} from "@/store/action"


const { confirm } = Modal;
function get_user_type(type){
  if(type===1){
     return "超级用户"
  }else if(type===2){
    return "系统用户"
  }else{
    return "普通用户"
  }
}
 class layoutHeader extends Component {
  state = {
    modalVisible:false ,//修改密码对话的是否显示
    password:"",
    checkPass:""
};

  
 
// }
// 退出登录
 outLogn = ()=>{
  
    var {history:{replace}} = this.props;
    confirm({
      title: '你确定退出登录吗?',
      okText: '确定',
      cancelText: '取消',
      onOk:()=> {
        // sessionStorage.removeItem("token");
        // sessionStorage.removeItem("userInfo");
        this.props.UpdateAppToken();
        this.props.UpdateUserInfo();
        replace("/login")  
        },
      onCancel() {
        console.log('Cancel');
      },
    });
 }

// 修改密码的对话框的显示与隐藏
handleModalVisible (key,value){
  this.setState({ [key]:value });

}
// 同步更新state 输入框的值
handleOnchang=(e)=>{
  var {name,value=''} = e.target;
  this.setState({ [name]:value });
}
// 提交表单数据
onSubmitPwd = ()=>{
  var {password,checkPass} = this.state;
  var {history:{replace}} = this.props;

  if(!password||!checkPass||password!==checkPass){
    return message.error("密码不能为空且两次密码要相同")
  }
  axios.POST("modifyUserpwd",{password,checkPass}).then(result=>{
    var {status,mssage} = result.data;
       if(status){
         message.error("修改成功,正在为你跳转重新登录")
         this.setState({"modalVisible":false,password:"",checkPass:"" });
        setTimeout(() => {
          // sessionStorage.removeItem("token");
          // sessionStorage.removeItem("userInfo");
          this.props.UpdateAppToken();
          this.props.UpdateUserInfo();
          replace("/login")  
        }, 1000);
       }else{
         message.error(mssage||"操作失败")
       }
  }).catch(err=>{
    console.log(err)
  })

}
  render() {
    var {username,user_type} = this.props.userInfo;
    console.log(this.props.auth_show_type)
    return (
        <div className="by-header-main">
          <div style={{marginRight:"12px"}}> 权限按钮切换：<Switch checked={this.props.auth_show_type} onChange={this.props.ToggleAuthShowType}/> </div>

          <div style={{marginRight:"12px"}}>用户类型 : <span style={{color:"#1DA57A"}}>{get_user_type(user_type)}</span>&nbsp;&nbsp;</div>
          <div className="userName">
            <Dropdown placement="bottomRight" overlay={
              <Menu>
              <Menu.Item>
                <div onClick={()=>this.handleModalVisible('modalVisible',true)}> 修改密码 </div>
              </Menu.Item>
              <Menu.Item>
                <div onClick={this.outLogn}> 退出登录</div>
              </Menu.Item>
            </Menu>
            } >
             <div style={{color:"#1DA57A"}}>
              用户名 &nbsp;: {username } &nbsp;<Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
                </div>
            </Dropdown>
          </div>
            {/* 修改密码的对话框 */}
            <Modal
            title={`修改管理员:${username} 密码`}        
            cancelText='取消'
            okText='确定'
            centered
            visible={this.state.modalVisible}   
            onOk={()=>this.handleModalVisible('modalVisible',false)}
            onCancel={()=>this.handleModalVisible('modalVisible',false)}
          >
           <div className="form-main">
           <Input placeholder="请输入新密码" name="password" value={this.state.password}  allowClear onChange={this.handleOnchang} />
           <Input placeholder="请再次输入新密码" name="checkPass" value={this.state.checkPass} allowClear onChange={this.handleOnchang} />
            <Button type="primary"  className="login-form-button" onClick={this.onSubmitPwd}>
              提交
            </Button>
           </div>
          </Modal>
          
        </div>
    );
  }
}
export default connect(
  state=>({
     userInfo:state.UserInfo,
     auth_show_type:state.AuthShowType
  }),
  { UpdateUserInfo,UpdateAppToken,ToggleAuthShowType}
)(withRouter(layoutHeader))
// export default withRouter(layoutHeader)