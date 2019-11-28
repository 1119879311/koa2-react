import React, { Component } from 'react'
import {Input,Checkbox,Select,Upload,Button,Icon,message,Switch } from 'antd';
import axios  from '../../../api/axios'
import MyBraftEditor from "../../../component/MyBraftEditor";
import {leveRecurOne} from "../../../util"
import {uploadServerHost} from '../../../api/url'
import "./addEdit.css"
const { Option } = Select;

export default class index extends Component {

  state={
    cateList:[],
    tabList:[],
    uploading: false,
    fromData:this.props.fromData?this.props.fromData:{ //表单数据
      id:"",
      title:"",
      remark:"",
      cata_id:"", 
      ueContent:"",//内容
      status:1,
      tabList:[],//1,2
      fileList:[],//{uid:url}
    }
  }
   // 同步更新state 的值
   handleAsynChange =(key,value,obj)=>{
    if(obj){
      let objval = this.state[obj];
      objval[key] = value;
      this.setState({ [obj]:objval});
    }else{
      this.setState({ [key]:value});
    }
    
  }

  // 获取分类数据
  getCateList(){
    axios.GET("cmsCate",{status:0}).then(res=>{
      let {status,data} = res.data;
      if(status){
        data = leveRecurOne(data)
        this.setState({cateList:data})
      }else{

      }
    })
  }
  // 获取标签数据
  getTabList(){
    axios.GET("cmsTab",{status:1}).then(res=>{
      let {status,data} = res.data;
      if(status){
        this.setState({tabList:data})
      }else{
      }
    })
  }

