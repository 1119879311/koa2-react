import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import {Menu, Icon,message,Button,Spin  } from 'antd';
import axios  from '../../../api/axios'
import "./index.css"
import AddEditMeun from "./AddEditMeun";
import AuthBotton from "../../../component/authButton/indexs";

const { SubMenu } = Menu;

// let menuDatas = [   
//   {"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0,"children":[]},
//   {"path":"/admin/cms","name":"cms","title":"内容管理","id":5,"pid":0,"children":
//       [
//           {"path":"/admin/cmsArticle","name":"article","title":"帖子管理","id":6,"pid":5,"children":[]},
//           {"path":"/admin/cmsCate","name":"cate","title":"分类管理","id":7,"pid":5,"children":[]},
//           {"path":"/admin/cmsTab","name":"tab","title":"标签管理","id":8,"pid":5,"children":[]}
//       ]
//   },
//   {"path":"/admin/rbac","name":"rbac","title":"系统管理","id":1,"pid":0,"children":
//       [
//           {"path":"/admin/rbacUser","name":"user","title":"管理员","id":2,"pid":1,"children":[]},
//           {"path":"/admin/rbacRole","name":"role","title":"角色管理","id":3,"pid":1,"children":[]},
//           {"path":"/admin/rbacAuth","name":"auth","title":"权限管理","id":4,"pid":1,"children":[]}
//       ],   
//   },
//   {"path":"/admin/populariz","name":"populariz","title":"推广管理","id":9,"pid":0,"children":
//       [
//           {"path":"/admin/distribWxnumber","name":"wxnumber","title":"分配微信号","id":10,"pid":9,"children":[]},
//       ],   
//   },
  
