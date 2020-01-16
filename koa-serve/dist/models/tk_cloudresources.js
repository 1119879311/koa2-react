const model = imports("models/model");
module.exports = class {

    /**获取 all 
        * @param {String|Number} status default 1 
    */
    static async findAll(option = {}) {
        try {
            let { page = 1, limit = 30, status, search_key, url, ext, has_pwd } = option;
            var where = status != 0 ? { status, url, ext, has_pwd } : { url, ext, has_pwd };
            if (search_key) {
                where = Object.assign(where, { "context": ["like", `%${search_key}%`] });
            }
            let order = { id: "desc" };
            return await model.pageSelect({ table: "tk_cloudresources", where, order, limit: [page, limit] });
        } catch (error) {
            console.log(error.message);
            return await { errmsg: error.message };
        }
    }

    /**add tab
        * @param {object} options 
        * @param {string} name 
        * @param {string|Number}  status default 1 
    */
    static async add(options = {}) {
        let { context, url, ext, has_pwd, user, status = 1 } = options;
        if (!context || !url) return await { errmsg: "context and url is required" };
        try {
            var addData = {
                context, url, ext, has_pwd, user, status,
                createdAt: new Date().getTime()
            };
            var resInsert = await model.thenAdd({ table: "tk_cloudresources", values: addData }, { context, url });
            if (resInsert.type == "exist") return await { errmsg: "context and url is exist" };
            if (resInsert.type == "add") return await { data: resInsert.id, mssage: "add is success" };
            return await { errmsg: "add is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }
    /** update tab
        * @param {object} options 
        * @param {string} name 
        * @param {string|Number}  status default 1 
    */
    static async update(options = {}) {
        let { id, context, url, ext, has_pwd, user, status = 1 } = options;
        // var {id,content,status = 1,author_from,classify} =options;
        if (!id || !context || !url) return await { errmsg: "id and context and url is required" };
        try {
            var res = await model.thenUpdate({ table: "tk_cloudresources", values: { context, url, ext, has_pwd, user, status }, where: { id } }, { id: ["!=", id], context, url });
            if (res.type == "exist") return await { errmsg: "context and url  is exist" };
            if (res.type == "update") return await { data: res.id, mssage: "update is success" };
            return await { errmsg: "udpate is fail" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }

    /**update switch 
         * @param {array} data 
     */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_cloudresources", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    static async del(id) {
        if (!id) return { errmsg: "id is require" };
        if (!Array.isArray(id)) id = [id];
        try {
            await model.delete({ table: "tk_cloudresources", where: { id: ['IN', id] } });
            return await { mssage: "delete is success" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }

};