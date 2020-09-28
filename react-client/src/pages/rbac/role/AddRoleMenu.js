import React, { Component } from 'react'
import { Button,Modal,message,Checkbox ,Tree   } from 'antd';
import axios  from '../../../api/axios'
const { TreeNode } = Tree;
// 分配菜单
export default class AddRoleMenu extends Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    allChecked:false
  };
  // 根据角色查菜单
  getRoleMenu=()=>{
    let {assRoleMenuId,allMenuDataId} = this.props;
    axios.GET("rbacMenu",{roleId:assRoleMenuId}).then(result=>{
      var  {status,data} = result.data;
      if(status){
         let checkedKeys = data.map(itme=>itme.id)
         this.setState({checkedKeys,allChecked:allMenuDataId.length!==0&&allMenuDataId.length===checkedKeys.length?true:false})
      }
    }).catch(error=>{
      console.log()
    })
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  // 复选框选中
  onCheck = ({checked}) => {
    let {allMenuDataId} = this.props;
    this.setState({ checkedKeys:checked,allChecked:allMenuDataId.length!==0&&allMenuDataId.length===checked.length?true:false});
  };
  // 点击选项
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  };
  // 全选
  onChange = e => {
    console.log('checked = ', e.target.checked);
    let {allMenuDataId} = this.props;
    this.setState({
      allChecked: e.target.checked,
      checkedKeys:e.target.checked?allMenuDataId:[],
    });
  };
  // 提交分配菜单数据
  onHandleSubmit=()=>{
    let {assRoleMenuId,handleAsynChange} = this.props;
    axios.POST("rbacrRoleAssginMenu",{id:assRoleMenuId,menuArrId:this.state.checkedKeys}).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         handleAsynChange('addMenuIshow',false)
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
  
   // 组件挂载时
   componentDidMount(){
    this.getRoleMenu();
    
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.id} dataRef={item} disableCheckbox={item.status===1?false:true}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    });

  render() {
    let {addMenuIshow,handleAsynChange,allMenuData} = this.props;
   

    return (
      <Modal
          width="640px"
          title="分配菜单"        
          cancelText='取消'
          okText='关闭'
          centered
          visible={addMenuIshow}   
          onOk={()=>handleAsynChange('addMenuIshow',false)}
          onCancel={()=>handleAsynChange('addMenuIshow',false)}
      > 
        <Checkbox onChange={this.onChange} checked={this.state.allChecked}>全选</Checkbox>
        <br/>
        <Tree
          checkable
          
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
          multiple={true}
          checkStrictly={true}
        >
          {this.renderTreeNodes(allMenuData)}
      </Tree>
       <br/>
        <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
            提交
        </Button>
      </Modal>
    );
  }
}