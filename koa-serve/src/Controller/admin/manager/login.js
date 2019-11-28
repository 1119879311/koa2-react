const {Controller,POST} = imports("Lib/router")
const { Aes,getClientIp}  = imports("util/heper");
const { expiresIn}  = imports("Config");
const TOKENS = imports("util/utilToken")
const logsLoginModle = imports("models/tk_logslogin")

@Controller()
class index{

    @POST("/login") 
    async findUser(ctx,next){
        var { name,password } = ctx.request.body; 
        if(!name||!password) return ctx.body = await ctx.error("登录失败，用户名和密码不能为空")
        var res = await ctx.Model.findOne({table:"tk_user",where:{name,password:Aes.aesEncrypt(password)}});
        if(!res){ //用户是否存在
            return ctx.body = await ctx.error("登录失败，用户名或者密码错误")
        }
        if(res.status!=1&& res.user_type!=1){ //用户是否启用(超级用户除外)
            return ctx.body = await ctx.error("你的账号已冻结禁止登陆，请联系超级管理员")
        }

        try {
            await logsLoginModle.add({login_name:res.name,login_ip:getClientIp(ctx.request)});
        } catch (error) { }
        //签发token
        var data = {user_type:res.user_type,username:res.name,userId:res.id,expiresIn:new Date().getTime()+expiresIn};
        var token =await TOKENS.Set(data);
        data["token"] =token;
        ctx.body = await ctx.success({data});
    
    }

}
module.exports = index;