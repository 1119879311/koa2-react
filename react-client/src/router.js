import React from 'react'
import Loadable from 'react-loadable'
import LoadingComp from './component/loading';


const MyLoadingComponent = ({ isLoading, error }) => {
  if (isLoading) {
      return <LoadingComp/>
  }
  else if (error) {
      return <div style={{"textAlign":"center",margin:"20px","fontSize":"20px"}}>Sorry, there was a problem loading the page.</div>
  }
  else {
      return null;
  }
};

// 登录
export const AsyncLogin = Loadable({loader: () => import('./pages/login'), loading: MyLoadingComponent});
//404页面
export const AsyncError = Loadable({loader: () => import('./pages/error'), loading: MyLoadingComponent});


export const allRouter =  [
    // 1. 首页
    { 
        path:"/admin",
        component:Loadable({loader: () => import('./pages/home'), loading: MyLoadingComponent}) ,
        title:"首页",
        name:"adminindex"
    },
    // 2.系统管理
    // 2.1 管理员管理
    { 
        path:"/admin/rbacUser",
        component:Loadable({loader: () => import('./pages/rbac/user/user'), loading: MyLoadingComponent}) ,
        title:"管理员",
        name:"rbacUser",
        isAuthName:"rbacUser"
    },
    // 2.2 角色管理
    {
         path:"/admin/rbacRole",
         component:Loadable({loader: () => import('./pages/rbac/role/role'), loading: MyLoadingComponent}) ,
         title:"角色管理",
         name:"AsynRole",
         isAuthName:"rbacRole"
    },
    // 2.3 权限管理
    {
         path:"/admin/rbacAuth",
         component:Loadable({loader: () => import('./pages/rbac/auth/auth'), loading: MyLoadingComponent}) ,
         title:"权限管理",
         name:"AsyncAuth",
         isAuthName:"rbacAuth"
    },
     // 2.4 菜单管理
     {
        path:"/admin/rbacMenu",
        component:Loadable({loader: () => import('./pages/rbac/menu/menu'), loading: MyLoadingComponent}) ,
        title:"菜单管理",
        name:"AsyncMenu",
        isAuthName:"rbacMenu"
   },
    // 3.内容管理
    // 3.1 帖子管理
    { 
        path:"/admin/cmsArticle",
        component:Loadable({loader: () => import('./pages/cms/artcile/artcile'), loading: MyLoadingComponent}) ,
        title:"帖子管理",
        name:"cmsArticle",
        isAuthName:"cmsArticle"
    },
    // 添加帖子
    { 
        path:"/admin/cmsarticleadd",
        component:Loadable({loader: () => import('./pages/cms/artcile/AddArticle'), loading: MyLoadingComponent}) ,
        title:"添加帖子",
        name:"cmsArticleAdd",
        isAuthName:"artcleadd"
    },
    // 编辑帖子
    { 
        path:"/admin/cmsarticle/:id",
        component:Loadable({loader: () => import('./pages/cms/artcile/EditArticle'), loading: MyLoadingComponent}) ,
        title:"编辑帖子",
        name:"cmsArticleEdit",
        isAuthName:"artcleedit"
    },
    // 3.2 分类管理
    { 
        path:"/admin/cmsCate",
        component:Loadable({loader: () => import('./pages/cms/cate/cate'), loading: MyLoadingComponent}) ,
        title:"分类管理",
        name:"AsyncCate",
        isAuthName:"cmsCate"
    },
    // 3.3 标签管理
    { 
        path:"/admin/cmsTab",
        component:Loadable({loader: () => import('./pages/cms/tabs/tabs'), loading: MyLoadingComponent}) ,
        title:"标签管理",
        name:"AsyncTabs",
        isAuthName:"cmsTab"
    },
    // 4.推广管理
    // 4.1 分配微信号
    { 
        path:"/admin/distribWxnumber",
        component:Loadable({loader: () => import('./pages/populariz/distribwxnumber'), loading: MyLoadingComponent}),
        title:"分配微信号",
        name:"distribWxnumber",
        isAuthName:"distribWxnumber"
    },
    // 5.日志管理
    // 5.1 登录日志
    { 
        path:"/admin/logslogin",
        component:Loadable({loader: () => import('./pages/logs/logsLogin'), loading: MyLoadingComponent}),
        title:"登录日志",
        name:"logslogin",
        isAuthName:"logslogin"
    },
      // 5.日志管理
    // 5.1 精美句子
    { 
        path:"/admin/resourcejuzi",
        component:Loadable({loader: () => import('./pages/resource/juzi'), loading: MyLoadingComponent}),
        title:"精美句子",
        name:"resourcejuzi",
        isAuthName:"resourcejuzi"
    },
     // 5.2 云盘资源
     { 
        path:"/admin/cloudresources",
        component:Loadable({loader: () => import('./pages/resource/cloudres'), loading: MyLoadingComponent}),
        title:"云盘资源",
        name:"cloudresources",
        isAuthName:"cloudres"
    },
    // 微信管理
    // 1.公众号关键词自动回复
    { 
        path:"/admin/keywordsreply",
        component:Loadable({loader: () => import('./pages/wxPublic/keywordsreply'), loading: MyLoadingComponent}),
        title:"关键词回复",
        name:"keywordsreply",
        isAuthName:"keywordsreply"
    }
  ]