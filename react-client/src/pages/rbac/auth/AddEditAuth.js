import React, { Component } from 'react'
import {Button,Modal,Input,Switch,message ,Select  } from 'antd';
import axios  from '../../../api/axios'
const { Option, OptGroup } = Select;

// 编辑、添加权限
export default class AddEditAuth extends Component{
  renderSelectItme=(datas)=>{
     return datas.map(itme=>{
        if(itme.children&&itme.children.length){
          return (
           <OptGroup label={itme.title} key={itme.title}>
              {this.renderSelectItme(itme.children)}
           </OptGroup>
          )
        }else{
         return <Option key={itme.title} value={itme.title}>{itme.title}</Option>
        }
      })
  }
   renderSelect(){
      let {authFromData,handleAsynChange,groupArr}= this.props;
 
      return <Select showSearch value={authFromData.groupName} style={{ width: 200 }} onChange={value => {handleAsynChange('groupName', value,'authFromData')}}>
             {this.renderSelectItme(groupArr)}
          
     </Select>
   }
 
   onHandleSubmit = ()=>{
     let {getTableData,authFromData,handleAsynChange} = this.props;
       var {id,name,identName,url,groupName,status,btnType} =  authFromData;
     if(!name) return message.error("权限名不能为空");
     if(!/^[a-zA-Z]{1,}$/.test(identName)) return message.error("权限标识一定是字母，不区分大小写");
     if(!groupName) return message.error("权限分组不能为空");
     if(!/^(\/[a-zA-Z0-9]{1,}){1,}\/$/.test(url)) return message.error("添加的url 格式不对，如：/abc/,/ab/dc/");
     var postData = {id,name,identName,url,groupName,status}
     if(btnType==="add"){ //添加
       var postType = "rbacAuthAdd"
     }else{ //编辑
       postType = "rbacAuthUpdate"
     }
     axios.POST(postType,postData).then(result=>{
      
       var  {status,mssage} = result.data;
       if(status){
          message.success(mssage||"操作成功");
          getTableData();
          handleAsynChange('addEditAuthIshow',false)
       }else{
          message.error(mssage||"操作失败");
       }
     }).catch(error=>{
       console.log()
     })
   }
   render() {
     let {authFromData,addEditAuthIshow,modalTitle,handleAsynChange} = this.props;
     
     return (
         <Modal
           width="640px"
           title={modalTitle}        
           cancelText='取消'
           okText='关闭'
           centered
           visible={addEditAuthIshow}   
           onOk={()=>handleAsynChange('addEditAuthIshow',false)}
           onCancel={()=>handleAsynChange('addEditAuthIshow',false)}
         >
         <div className="modal-form-main">
           {authFromData.id?( <div className="form-itmes"><span className="itme-labe">管理员序号:&nbsp;&nbsp;</span><Input name="fromId" value={authFromData.id} disabled/></div>):""}
           <div className="form-itmes"><span className="itme-labe"> 权限名(中文):&nbsp;&nbsp;</span> <Input  value={authFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'authFromData')}} /></div>  
           <div className="form-itmes"> <span className="itme-labe">权限标识(英文):&nbsp;&nbsp;</span><Input  value={authFromData.identName}   allowClear onChange={e => {handleAsynChange('identName', e.target.value,'authFromData')}} /></div>
           <div className="form-itmes"> 
             <span className="itme-labe" style={{"marginLeft":"-26px"}}>权限分组:&nbsp;&nbsp;</span>
             {this.renderSelect()}&nbsp;&nbsp;
             <Input style={{width:"154px"}} value={authFromData.groupName}   allowClear onChange={e => {handleAsynChange('groupName', e.target.value,'authFromData')}} />
             &nbsp;&nbsp;(可自定义分组)
           </div>
           <div className="form-itmes"> <span className="itme-labe">权限链接:&nbsp;&nbsp;</span><Input  value={authFromData.url}   allowClear onChange={e => {handleAsynChange('url', e.target.value,'authFromData')}} /></div>
          
           <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={authFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'authFromData')}} /></div>
           <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
             提交
           </Button>
         </div>
       </Modal>
     )
   }
 }
 