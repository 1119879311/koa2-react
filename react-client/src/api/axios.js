import axios from "axios";
import * as apiUrl from "./url";
import { message} from 'antd';

const Axios = axios.create({
  baseURL:apiUrl.baseUrl
})
//拦截请求

Axios.interceptors.request.use(function (req) {
    try {
        var token = sessionStorage.getItem("APP_TOKEN")  
    } catch (error) {
         token = "";
    }
    req.headers.Authorization = token;
    return req;
}, function (error) {
   
    return Promise.reject(error);
});

// 服务器返回的数据状态code:
// "Error":-104,    //操作失败错误提示
// "NoToken":-102, //缺失或者过期token 
// "NoAuth":-103, //无权限操作
// "Success":200 //操作成功
//拦截响应
Axios.interceptors.response.use(function (res) {
    var {code} = res.data;
    if(code===-102){
        message.error(res.data.mssage||"登录失效，请重新登录")
        // message.error({message:"登录失效，请重新登录",type:"error",duration:800})
    }else if(code===-103){
        //   Message({message:"你没权限操作",type:"warning"});
        // message.error(res.data.mssage||"你没权限操作")
        return res;
    }else if(code==='-104'){
        return res;
        //   Message({message:errmsg||"操作失败",type:"warning"});
    }else{
        return res;
    }
  
  }, function (error) {
    message.error("sorry,服务器跑路啦")
    return Promise.reject(error);
  });

function POST(apiName,data={}){
    var urls = apiUrl[apiName]?apiUrl[apiName]:apiName;
    return Axios({method: "post",url: urls,data:data});
}
function GET(apiName,data={}){
    var urls = apiUrl[apiName]?apiUrl[apiName]:apiName;
    return Axios({method: "GET",url: urls,params:data});
}
const ajax = {POST,GET}
export default ajax
// export default {
//     POST,GET,Axios
// }