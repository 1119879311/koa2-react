import React, { Component } from 'react'
import { Table,Button,Modal,Input,Switch,message  } from 'antd';
import axios from '../../../api/axios';
import AuthBotton from "../../../component/authButton/indexs";
import "./wxnoList.css"
export class index extends Component {
  state = {
     tableData:[],
     modalTitle:"",//对话框的标题
     modalVisible:false,//对话框的显示
     fromId:"",
     fromWxno:"",
     fromWeight:"",
     fromState:1,
  }
  get tableColumns (){
    var that = this;
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id'},
      {title: '微信号',	dataIndex: 'name',align: 'center',	key: 'name'},
      {title: '概率(0-100)%',	dataIndex: 'weight',align: 'center',	key: 'weight'},
      {title: '当天访问量',	dataIndex: 'sum',align: 'center',	key: 'sum'},
      {title: '状态 ', align: 'center', dataIndex: 'state',kye:"status",
      render (text, record) {
         let color = record.status === 1 ? 'green' : 'red';
         let val = record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '操作', align: 'center', dataIndex: 'operation',kye:"operation",
      render(text,record) {
        return (
          <div align="center">
           <AuthBotton  className="select-main-btn"  type="primary" size="default"
                authname="savewxno"
                onClick={() => that.handleShowBtn(record)}>  编辑</AuthBotton> 
            {/* <Button onClick={() => that.handleShowBtn(record)} className="select-main-btn"  type="primary" size="default"> 编辑 </Button> */}
            &nbsp;&nbsp;&nbsp;
            <AuthBotton  className="select-main-btn"  type="danger" size="default"
                authname="delwxno"
                onClick={() => that.handleDel(record)}>  删除</AuthBotton> 
            {/* <Popconfirm
              title="确定删除？"
              onConfirm={() => that.handleDel(record)}
            >
               <Button className="select-main-btn"   type="danger" size="default"> 删除 </Button>
            </Popconfirm> */}
          </div>
        );
      }
      }
    ]
  }
  //删除
  handleDel = (row)=>{
     let {getAllData} = this.props;
    if(row.status===1){
       return message.error("正常状态无法删除,请先编辑更改为禁止状态");
    }
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("delWxno",{id:[row.id]}).then(result=>{
      var {status,mssage} = result.data;
      if(status){
        message.success(mssage||"删除成功");
        getAllData();
     }else{
       message.error(mssage||"删除失败");
     }
    }).catch(error=>{
      console.log(error)
    })
  } 
  // 点击添加和编辑的按钮,显示对话框
  handleShowBtn=(type)=>{
    var fromId='',fromWxno='',fromWeight='0',fromState=1,modalTitle='';
    console.log(type)
    if(type){ //编辑
      fromId = type.id;
      fromWxno = type.name;
      fromWeight=type.weight;
      fromState = type.status;
       modalTitle = "编辑微信"
    }else{
       modalTitle = "添加微信"
    }
    this.setState({modalVisible:true,fromId,fromWxno,fromWeight,fromState,modalTitle})
  }
   // 同步更新state 的值
   handleAsynChange (key,value){
    this.setState({ [key]:value });

  }
  // 提交表单数据
  onHandleSubmit = ()=>{
    // 有fromId 是编辑，没有是添加
    var {fromId,fromWxno,fromWeight,fromState} = this.state;
    var {getAllData} = this.props
    var {selectHost,selectPath} = this.props;
    if(!fromWxno)  return message.error("微信号不能为空");
    if(isNaN(Number(fromWeight))||fromWeight<0||fromWeight>100)  return message.error("概率只能是数字0-100");
    // let {id,name,weight=0,count=-1,status=1,path_id,host_id,path_name,host_name};
    var postData = {
      id:fromId,
      name:fromWxno,
      weight:fromWeight,
      status:fromState,
      // path_name:selectPath.label,
      // host_name:selectHost.label,
      host_id:selectHost.key,
      path_id:selectPath.key,
      count:-1
    }
    axios.POST("saveWxno",postData).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         getAllData();
         this.setState({modalVisible:false})
      }else{
        message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log()
    })
  }
  render() {
    const {tableData,disabled} = this.props;
    const {fromId,fromState} = this.state;
     return (
       <div className="wxList-main">
          <Table
          pagination={false}
          size="small"
          style={{"width":"80%","margin":"12px auto","minWidth":"600px"}}
          rowKey = {row=>row.id}
					columns={this.tableColumns}
					dataSource={tableData}
          bordered
          title={() => (
            <div>
               <AuthBotton  className="select-main-btn"  type="primary" size="default"
                authname="savewxno"
                mydisabled={disabled}
                onClick={() => this.handleShowBtn("")}>  添加</AuthBotton> 
               {/* <Button disabled={disabled} onClick={() => this.handleShowBtn("")} className="select-main-btn"  type="primary" size="default"> 添加 </Button> */}
               </div>
          )}
				/>
            <Modal
            title={this.state.modalTitle}        
            cancelText='取消'
            okText='关闭'
            centered
            visible={this.state.modalVisible}   
            onOk={()=>this.handleAsynChange('modalVisible',false)}
            onCancel={()=>this.handleAsynChange('modalVisible',false)}
          >
           <div className="modal-form-main">
            {fromId?( <div className="form-itmes"><span className="itme-labe">序号:</span><Input name="fromId" value={fromId} disabled/></div>):""}
             <div className="form-itmes"><span className="itme-labe"> 微信号:</span> <Input placeholder="请输入微信号" value={this.state.fromWxno}   allowClear onChange={e => {this.handleAsynChange('fromWxno', e.target.value)}} /></div>
             <div className="form-itmes"> <span className="itme-labe">概率:</span><Input placeholder="请输入分配概率0-100" value={this.state.fromWeight}   allowClear onChange={e => {this.handleAsynChange('fromWeight', e.target.value)}} /></div>
             <div className="form-itmes"><span className="itme-labe">状态：</span><Switch checkedChildren="开" unCheckedChildren="关" checked={fromState===1?true:false} onChange={e => {this.handleAsynChange('fromState', e===true?1:2)}} /></div>
            <Button type="primary"  className="form-button" onClick={this.onHandleSubmit}>
              提交
            </Button>
           </div>
          </Modal>

       </div>
     )
  }
}
export default index