const model = imports("models/model");
const { recurMany, weightAllocation, dataFormat } = imports("util/heper");
function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
}
module.exports = class {
  /**
   * 保存(添加或者编辑) tk_hostpath 表的数据
   * @param {*} options 
   */
  static async saveHostPath(options) {
    var { id, name, pid = 0, status = 1 } = options;
    if (!name) return { errmsg: "name is require" };
    //如果有id 则为编辑
    //如果pid 没有则为0(一级)
    pid = pid ? pid : 0;
    var values = { name, pid, status, updatatime: new Date().getTime() };
    try {
      if (id) {
        //编辑
        var resInsert = await model.thenUpdate({ table: "tk_hostpath",
          where: { id }, values }, { id: ["!=", id], pid, name });
        if (resInsert.type == "exist") {
          var res = { errmsg: "name is already exist" };
        } else if (resInsert.type == "update") {
          var res = { data: resInsert.id, mssage: "更新成功" };
        }
      } else {
        //添加 (为一级和二级)
        var resInsert = await model.thenAdd({ table: "tk_hostpath", values }, { pid, name });
        if (resInsert.type == "exist") {
          var res = { errmsg: "name is already exist" };
        } else if (resInsert.type == "add") {
          var res = { data: resInsert.id, mssage: "添加成功" };
        }
      }
      console.log(res);
      return await res;
    } catch (error) {
      console.log(error);
      return await { errmsg: "server is error" };
    }
  }
  /**
    * 获取所有的hostpaht 和wxno 列数据
    * @param {*}  
    */
  static async getHostPathWxno() {
    var resArr = await model.select({ table: "tk_hostpath", where: { status: 1 } });
    if (!resArr || !resArr.length) {
      return await { data: [] };
    }
    var wxnoArr = await model.select({ table: "tk_wxno" });
    while (wxnoArr.length) {
      var wxnoItme = wxnoArr.splice(0, 1)[0];
      var falg = dataFormat(new Date(Number(wxnoItme.last_time)), 'dd') == new Date().getDate();
      falg ? wxnoItme['sum'] : wxnoItme['sum'] = 0;
      var index = resArr.findIndex(itme => itme.id == wxnoItme.path_id);
      if (index > -1) {
        resArr[index]['wxnoArr'] ? resArr[index]['wxnoArr'].push(wxnoItme) : resArr[index]['wxnoArr'] = [wxnoItme];
      }
    }
    return await { data: recurMany(resArr)
      // ctx.body = await ctx.success()

    };
  }
  /**
  * 保存(添加或者编辑) tk_wxno 表的数据
  * @param {*} options 
  */
  static async saveWxno(options) {
    let { id, name, weight = 0, count = -1, status = 1, path_id, host_id } = options;
    // if(!name)  return ctx.error("name is require");
    // if(!path_id)  return ctx.error("path_id is require");
    // if(!host_id)  return ctx.error("path_id is require");
    let values = { name, weight, count, status, path_id, host_id, last_time: new Date().getTime()
      //有id 编辑，没有id 添加 
    };try {
      if (id) {
        //编辑
        var resInsert = await model.thenUpdate({ table: "tk_wxno",
          where: { id }, values }, { id: ["!=", id], path_id, name });
        if (resInsert.type == "exist") {
          var res = { errmsg: "name is already exist" };
        } else if (resInsert.type == "update") {
          var res = { data: resInsert.id, mssage: "更新成功" };
        }
        // return ctx.body = await ctx.send(res)
      } else {
        //添加 
        var resInsert = await model.thenAdd({ table: "tk_wxno", values }, { path_id, name });
        if (resInsert.type == "exist") {
          var res = { errmsg: "name is already exist" };
        } else if (resInsert.type == "add") {
          var res = { data: resInsert.id, mssage: "添加成功" };
        }
        // return ctx.body = await ctx.send(res)
        return await res;
      }
    } catch (error) {
      console.log(error);
      return await { errmsg: "server is error" };
    }
  }
  /**
   * 删除微信
   * @param {*} ctx 
   * @param {*} next 
   */
  static async delWxno(options) {
    var { id } = options;
    if (!id) return { errmsg: "path_id is require" };
    if (!Array.isArray(id)) id = [id];
    try {
      await model.delete({ table: "tk_wxno", where: { id: ['IN', id] } });
      return "删除成功";
    } catch (error) {
      console.log(error);
      return await { errmsg: "server is error" };
    }
  }

  /**
  * 根据概率随机一个wxno
  * @param {*} options 
  */
  static async getRadomWxno(ctx) {
    const { host_name = '', path_name = "" } = ctx.request.body;
    if (!host_name || !path_name) {
      return await { data: "", errmsg: "暂无数据" };
    }
    // 状态要正常和概率要大于0；
    //  先在pid 
    var sql = `select id from tk_hostpath where name =${model.escape(path_name)} and  pid in (select id from tk_hostpath where name=${model.escape(host_name)} and pid=0)`;
    var result = await model.execsql(sql);
    if (!result || !result.length) return await { data: "", errmsg: "暂无数据" };
    var resData = await model.select({ table: "tk_wxno", where: { path_id: result[0].id, status: 1, weight: [">", 0] } });
    if (!resData || !resData.length) {
      return await { data: "", errmsg: "暂无数据" };
    }
    result = new weightAllocation(resData);
    var reswxno = result.init();
    if (reswxno && reswxno.name) {
      var falg = dataformat(new Date(Number(reswxno.last_time)), 'dd') == new Date().getDate();
      var sum = falg ? reswxno.sum + 1 : 1;
      model.update({ table: "tk_wxno", values: { sum: sum, last_ip: getClientIp(ctx.request) }, where: { id: reswxno.id } });
      return { data: reswxno.name };
    } else {
      return await { data: "", errmsg: "暂无数据" };
    }
  }
};