const {userAuth,roleAuth} = imports("Lib/permission")
// 拦截用户的角色认证
module.exports = class {
    @userAuth()
    @roleAuth()
    async __before__(ctx,next){}
}