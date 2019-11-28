import React, { Component } from 'react'
import { Table,Button,message,Modal } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AddUserRole from "./AddUserRole" // 分配角色
import AddEditUser from "./AddEditUser" // 编辑、添加用户
import AuthBotton from "../../../component/authButton/indexs";
import {connect} from "react-redux"
import  "./index.css"



function user_type_util(type){
  if(type===1){
     return "超级用户"
  }else if(type===2){
    return "系统用户"
  }else{
    return "普通用户"
  }
}

export class index extends Component {
  state = {
    //  列表数据
     tableData:[],
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据

    // 添加编辑用户的数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditUserIshow:false, //添加、编辑的弹窗的开关
     userFromData:{//添加、编辑管理员的数据
      id:"",name:"",user_type:'',password:"",contact:"",status:1
    },
    
    // 分配角色的数据
    addUserRoleIshow:false,//分配权限的弹窗的开关
    allRoleData:[],//所有的角色
    allRoleDataId:[],//所有角色的id
    selectRoleUserId:"",//当前操作分配权限的用户id
    selectRoleId:[],//当前操作分配用户所属的角色
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
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:80},
      {title: '用户名',	dataIndex: 'name',align: 'center',	key: 'name',width:120},
      {title: '联系方式',	dataIndex: 'contact',align: 'center',	key: 'contact',width:180},
      {title: '用户类型',	dataIndex: 'user_type',align: 'center',	key: 'user_type',width:150,
        render: (text, record) =>( user_type_util(record.user_type))
      },
      {title: '状态 ', align: 'center', dataIndex: 'status',key:"status",width:80,
      render (text, record) {
         let color = record.user_type===1||record.status === 1 ? 'green' : 'red';
         let val = record.user_type===1||record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '创建时间',	dataIndex: 'createtime',align: 'center',	key: 'createtime',width:180,
      render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)
     },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 280,
      render:(text,record) =>{
        return (
          <div align="left" className="operation-main">
         
              {record.user_type !== 1?<AuthBotton 
                onClick={() => this.handleAssinRoleBtn(record)} 
                authname='assginrole'
                // authutil={this.props.authutil}    
                className="select-main-btn"  type="primary" size="default"> 分配角色 </AuthBotton>:""}
            
              {record.user_type !== 1? <AuthBotton 
                onClick={() => this.handleShowBtn(record)}
                // authutil={this.props.authutil}
                authname="useredit"
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>:""}

              {this.props.user_info.user_type === 1?<Button 
                onClick={() => this.handleShowPassBtn(record)} 
                className="select-main-btn"  type="primary" size="default"> 查看密码 </Button>:""}    

              {record.user_type === 1||record.user_type === 2?"":<AuthBotton 
                onClick={()=>that.handleDelUser(record)}
                className="select-main-btn"
                // authutil={this.props.authutil}
                authname="userdel"  type="danger" size="default"> 删除 </AuthBotton>}
          
        </div>   
        );
      }
      }
    ]
  }
  // 获取表格数据
   getTableData=()=>{
    axios.GET("manager").then(res=>{
      let {status,data} = res.data;
      console.log(data)
      if(status){
        this.setState({tableData:data,multipleSelection:[],selectedRowKeys:[]})
      }else{

      }
    })
  }
   // 获取所有角色数据
   getallRoleData=()=>{
    axios.GET("rbacRole",{status:1}).then(res=>{
      let {status,data} = res.data;
      console.log(data)
      if(status){
        this.setState({allRoleDataId:data.map(itme=>itme.id)})
        this.filterGropaRole(data)
      }else{

      }
    })
  }
    // 分组角色
    filterGropaRole(data){
      var res = {};
      data.forEach(itme=>{
        if(res[itme.role_type]){
          res[itme.role_type].push(itme)
        }else{
            res[itme.role_type] = [itme];
        }
      })
      var resArr = [];
      for (const key in res) {
        let groupName = key==='1'?"内部":"外部";
        resArr.push({groupName,dataList:res[key]});
      }
      this.setState({allRoleData:resArr})    
    }

  // 分配角色按钮
  handleAssinRoleBtn(row){
    console.log(row)
    let selectRoleId = row.role?row.role.map(itme=>Number(itme.id)):[];
    this.setState({addUserRoleIshow:true,selectRoleUserId:row.id,selectRoleId})
  }
  // 编辑和添加 按钮
  handleShowBtn(row){
    var userFromData = { id:"",name:"",user_type:'',password:"",contact:"",status:1,btnType:"add" };
    if(row){
      var modalTitle ="编辑";
      userFromData = JSON.parse(JSON.stringify(row));;
      userFromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
    }
    this.setState({modalTitle,addEditUserIshow:true,userFromData})
  }
  // 删除
  handleDelUser(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该用户处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("rbacUserDel",{id:row.id}).then(result=>{
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
    axios.POST("rbacUserSwtich",{data}).then(result=>{
     
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
    this.setState({ selectedRowKeys ,multipleSelection});
  };
  // 查看用户密码
  handleShowPassBtn = row=> {
    // rbacUserShowpass
    let SpinLoading = message.loading('正在请求中...', 0);
    axios.POST("rbacUserShowpass",{id:row.id}).then(result=>{
      var  {status,mssage,data} = result.data;
      setTimeout(SpinLoading, 0);
      if(status){
          Modal.info({
            title: `${row.name} 的密码`,
            content: (
              <div>{data}</div>
            ),
          });

      }else{
         message.error(mssage||"查找失败");
      }
    }).catch(error=>{
      console.log(error)
    })
  }
  // 组件挂载时
  componentDidMount(){
    this.getTableData();
    this.getallRoleData();
  }
  render() {
    const { selectedRowKeys,multipleSelection,tableData ,modalTitle,addEditUserIshow,userFromData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="rbacuser-view">
        {/* 表格 */}
        <Table
            size="small"
            style={{"margin":"12px auto"}}
            rowKey = {row=>row.id}
            columns={this.tableColumns}
            rowSelection={rowSelection}
            dataSource={tableData}
            pagination={{ pageSize: 30 }}
            scroll={{ x: 1080 }}
            bordered
            title={() => (
              <div>
                 <AuthBotton  onClick={() => this.handleShowBtn("")} 
                    // authutil={this.props.authutil}
                    authname="useradd"
                    className="select-main-btn"  type="primary" size="default"> 添加用户 </AuthBotton>
                 &nbsp;&nbsp;&nbsp;
                 <AuthBotton  className="select-main-btn"  type="primary" size="default"
                    // authutil={this.props.authutil}
                    authname="userswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===2).length?'false':'true'}
                   onClick={() => this.handleSwitch('allStart')}>  全部启用</AuthBotton> &nbsp;&nbsp;&nbsp;
                <AuthBotton  className="select-main-btn"  type="danger" size="default" 
                    // authutil={this.props.authutil}
                    authname="userswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===1).length?'false':'true'}
                    onClick={() => this.handleSwitch('allStop')}> 全部停用 </AuthBotton>
                 </div>
            )}
          />
          {/* 全部停用，启用按钮 */}
          

          {/* 添加编辑管理员的弹框 */}
          <AddEditUser 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditUserIshow={addEditUserIshow} 
            userFromData={userFromData}
            />
            {/* 分配角色的弹窗 */}
            <AddUserRole
             getTableData={this.getTableData.bind(this)} 
             handleAsynChange={this.handleAsynChange.bind(this)} 
             addUserRoleIshow={this.state.addUserRoleIshow}
             allRoleData={this.state.allRoleData}
             allRoleDataId={this.state.allRoleDataId}
             selectRoleUserId={this.state.selectRoleUserId}
             selectRoleId = {this.state.selectRoleId}
             key={this.state.selectRoleUserId}
            />
        </div>
    )
  }
}

export default connect(state=>({
  user_info:state.UserInfo
}))(index)
