import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message } from 'antd';
import axios  from '../../../api/axios'
// 编辑、添加用户
export default class AddEditTab extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,tabFromData,handleAsynChange} = this.props;
    var {id,name,status,btnType} =  tabFromData;
    if(!name) return message.error("标签不能为空");
    var postData = {id,name,status}
    if(btnType==="add"){ //添加
      var postType = "cmsTabAdd"
    }else{ //编辑
      postType = "cmsTabUpdate"
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
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditTabIshow}   
          onOk={()=>handleAsynChange('addEditTabIshow',false)}
          onCancel={()=>handleAsynChange('addEditTabIshow',false)}
        >
        <div className="modal-form-main">
          {tabFromData.id?( <div className="form-itmes"><span className="itme-labe">序号:&nbsp;&nbsp;</span><Input name="fromId" value={tabFromData.id} disabled/></div>):""}
          <div className="form-itmes"><span className="itme-labe">标签名:&nbsp;&nbsp;</span> <Input  value={tabFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'tabFromData')}} /></div>  
        
          <div className="form-itmes"><span className="itme-labe" style={{width:"80px"}}>状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={tabFromData.status===1?true:false} onChange={e => {handleAsynChange('status', e===true?1:2,'tabFromData')}} /></div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
