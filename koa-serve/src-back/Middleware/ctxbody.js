// 自定义状态
const codeState =  {
    "Error":-104,
    "NoToken":-102,
    "NoAuth":-103,
    "Success":200
}
// 定义接口返回的规范:至少四个字段：
// 成功返回：
/*
{status:true,code:200,mssage:"",data:""}
*/ 
// 失败返回：（包括：参数验证失败，缺失token,token 过期 等场景）
/*
 {status:false,code:code ,errmsg:"",data:""}
*/ 

 let success =(option={})=>{
  var res =  {status:true,code:codeState["Success"],mssage:"handle is success",data:""};
  if(typeof option =="string"){
     res['mssage'] = option;
     return res;
  }
  return Object.assign(res,option||{})
}

let error =(option={})=>{
    var res =  {status:false,code:codeState["Error"],mssage:"handle is fail",data:""};
    if(typeof option =="string"){
         res['mssage'] = option;
         return res;
    }
    if(option&&option.errmsg)  res['mssage'] = option.errmsg;
    delete option.errmsg;
    return Object.assign(res,option||{})
}

let send = (option={})=>{
    var res =  {status:true,code:codeState["Success"],mssage:"handle is success",data:""};
    if(typeof option =="string"){
        res['mssage'] = option;
        return res;
    }
    if(option.errmsg||option.status==false){
        var res =  {status:false,code:codeState["Error"],mssage:option.errmsg||"handle is fail",data:""};
    }
    delete option.errmsg
    return Object.assign(res,option||{})
}

module.exports = {
    success,error,send,codeState
}