import React, { Component } from 'react'
import { Button,Modal,Input,message ,Select} from 'antd';
import axios  from '../../../api/axios'
const { Option } = Select;
// 编辑、添加用户
export default class AddEditCate extends Component{
  onHandleSubmit = ()=>{
    let {getTableData,cateFromData,handleAsynChange} = this.props;
    var {id,name,pid,sort,btnType} =  cateFromData;
    if(!name) return message.error("分类不能为空");
    if(!/^\d+$/.test(sort)) return message.error("排序只能填数字");
    
    var postData = {id,name,pid,sort:Number(sort)}
    console.log(postData)
    if(btnType==="add"){ //添加
      var postType = "cmsCateAdd"
    }else{ //编辑
      postType = "cmsCateUpdate"
    }
    axios.POST(postType,postData).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getTableData();
         handleAsynChange('addEditCateIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
  selectOption = ()=>{
    let {cateFromData,handleAsynChange} = this.props;
     return <Select showSearch value={cateFromData.pid} style={{ width: "100%" }} onChange={value => {handleAsynChange('pid', value,'cateFromData')}}>
            { cateFromData.catelist.map(itme=><Option key={itme.id} value={itme.id} style={{"paddingLeft": 12*Number(itme.leve) +"px"}}>{itme.name}</Option>)  }
      </Select>
  }
  render() {
    let {cateFromData,addEditCateIshow,modalTitle,handleAsynChange} = this.props;
    return (
        <Modal
          title={modalTitle}        
          cancelText='取消'
          okText='关闭'
          centered
          visible={addEditCateIshow}   
          onOk={()=>handleAsynChange('addEditCateIshow',false)}
          onCancel={()=>handleAsynChange('addEditCateIshow',false)}
        >
        <div className="modal-form-main">
          {cateFromData.id?( <div className="form-itmes"><span className="itme-labe">序号:&nbsp;&nbsp;</span><Input name="fromId" value={cateFromData.id} disabled/></div>):""}
          <div className="form-itmes"><span className="itme-labe">分类名:&nbsp;&nbsp;</span> <Input  value={cateFromData.name}   allowClear onChange={e => {handleAsynChange('name', e.target.value,'cateFromData')}} /></div>  
          <div className="form-itmes"><span className="itme-labe">所属分类:&nbsp;&nbsp;</span> 
            {this.selectOption()}
          </div>  
         
          <div className="form-itmes"><span className="itme-labe">排序:&nbsp;&nbsp;</span> <Input  value={cateFromData.sort}   allowClear onChange={e => {handleAsynChange('sort', e.target.value,'cateFromData')}} /></div>  
        
          <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
          </Button>
        </div>
      </Modal>
    )
  }
}
