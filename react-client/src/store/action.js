import {
     USER_INFO,
     APP_TOKEN,
     AUTH_SHOW_TYPE
    } from "./action-type";

//更新用户基本信息    
export const UpdateUserInfo = (data)=>{
     return (dispatch)=>{
          dispatch({
               type:USER_INFO,
               data:data,
          })
     }
}

// 更新appToken
export const UpdateAppToken = (data)=>{
     return {
          type:APP_TOKEN,
          data:data,
     }
     
}
// 切换更新 权限按钮类型: 显示、隐藏
export const ToggleAuthShowType = ()=>{
     return (dispatch,getState)=>{
          dispatch({
               type:AUTH_SHOW_TYPE,
               data:!!!(getState().AuthShowType),
          })
     }
}



    
