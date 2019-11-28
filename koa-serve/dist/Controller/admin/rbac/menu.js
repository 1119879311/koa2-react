var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2;

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

const { Controller, POST, GET } = imports("Lib/router");
const menuModel = imports("models/menu");
const logicMenu = imports("logic/menu");
const { recurMany } = imports("util/heper");

const roleBase = imports("Controller/admin/role_base");

// 该模块属于权限管理的角色模块，所有请求需要授权

let index = (_dec = Controller("/menu"), _dec2 = GET("/"), _dec3 = POST("/add"), _dec4 = POST("/update"), _dec5 = POST("/delete"), _dec(_class = (_class2 = class index extends roleBase {
    async find(ctx, next) {
        let { status, roleId } = ctx.request.query;
        // 查询所有的权限行为
        // 根据角色id 刷选除对应的菜单
        if (roleId) {
            var data = await menuModel.findRoleMenu(roleId, status);
        } else {
            var data = await menuModel.findAll(status);
            data = recurMany(data);
        }

        ctx.body = await ctx.send({ data });
    }

    /**添加 菜单行为
     * @param POST /menu/add
     * @param body 
    * @param return {code,mssage/errmsg,data,status}
     **/

    async add(ctx, next) {
        var { name, title, path } = ctx.request.body;
        var validRes = await logicMenu.veryMenu({ name, path, title });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await menuModel.add(ctx.request.body)));
    }
    /**修改菜单
     * @param POST /auth/update
     * @param body { id, name,identName,url,status,groupName}
     * @param return {code,mssage/errmsg,data,status}
     **/

    async update(ctx, next) {
        var { id, name, title, path } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id  is required");
        // 数据验证
        var validRes = await logicMenu.veryMenu({ name, title, path });
        if (validRes) return ctx.body = await ctx.error(validRes);
        ctx.body = await ctx.send((await menuModel.update(ctx.request.body)));
    }
    /**删除菜单
     * @param POST /menu/delete
     * @param body { id}
     * @param return {code,mssage/errmsg,data,status}
     **/
    //删除role
    async delete(ctx, next) {
        let { id } = ctx.request.body;
        if (!id) return ctx.body = await ctx.error("id  is required");
        ctx.body = await ctx.send((await menuModel.delete(id)));
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "find", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "find"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delete", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "delete"), _class2.prototype)), _class2)) || _class);

module.exports = index;