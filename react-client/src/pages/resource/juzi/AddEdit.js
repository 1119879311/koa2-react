import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message } from 'antd';
import axios  from '../../../api/axios'
// 编辑、添加用户
export default class AddEditTab extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,tabFromData,handleAsynChange} = this.props;
    var {id,content,status,classify,author_from,btnType} =  tabFromData;
    if(!content) return message.error("内容不能为空");
    var postData = {id,content,status,classify,author_from}
    if(btnType==="add"){ //添加
      var postType = "juziAdd"
    }else{ //编辑
      postType = "juziUpdate"
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
            <span className="itme-labe">内容:&nbsp;&nbsp;</span> 
              <Input.TextArea rows={4}  value={tabFromData.content}  
               allowClear  onChange={e => {handleAsynChange('content', e.target.value,'tabFromData')}} 
              />
          </div>
          <div className="form-itmes">
            <span className="itme-labe">出自:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.author_from}  
               allowClear  onChange={e => {handleAsynChange('author_from', e.target.value,'tabFromData')}} 
              />
          </div> 
          <div className="form-itmes">
            <span className="itme-labe">分类:&nbsp;&nbsp;</span> 
              <Input  value={tabFromData.classify}  
               allowClear  onChange={e => {handleAsynChange('classify', e.target.value,'tabFromData')}} 
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
