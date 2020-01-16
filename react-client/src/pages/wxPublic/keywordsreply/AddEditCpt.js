import React, { Component } from 'react'
import { Button,Modal,Input,Switch,message } from 'antd';
import axios  from '../../../api/axios'
// 编辑、添加
export default class AddEditCpt extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,FromData,handleAsynChange} = this.props;
    var {id,keywords,reply,status,sort,btnType} =  FromData;
    if(!keywords) return message.error("关键词不能为空");
    if(!reply) return message.error("回复内容不能为空");
    var postData = {id,keywords,reply,status,sort}
    if(btnType==="add"){ //添加
      var postType = "keywordsReplyAdd"
    }else{ //编辑
      postType = "keywordsReplyUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getTableData();
         handleAsynChange('addEditIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }

  render() {
    let {FromData,addEditIshow,modalTitle,handleAsynChange} = this.props;
    
    return (
        <Modal
          title={modalTitle}        
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditIshow}   
          onOk={()=>handleAsynChange('addEditIshow',false)}
          onCancel={()=>handleAsynChange('addEditIshow',false)}
        >
        <div className="modal-form-main">
          {FromData.id?( <div className="form-itmes"><span className="itme-labe">序号:&nbsp;&nbsp;</span><Input name="fromId" value={FromData.id} disabled/></div>):""}
          <div className="form-itmes">
            <span className="itme-labe">关键词:&nbsp;&nbsp;</span>
             <Input  value={FromData.keywords}   allowClear 
             onChange={e => {handleAsynChange('keywords', e.target.value,'FromData')}} />
          </div>  
          <div className="form-itmes">
            <span className="itme-labe">回复:&nbsp;&nbsp;</span> 
              <Input.TextArea rows={2}  value={FromData.reply}  
               allowClear  onChange={e => {handleAsynChange('reply', e.target.value,'FromData')}} 
              />
          </div>
          <div className="form-itmes">
            <span className="itme-labe">排序:&nbsp;&nbsp;</span>
             <Input  value={FromData.sort}   allowClear 
             onChange={e => {handleAsynChange('sort', e.target.value,'FromData')}} />
          </div>
          <div className="form-itmes">
               <span className="itme-labe" style={{width:"80px"}}>状态：</span>
              <Switch checkedChildren="开" unCheckedChildren="关" 
                checked={FromData.status===1?true:false} 
                onChange={e => {handleAsynChange('status', e===true?1:2,'FromData')}} />
          </div>
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
