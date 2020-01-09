const {Controller,GET} = imports("Lib/router")
const roleBase = imports("Controller/admin/role_base")
const logsLoginModle = imports("models/tk_logslogin")

// 登录日志
@Controller("/logslogin")
class index extends roleBase{

    @GET("/")
    async findlogin(ctx,next){
        let option =  ctx.request.query;
       ctx.body = await ctx.send(await logsLoginModle.findAll(option))  
    }
  
   
}
module.exports = index;