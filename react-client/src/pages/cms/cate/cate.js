import React, { Component } from 'react'
import { Table,message ,Input,Select ,Button} from 'antd';
import axios  from '../../../api/axios'
import {dataFormat,leveRecurOne,filterChrildId} from "../../../util"
import AuthBotton from "../../../component/authButton/indexs";
import AddEditCate from "./AddEditCate"
import "./index.css"
const {Option} = Select

export class index extends Component {
  state = {
    search_key:"",
    status:"",
    loading:false,
    rendTableData:[],
    //  列表数据
     tableData:[],
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据

     // 添加编辑数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditCateIshow:false, //添加、编辑的弹窗的开关
     cateFromData:{//添加、编辑的数据
      id:"",
      name:"",
      pid:0,
      sort:100,
      catelist:[]
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
   
  // 表格列
  get tableColumns (){
    var that = this;
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:80},
      {title: '分类名称',	dataIndex: 'name',align: 'left',	key: 'name',
        render (text, record){
          return <span style={{"paddingLeft": 2*Number(record.leve-1) +"em"}}>{record.name}</span>
        }
      },
      {title: '分类等级',	dataIndex: 'leve',align: 'center',	key: 'leve'},
      {title: '分类排序',	dataIndex: 'sort',align: 'center',	key: 'sort'},
      {title: '状态 ', align: 'center', dataIndex: 'state',key:"status",
        render (text, record) {
          let color =record.status === 1 ? 'green' : 'red';
          let val = record.status === 1 ? '正常' : '禁用';
          return (
              <span style={{color}}>{val}</span>
          )
        }
      },
      {title: '创建时间',	dataIndex: 'createtime',align: 'center',	key: 'createtime',
      render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)
     },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 220,
      render:(text,record) =>{
        return (
          <div align="left" className="operation-main">
            
               <AuthBotton 
                onClick={() => this.handleShowBtn(record,"edit")}
                // authutil={this.props.authutil}
                authname="cateedit"
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>

            <AuthBotton 
                onClick={() => this.handleShowBtn(record,"add")}
                // authutil={this.props.authutil}
                authname="cateadd"
                className="select-main-btn"  type="primary" size="default"> 添加子分类 </AuthBotton>

              {<AuthBotton 
                onClick={()=>that.handleDelUser(record)}
                className="select-main-btn"
                // authutil={this.props.authutil}
                authname="catedel"  type="danger" size="default"> 删除 </AuthBotton>}
          
        </div>   
        );
      }
      }
    ]
  }
  // 获取表格数据
   getTableData= ()=>{
    this.setState({loading:true})
    axios.GET("cmsCate",{status:0}).then(async res=>{
      let {status,data} = res.data;
       this.setState({loading:false})
      if(status){
        data = leveRecurOne(data)
        console.log(data)
        await this.setState({tableData:data,multipleSelection:[],selectedRowKeys:[]})
        await this.onSubmitSearch();
      }else{

      }
    })
  }
 
   
  // 编辑和添加 按钮
  handleShowBtn=(row,btnType)=>{
    console.log(row)
    var cateFromData = { id:"",name:"" ,pid:0,sort:100,catelist:[],btnType:"add" };
    let {tableData} = this.state;
    // 添加    
    if(btnType==="add"){
         // 子分类
      if(row){
        if(row.status===2) return message.error("禁用状态无法添加子分类");
        var modalTitle =`添加 ${row.name} 的子分类`;
        cateFromData["pid"] = row.id;
        cateFromData["catelist"]=[{id:row.id,name:row.name,leve:1}]
        // 顶级分类
      }else{
          modalTitle =`添加分类`;
          cateFromData["pid"] = 0;
          cateFromData["catelist"]=[{id:0,name:'顶级分类',leve:1}]
        }
    // 编辑
    }else{
      modalTitle =`编辑${row.name}`;
      cateFromData = JSON.parse(JSON.stringify(row));
      cateFromData["btnType"]="edit";
      cateFromData["pid"] = row.pid;
      cateFromData["catelist"]= [{id:0,name:'顶级分类',leve:1},...this.filterChrild(tableData,row.id)]
    }
    console.log(modalTitle)
    console.log(cateFromData)
    this.setState({modalTitle,addEditCateIshow:true,cateFromData})

  }

  filterChrild=(data,tid=0)=>{//找当前栏目除了子集以外的栏目(过滤子集栏目)
    if (!tid||tid===0) return data;
    var arrId = filterChrildId(data, "id", "pid", tid);
    arrId.push(tid);
       data = data.filter((itme)=>{
        return itme.id!==arrId.find((val)=>{return val===itme.id});
    })
    return data;
 }
  // 删除
  handleDelUser(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该用户处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("cmsCateDel",{id:row.id}).then(result=>{
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
    axios.POST("cmsCateSwtich",{data}).then(result=>{
     
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
    
  }
  render() {
    const { loading,selectedRowKeys,multipleSelection,rendTableData,modalTitle,addEditCateIshow,cateFromData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="rbacuser-view">
       {/* 搜索 */}
       <div className="col-12 m-flex search-wrap">
           <Input placeholder="关键词" allowClear style={{width:"240px"}}
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
            style={{"margin":"6px auto"}}
            rowKey = {row=>row.id}
            columns={this.tableColumns}
            rowSelection={rowSelection}
            dataSource={rendTableData}
            pagination={{ pageSize: 30 }}
            scroll={{ x: 1050 }}
            bordered
            title={() => (
              <div>
                 <AuthBotton  onClick={() => this.handleShowBtn('',"add")} 
                    // authutil={this.props.authutil}
                   authname="cateadd"
                   className="select-main-btn"  type="primary" size="default"> 添加分类</AuthBotton>
                   &nbsp;&nbsp;&nbsp;
                  <AuthBotton  className="select-main-btn"  type="primary" size="default"
                    // authutil={this.props.authutil}
                    authname="cateswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===2).length?'false':'true'}
                    onClick={() => this.handleSwitch('allStart')}>  全部启用</AuthBotton> 
                   &nbsp;&nbsp;&nbsp;
                  <AuthBotton  className="select-main-btn"  type="danger" size="default" 
                    // authutil={this.props.authutil}
                    authname="cateswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===1).length?'false':'true'}
                    onClick={() => this.handleSwitch('allStop')}> 全部停用 </AuthBotton>
                 </div>
            )}
          />
         
          
             {/* 添加编辑的弹框 */}
            <AddEditCate 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditCateIshow={addEditCateIshow} 
            cateFromData={cateFromData}
            />
        </div>
    )
  }
}

export default index