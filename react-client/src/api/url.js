const serverApi = process.env.NODE_ENV ==="production"?"https://wx.bylives.com":"http://127.0.0.1:9000";
export let uploadServerHost = serverApi
export let baseUrl = serverApi+"/api";

//1.0登录 
export let adminLogin = `/login`;
export let adminCode = "/code"
// 管理员个人中心
// 1.1 修改密码
export let modifyUserpwd = `/managerCenter/modifypwd`;
export let getManagerRole = `/managerCenter/getManagerRole`;

// 推广管理
export let saveHostPath = `/extension/saveHostPath`;
export let getHostPath = `/extension/getHostPath`;
export let saveWxno = `/extension/saveWxno`;
export let getRadomWxno = `/extension/getRadomWxno`;
export let delWxno = `/extension/delWxno`;

//---------cms
//----cms:article
export let cmsArticle = `/post`; 
export let cmsDetail = `/post/detail`;
export let cmsArticleAdd = `/post/add`;
export let cmsArticleUpdate = `/post/update`;
export let cmsArticleSwtich= `/post/swtich`;
export let cmsArticleDel= `/post/delete`;
export let cmsGroupType = `/post/groupType`;


//----cms:tab
export let cmsTab = `/tab`;
export let cmsTabAdd = `/tab/add`;
export let cmsTabUpdate = `/tab/update`;
export let cmsTabSwtich = `/tab/swtich`;
export let cmsTabDel = `/tab/delete`;
//----cms:cate
export let cmsCate = `/cate`;
export let cmsCateAdd = `/cate/add`;
export let cmsCateUpdate = `/cate/update`;
export let cmsCateSwtich = `/cate/swtich`;
export let cmsCateDel = `/cate/delete`;


//图片上传 
export let uploadArticleUe= `/post/uploadueimg`; 
export let uploadArticleThum= `/post/uploadThum`; 

// rbac :user
export let rbacUser = `/manager`; //查找用户
export let rbacUserAdd = `/manager/add`; //添加用户
export let rbacUserUpdate = `/manager/update`; //编辑用户
export let rbacUserSwtich = `/manager/swtich`; //开启/禁用用户状态
export let rbacUserDel = `/manager/delete`; //删除用户
export let rbacUserAssginRole= `/manager/assginRole`; //分配角色
export let rbacUserShowpass= `/manager/showpass`;//查看密码




// rbac:role 
export let rbacRole = `/role`;
export let rbacRoleAdd = `/role/add`;
export let rbacRoleUpdate = `/role/update`;
export let rbacRoleSwtich = `/role/swtich`;
export let rbacrRoleAssginAuth = `/role/assginAuth`;
export let rbacrRoleAssginMenu = `/role/assginMenu`;
export let rbacRoleDel = `/role/delete`;


// rbac:auth
export let rbacAuth = `/auth`;
export let rbacAuthAdd = `/auth/add`;
export let rbacAuthUpdate = `/auth/update`;
export let rbacAuthSwtich = `/auth/swtich`;
export let rbacAuthDel = `/auth/delete`;

// rbac:menu
export let rbacMenu = `/menu`;
export let rbacMenuAdd = `/menu/add`;
export let rbacMenuUpdate = `/menu/update`;
export let rbacMenuDel = `/menu/delete`;

// 管理日志
//  1.登录日志
export let logsLogin = `/logslogin`;


// 资源管理模块

// 句子管理
export let resourcejuzi = `/juzi`;
export let juziAdd = `/juzi/add`;
export let juziUpdate = `/juzi/update`;
export let juziSwtich = `/juzi/swtich`;
export let juziDel = `/juzi/delete`;

// 云盘资源
export let cloudresources = `/cloudresources`;
export let cloudresAdd = `/cloudresources/add`;
export let cloudresUpdate = `/cloudresources/update`;
export let cloudresSwtich = `/cloudresources/swtich`;
export let cloudresDel = `/cloudresources/delete`;


// 微信管理模块

// 公众号关键词回复
export let keywordsReply = `/keywordsReply`;
export let keywordsReplyAdd = `/keywordsReply/add`;
export let keywordsReplyUpdate = `/keywordsReply/update`;
export let keywordsReplySwtich = `/keywordsReply/swtich`;
export let keywordsReplyDel = `/keywordsReply/delete`;

