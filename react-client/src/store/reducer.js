import {
    USER_INFO,
    APP_TOKEN,
    AUTH_SHOW_TYPE
   } from "./action-type";

   import {combineReducers} from 'redux'
const initUserInfo = {
    authList: {},
    meunList: [],
    userId: "",
    user_type: "",
    username: "",
}
// authList: {}
// meunList: [{id: 1, name: "adminindex", path: "/admin", title: "首页", pid: 0, status: 1, sort: 1}]
// userId: 5
// user_type: 1
// username: "root"

 const UserInfo = (state=initUserInfo,action)=>{
    switch (action.type) {
        case USER_INFO:
            console.log(state)
            if(action.data){
                state = {...state, ...action.data}
                sessionStorage.setItem(USER_INFO,JSON.stringify(state))
            }else{
                state = {...state, ...initUserInfo}
                sessionStorage.removeItem(USER_INFO); 
            }
            return state
            // break;
        default:
            return  state
    }
}

const AppToken = (state="",action)=>{
    switch (action.type) {
        case APP_TOKEN:
            console.log(action)
            if(action.data){
                sessionStorage.setItem(APP_TOKEN,action.data)
            }else{
                sessionStorage.removeItem(APP_TOKEN);
            }
            return action.data||""
            // break;
        default:
               state = sessionStorage.getItem(APP_TOKEN);
               if(state===null||state===undefined){
                state = ""; 
               }
               return state;
    }
}

const AuthShowType =(state=true,action)=>{
    
    switch (action.type) {
        case AUTH_SHOW_TYPE:
            sessionStorage.setItem(AUTH_SHOW_TYPE,action.data)
            return action.data
            // break;
        default:
         state = sessionStorage.getItem(AUTH_SHOW_TYPE);
        if(!state||state==="false") {
            state = false
        }else{
            state = true;
        }
        return  state;
    }
}
export const reducers = combineReducers({
    UserInfo,AppToken,AuthShowType
})


