const {Controller,GET,POST} = imports("Lib/router")
const {userAuth,roleAuth} = imports("Lib/permission")
const juziModel = imports("models/tk_juzihui")
@Controller("/juzi")
class index{
     /**获取所有
     *@param body { status,searchkey,}
     *@param  return {code,mssage/errmsg,data,status} 
    */

    @GET("/")
    async findAll(ctx,next){
       
       return  await ctx.send( await juziModel.findAll(ctx.request.query));
    }

    @userAuth()
    @roleAuth()
    @POST("/add")
    async add(ctx,next){
       ctx.body= await ctx.send( await juziModel.add(ctx.request.body) )
    }

      //单个/批量修改状态
    /**
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */
    
    
    @userAuth()
    @roleAuth()
    @POST("/swtich")
    async swtich(ctx,next){
        var {data} = ctx.request.body;
        return ctx.body= await ctx.send( await juziModel.switch(data) )
    }

    //单个更新
    @userAuth()
    @roleAuth()
    @POST("/update")
    async update(ctx,next){
        ctx.body= await ctx.send( await juziModel.update(ctx.request.body) )      
    }

    // 删除一个/批量
    @userAuth()
    @roleAuth()
    @POST("/delete")
    async del(ctx,next){
        var {id} = ctx.request.body;
        ctx.body= await ctx.send( await juziModel.del(id) )
    }
    
}
module.exports = index;