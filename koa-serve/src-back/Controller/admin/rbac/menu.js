const {Controller,POST,GET} = imports("Lib/router")
const menuModel = imports("models/menu");
const logicMenu = imports("logic/menu");
const {recurMany} = imports("util/heper")

const roleBase = imports("Controller/admin/role_base")

// 该模块属于权限管理的角色模块，所有请求需要授权

@Controller("/menu")
class index extends roleBase{


    /**获取所有菜单
     * @param body {  id,status}
     *@param  return {code,mssage/errmsg,data,status} 
    */
    @GET("/")
    async find(ctx,next){
        let {status,roleId} = ctx.request.query;
        // 查询所有的权限行为
        // 根据角色id 刷选除对应的菜单
        if(roleId){
            var data = await menuModel.findRoleMenu(roleId,status);
        }else{
            var data = await menuModel.findAll(status);
            data = recurMany(data);
        }
      
        ctx.body =await ctx.send({data})
      
    }

    /**添加 菜单行为
     * @param POST /menu/add
     * @param body 
    * @param return {code,mssage/errmsg,data,status}
     **/ 

    @POST("/add") 
    async add(ctx,next){
        var { name,title,path} = ctx.request.body;
        var validRes = await logicMenu.veryMenu({name,path,title});
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body =await ctx.send(await menuModel.add(ctx.request.body))
       
    }
    /**修改菜单
     * @param POST /auth/update
     * @param body { id, name,identName,url,status,groupName}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/update") 
    async update(ctx,next){
        var {id, name,title,path} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
       // 数据验证
        var validRes = await logicMenu.veryMenu({name,title,path});
       if (validRes) return ctx.body = await ctx.error(validRes);
       ctx.body =await ctx.send(await menuModel.update(ctx.request.body))

    }
    /**删除菜单
     * @param POST /menu/delete
     * @param body { id}
     * @param return {code,mssage/errmsg,data,status}
     **/ 
    @POST("/delete")  //删除role
    async delete(ctx,next){
        let {id} = ctx.request.body;
        if(!id) return  ctx.body =await ctx.error("id  is required"); 
        ctx.body =await ctx.send(await menuModel.delete(id))
      
    }

   
}
module.exports = index;