// ];
// const meunIndex = [{"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0}];

 class menuView extends Component {
  constructor(props){
    super(props)
    this.state =  {
      loading:false,
      menuAllList:[],
      pathname: [],
      modalTitle:"",
      addEditMeunIshow:false, //添加、编辑的弹窗的开关
      meunFromData:{id:"", path:"", name:"", title:"", status:"",sort:100,pid:0,btnType:""}
    };
  }
  // 获取菜单列表数据所有
  getAllMenuData(){
    this.setState({loading:true})
    axios.GET("rbacMenu").then( async result=>{
      this.setState({loading:false})

      var  {status,data} = result.data;
      if(status){
       await this.setState({menuAllList:data})
      }
    }).catch(error=>{
      console.log()
    })
  }
  componentWillMount(){
    this.getAllMenuData();
  }
  // 展开一级，显示二级
  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.pathname.indexOf(key) === -1);
    this.setState({
      pathname: latestOpenKey ? [latestOpenKey] : [],
    });
    
  }
  // 编辑菜单(一级，二级)
  handleEditBtn=(e,rows)=>{//e：事件对象； rows:操作的列
    e.stopPropagation()
    let meunFromData = JSON.parse(JSON.stringify(rows));//不建议直接赋值，对象引用关系
    meunFromData['btnType']="edit";
    this.setState({meunFromData,modalTitle:"编辑菜单",addEditMeunIshow:true})
  }
  // 添加菜单 (一级，二级)
  handleAddBtn=(e,rows)=>{//e：事件对象；rows:操作的列
    e.stopPropagation()  
    let modalTitle="";
    let meunFromData={id:"", path:"", name:"", title:"",sort:100, status:1,pid:0,btnType:"add"};
    if(rows){ //添加二级菜单
      modalTitle="添加二级菜单"
      meunFromData['pid'] = rows.id;
    }else{ //添加一级菜单
      modalTitle="添加一级菜单"
    }
    this.setState({meunFromData,modalTitle,addEditMeunIshow:true})
  }
  // 删除菜单
  handleDel=(e,rows)=>{
    e.stopPropagation()  
    console.log(rows)
    // if(rows.children&&rows.children.length){
    //   return  message.error("该菜单有下级菜单无法删除");      
    // }
    if(rows.status===1){
      return  message.error("该菜单处于正常状态无法删除,请编辑为禁用状态");      
    }
    var resConfirm = window.confirm("你确定删除该菜单吗")
    if(!resConfirm) return;
    axios.POST("rbacMenuDel",{id:rows.id}).then(result=>{
     
      var  {status,mssage} = result.data;
      if(status){
         message.success(mssage||"操作成功");
         this.getAllMenuData();
      }else{
         message.error(mssage||"操作失败");
      }
    }).catch(error=>{
      console.log(error)
    })

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
  //递归迭代树状菜单数据，itme
  MenuItme = (itmeData)=>{
    return itmeData.map(itmes=>{
      if(itmes.children&&itmes.children.length){
      return <SubMenu
         key={itmes.name}
         title={
           <div className="my-menu-itme">
             <div className="left">
                 <Icon type="appstore" />
                 <span>{itmes.title}&nbsp;&nbsp;({itmes.status!==1?<font style={{color:"red"}}>禁用</font>:<font style={{color:"#1DA57A"}}>正常</font>})</span>
             </div> 
             <div className="operation">
               {itmes.pid === 0?
               <AuthBotton  
               authname="menuadd" 
               onClick={e=>this.handleAddBtn(e,itmes)}   
               className="select-main-btn" 
                type="primary" size="default"> 添加二级菜单 </AuthBotton>:""}
               &nbsp;&nbsp;&nbsp;

               <AuthBotton 
                authname="menuedit" 
               onClick={e=>this.handleEditBtn(e,itmes)}  
               className="select-main-btn"  
               type="primary" size="default"> 编辑 </AuthBotton>
               &nbsp;&nbsp;&nbsp;

               <AuthBotton
                authname="menudel" 
                onClick={(e) => this.handleDel(e,itmes)} 
                 className="select-main-btn" 
                  type="danger" size="default"> 删除 </AuthBotton>
             </div>        
           </div>
         }>  
         {this.MenuItme(itmes.children)}
     </SubMenu>
      }else{
       return (
         <Menu.Item key={itmes.path}>
              <div className="my-menu-itme">
                <div className="left">
                    <Icon type="appstore" />
                    <span>{itmes.title}&nbsp;&nbsp;({itmes.status!==1?<font style={{color:"red"}}>禁用</font>:<font style={{color:"#1DA57A"}}>正常</font>})</span>
                </div>
                <div className="operation">
                  {itmes.pid === 0&&itmes.title!=="首页"?
                  <AuthBotton 
                    authname="menuadd" 
                   onClick={e=>this.handleAddBtn(e,itmes)} 
                   className="select-main-btn" 
                    type="primary" size="default"> 添加二级菜单 </AuthBotton>:""}
                &nbsp;&nbsp;&nbsp;
                
                <AuthBotton 
                 authname="menuedit" 
                  onClick={e=>this.handleEditBtn(e,itmes)} 
                  className="select-main-btn"   type="primary"
                   size="default"> 编辑 </AuthBotton>
               &nbsp;&nbsp;&nbsp;
               
               <AuthBotton 
                   authname="menudel" 
                  onClick={(e) => this.handleDel(e,itmes)}
                    className="select-main-btn"  type="danger" 
                    size="default"> 删除 </AuthBotton>               
                </div>         
              </div>
          </Menu.Item>
        )
      }
     
    })
 }

  render() {
    return (
      <div className="menu-view">
      
       
          <div style={{ borderBottom: '1px solid #E9E9E9',padding:'4px 0 8px' }}>
            <AuthBotton 
             authname="menuadd" 
             onClick={e=>this.handleAddBtn(e,0)} 
             className="select-main-btn" 
              type="primary" size="default"> 添加一级菜单 </AuthBotton>
              &nbsp;&nbsp;&nbsp;
             <Button type="primary" icon="sync" onClick={()=>this.getAllMenuData()}>刷新</Button>

          </div>
          {/* 菜单列表 */}
          <Spin spinning={this.state.loading} >
          <Menu
            mode='inline'
            theme='light'
            selectedKeys={this.state.pathname}
            openKeys={this.state.pathname}
            onOpenChange={this.onOpenChange}
          >
          {this.MenuItme(this.state.menuAllList)}
          </Menu>
          </Spin >
         
          {/* 添加菜单弹窗 */}
          <AddEditMeun
            meunFromData={this.state.meunFromData}
            addEditMeunIshow={this.state.addEditMeunIshow}
            modalTitle={this.state.modalTitle}
            handleAsynChange={this.handleAsynChange.bind(this)} 
            getAllMenuData={this.getAllMenuData.bind(this)}
          />
      </div>
    );
  }
}

export default withRouter(menuView)