import React, { Component } from 'react'
import { Table,message } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AuthBotton from "../../../component/authButton/indexs";
import "./index.css"
export default class  extends Component {
  state = {
    //  列表数据
     tableData:[],
     totalData:0,
     currentPage:1,
     pageSize:15,
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据
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
      {title: '标题',	dataIndex: 'title',align: 'center',	key: 'title'},
      {title: '所属分类',	dataIndex: 'cname',align: 'center',	key: 'cname'},
      {title: '状态 ', align: 'center', dataIndex: 'state',key:"status",
      render (text, record) {
         let color =record.status === 1 ? 'green' : 'red';
         let val = record.status === 1 ? '正常' : '禁用';

         return (
            <span style={{color}}>{val}</span>
         )
        }
      },
      {title: '访问量',	dataIndex: 'readcount',align: 'center',	key: 'readcount'},
      {title: '创建时间',	dataIndex: 'createtime',align: 'center',	key: 'createtime',
      render:(text, record) => (<span>{dataFormat(record.createtime)}</span>)
     },
      {title: '操作', align: 'left', dataIndex: 'operation',kye:"operation", fixed: 'right',width: 220,
      render:(text,record) =>{
        return (
          <div align="left" className="operation-main">
            
            <AuthBotton 
                onClick={() => this.handleShowBtn(record)}
                // authutil={this.props.authutil}
                authname="artcleedit"
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>
           
            <AuthBotton 
                type={record.status === 1 ? 'danger' : 'primary'}
                onClick={() => this.handleSwitch(1,record)}
                // authutil={this.props.authutil}
                authname="artcleswtich"
                className="select-main-btn" size="default"
                >  {record.status === 1 ? '禁用' : '开启'} </AuthBotton>

              {<AuthBotton 
                onClick={()=>that.handleDelUser(record)}
                className="select-main-btn"
                // authutil={this.props.authutil}
                authname="articledel"  type="danger" size="default"> 删除 </AuthBotton>}
        </div>   
        );
      }
      }
    ]
  }
  // 获取表格数据
   getTableData=(page)=>{
     let {pageSize} = this.state;
    axios.GET("cmsArticle",{page,limit:pageSize,a_status:0}).then(res=>{
      let {status,data,count} = res.data;
      console.log(data)
      if(status){
        this.setState({tableData:data,totalData:count,multipleSelection:[],selectedRowKeys:[]})
      }else{

      }
    })
  }
 //点击分页
 onChangePage=(currentPage)=>{
   this.getTableData(currentPage)
   this.setState({currentPage})
 }
   
  // 编辑和添加 按钮
  handleShowBtn(row){
    if(row){  //编辑
      this.props.history.push(`/admin/cmsarticle/${row.id}`)
    }else{ //添加
      this.props.history.push("/admin/cmsarticleadd")
    }
    // this.setState({modalTitle,addEditTabIshow:true,tabFromData})
  }
  // 删除
  handleDelUser(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该用户处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("cmsArticleDel",{id:row.id}).then(result=>{
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
    axios.POST("cmsArticleSwtich",{data}).then(result=>{
     
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
 
  // 组件挂载时
  componentDidMount(){
    this.getTableData(1);
    
  }
  render() {
    const { selectedRowKeys,multipleSelection,tableData} = this.state;
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
            pagination={{current:this.state.currentPage, pageSize: this.state.pageSize,onChange:(page)=>this.onChangePage(page), total:this.state.totalData }}
            scroll={{ x: 1050 }}
            bordered
            title={() => (
              <div>
                 <AuthBotton  onClick={() => this.handleShowBtn("")} 
                  // authutil={this.props.authutil}
                  authname="artcleadd"
                 className="select-main-btn"  type="primary" size="default"> 添加帖子 </AuthBotton>
                 &nbsp;&nbsp;&nbsp;

                 <AuthBotton  className="select-main-btn"  type="primary" size="default"
                    // authutil={this.props.authutil}
                    authname="artcleswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===2).length?false:true}
                  onClick={() => this.handleSwitch('allStart')}>  全部启用</AuthBotton> 
                  &nbsp;&nbsp;&nbsp;

                <AuthBotton  className="select-main-btn"  type="danger" size="default" 
                  // authutil={this.props.authutil}
                  authname="artcleswtich"
                  mydisabled={multipleSelection.filter(itme=>itme.status===1).length?false:true}
                  onClick={() => this.handleSwitch('allStop')}> 全部停用</AuthBotton>
                 </div>
            )}
          />
        </div>
    )
  }
}
