const model = imports("models/model");
module.exports = class {

    /**获取 all 
        * @param {String|Number} status default 1 
    */
    static async findAll(option = {}) {
        try {
            let { page = 1, limit = 30, status = 1, search_key } = option;
            var where = status != 0 ? { status } : {};
            if (search_key) {

                where = Object.assign(where, { "keywords": ["like", `%${search_key}%`] });
            }
            let order = { sort: "desc", id: "desc" };
            return await model.pageSelect({ table: "tk_wordsreply", where, order, limit: [page, limit] });
        } catch (error) {
            console.log(error.message);
            return await { errmsg: error.message };
        }
    }

    /**add 
        * @param {object} options 
        * @param {string} name 
        * @param {string|Number}  status default 1 
    */
    static async add(options = {}) {
        let { keywords = "", reply = "", sort = 100, status = 1 } = options;
        if (!keywords || !reply) return await { errmsg: "keywords and reply is required" };
        try {
            var addData = {
                keywords,
                reply,
                sort,
                status,
                createtime: new Date().getTime()
            };
            var resInsert = await model.thenAdd({ table: "tk_wordsreply", values: addData }, { keywords });
            if (resInsert.type == "exist") return await { errmsg: "keywords is exist" };
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
        var { id, keywords, reply, status, sort } = options;
        if (!keywords || !reply) return await { errmsg: "keywords and reply is required" };
        try {
            var res = await model.thenUpdate({ table: "tk_wordsreply", values: { keywords, reply, status, sort }, where: { id } }, { id: ["!=", id], keywords });
            if (res.type == "exist") return await { errmsg: "keywords is exist" };
            if (res.type == "update") return await { data: res.id, mssage: "update is success" };
            return await { errmsg: "udpate is fail" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    /**update switch 
         * @param {array} data 
     */
    static async switch(data = []) {
        if (!Array.isArray(data) || !data.length) return { errmsg: "data type is Array and required" };
        try {
            await model.updateMany({ table: "tk_wordsreply", values: data, where: { key: "id" } });
            return await { mssage: "update is success" };
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    static async del(id) {
        if (!id) return { errmsg: "id is require" };
        if (!Array.isArray(id)) id = [id];
        try {
            await model.delete({ table: "tk_wordsreply", where: { id: ['IN', id] } });
            return await { mssage: "delete is success" };
        } catch (error) {
            console.log(error);
            return await { errmsg: "server is error" };
        }
    }

};