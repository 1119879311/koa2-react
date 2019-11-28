
export default {
  getUserInfo(){
    let {authList={},user_type=""} = JSON.parse(sessionStorage.getItem("userInfo"))||{};
    return {authList,user_type}
   },
   verifyAuth(userInfo,authName){
     let {user_type,authList} = userInfo;
     return user_type===1||authList[authName];
   }
}