  // 分类选择
  cateSelectOption = ()=>{
     let {cateList} =this.state;
     return <Select showSearch value={this.state.fromData.cata_id} style={{ width: "100%" }} placeholder="请选择分类"
        onChange={value => {this.handleAsynChange('cata_id', value,'fromData')}}>
            {cateList.map(itme=><Option key={itme.id} value={itme.id} style={{"paddingLeft": 12*Number(itme.leve) +"px"}}>{itme.name}</Option>)  }
      </Select>
  }
  // 图片上传参数
  uploadOption=()=>{
    // let {fromData} = this.state;
    return {
      onRemove: file => {
        // 去掉图片
        this.setState(state => {
          let {fromData} = state;
          const index = fromData.fileList.indexOf(file);
          const newFileList = fromData.fileList.slice();
          newFileList.splice(index, 1);
          fromData['fileList'] = newFileList
          return {
            fromData,
          };
        });
      },
      // 上传前
      beforeUpload: file => {
        console.log(file)
        this.setState(state => {
          let {fromData} = state;
          fromData['fileList']  = [...state.fromData.fileList, file];
          return {fromData}
        });
        return false;
      },
      listType:"picture",
      fileList:this.state.fromData.fileList,
      data:{},
      headers:{},
    }
  }
  // 缩略图上传至服务器
  handleUpload=()=>{
      const { fromData } = this.state;
      const formData = new FormData();
      let  fileData = fromData.fileList[0];
      if(!fileData||fileData.url) return  message.error("请重新选择图片");
      formData.append('file', fromData.fileList[0]);
      formData.append("id",fromData.id)
      this.setState({ uploading: true});
      axios.POST("uploadArticleUe",formData).then(result=>{
        var  {status,mssage,data} = result.data;
        this.setState({uploading:false})
        if(status&&data[0]){
           message.success(mssage||"上传成功");
           fromData['fileList'] = [{uid: '-1',url:uploadServerHost+data[0]}];
           this.setState({fromData})
        }else{
           message.error(mssage||"上传失败");
        }
      }).catch(error=>{
        console.log(error)
      })
  }
  // 提交表单数据值服务器
  handleSubmitFrom = ()=>{
    let {fromData} = this.state;
    if(!fromData.title) return message.error("标题不能为空");
    if(!fromData.remark) return message.error("摘要不能为空");
    if(!fromData.ueContent) return message.error("正文不能为空");
    if(fromData.btnType===1){ //编辑
      var postType = "cmsArticleUpdate"
    }else{ //编辑
      postType = "cmsArticleAdd"
    }
    let postData = {
      id:fromData.id,
      cid: fromData.cata_id,
      content:fromData.ueContent,
      remark: fromData.remark,
      status: fromData.status,
      tabList: fromData.tabList,
      thumimg: fromData.fileList[0]?fromData.fileList[0].url.replace(uploadServerHost,""):'',
      title: fromData.title,
    }
    axios.POST(postType,postData).then(result=>{
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log("server is error")
    })
  }
  componentDidMount(){
    this.getCateList();
    this.getTabList();
  }
  render(){
   
    let {fromData,uploading,tabList} = this.state;
    return (
      <div className="addeditarticle-view">
          <div className="from-main">
            {fromData.id?
              <div className="gutter-row">
                  <div className="gutter-label label-right">
                    序号 ：
                  </div>
                  <div className="gutter-content">
                    <Input value={fromData.id}  disabled
                  />
                  </div>
              </div> :''}

            <div className="gutter-row">
              <div className="gutter-label label-right">
                文章标题 ：
              </div>
              <div className="gutter-content">
                <Input value={fromData.title}  allowClear 
                 onChange={e=>this.handleAsynChange("title",e.target.value,"fromData")} />
              </div>
            </div>

            <div className="gutter-row">
              <div className="gutter-label label-right">
                文章摘要 ：
              </div>
              <div className="gutter-content">
                <Input value={fromData.remark}  allowClear
                 onChange={e=>this.handleAsynChange("remark",e.target.value,"fromData")}/>
              </div>
            </div>

            <div className="gutter-row">
              <div className="gutter-label label-right">
                标签 ：
              </div>
              <div className="gutter-content">
                <Checkbox.Group
                      style={{"width":"100%"}}
                      onChange={(val)=>this.handleAsynChange("tabList",val,"fromData")}
                      value={fromData.tabList}
                    >
                    {tabList.map((itme,index)=><Checkbox value={itme.id} key={index}>{itme.name}</Checkbox> )}
                  </Checkbox.Group>
              </div>
            </div>
            
            <div className="gutter-row">
              <div className="gutter-label label-right">
                 所属分类 ：
              </div>
              <div className="gutter-content">
                {this.cateSelectOption()}
              </div>
            </div>

            <div className="gutter-row">
              <div className="gutter-label label-right">
               文章缩略图 ：
              </div>
              <div className="gutter-content">
                <Upload {...this.uploadOption()}>
                  <Button
                   disabled={fromData.fileList.length>0}>
                    <Icon type="upload" /> 选择图片
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={this.handleUpload}
                  disabled={fromData.fileList.length !==1}
                  loading={uploading}
                  style={{ marginTop: 16 }}
                >
                  {uploading ? '上传中' : '上传至服务器'}
                </Button>
              </div>
            </div>

             <div className="gutter-row">
              <div className="gutter-label label-right">
                 状态 ：
              </div>
              <div className="gutter-content">
              <Switch
                checkedChildren="开" unCheckedChildren="关"
                checked={fromData.status===1?true:false} 
                onChange={e => {this.handleAsynChange('status', e===true?1:2,'fromData')}} />
              </div>
            </div>
            
            <div className="gutter-row" style={{alignItems: "flex-start"}}>
              <div className="gutter-label label-right">
                文章正文 ：
              </div>
              <div className="gutter-content">
                  <MyBraftEditor
                   value={fromData.ueContent}
                   handleAsynChange={this.handleAsynChange.bind(this)} 
                   />
              </div>
            </div>

            <div className="gutter-row" style={{"textAlign":"center"}}>
               <Button
                  type="primary"
                  onClick={this.handleSubmitFrom}
                  style={{ margin: "0 auto"}}
                >
                  提交
                </Button>
            </div>
          </div>
      </div>
    )
  }
}