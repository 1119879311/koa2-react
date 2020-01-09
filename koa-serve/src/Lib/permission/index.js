let { codeState } =imports("Middleware/ctxbody");
const TOKENS = imports("util/utilToken")


let utilUser = async (ctx,next)=>{
     let token =await ctx.header.authorization;
     if(!token)  return ctx.body =await  {code:codeState["NoToken"],mssage:"缺失令牌,请先登录",status:false};
     try {
         let res = await TOKENS.Get(token);
         ctx.state['userInfo'] = res["data"];
         ctx.set({"tokenField":"token","tokenValue":token});
     } catch (err) {
         return ctx.body =await  {code:codeState["NoToken"],mssage:"令牌失效,请退出重新登录",status:false};
     }
     return await next()
}

let utilRole =async (ctx,next)=>{

    var {userId,user_type} = ctx.state.userInfo;
    if(user_type==1) return await next();//如果是超级管理用户直接跳过；

    var urlAuth = ctx.path.replace(/(\/)?$/,"/");
    var roleId = await ctx.Model.select({table:"tk_role as r",field:"r.id",where:{"ur.u_id":userId,"r.status":1},
          join:{table:"tk_user_role as ur",join:"right",on:"ur.r_id=r.id"}})
    if(!roleId|| !roleId.length) return ctx.body =await {status:false,mssage:"sorry,你无权操作",code:codeState["NoAuth"]};
   
    roleId = roleId.map(itme=>itme.id);
    var resAuth = await ctx.Model.findOne({table:"tk_auth as a",field:"a.url",where:{"ra.r_id":["in",roleId],"a.url":urlAuth,"a.status":1},
        join:{table:"tk_role_auth as ra",join:"right",on:"a.id=ra.a_id"}});
  
    if(resAuth&&resAuth.url)  return await next();
    return ctx.body =await {code:codeState["NoAuth"],mssage:"sorry,你无权操作",status:false}
}

const userAuth = ()=>{
    return (target,value,dec)=>{
        let fn = dec.value;
        dec.value = async (ctx,next)=>{
            let token =await ctx.header.authorization;
            if(!token)  return  {code:codeState["NoToken"],mssage:"缺失令牌,请先登录",status:false};
            try {
                let res = await TOKENS.Get(token);
                ctx.state['userInfo'] = res["data"];
                ctx.set({"tokenField":"token","tokenValue":token});
            } catch (err) {
                return await  {code:codeState["NoToken"],mssage:"令牌失效,请退出重新登录",status:false};
            }
            return  await fn.call(target,ctx,next);
        }
    }
}

const roleAuth = ()=>{
    return (target,value,dec)=>{
        let fn = dec.value;
        dec.value = async (ctx,next)=>{
            var {userId,user_type} = ctx.state.userInfo;
            if(user_type==1) return await fn.call(target,ctx,next);//如果是超级管理用户直接跳过；
        
            var urlAuth = ctx.path.replace(/(\/)?$/,"/");
            var roleId = await ctx.Model.select({table:"tk_role as r",field:"r.id",where:{"ur.u_id":userId,"r.status":1},
                  join:{table:"tk_user_role as ur",join:"right",on:"ur.r_id=r.id"}})
            if(!roleId|| !roleId.length) return {status:false,mssage:"sorry,你无权操作",code:codeState["NoAuth"]};
           
            roleId = roleId.map(itme=>itme.id);
            var resAuth = await ctx.Model.findOne({table:"tk_auth as a",field:"a.url",where:{"ra.r_id":["in",roleId],"a.url":urlAuth,"a.status":1},
                join:{table:"tk_role_auth as ra",join:"right",on:"a.id=ra.a_id"}});
            
            if(resAuth&&resAuth.url)  return await fn.call(target,ctx,next);
            return {code:codeState["NoAuth"],mssage:"sorry,你无权操作",status:false}
        }
    }
}

module.exports = {
    userAuth,roleAuth,utilUser,utilRole
}


