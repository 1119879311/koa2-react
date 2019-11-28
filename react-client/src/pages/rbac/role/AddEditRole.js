import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message,Select  } from 'antd';
import axios  from '../../../api/axios'
const { Option } = Select;
 // 编辑、添加角色
 export default class AddEditRole extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,roleFromData,handleAsynChange} = this.props;
    var {id,name,role_type,title,status,btnType} =  roleFromData;
    if(!name) return message.error("角色名不能为空");
    if(!title) return message.error("角色描述不能为空");
    if(btnType==="add"&&!role_type) return message.error("请选择角色类型");
    var postData = {id,name,role_type,title,status}
    if(btnType==="add"){ //添加
      var postType = "rbacRoleAdd"
    }else{ //编辑
      postType = "rbacRoleUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getTableData();
         handleAsynChange('addEditRoleIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
  SelectRoleType(){
    let {roleFromData,handleAsynChange} = this.props;
    if(roleFromData.btnType!=="add") return "";
    return (
      <div className="form-itmes">
        <span className="itme-labe"> 角色类型:&nbsp;&nbsp;</span> 
        <Select
          labelInValue
          style={{ width: "100%" }}
          onChange={e => {handleAsynChange('role_type', e.key,'roleFromData')}}
        >
          <Option value="1">内部角色</Option>
          <Option value="2">外部角色</Option>
        </Select>
      </div>  
      )
  }
  render() {
    let {roleFromData,addEditRoleIshow,modalTitle,handleAsynChange} = this.props;
    
    return (
        <Modal
          title={modalTitle}        
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditRoleIshow}   
          onOk={()=>handleAsynChange('addEditRoleIshow',false)}
          onCancel={()=>handleAsynChange('addEditRoleIshow',false)}
        >
        <div className="modal-form-main">
          {roleFromData.id?( <div className="form-itmes"><span className="itme-labe">角色序号:&nbsp;&nbsp;</span><Input name="fromId" value={roleFromData.id} disabled/></div>):""}
          <div className="form-itmes"><span className="itme-labe"> 角色名称:&nbsp;&nbsp;</span> <Input  value={roleFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'roleFromData')}} /></div>  
          <div className="form-itmes"> <span className="itme-labe">角色描述:&nbsp;&nbsp;</span><Input  value={roleFromData.title}   allowClear onChange={e => {handleAsynChange('title', e.target.value,'roleFromData')}} /></div>
          {this.SelectRoleType()}
          <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={roleFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'roleFromData')}} /></div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
