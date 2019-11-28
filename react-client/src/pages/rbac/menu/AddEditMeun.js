import React, { Component } from 'react'
import {Button, Modal,Input,Switch,message } from 'antd';
import axios  from '../../../api/axios'
 // 编辑、添加菜单
 export default class AddEditMeun extends Component{
  onHandleSubmit = ()=>{
    let {meunFromData,handleAsynChange,getAllMenuData} = this.props;
    console.log(meunFromData)
    var {id,name,title,path,status,pid,sort,btnType} =  meunFromData;
    if(!title) return message.error("菜单名不能为空");
    if(!name) return message.error("菜单标识不能为空");
    if(path==="") return message.error("菜单链接不能为空");
    var postData = {id,name,title,path,status,pid,sort}
    if(btnType==="add"){ //添加
      var postType = "rbacMenuAdd"
    }else{ //编辑
      postType = "rbacMenuUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getAllMenuData();
         handleAsynChange('addEditMeunIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  render() {
    let {meunFromData,addEditMeunIshow,modalTitle,handleAsynChange} = this.props;
    
    return (
        <Modal
          title={modalTitle}   
          width='640px'     
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditMeunIshow}   
          onOk={()=>handleAsynChange('addEditMeunIshow',false)}
          onCancel={()=>handleAsynChange('addEditMeunIshow',false)}
        >
        <div className="modal-form-main">
          {meunFromData.id?( <div className="form-itmes"><span className="itme-labe">菜单序号:&nbsp;&nbsp;</span><Input  name="fromId" value={meunFromData.id} disabled/></div>):""}
          <div className="form-itmes"><span className="itme-labe"> 菜单名称(中文):&nbsp;&nbsp;</span> <Input  value={meunFromData.title}   allowClear onChange={e => {handleAsynChange('title', e.target.value,'meunFromData')}} /></div>  
         
          <div className="form-itmes"> <span className="itme-labe">菜单标识(英文):&nbsp;&nbsp;</span><Input  value={meunFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'meunFromData')}} /></div>
          <div className="form-itmes"> <span className="itme-labe">菜单链接:&nbsp;&nbsp;</span><Input  value={meunFromData.path}   allowClear onChange={e => {handleAsynChange('path', e.target.value,'meunFromData')}} /></div>         
          <div className="form-itmes"> <span className="itme-labe">菜单排序(数字):&nbsp;&nbsp;</span><Input  value={meunFromData.sort}   allowClear onChange={e => {handleAsynChange('sort', e.target.value,'meunFromData')}} /></div>                  
          <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={meunFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'meunFromData')}} /></div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}