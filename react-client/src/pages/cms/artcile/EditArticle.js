import React, { Component } from 'react'
import AddEditAddArticle from './AddEditAddArticle'
import axios  from '../../../api/axios'
import {uploadServerHost} from '../../../api/url'

export default class index extends Component {
  state={
     fromData:{
        id:"",
        title:"",
        remark:"",
        cata_id:"", 
        ueContent:"",//内容
        status:1,
        tabList:[],//1,2
        fileList:[],//{uid:url}
        btnType:"加载中",
     }
  }
  componentDidUpdate(prevProps){
    let prevId =this.props.match.params.id;
    if(prevId&&prevId!==prevProps.match.params.id){
      this.getArticleDetail();
    }
  }
  getArticleDetail(){
    let {fromData} = this.state;
    let {id} = this.props.match.params;
    axios.GET("cmsDetail",{id,is_tab:0,a_status:0}).then(res=>{
      let {status,data} = res.data;
      if(status&&data){
        if(data.thumimg){
            var thumimg =(data.thumimg).replace(/\\/g,"/");
            var index = thumimg.search(/(\/)(?!.*\1)/gi)
            var name = thumimg.substr(index+1);
            fromData.fileList = [{uid:name,url:uploadServerHost+thumimg}]
        }
        fromData.status = data.status;
        fromData.id = data.id;
        fromData.title = data.title;
        fromData.remark = data.remark;
        fromData.tabList = data.tab.length<1?[]:data.tab.map((itme)=>{return itme.id})
        fromData.ueContent =data.content; 
        fromData.cata_id = data.cid;
        fromData.btnType=1;
        this.setState({fromData})
      }else{
        fromData.btnType="暂无数据";
        this.setState({fromData})
      }
    })
  }
  componentDidMount(){
    this.getArticleDetail();
  }
  render(){
    let {fromData} = this.state
    return (
      <div className="editarticle-view">
         {fromData.btnType!==1?
         <div style={{textAlign:"center",marginTop:40}}>{fromData.btnType}</div>
         :<AddEditAddArticle {...this.props} fromData={fromData}/>}
      </div>
    )
  }
}