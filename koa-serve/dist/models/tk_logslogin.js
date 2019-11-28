
const model = imports("models/model");
const request = imports("util/request");

module.exports = class {

    /**find all logsLogin
     * @param {object} options 
     * @param {string}  login_name     //登录名
     * @param {string}  start_time   //开始时间
     * @param {string}  end_time     //结束时间
     * @param {number}  page 
     * @param {number}  limit
     * 
     * 
     */
    static async findAll(options = {}) {
        var { login_name = '', page = 1, limit = 15 } = options;
        var where = {};
        login_name ? where[`login_name`] = login_name : '';
        try {
            return await model.pageSelect({
                table: "tk_logslogin",
                order: "id desc",
                limit: [page, limit],
                where: where
            });
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }
    /**add logsLogin
        * @param {object} options 
        * @param {string} login_name 
        * @param {string}  login_ip 
        * 
    */
    static async add(options = {}) {
        let { login_name, login_ip } = options;
        try {
            let login_address = await this.getIpAddress(login_ip);
            let values = { login_name, login_ip, login_address, login_time: new Date().getTime() };
            return await model.add({ table: "tk_logslogin", values });
        } catch (error) {
            return await { errmsg: "server is error" };
        }
    }

    static async getIpAddress(ip) {
        if (!ip) return '';
        try {
            var webKey = "6785506b6676ac1c290daaead359ca27";
            var url = `https://restapi.amap.com/v3/ip?key=${webKey}&ip=${ip}`;
            var res = await request.get(url);
            res = JSON.parse(res);
            return res['province'] + res['city'];
        } catch (error) {
            console.log(error);
            return '';
        }
    }

};