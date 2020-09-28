import React, { Component } from 'react'
import { Table,message ,Input,Select ,Button } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AddEditAuth from './AddEditAuth' // 编辑、添加权限
import {connect} from "react-redux"
import AuthBotton from "../../../component/authButton/indexs";
import  "./index.css"
const {Option} = Select
export class index extends Component {
  state = {
     search_key:"",
     status:"",
     loading:false,
     rendTableData:[],
     tableData:[],
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditAuthIshow:false, //添加、编辑的弹窗的开关
     authFromData:{//添加、编辑权限的数据
      id:"",name:"",identName:"",url:"",groupName:"",status:1
    },
    groupArr:[],//权限分组(根据菜单分组)
  }
    // 同步更新state 的值
    handleAsynChange =(key,value,obj)=>{
      console.log(key,value)
      if(obj){
        let objval = this.state[obj];
        objval[key] = value;
        this.setState({ [obj]:objval});
      }else{
        this.setState({ [key]:value});
      }
      
    }
   
  // 表格列
  get tableColumns (){
    var that = this;
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:60},
      {title: '权限名称',	dataIndex: 'name',align: 'center',	key: 'name',width:120},
      {title: '权限标识',	dataIndex: 'identName',align: 'center',	key: 'identName',width:120},
      {title: '权限链接',	dataIndex: 'url',align: 'center',	key: 'url',width:180},
      {title: '权限分组',	dataIndex: 'groupName',align: 'center',	key: 'groupName',width:120},
      {title: '状态 ', align: 'center', dataIndex: 'state',kye:"status",width:80,
      render (text, record) {
         let color = record.status === 1 ? 'green' : 'red';
         let val = record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '创建时间',	dataIndex: 'createtime',align: 'center',	key: 'createtime',width:150,
       render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)
      },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 210,
      render:(text,record) =>{
        return (
          <div align="left">
            <AuthBotton 
              onClick={() => this.handleShowBtn(record)} 
              authname="authedit"  className="select-main-btn" 
               type="primary" size="default"> 编辑 </AuthBotton>
            &nbsp;&nbsp;&nbsp;
            <AuthBotton 
               className="select-main-btn"  authname="authswtich" 
                type={record.status === 1 ? 'danger' : 'primary'}  size="default" 
                onClick={() => this.handleSwitch(1,record)}>
                 {record.status === 1 ? '禁用' : '开启'} </AuthBotton>
            &nbsp;&nbsp;&nbsp;
            {that.props.user_info.user_type !== 1&&that.props.user_info.user_type !== 2?""
             :<AuthBotton className="select-main-btn" 
               onClick={()=>that.handleDelBtn(record)}
               authname="authdel"
               type="danger" size="default"> 删除 </AuthBotton>}
          </div>
        );
      }
      }
    ]
  }
  // 获取表格数据
   getTableData =  ()=>{
     this.setState({loading:true})
    axios.GET("rbacAuth").then( async res=>{
      let {status,data} = res.data;
      console.log(data)
      let groupListAuth  = {};
      data.forEach(itme=>{
          if(groupListAuth[itme.groupName]){
            groupListAuth[itme.groupName].push(itme)
          }else{
            groupListAuth[itme.groupName] = [itme]
          }
      })
      let groupListArr = []
      for (const key in groupListAuth) {
        groupListArr.push({key,value:groupListAuth[key]})
      }
      console.log(groupListArr)
      this.setState({loading:false})
      if(status){
        await this.setState({tableData:data,multipleSelection:[],selectedRowKeys:[]})
        await this.onSubmitSearch();
      }else{

      }
    })
  }
   // 获取权限分组(菜单)数据所有
   getAllMenuData(){
    axios.GET("rbacMenu").then(result=>{
      var  {status,data} = result.data;
      if(status){
        this.setState({groupArr:data})
      }
    }).catch(error=>{
      console.log()
    })
  }

  // 编辑和添加 按钮
  handleShowBtn(row){
    var authFromData = { id:"",name:"",identName:"",url:"",groupName:"",status:1,btnType:"add" };
    if(row){
      var modalTitle ="编辑";
      authFromData = row;
      authFromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
    }
    this.setState({modalTitle,addEditAuthIshow:true,authFromData})
  }
  // 删除
  handleDelBtn(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该权限处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("rbacAuthDel",{id:row.id}).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"删除成功");
         this.getTableData();
      }else{
         message.error(mssage||"删除失败");
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  //确定状态修改  请求 
  handleSwitch=(val,rowdata)=>{
    let {multipleSelection} = this.state;
    var data = [];
    switch (val) {
        case 1:
              var status = rowdata.status===2?1:2;
              data = [{id:rowdata.id,status}]
            break;
          case "allStop":
            multipleSelection.forEach(itme=>{ if(itme.status!==2){ data.push(  {id:itme.id,status:2} )} })
            break;
          case "allStart":
            multipleSelection.forEach(itme=>{ if(itme.status!==1){ data.push(  {id:itme.id,status:1} )} })                 
            break;
        default:
            break;
    }
    axios.POST("rbacAuthSwtich",{data}).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"更新成功");
         this.getTableData();
      }else{
         message.error(mssage||"更新失败");
      }
    }).catch(error=>{
      console.log(error)
    })
      
  }
  // 点击选择时操作
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    let {tableData} = this.state;
    let multipleSelection = [];
    for (let index = 0; index < selectedRowKeys.length; index++) {
      let val = selectedRowKeys[index];
      multipleSelection= [...multipleSelection,...(tableData.filter(itme=>itme.id===val))]
    }
    console.log(multipleSelection)
    this.setState({ selectedRowKeys ,multipleSelection});
  };
   handleChange(value) {
    console.log(`selected ${value}`);
  }
  onSubmitSearch= async ()=>{
    let {search_key,status,tableData} =await this.state;
    let resData = tableData;
    if(status){
       resData = resData.filter(itme=>itme.status===status) 
    }
    if(search_key){
        resData = resData.filter(itme=>{
          return itme.name.includes(search_key)||itme.groupName.includes(search_key)
            ||itme.identName.includes(search_key)||itme.url.includes(search_key)
      })
    }
    this.setState({rendTableData:resData})  
  }
  // 组件挂载时
  componentDidMount(){
    this.getTableData();
    this.getAllMenuData();

  }
  render() {
    const { selectedRowKeys,loading,multipleSelection,rendTableData ,modalTitle,addEditAuthIshow,authFromData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      fixed:true
    };
    return (
      <div className="rbacuser-view">
        {/* 搜索 */}
        <div className="col-12 m-flex search-wrap">
           <Input placeholder="关键词/名称/标识/分组" allowClear style={{width:"240px"}}
            onChange={(e)=>this.handleAsynChange('search_key',e.target.value)}/>
            <div>
             
              <span>状态 : </span>
              <Select placeholder="请选择" allowClear
                style={{width:"240px"}}
                value={this.state.status}
                onChange={(e)=>this.handleAsynChange('status',e)}
                >
                <Option value={1}>正常</Option>
                <Option value={2}>禁用</Option>
              </Select>
            </div>
           <Button icon="search" type="primary" onClick={this.onSubmitSearch}>搜索</Button>
           <Button type="primary" icon="sync" onClick={()=>this.getTableData()}>刷新</Button>
        </div>

        {/* 表格 */}
        <Table
            loading={loading}
            size="small"
            style={{"margin":"12px auto"}}
            rowKey = {row=>row.id}
            columns={this.tableColumns}
            rowSelection={rowSelection}
            dataSource={rendTableData}
            pagination={{ pageSize: 15 }}
            scroll={{ x: 1050 }}
            bordered
            title={() => (
              <div>
                 
                  <AuthBotton  
                     authname="authadd" 
                     onClick={() => this.handleShowBtn("")} 
                     className="select-main-btn"  type="primary" size="default"> 添加权限
                  </AuthBotton>
                   &nbsp;&nbsp;&nbsp;
                  <AuthBotton 
                      authname="authswtich" 
                      className="select-main-btn"  type="primary" size="default"
                      mydisabled={multipleSelection.filter(itme=>itme.status===2).length?false:true}
                      onClick={() => this.handleSwitch('allStart')}>  全部启用
                    </AuthBotton>
                   &nbsp;&nbsp;&nbsp;
                   <AuthBotton 
                       authname="authswtich" 
                      className="select-main-btn"  type="danger" size="default" 
                      mydisabled={multipleSelection.filter(itme=>itme.status===1).length?false:true}
                      onClick={() => this.handleSwitch('allStop')}> 全部停用 
                    </AuthBotton>
              </div>   
          )}
          />
         
          {/* 添加编辑管理员的弹框 */}
          <AddEditAuth 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditAuthIshow={addEditAuthIshow} 
            authFromData={authFromData}
            groupArr={this.state.groupArr}
            />
            
            

          
        </div>
    )
  }
}
export default connect(state=>({
  user_info:state.UserInfo
}))(index)

// export default index
