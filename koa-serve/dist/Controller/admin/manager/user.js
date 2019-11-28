var _dec, _dec2, _dec3, _class, _desc, _value, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

const { Controller, POST } = imports("Lib/router");
const { Aes } = imports("util/heper");
const userAuth = imports("Controller/admin/user_base");
const roleModel = imports("models/role");
const meuModel = imports("models/menu");
const authModel = imports("models/auth");
const { recurMany } = imports("util/heper");

let index = (_dec = Controller("/managerCenter"), _dec2 = POST("/modifypwd"), _dec3 = POST("/getManagerRole"), _dec(_class = (_class2 = class index extends userAuth {
    //修改当前登录用户的信息
    async modifypwd(ctx, next) {
        let { password, checkPass } = ctx.request.body;
        let { userId } = ctx.state.userInfo;
        if (!password || password != checkPass) return ctx.body = ctx.error("两次密码不一样");
        var data = { password: Aes.aesEncrypt(password) };
        try {
            await ctx.Model.update({ table: "tk_user", where: { id: userId }, values: data });
            ctx.body = await ctx.success("修改成功");
        } catch (error) {
            return ctx.body = ctx.error('server is error');
        }
    }
    //修改当前登录用户的信息
    async getManagerRole(ctx, next) {
        var { userId, user_type, username } = ctx.state['userInfo'];
        var userInfo = { username: username, userId: userId, user_type };
        if (user_type == 1) {
            //超级用户
            var meunList = await ctx.Model.select({ table: "tk_menu", where: { status: 1 }, order: ["sort"] });
            meunList = recurMany(meunList);
            return ctx.body = await ctx.success({ data: { meunList, authList: [], userInfo } });
        }
        //根据用户查角色
        //根据角色查权限和菜单 status :1
        try {
            var res = await roleModel.getUserRole(userId); //
            if (res.errmsg) return ctx.body = ctx.error('server is error');
            let roleId = res.map(itme => itme.role_id);
            if (!roleId.length) {
                return ctx.body = await ctx.success({ data: { meunList: [], authList: [], userInfo } });
            }
            // 查菜单
            let meunList = await meuModel.findRoleMenu(roleId, 1);
            meunList = recurMany(meunList);
            // 查权限
            let authList = await authModel.findRoleAuth(roleId, 1);
            return ctx.body = await ctx.success({ data: { meunList, authList, userInfo } });
        } catch (error) {
            return ctx.body = ctx.error('server is error');
        }

        // var meunList = [
        //     {"path":"/admin","name":"adminIndex","title":"首页","id":2,"pid":0},
        //     {"path":"/admin/cms","name":"cms","title":"内容管理","id":5,"pid":0,"children":
        //         [
        //             {"path":"/admin/cmsArticle","name":"article","title":"帖子管理","id":6,"pid":5,"children":[]},
        //             {"path":"/admin/cmsCate","name":"cate","title":"分类管理","id":7,"pid":5,"children":[]},
        //             {"path":"/admin/cmsTab","name":"tab","title":"标签管理","id":8,"pid":5,"children":[]}
        //         ]
        //     },
        //     {"path":"/admin/populariz","name":"populariz","title":"推广管理","id":9,"pid":0,"children":
        //     [
        //         {"path":"/admin/distribWxnumber","name":"wxnumber","title":"分配微信号","id":10,"pid":9,"children":[]},
        //     ],   
        //     },
        //     {"path":"/admin/rbac","name":"rbac","title":"系统管理","id":1,"pid":0,"children":
        //         [
        //             {"path":"/admin/rbacUser","name":"user","title":"管理员","id":2,"pid":1,"children":[]},
        //             {"path":"/admin/rbacRole","name":"role","title":"角色管理","id":3,"pid":1,"children":[]},
        //             {"path":"/admin/rbacMenu","name":"menu","title":"菜单管理","id":11,"pid":1,"children":[]},                  
        //             {"path":"/admin/rbacAuth","name":"auth","title":"权限管理","id":4,"pid":1,"children":[]}
        //         ],   
        //     },
        //     {"path":"/admin/logs","name":"logs","title":"日志管理","id":12,"pid":0,"children":
        //     [
        //         {"path":"/admin/lgosLogin","name":"lgosLogin","title":"登录日志","id":13,"pid":12,"children":[]},
        //     ],   
        //     },
        // ]
        // ctx.body = await ctx.success({data:{meunList,authList:[]}})
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "modifypwd", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "modifypwd"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getManagerRole", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "getManagerRole"), _class2.prototype)), _class2)) || _class);

module.exports = index;