import React, { Component } from 'react'
import { Select ,Button,Modal,Input,message} from 'antd';
import WxnoList from './wxnoList'
import AuthBotton from "../../../component/authButton/indexs";
import axios from '../../../api/axios';
import "./index.css"
const { Option } = Select;
function RendSelect(props){
  var {handleChange,dataArr,selectId,addHandleData,handleEditBtn,labelVal,Addabled,editabled} = props;
  return (
    <div className="select-main">
       <span>{labelVal}&nbsp;:&nbsp;&nbsp; </span><Select  showSearch value={selectId} labelInValue placeholder="请选择" style={{ width: 320 }} onChange={handleChange}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }>
        {
          dataArr.map(itme=> 
              itme.status===1? <Option key={itme.id} value={itme.id}>{itme.name}</Option>:""
          )
        }
      </Select>
      
      <AuthBotton  className="select-main-btn"  type="primary" size="default"
        authname="savehostpath"
        mydisabled={Addabled}
        onClick={addHandleData}>  添加</AuthBotton> 
        <AuthBotton  className="select-main-btn"  type="primary" size="default"
        authname="savehostpath"
        mydisabled={editabled}
        onClick={handleEditBtn}>  编辑</AuthBotton> 
      {/* <Button className="select-main-btn" disabled={Addabled} onClick={addHandleData} type="primary" size="default"> 添加 </Button>
      <Button className="select-main-btn" type="primary" disabled={editabled} onClick={handleEditBtn} size="default"> 编辑 </Button> */}
    </div>
  )
}

export class index extends Component {

  state = {
    dataArr:[], //所有数据
    pathNameArr:[], //当前域名下的后缀列表数据
    selectHost:{key:"",label:""}, //选中的域名数据id
    selectPath:{key:"",label:""},
    wxnoArr:[],//当前后缀下的所有微信号
    addModelTile:"",//对话框标题
    modalVisible:false ,//添加数据对话的是否显示
    addHostPathVal:"", //添加域名和后缀的值
    addPid:"",//等级，域名与后缀的上下等级关系
    dataId:"",//当前host 和path对话框的 id,编辑时有，添加时没有
  }; 
  // 找出当前域名下的所有子级后缀
   filterCurrentPath =async (selectHost)=>{
    var {dataArr} = this.state;
    var pathNameArr = dataArr.filter(itme=>itme.id===selectHost)[0];
    pathNameArr = pathNameArr?pathNameArr['children']:[];
    await this.setState({pathNameArr}) //当前域名下的所有后缀    
    if(pathNameArr.length){ //设置后缀默认第一项选中
       await this.setState({selectPath:{key:pathNameArr[0].id,label:pathNameArr[0].name}});
       this.filterCurrentWxno(pathNameArr[0].id);//根据选中的后缀获取当前的所有wxno
    }else{
      await this.setState({selectPath:{key:"",label:""},wxnoArr:[]})
    }
    
  }
  // 找当前后缀下的所有微信号
  filterCurrentWxno = (selectPath)=>{
    let {pathNameArr} = this.state;
    let wxnoArr = pathNameArr.filter(itme=>itme.id===selectPath)[0];
    wxnoArr = wxnoArr?wxnoArr['wxnoArr']:[];
    this.setState({wxnoArr})
   
  }
  //host  select 改变的时候重新获取 列表数据
  handleHostChange =async (selectHost)=>{ 
    await this.setState({selectHost});
    this.filterCurrentPath(selectHost.key);
  }
  // path select改变是重新获取 wxno 列表数据
  handlePathChange =async (selectPath)=>{
    await this.setState({selectPath});
    this.filterCurrentWxno(selectPath.key);
  }
  //获取所有数据
   getAllData(){
    axios.GET("getHostPath").then( ({data:{status,mssage,data}})=>{
      if(status){
        var {selectHost} = this.state;
        console.log(selectHost)
        var objVal =selectHost.key?selectHost:(data[0]?{key:data[0].id,label:data[0].name}:{key:"",label:""});
        // var objVal = data[0]?data[0]:{id:"",label:""};
        console.log(objVal)
        this.setState({
          dataArr:data,
          selectHost:objVal
         })
          this.filterCurrentPath(objVal.key)
      }else{
        message.error(mssage)
      }
     
    }).catch(error=>{
      console.log(error)
    })
  }
  // 点击域名或者后缀 添加按钮触发
  handleHostPathShow =async (type)=>{
    var {selectHost} = this.state;
    if(type===2&&(!selectHost||!selectHost.key))  return message.error("请选择一级域名");
    await this.setState({ modalVisible:true,dataId:'',"addHostPathVal":"" });
    if(type===1){
      await this.setState({addModelTile:"添加新域名",addPid:""})
    }else if(type===2&&selectHost&&selectHost.key){
      await  this.setState({addModelTile:`添加${this.state.selectHost.label}后缀`,addPid:this.state.selectHost.key})
    }
   
  }
  //点击域名或者后缀 编辑按钮触发 ,肯定有dataId
  handleEditBtnShow =async (type)=>{
    var {selectHost,selectPath} = this.state;
    if(type===1){ //一级没有pid
      await this.setState({ modalVisible:true,addModelTile:`编辑域名`,"addHostPathVal":selectHost.label,dataId:selectHost.key ,addPid:0});
    }else if(type===2){
      await this.setState({ modalVisible:true,addModelTile:'编辑后缀',"addHostPathVal":selectPath.label,dataId:selectPath.key,addPid:selectHost.key });
    }
  }

