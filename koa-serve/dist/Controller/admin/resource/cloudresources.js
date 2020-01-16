var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _desc, _value, _class2;

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

const { Controller, GET, POST } = imports("Lib/router");
const { userAuth, roleAuth } = imports("Lib/permission");
const cloudModel = imports("models/tk_cloudresources");
let index = (_dec = Controller("/cloudresources"), _dec2 = GET("/"), _dec3 = userAuth(), _dec4 = roleAuth(), _dec5 = POST("/add"), _dec6 = userAuth(), _dec7 = roleAuth(), _dec8 = POST("/swtich"), _dec9 = userAuth(), _dec10 = roleAuth(), _dec11 = POST("/update"), _dec12 = userAuth(), _dec13 = roleAuth(), _dec14 = POST("/delete"), _dec(_class = (_class2 = class index {
    async findAll(ctx, next) {

        return await ctx.send((await cloudModel.findAll(ctx.request.query)));
    }

    async add(ctx, next) {
        ctx.body = await ctx.send((await cloudModel.add(ctx.request.body)));
    }

    //单个/批量修改状态
    /**
     * @param {object} ctx.request.body 
     * @param {array} data =>[{id:1,status:1}]
     * */

    async swtich(ctx, next) {
        var { data } = ctx.request.body;
        return ctx.body = await ctx.send((await cloudModel.switch(data)));
    }

    //单个更新

    async update(ctx, next) {
        ctx.body = await ctx.send((await cloudModel.update(ctx.request.body)));
    }

    // 删除一个/批量

    async del(ctx, next) {
        var { id } = ctx.request.body;
        ctx.body = await ctx.send((await cloudModel.del(id)));
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "findAll", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findAll"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "add", [_dec3, _dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "add"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "swtich", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "swtich"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "update", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "update"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "del", [_dec12, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "del"), _class2.prototype)), _class2)) || _class);

module.exports = index;