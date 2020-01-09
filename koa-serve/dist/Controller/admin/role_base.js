var _dec, _dec2, _desc, _value, _class;

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

const { userAuth, roleAuth } = imports("Lib/permission");
// 拦截用户的角色认证
module.exports = (_dec = userAuth(), _dec2 = roleAuth(), (_class = class {
    async __before__(ctx, next) {}
}, (_applyDecoratedDescriptor(_class.prototype, "__before__", [_dec, _dec2], Object.getOwnPropertyDescriptor(_class.prototype, "__before__"), _class.prototype)), _class));