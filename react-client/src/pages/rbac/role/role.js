import React, { Component } from 'react'
import { Table,message ,Input,Select ,Button } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AssginAuth from "./AssginAuth" //分配权限
import AddRoleMenu from "./AddRoleMenu" //分配菜单
import AddEditRole from "./AddEditRole" //添加编辑角色
import AuthBotton from "../../../component/authButton/indexs";
import  "./index.css"
const {Option} = Select

export class index extends Component {
  state = {
    search_key:"",
    status:"",
    loading:false,
    rendTableData:[],
    // 表格数据
     tableData:[],
    //  添加编辑角色的数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditRoleIshow:false, //添加、编辑的弹窗的开关
     roleFromData:{//添加、编辑管理员的数据
      id:"",name:"",role_type:'',title:"",status:1,btnType:""
    },
    //分配菜单操作相关数据
    assRoleMenuId:"",//操作当前列分配菜单的角色id
    addMenuIshow:false,//分配菜单的弹窗的开关
    allMenuData:[],//所有的菜单数据，
    allMenuDataId:[],
    // 分配权限相关的数据
    allAuthData:[],//权限数据已分组
    allAuthDataId:[], //权限的所有id
    addAuthIshow:false,
    assRoleAuthId:"",//操作当前列分配权限的角色id
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
    // var that = this;
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:80},
      {title: '角色名称',	dataIndex: 'name',align: 'center',	key: 'name',width:120},
      {title: '角色描述',	dataIndex: 'title',align: 'center',	key: 'contact'},
      {title: '角色类型',	dataIndex: 'role_type',align: 'center',	key: 'role_type',width:150,
        render: (text, record) =>(record.role_type===1?"内部":"外部" )
      },
      {title: '状态 ', align: 'center', dataIndex: 'state',kye:"status",width:80,
      render (text, record) {
         let color = record.status === 1 ? 'green' : 'red';
         let val = record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '创建时间',	dataIndex: 'createtime',align: 'center',	key: 'createtime',width:180,
      render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)    
      },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 290,
      render:(text,record) =>{
        return (
          <div align="left">
           <AuthBotton 
                onClick={() => this.handleAssinMenuBtn(record)} 
                authname='assginmenu' 
                className="select-main-btn"  type="primary" size="default"> 分配菜单 </AuthBotton>
           {/* <Button onClick={() => this.handleAssinMenuBtn(record)}  className="select-main-btn"  type="primary" size="default"> 分配菜单 </Button> */}
            &nbsp;
            <AuthBotton 
                onClick={() => this.handleAssinRoleBtn(record)} 
                authname='assginauth' 
                className="select-main-btn"  type="primary" size="default"> 分配权限 </AuthBotton>
           {/* <Button onClick={() => this.handleAssinRoleBtn(record)}  className="select-main-btn"  type="primary" size="default"> 分配权限 </Button> */}
           &nbsp;
           <AuthBotton 
                onClick={() => this.handleShowBtn(record)} 
                authname='roleedit' 
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>
            {/* <Button onClick={() => this.handleShowBtn(record)}  className="select-main-btn"  type="primary" size="default"> 编辑 </Button> */}
            &nbsp;
            {record.role_type === 1?"":<AuthBotton 
                onClick={() => this.handleDelRole(record)} 
                authname='roledel' 
                className="select-main-btn"  type="danger" size="default"> 删除 </AuthBotton>}
            {/* <Popconfirm
              title="确定删除？"
              onConfirm={() => that.handleDelRole(record)}
            >
              {record.role_type === 1?"":<Button className="select-main-btn"  type="danger" size="default"> 删除 </Button>}
            </Popconfirm> */}
          </div>
        );
      }
      }
    ]
  }
  // 获取表格数据
   getTableData=()=>{
    this.setState({loading:true})
    axios.GET("rbacRole").then( async res=>{
      let {status,data} = res.data;
      this.setState({loading:false})
      if(status){
        await this.setState({tableData:data,selectedRowKeys:[]})
        await this.onSubmitSearch();
      }else{

      }
    })
  }
   // 获取菜单列表数据所有
   getAllMenuData(){
    axios.GET("rbacMenu").then(result=>{
      var  {status,data} = result.data;
      if(status){
        this.setState({allMenuData:data})
        this.getAllMenuId(data)
      }
    }).catch(error=>{
      console.log()
    })
  }
  // 刷选除所有的菜单id
  getAllMenuId(data){
    var allkey=[];
    let fn = (data)=>{
      data.forEach(itme=>{
        allkey.push(itme.id);
        if(itme.children&&itme.children.length){
          fn(itme.children)
        }
      })     
    }
    fn(data);
    this.setState({allMenuDataId:allkey})
  }
   // 获取所有权限数据
  getallAuthData=()=>{
    axios.GET("rbacAuth").then(res=>{
      let {status,data} = res.data;
     
      if(status){
        this.filterGropaAuth(data);
        let allAuthDataId =  data.map(itme=>itme.id)
        this.setState({allAuthDataId})
      }else{

      }
    })
  }
  // 分组权限
  filterGropaAuth(data){
    var res = {};
    data.forEach(itme=>{
      if(itme.groupName){
        if(res[itme.groupName]){
          res[itme.groupName].push(itme)
        }else{
            res[itme.groupName] = [itme];
        }
      }else{
        res['未分组']?res['未分组']=[itme]:res['未分组'].push(itme)
      }
    })
    var resArr = [];
    for (const key in res) {
      resArr.push({groupName:key,dataList:res[key]});
    }
    console.log(resArr)
    this.setState({allAuthData:resArr})    
  }

  // 分配菜单按钮
  handleAssinMenuBtn(row){
    console.log(row)
    this.setState({addMenuIshow:true,assRoleMenuId:row.id})
  }
  // 分配权限按钮
  handleAssinRoleBtn(row){
    this.setState({addAuthIshow:true,assRoleAuthId:row.id})
  }
  // 编辑和添加 按钮
  handleShowBtn(row){
    var roleFromData = {  id:"",name:"",title:"",role_type:"",status:1,btnType:"add" };

    if(row){
      var modalTitle ="编辑";
      roleFromData = JSON.parse(JSON.stringify(row));
      roleFromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
    }
    this.setState({modalTitle,addEditRoleIshow:true,roleFromData})
  }
  // 删除
  handleDelRole(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该角色处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("rbacRoleDel",{id:row.id}).then(result=>{
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
  onSubmitSearch= async ()=>{
    let {search_key,status,tableData} =await this.state;
    let resData = tableData;
    if(status){
       resData = resData.filter(itme=>itme.status===status) 
    }
    if(search_key){
        resData = resData.filter(itme=>{
          return itme.name.includes(search_key)
      })
    }
    this.setState({rendTableData:resData})  
  }

  // 组件挂载时
  componentDidMount(){
    this.getTableData();
    this.getAllMenuData();
    this.getallAuthData();
  }
  render() {
    const {loading,rendTableData  } = this.state;
   
    return (
      <div className="rbacuser-view">
        {/* 搜索 */}
        <div className="col-12 m-flex search-wrap">
           <Input placeholder="关键词/名称" allowClear style={{width:"240px"}}
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
            // rowSelection={rowSelection}
            dataSource={rendTableData}
            pagination={{ pageSize: 30 }}
            scroll={{ x: 1050 }}
            bordered
            title={() => (
              <div> 
                 <AuthBotton 
                onClick={() => this.handleShowBtn("")} 
                authname='roleadd' 
                className="select-main-btn"  type="primary" size="default"> 添加角色 </AuthBotton>
                {/* <Button  onClick={() => this.handleShowBtn("")} className="select-main-btn"  type="primary" size="default"> 添加角色 </Button> */}
                </div>
            )}
          />
         

          {/* 添加编辑角色的弹框 */}
          <AddEditRole 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={this.state.modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditRoleIshow={this.state.addEditRoleIshow} 
            roleFromData={this.state.roleFromData}
            />
            {/* 分配菜单弹窗 */}
            <AddRoleMenu
             handleAsynChange={this.handleAsynChange.bind(this)} 
             addMenuIshow={this.state.addMenuIshow}
             allMenuData={this.state.allMenuData}
             allMenuDataId={this.state.allMenuDataId}
             assRoleMenuId = {this.state.assRoleMenuId}
             key={'AddRoleMenu'+this.state.assRoleMenuId}
            />

            {/* allAuthData */}
            <AssginAuth
             handleAsynChange={this.handleAsynChange.bind(this)} 
             addAuthIshow={this.state.addAuthIshow}
             allAuthData={this.state.allAuthData}
             allAuthDataId={this.state.allAuthDataId}
             assRoleAuthId={this.state.assRoleAuthId}
             key={'AssginAuth'+this.state.assRoleAuthId}
            />
        </div>
    )
  }
}

export default index
