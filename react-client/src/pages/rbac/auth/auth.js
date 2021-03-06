import React, { Component ,Fragment} from 'react'
import { message ,Input,Select ,Button ,Row,Col,Divider} from 'antd';
import axios  from '../../../api/axios'
import AddEditAuth from './AddEditAuth' // 编辑、添加权限
import {connect} from "react-redux"
import AuthBotton from "../../../component/authButton/indexs";
import  "./index.css"
const {Option} = Select
function ListMain(props){
    let {dataList = [],handleShowBtn} = props
    return <div className="auth-list-main">
            {
                dataList.map((val,index)=>(
                  <Fragment key={index}>
                  <div style={{margin:"12px 6px"}} >
                
                    <Divider orientation="left" className="by-divider">
                        {val.key}
                        &nbsp;
                        <AuthBotton  
                            authname="authadd" 
                            onClick={() => handleShowBtn({"groupName":val.key})} 
                            className="select-main-btn"   size="default"> 添加权限
                        </AuthBotton>
                    </Divider>
                    <Row justify="space-between" style={{marginLeft:"12px"}}  gutter={24}>
                        {val.value.map(itme=> <Col span={4}  key={itme.id}> <ListItme itme={itme} {...props}/> </Col>)}
                    </Row>
                  </div>
                   
                 </Fragment> 
                ))
              }
    </div>
}

function ListItme(props){
    let {itme={},user_info={},handleShowBtn,handleSwitch,handleDelBtn} = props
    return <div className="list-itme">
        <div className="list-itme-content" style={{color:itme.status === 1?'#1DA57A':'red'}}>
            <div>{itme.name}</div>
            <div>{itme.identName}</div>
        </div>
        <div className="list-itme-handle">
        <AuthBotton 
              onClick={() => handleShowBtn(itme)} 
              authname="authedit"  className="select-main-btn" 
               type="primary" size="small"> 编辑/查看 </AuthBotton>
           
            <AuthBotton 
               className="select-main-btn"  authname="authswtich" 
                type={itme.status === 1 ? 'danger' : 'primary'}  size="small" 
                onClick={() => handleSwitch(1,itme)}>
                 {itme.status === 1 ? '禁用' : '开启'} </AuthBotton>
           
            {user_info.user_type !== 1&&user_info.user_type !== 2?""
             :<AuthBotton className="select-main-btn" 
               onClick={()=>handleDelBtn(itme)}
               authname="authdel"
               type="danger" size="small"> 删除 </AuthBotton>}
           
        </div>

    </div>
}

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
    groupListArr:[]
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
   
 
  // 获取列表数据
   getTableData =  ()=>{
     this.setState({loading:true})
    axios.GET("rbacAuth").then( async res=>{
      let {status,data} = res.data;
      console.log(data)
      this.handleAuthListGroup(data)
      this.setState({loading:false})
      if(status){
        await this.setState({tableData:data,multipleSelection:[],selectedRowKeys:[]})
        await this.onSubmitSearch();
      }else{

      }
    })
  }

  // 对权限列表分组
   handleAuthListGroup(data){
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
    this.setState({groupListArr})

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
    if(row&&row.id){
      var modalTitle ="编辑";
      authFromData = row;
      authFromData["btnType"]="edit";
      
    }else{
       modalTitle ="添加"
       row = row?row:{}
       authFromData = Object.assign({},authFromData,row)
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
    this.handleAuthListGroup(resData)
    // this.setState({rendTableData:resData})  
  }
  // 组件挂载时
  componentDidMount(){
    this.getTableData();
    this.getAllMenuData();

  }
  render() {
    const { modalTitle,addEditAuthIshow,authFromData } = this.state;
   
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
           <AuthBotton  
            authname="authadd" 
            onClick={() => this.handleShowBtn("")} 
            className="select-main-btn"  type="primary" size="default"> 添加权限
        </AuthBotton>
        </div>
        
        <Divider />
         <ListMain 
         dataList={this.state.groupListArr}
         handleShowBtn={this.handleShowBtn.bind(this)} 
         handleSwitch={this.handleSwitch.bind(this)} 
         handleDelBtn={this.handleDelBtn.bind(this)} 
         user_info={this.props.user_info}

         />
         {/* handleShowBtn,handleSwitch,handleDelBtn */}
       
         
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
