import React, { Component } from 'react'
import { Button,Modal,message,Checkbox,Row,Col } from 'antd';
import axios  from '../../../api/axios'
export default class AddUserRole extends Component{
  constructor(props){
    super(props)
    this.state = {
       selectRole:this.props.selectRoleId,
      //  selectAddId:this.props.allRoleDataId,
       indeterminate: false,
       checkAll: false,
    }
  }

  onChange = selectRole => {
    // let {selectAddId} = this.state;
     let {allRoleDataId} = this.props;
    this.setState({
      selectRole,
      indeterminate: !!selectRole.length && selectRole.length < allRoleDataId.length,
      checkAll: selectRole.length === allRoleDataId.length,
    });
  };

  onCheckAllChange = e => {
    this.setState({
      selectRole: e.target.checked ? this.props.allRoleDataId : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  onHandleSubmit=()=>{
    if(this.state.selectRole.length>2){
      return  message.error("最多只能分配两个角色");
    }
    var postData = {id:this.props.selectRoleUserId,roleArrId:this.state.selectRole};
    axios.POST("rbacUserAssginRole",postData).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         this.props.getTableData();
         this.props.handleAsynChange('addUserRoleIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
 

  render() {
    let {allRoleData,addUserRoleIshow,handleAsynChange} = this.props;
    return (
      <Modal
      title="分配角色"        
      cancelText='取消'
      okText='关闭'
      centered
      visible={addUserRoleIshow}   
      onOk={()=>handleAsynChange('addUserRoleIshow',false)}
      onCancel={()=>handleAsynChange('addUserRoleIshow',false)}
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
        <br />
        <Checkbox.Group
                style={{width:"100%"}}
                value={this.state.selectRole}
                onChange={this.onChange}
              >
              {
                allRoleData.map((val,index)=>(
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