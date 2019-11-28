const model = imports("models/model");

module.exports = class {
    
    // 根据一个角色查它的有效菜单(status=1)
    static async findRoleMenu(roleId='',status=""){
        if(typeof roleId=="string") roleId=[roleId]
        let where = {"mr.r_id":["in",roleId]};
        if(status!=="") where[`m.status`] =status;
        return model.select({table:"tk_menu as m",field:"m.*",where,
        join:{table:"tk_menu_role as mr",join:"right",on:"m.id=mr.m_id"},
        order:["m.sort"]});
    }
    // 根据状态查所有权限行为
    static async findAll(status){
        return await model.select({table:"tk_menu",where:{status},order:["sort"]});
    }   
    //添加
    static async add(options={}){
      var { name,title,path,status=1,pid=0,sort=100} = options;
        var values = { name,title,path,status,sort,pid,createtime:new Date().getTime() };
        try {
            var resInsert = await model.thenAdd({table:"tk_menu",values},{name,title,_logic: 'OR'})
            if(resInsert.type=="exist") return await {errmsg:"name or title is already exist"}
            if(resInsert.type=="add") return await {data:resInsert.id,mssage:"add is success"};
            return  await {errmsg:"添加失败"};
        } catch (error) {
            return await {errmsg:"server is error"} 
        }
    }
     //编辑
     static async update(options={}){
      var {id,name,title,path,status,sort} = options;
        var values  = { id,name,title,path,status,sort};
        try {
            var resInsert =await model.thenUpdate({table:"tk_menu",where:{id},values},{id:["!=",id],__complex:{name:name,title:title,_logic: 'OR'}});
            if(resInsert.type=="exist") return {errmsg:"name or name is already exist"};
            if(resInsert.type=="update") return  {data:resInsert.id,mssage:"update is success"};
            return await {errmsg:"update is fail"} 

        } catch (error) {
            return await {errmsg:"server is error"}            
        }
    }
     // 删除一个菜单
     static async delete(id){
      try {
          //1.先查是否存在适合的删除数据 (id,status = 2|停用状态)    
          // var resfind = await model.findOne({table:"tk_auth",where:{id}});
          var resfind = await model.select({table:"tk_menu",where:{id,pid:id,_logic: 'OR'}});
          if(resfind&&resfind.length==0)  return await {errmsg:"no data,删除失败"};
          if(resfind&&resfind.length>1)  return await {errmsg:"该菜单有下级菜单无法删除"};
          resfind = resfind.filter(itme=>itme.id==id)[0];
          if(resfind.status!=2) return await {errmsg:"处于正常状态无法删除"};
          var resR = await model.delete({table:"tk_menu_role",where:{"m_id":id},build:true});
          var resT = await model.delete({table:"tk_menu",where:{id},build:true});      
          // 执行事务（原子性）：
          await model.transaction([resR,resT]); 
          return await {mssage:"detele is success"};
      } catch (error) {
          return await {errmsg:"server is error"}      
      }

  }

}