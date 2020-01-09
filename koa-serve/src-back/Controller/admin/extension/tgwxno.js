const {Controller,POST,GET} = imports("Lib/router")
const {userAuth,roleAuth} = imports("Lib/permission")
const wxnoModel = imports("models/wxno")
@Controller("/extension")
class index{
     /**
   * 根据概率随机一个wxno
   * @param {*} ctx 
   * @param {*} next 
   */
    @GET("/getRadomWxno") 
    async getRadomWxno(ctx,next){
        ctx.body = await ctx.send( await wxnoModel.getRadomWxno(ctx));
    }
        /**
   *获取域名与后缀
   * @param {*} ctx 
   * @param {*} next 
   */
    @GET("/getHostPath") 
    @userAuth()
    @roleAuth()
    async getHostPath(ctx,next){
      ctx.body = await ctx.send( await wxnoModel.getHostPathWxno());
        
    }
        /**
   * 保存和编辑域名与后缀
   * @param {*} ctx 
   * @param {*} next 
   */
    @POST("/saveHostPath") 
    @userAuth()
    @roleAuth()
    async saveHostPath(ctx,next){
      ctx.body = await ctx.send( await wxnoModel.saveHostPath(ctx.request.body));

    }
      /**
   * 保存和编辑微信
   * @param {*} ctx 
   * @param {*} next 
   */
    @POST("/saveWxno") 
    @userAuth()
    @roleAuth()
    async saveWxno(ctx,next){
      let {name,path_id,host_id}=ctx.request.body;
      if(!name)  return ctx.error("name is require");
      if(!path_id)  return ctx.error("path_id is require");
      if(!host_id)  return ctx.error("path_id is require");
      ctx.body = await ctx.send( await wxnoModel.saveWxno(ctx.request.body));        
    }
      /**
   * 删除一个微信
   * @param {*} ctx 
   * @param {*} next 
   */
    @POST("/delWxno") 
    @userAuth()
    @roleAuth()
    async delWxno(ctx,next){
      ctx.body = await ctx.send( await wxnoModel.delWxno(ctx.request.body));        
        
    }
}
module.exports = index;