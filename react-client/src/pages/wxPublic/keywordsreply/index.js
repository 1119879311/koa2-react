import React, { Component } from 'react'
import { Table,message ,Input,Select ,Button} from 'antd';
import axios  from '../../../api/axios'
import {dataFormat} from "../../../util"
import AuthBotton from "../../../component/authButton/indexs";
import AddEditCpt from "./AddEditCpt"
import "./index.css"
const {Option} = Select

export class index extends Component {
  state = {
     totalData:0,
     currentPage:1,
     pageSize:30,
     search_key:"",//搜索关键词
     status:'',
     loading:false,
    //  列表数据
     tableData:[],
     selectedRowKeys :[],//选择的key
     multipleSelection:[],//选择的数据

     // 添加编辑数据
     modalTitle:"", //添加、编辑的弹窗的标题
     addEditIshow:false, //添加、编辑的弹窗的开关
     FromData:{//添加、编辑的数据
      id:"",keywords:"",reply:"",status:1
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
      {title: '关键词',	dataIndex: 'keywords',align: 'center',	key: 'keywords'},
      {title: '回复内容',	dataIndex: 'reply',align: 'center',	key: 'reply'},
      {title: '排序',	dataIndex: 'sort',align: 'center',	key: 'sort'},
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
                onClick={() => this.handleShowBtn(record)}
                // authutil={this.props.authutil}
                authname="keywordsreplyedit"
                className="select-main-btn"  type="primary" size="default"> 编辑 </AuthBotton>

              {<AuthBotton 
                onClick={()=>that.handleDelUser(record)}
                className="select-main-btn"
                // authutil={this.props.authutil}
                authname="keywordsreplyDel"  type="danger" size="default"> 删除 </AuthBotton>}
          
        </div>   
        );
      }
      }
    ]
  }
  // 获取表格数据
   // 获取表格数据
   getTableData=async ()=>{
      this.setState({loading:true})
      let {pageSize,search_key,currentPage,status} =await this.state;
      axios.GET("keywordsReply",{page:currentPage,limit:pageSize,status:status||0,search_key}).then(res=>{
        let {status,data,count} = res.data;
        this.setState({loading:false})
        console.log(data)
        if(status){
          this.setState({tableData:data,totalData:count,multipleSelection:[],selectedRowKeys:[]})
        }else{

        }
      })
  }
  //  getTableData=()=>{
  //   this.setState({loading:true})
  //   axios.GET("keywordsReply",{status:0}).then( async res=>{
  //     let {status,data} = res.data;
  //     await this.setState({loading:false})
  //     console.log(data)
  //     if(status){
  //       await this.setState({tableData:data,multipleSelection:[],selectedRowKeys:[]})
  //       await this.onSubmitSearch();

  //     }else{

  //     }
  //   })
  // }
  //点击分页
  onChangePage=async (currentPage)=>{
    await this.setState({currentPage})
    await this.getTableData(currentPage)
  }
   
  // 编辑和添加 按钮
  handleShowBtn(row){
    console.log(row)
    var FromData = { id:"",keywords:"",reply:"",status:1,btnType:"add" };
    if(row){
      var modalTitle ="编辑";
      FromData = JSON.parse(JSON.stringify(row));;
      FromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
    }
    this.setState({modalTitle,addEditIshow:true,FromData})
  }
  // 删除
  handleDelUser(row){
    console.log(row)   
    if(row.status!==2) return  message.error("该处于正常状态无法删除,请编辑为禁用状态");
    var resConfirm = window.confirm("你确定删除吗")
    if(!resConfirm) return;
    axios.POST("keywordsReplyDel",{id:row.id}).then(result=>{
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
    axios.POST("keywordsReplySwtich",{data}).then(result=>{
     
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
    await this.setState({currentPage:1})
    await this.getTableData(); 
  }
  // 组件挂载时
  componentDidMount(){
    this.getTableData();
    
  }
  render() {
    const { loading,selectedRowKeys,multipleSelection,tableData,modalTitle,addEditIshow,FromData } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="keywordsReply-view">
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
        </div>
        {/* 表格 */}
        <Table
            loading = {loading}
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
                  authname="keywordsreplyadd"
                 className="select-main-btn"  type="primary" size="default"> 添加 </AuthBotton>
                 &nbsp;&nbsp;&nbsp;
                 <AuthBotton  className="select-main-btn"  type="primary" size="default"
                    // authutil={this.props.authutil}
                    authname="keywordsreplyswtich"
                    mydisabled={multipleSelection.filter(itme=>itme.status===2).length?'false':'true'}
                  onClick={() => this.handleSwitch('allStart')}>  全部启用</AuthBotton> 
                  &nbsp;&nbsp;&nbsp;
                <AuthBotton  className="select-main-btn"  type="danger" size="default" 
                  // authutil={this.props.authutil}
                  authname="keywordsreplyswtich"
                  mydisabled={multipleSelection.filter(itme=>itme.status===1).length?'false':'true'}
                  onClick={() => this.handleSwitch('allStop')}> 全部停用 </AuthBotton>
                 </div>
            )}
          />
        
          
             {/* 添加编辑的弹框 */}
            <AddEditCpt 
            getTableData={this.getTableData.bind(this)} 
            modalTitle={modalTitle} 
            handleAsynChange={this.handleAsynChange.bind(this)} 
            addEditIshow={addEditIshow} 
            FromData={FromData}
            />
        </div>
    )
  }
}

export default index