  // 同步更新state 的值
  handleAsynChange (key,value){
    this.setState({ [key]:value });

  }

  // 提交数据
  onSubmitPwd =async ()=>{
    var {addHostPathVal,addPid,dataId} = this.state;
    // 根据id 判断是否是添加或者修改
    // 修改的直接带id 
    // 添加的是否有pid(0没有为一级,1为二级)
    
    // id,name,pid=0,status=1
    if(!addHostPathVal){
      return message.error("数据不能为空");
    }
    var postData = {
      id:dataId,
      name:addHostPathVal,
      status:1,
      pid:addPid
    }
    axios.POST("saveHostPath",postData).then(result=>{
      var {status,mssage} = result.data;
       if(status){
         this.getAllData();
         message.success(mssage||"操作成功")
       }else{
         message.error(mssage||"操作失败")
       }
       
    })
    this.setState({addHostPathVal:"",addPid:"",modalVisible:false});
   
  }


  // 组件挂载的生命周期
  componentWillMount(){
    this.getAllData();
   
  }
  render() {
    var {dataArr,selectHost,pathNameArr,selectPath,wxnoArr,dataId}  = this.state;
    var linkPath = selectPath.label==="/"?'':selectPath.label;
    var links ='http://'+selectHost.label+'/'+linkPath;   
    return (
      <div className="wxnumber-views">
           <RendSelect labelVal="域名" handleChange={this.handleHostChange} live="1"
              Addabled={false} editabled={selectHost.key?false:true}
              addHandleData={this.handleHostPathShow.bind(this,1)} 
              handleEditBtn={this.handleEditBtnShow.bind(this,1)}
              dataArr={dataArr} selectId={selectHost}/>
           <RendSelect labelVal="后缀" handleChange={this.handlePathChange} live="2"
             Addabled={selectHost.key?false:true} editabled={selectPath.key?false:true} 
             addHandleData={this.handleHostPathShow.bind(this,2)} 
             handleEditBtn={this.handleEditBtnShow.bind(this,2)}
             dataArr={pathNameArr} selectId={selectPath}/>
           <Modal
            title={this.state.addModelTile}        
            cancelText='取消'
            okText='关闭'
            centered
            visible={this.state.modalVisible}   
            onOk={()=>this.handleAsynChange('modalVisible',false)}
            onCancel={()=>this.handleAsynChange('modalVisible',false)}
          >
           <div className="form-main">
            {dataId?< Input  style={{ width: "300px",marginLeft: "-10px",marginBottom: "12px"}} name="dataId" value={dataId} disabled/>:''}
            <Input placeholder="请输入" name="addHostPathVal" value={this.state.addHostPathVal}  allowClear onChange={e => {this.handleAsynChange('addHostPathVal', e.target.value)}} />
            <Button type="primary"  className="form-button" onClick={this.onSubmitPwd}>
              提交
            </Button>
           </div>
          </Modal>
          <div className="show-link">
            <div style={{flex:1}}> 链接：{selectHost.label? <a href={links} rel="noopener noreferrer" target="_blank">{links}</a>:""}</div>
          </div>
          <WxnoList getAllData={this.getAllData.bind(this)} disabled={selectPath.key?false:true} tableData={wxnoArr} selectHost={selectHost} selectPath={selectPath}/>
      </div>
    )
  }
}

export default index