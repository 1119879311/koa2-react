import React, { Component } from 'react'
import { Table } from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"

export default class index extends Component {
  state = {
    //  列表数据
     tableData:[],
     totalData:0,
     currentPage:1,
     pageSize:15,

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
    return [
      {title: '序号',	dataIndex: 'id',align: 'center',	key: 'id',width:80},
      {title: '登录用户',	dataIndex: 'login_name',align: 'center',	key: 'login_name'},
      {title: '登录ip',	dataIndex: 'login_ip',align: 'center',	key: 'login_ip'},
      {title: '登录所在地 ', align: 'center', dataIndex: 'login_address',key:"login_address"},
      {title: '登录时间',	dataIndex: 'login_time',align: 'center',	key: 'login_time',
         render:(text, record) => (<span>{dataFormat(record.login_time)}</span>)
       },
    ]
  }
  // 获取表格数据
   getTableData=(page)=>{
     let {pageSize} = this.state;
    axios.GET("logslogin",{page,limit:pageSize}).then(res=>{
      let {status,data,count} = res.data;
      console.log(data)
      if(status){
        this.setState({tableData:data,totalData:count})
      }else{

      }
    })
  }
 //点击分页
 onChangePage=(currentPage)=>{
   this.getTableData(currentPage)
   this.setState({currentPage})
 }
   
 
 
  // 组件挂载时
  componentDidMount(){
    this.getTableData(1);
    
  }
  render() {
    const {tableData,currentPage,pageSize,totalData} = this.state;
 
    return (
      <div className="rbacuser-view">
        {/* 表格 */}
        <Table
            size="small"
            style={{"margin":"12px auto"}}
            rowKey = {row=>row.id}
            columns={this.tableColumns}
            // rowSelection={rowSelection}
            dataSource={tableData}
            pagination={{current:currentPage, pageSize: pageSize,onChange:(page)=>this.onChangePage(page), total:totalData }}
            // scroll={{ x: 1050 }}
            bordered
          />
        </div>
    )
  }
}
