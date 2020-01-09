var _dec, _dec2, _class, _desc, _value, _class2;

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

const { Controller, GET } = imports("Lib/router");
const roleBase = imports("Controller/admin/role_base");
const logsLoginModle = imports("models/tk_logslogin");

// 登录日志
let index = (_dec = Controller("/logslogin"), _dec2 = GET("/"), _dec(_class = (_class2 = class index extends roleBase {
    async findlogin(ctx, next) {
        let option = ctx.request.query;
        ctx.body = await ctx.send((await logsLoginModle.findAll(option)));
    }
}, (_applyDecoratedDescriptor(_class2.prototype, "findlogin", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findlogin"), _class2.prototype)), _class2)) || _class);

module.exports = index;