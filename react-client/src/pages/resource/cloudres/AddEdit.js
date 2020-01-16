import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message } from 'antd';
import axios  from '../../../api/axios'
// 编辑、添加用户
export default class AddEditTab extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,tabFromData,handleAsynChange} = this.props;
    var {id,context,url,ext,has_pwd,user,status,btnType} =  tabFromData;
    if(!context) return message.error("描述不能为空");
    if(!url) return message.error("链接不能为空");
    var postData = {id,context,url,ext,has_pwd,user,status}
    // id:"",context:"",url:"",ext:"",has_pwd:"",user:"",status:1
    if(btnType==="add"){ //添加
      var postType = "cloudresAdd"
    }else{ //编辑
      postType = "cloudresUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getTableData();
         handleAsynChange('addEditTabIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }

  render() {
    let {tabFromData,addEditTabIshow,modalTitle,handleAsynChange} = this.props;
    
    return (
        <Modal
          title={modalTitle}   
          width='640px'     
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditTabIshow}   
          onOk={()=>handleAsynChange('addEditTabIshow',false)}
          onCancel={()=>handleAsynChange('addEditTabIshow',false)}
        >
        <div className="modal-form-main">
          {tabFromData.id?( <div className="form-itmes"><span className="itme-labe">序号:&nbsp;&nbsp;</span><Input name="fromId" value={tabFromData.id} disabled/></div>):""}
          <div className="form-itmes">
            <span className="itme-labe">描述:&nbsp;&nbsp;</span> 
              <Input.TextArea rows={4}  value={tabFromData.context}  
               allowClear  onChange={e => {handleAsynChange('context', e.target.value,'tabFromData')}} 
              />
          </div>
          {/* id:"",context:"",url:"",ext:"",has_pwd:"",user:"",status:1 */}
          <div className="form-itmes">
            <span className="itme-labe">链接:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.url}  
               allowClear  onChange={e => {handleAsynChange('url', e.target.value,'tabFromData')}} 
              />
          </div> 
          <div className="form-itmes">
            <span className="itme-labe">密码:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.has_pwd}  
               allowClear  onChange={e => {handleAsynChange('has_pwd', e.target.value,'tabFromData')}} 
              />
          </div> 
          <div className="form-itmes">
            <span className="itme-labe">类型/后缀:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.ext}  
               allowClear  onChange={e => {handleAsynChange('ext', e.target.value,'tabFromData')}} 
              />
          </div>  
          <div className="form-itmes">
            <span className="itme-labe">用户:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.user}  
               allowClear  onChange={e => {handleAsynChange('user', e.target.value,'tabFromData')}} 
              />
          </div>    
          <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={tabFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'tabFromData')}} /></div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
