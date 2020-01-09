const model = imports("models/model");
module.exports = class {
    
     /**获取 all cate
         * @param {String|Number} status default 1 
     */
    static async findAll(option={}){
        try {
            let {page=1,limit=30,status=1,search_key} = option;
            var where = status!=0?{status}:{};
            if(search_key){
              
                where = Object.assign(where,{__complex:{"content|author_from|classify":["like",[`%${search_key}%`]],"_logic":"OR"}})
               
            }
            return await model.pageSelect({table:"tk_juzihui",where,limit:[page,limit]});
        } catch (error) {
            console.log(error.message)
            return await {errmsg:error.message}
        }
    }


     /**add tab
         * @param {object} options 
         * @param {string} name 
         * @param {string|Number}  status default 1 
     */
    static async add(options={}){
        let {content,status = 1,author_from,classify} = options;
        if(!content) return await {errmsg:"content is required"};
        try {
            var addData = {
                content,
                status,
                author_from,
                classify,
                dataTime:new Date().getTime()
            }
            var resInsert = await model.thenAdd({table:"tk_juzihui",values:addData},{content})
            if(resInsert.type=="exist") return await {errmsg:"name is content"}
            if(resInsert.type=="add") return await {data:resInsert.id,mssage:"add is success"};
            return  await {errmsg:"add is fail"};
        } catch (error) {
         return await {errmsg:"server is error"}   
        }
    }
     /** update tab
         * @param {object} options 
         * @param {string} name 
         * @param {string|Number}  status default 1 
     */
    static async update(options={}){
        var {id,content,status = 1,author_from,classify} =options;
        if(!id||!content) return await {errmsg:"id or content is required"}
         try {
             var res = await model.thenUpdate({table:"tk_juzihui",values:{content,author_from,classify,status},where:{id}},{id:["!=",id],content})
             if(res.type=="exist") return await {errmsg:"content is exist"};
             if(res.type=="update") return await {data:res.id,mssage:"update is success"}
             return await {errmsg:"udpate is fail"}
         } catch (error) {
            return await {errmsg:"server is error"}              
         }
    }


    /**update switch 
         * @param {array} data 
     */ 
    static async switch (data=[]) {
        if(!Array.isArray(data)||!data.length) return {errmsg:"data type is Array and required"}
        try {
            await model.updateMany({table:"tk_juzihui",values:data,where:{key:"id"}})
            return await {mssage:"update is success"};
          } catch (error) {
            return await {errmsg:"server is error"}      
          }
    }

    static async del(id){
        if(!id) return {errmsg:"id is require"};
        if(!Array.isArray(id)) id = [id];
        try {
            await model.delete({table:"tk_juzihui",where:{id:['IN',id]}})
            return await {mssage:"delete is success"};
        } catch (error) {
          console.log(error)
          return await {errmsg:"server is error"}           
        }
      }

  }
  
  