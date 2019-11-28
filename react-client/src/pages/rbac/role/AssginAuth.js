import React, { Component } from 'react'
import { Button,Modal,message,Checkbox  ,Row, Col  } from 'antd';
import axios  from '../../../api/axios'

export default class AssginAuth extends Component{
  constructor(props){
    super(props)
    this.state = {
       selectAuthId:[],//选中的权限
       indeterminate: false,
       checkAll: false,
    }
  }
 // 根据角色查权限
 getRoleAuth=()=>{
  let {assRoleAuthId,allAuthDataId} = this.props;
  axios.GET("rbacAuth",{roleId:assRoleAuthId}).then(result=>{
    var  {status,data} = result.data;
    if(status){
       let selectAuthId = data.map(itme=>itme.id)
       this.setState({selectAuthId,checkAll:allAuthDataId.length!==0&&allAuthDataId.length===selectAuthId.length?true:false})
    }
  }).catch(error=>{
    console.log()
  })
}
  onChange = selectAuthId => {
    let {allAuthDataId} = this.props;
    this.setState({
      selectAuthId,
      indeterminate: !!selectAuthId.length && selectAuthId.length < allAuthDataId.length,
      checkAll: selectAuthId.length === allAuthDataId.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      selectAuthId: e.target.checked ? this.props.allAuthDataId : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  onHandleSubmit=()=>{
    console.log(this.state.selectAuthId)
    let {assRoleAuthId,handleAsynChange} = this.props;
    axios.POST("rbacrRoleAssginAuth",{id:assRoleAuthId,authArrId:this.state.selectAuthId}).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         handleAsynChange('addAuthIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
   // 组件挂载时
   componentDidMount(){
    this.getRoleAuth();
    
  }

  render() {
    let {allAuthData,addAuthIshow,handleAsynChange} = this.props;
    console.log(allAuthData)
    return (
      <Modal
      width="680px"
      title="分配权限"        
      cancelText='取消'
      okText='关闭'
      centered
      visible={addAuthIshow}   
      onOk={()=>handleAsynChange('addAuthIshow',false)}
      onCancel={()=>handleAsynChange('addAuthIshow',false)}
    >
    <div className="modal-form-main">
    <div>
        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <Checkbox
            indeterminate={this.state.indeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.checkAll}
          >
            全选
          </Checkbox>
        </div>
            <Checkbox.Group
                value={this.state.selectAuthId}
                onChange={this.onChange}
              >
              {
                allAuthData.map((val,index)=>(
                  <div style={{margin:"12px 6px"}} key={index}>
                    <span>{val.groupName}</span><br/>
                    <Row style={{marginLeft:"28px"}}>
                        {val.dataList.map(itme=> <Col  key={itme.id} span={8}><Checkbox value={itme.id}>{itme.name}</Checkbox> </Col>)}
                    </Row>
                  </div>
                ))
              }
            </Checkbox.Group>
      </div>
       <br />
       <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
        提交
      </Button>
    </div>
  </Modal>
    )
  }
}