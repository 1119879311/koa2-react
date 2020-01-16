import React, { Component } from 'react'
import { Table,message,Input,Button,Select } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AuthBotton from "../../../component/authButton/indexs";
import AddEditcloudres from "./AddEdit"
import "./index.css"
const { Option } = Select;
export class index extends Component {
  state = {
    //  列表数据
     tableData:[],
     totalData:0,
     currentPage:1,
     pageSize:30,

     search_key:"",//搜索关键词
     url:"",
     ext:"",
     status:'',

     loading:false,
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据

     // 添加编辑数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditTabIshow:false, //添加、编辑的弹窗的开关
     tabFromData:{//添加、编辑的数据
      id:"",context:"",url:"",ext:"",has_pwd:"",user:"",status:1
    },
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
    // export let cloudresources = `/cloudresources`;
    // export let cloudresAdd = `/cloudresources/add`;
    // export let cloudresUpdate = `/cloudresources/update`;
    // export let cloudresSwtich = `/cloudresources/swtich`;
    // export let cloudresDel = `/cloudresources/delete`;
  // 表格列
  get tableColumns (){
    var that = this;
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:80},
      {title: '描述',	dataIndex: 'context',align: 'center',	key: 'context',width:180},
      {title: '链接', align: 'center', dataIndex: 'url',key:"url",width:200},
      {title: '密码 ', align: 'center', dataIndex: 'has_pwd',key:"has_pwd",width:100,
      render (text, record) {
        
         return (
            <span>{record.has_pwd}</span>
         )
        }
      },
      {title: '类型/后缀', align: 'center', dataIndex: 'ext',key:"ext",width:80},
      {title: '文件大小', align: 'center', dataIndex: 'size',key:"size",width:80},
      {title: '用户', align: 'center', dataIndex: 'user',key:"user",width:120},
      {title: '状态 ', align: 'center', dataIndex: 'status',key:"status",width:80,
      render (text, record) {
         let color =record.status === 1 ? 'green' : 'red';
         let val = record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '创建时间',	dataIndex: 'createdAt',align: 'center',	key: 'createtime',width:180,
      render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)
     },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 150,
      render:(text,record) =>{
        return (
          <div align="left" className="operation-main">
            
            <AuthBotton 
                onClick={() => this.handleShowBtn(record)}
              
                authname="cloudresedit"
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>

              {<AuthBotton 
                onClick={()=>that.handleDelUser(record)}
                className="select-main-btn"
            
                authname="cloudresdel"  type="danger" size="default"> 删除 </AuthBotton>}
          
        </div>   
        );
      }
      }
    ]
  }
    // 获取表格数据
     getTableData=async ()=>{
       this.setState({loading:true})
      let {pageSize,search_key,currentPage,status,url,ext} =await this.state;
      var getData = {page:currentPage,limit:pageSize,search_key,status,url,ext}
      var postData = {};
      for (let key in getData) {
        if(getData[key]!==""){
          postData[key] = getData[key];
        }
      }
     
      axios.GET("cloudresources",postData).then(res=>{
       let {status,data,count} = res.data;
       this.setState({loading:false})
       console.log(data)
       if(status){
         this.setState({tableData:data,totalData:count,multipleSelection:[],selectedRowKeys:[]})
       }else{
 
       }
     })
   }
  //点击分页
  onChangePage=async (currentPage)=>{
    await this.setState({currentPage})
    await this.getTableData(currentPage)
  }
   
  // 编辑和添加 按钮
  handleShowBtn(row){
    console.log(row)
    var tabFromData = { id:"",context:"",url:"",ext:"",has_pwd:"",user:"",status:1,btnType:"add" };
    if(row){
      var modalTitle ="编辑";
      tabFromData = JSON.parse(JSON.stringify(row));;
      tabFromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
    }
    this.setState({modalTitle,addEditTabIshow:true,tabFromData})
  }
  // 删除
  handleDelUser(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("cloudresDel",{id:row.id}).then(result=>{
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
    axios.POST("cloudresSwtich",{data}).then(result=>{
     
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
  // 点击搜索
  onSubmitSearch = async ()=>{
    await this.setState({currentPage:1})
    await this.getTableData();

  }
  // 组件挂载时
  componentDidMount(){
    this.getTableData(1);
    
  }
  render() {
    const { selectedRowKeys,multipleSelection,tableData,modalTitle,addEditTabIshow,tabFromData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="rbacuser-view">

        {/* 搜索 */}
        <div className="col-12 m-flex search-wrap">
           <Input placeholder="关键词/描述" allowClear style={{width:"240px"}}
             onChange={(e)=>this.handleAsynChange('search_key',e.target.value)}/>
             
            <div>
                <span>链接 : </span>
                <Input placeholder="请输入链接" allowClear style={{width:"240px"}}
               onChange={(e)=>this.handleAsynChange('url',e.target.value)}/>
            </div>
            <div>
                <span>类型/后缀 : </span>
                <Input placeholder="请输入类型/后缀" allowClear style={{width:"150px"}}
               onChange={(e)=>this.handleAsynChange('ext',e.target.value)}/>
            </div>
            <div>
                <span>状态 : </span>
                <Select placeholder="请选择" allowClear
                  style={{width:"150px"}}
                  value={this.state.status}
                  onChange={(e)=>this.handleAsynChange('status',e)}>
                  <Option value={1}>正常</Option>
                  <Option value={2}>禁用</Option>
                </Select>
            </div>
           <Button icon="search" type="primary" onClick={this.onSubmitSearch}>搜索</Button>
        </div>
        {/* 表格 */}
        <Table
            size="small"
            style={{"margin":"12px auto"}}
            rowKey = {row=>row.id}
            columns={this.tableColumns}
            rowSelection={rowSelection}
            dataSource={tableData}
            loading={this.state.loading}
            pagination={{current:this.state.currentPage, pageSize: this.state.pageSize,onChange:(page)=>this.onChangePage(page), total:this.state.totalData }}
           
            scroll={{ x: 1200 }}
            bordered
            title={() => (
              <div>
                 <AuthBotton  onClick={() => this.handleShowBtn("")} 
                  // authutil={this.props.authutil}
                  authname="cloudresadd"
                 className="select-main-btn"  type="primary" size="default"> 添加</AuthBotton>
                 &nbsp;&nbsp;&nbsp;
                 <AuthBotton  className="select-main-btn"  type="primary" size="default"
                    // authutil={this.props.authutil}
                    authname="cloudresswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===2).length?'false':'true'}
                  onClick={() => this.handleSwitch('allStart')}>  全部启用</AuthBotton> 
                  &nbsp;&nbsp;&nbsp;
                <AuthBotton  className="select-main-btn"  type="danger" size="default" 
                  // authutil={this.props.authutil}
                  authname="cloudresswtich"
                  mydisabled={multipleSelection.filter(itme=>itme.status===1).length?'false':'true'}
                  onClick={() => this.handleSwitch('allStop')}> 全部停用 </AuthBotton>
                 </div>
            )}
          />
        
          
             {/* 添加编辑的弹框 */}
            <AddEditcloudres 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditTabIshow={addEditTabIshow} 
            tabFromData={tabFromData}
            />
        </div>
    )
  }
}

export default index