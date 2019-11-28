import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message,Select } from 'antd';
import axios  from '../../../api/axios'
const { Option } = Select;
// 编辑、添加用户
export default class AddEditUser extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,userFromData,handleAsynChange} = this.props;
    var {id,name,user_type,password,contact,status,btnType} =  userFromData;
    if(!name) return message.error("管理员名不能为空");
    if(btnType==="add"&&!user_type) return message.error("请选择用户类型");
    if(btnType==="add"&&!password) return message.error("管理员密码不能为空");
    if(!contact) return message.error("联系方式不能为空");
    var postData = {id,name,user_type,password,contact,status}
    if(btnType==="add"){ //添加
      var postType = "rbacUserAdd"
    }else{ //编辑
      postType = "rbacUserUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getTableData();
         handleAsynChange('addEditUserIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }

  SelectUserType(){
    let {userFromData,handleAsynChange} = this.props;
    if(userFromData.btnType!=="add") return "";
    return (
      <div className="form-itmes">
        <span className="itme-labe"> 管理员类型:&nbsp;&nbsp;</span> 
        <Select
          labelInValue
          style={{ width: "100%" }}
          onChange={e => {handleAsynChange('user_type', e.key,'userFromData')}}
        >
          <Option value="2">系统用户</Option>
          <Option value="3">普通用户</Option>
        </Select>
      </div>  
      )
  }
  render() {
    let {userFromData,addEditUserIshow,modalTitle,handleAsynChange} = this.props;
    
    return (
        <Modal
          title={modalTitle}        
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditUserIshow}   
          onOk={()=>handleAsynChange('addEditUserIshow',false)}
          onCancel={()=>handleAsynChange('addEditUserIshow',false)}
        >
        <div className="modal-form-main">
          {userFromData.id?( <div className="form-itmes"><span className="itme-labe">管理员序号:&nbsp;&nbsp;</span><Input name="fromId" value={userFromData.id} disabled/></div>):""}
          <div className="form-itmes"><span className="itme-labe"> 管理员名称:&nbsp;&nbsp;</span> <Input  value={userFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'userFromData')}} /></div>  
          {userFromData.btnType==="add"?<div className="form-itmes"><span className="itme-labe"> 管理员密码:&nbsp;&nbsp;</span> <Input  value={userFromData.password}   allowClear onChange={e => {handleAsynChange('password', e.target.value,'userFromData')}} /></div>:""}
          {this.SelectUserType()}
          <div className="form-itmes"> <span className="itme-labe">联系方式:&nbsp;&nbsp;</span><Input  value={userFromData.contact}   allowClear onChange={e => {handleAsynChange('contact', e.target.value,'userFromData')}} /></div>
          <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={userFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'userFromData')}} /></div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
