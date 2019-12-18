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

const { Controller, POST, GET } = imports("Lib/router");
const { Aes, getClientIp } = imports("util/heper");
const { expiresIn } = imports("Config");
const TOKENS = imports("util/utilToken");
const logsLoginModle = imports("models/tk_logslogin");
const svgCaptcha = require("svg-captcha");
const app_code_key = "app_code_key";
// 验证

const verifycode = (code, code_token) => {
    console.log(code, code_token);
    if (!code || !code_token) {
        return { mssage: "code 认证失败" };
    }
    code = code.toLocaleLowerCase();
    try {
        var res = JSON.parse(Aes.aesDecrypt(code_token, code + "---" + app_code_key));
        console.log(res);
        if (res.time < new Date().getTime()) {
            return { mssage: "code 认证失败" };
        }
        if (code !== res.code) return { mssage: "code 认证失败" };
        return null;
    } catch (error) {

        return { mssage: "code 认证失败" };
    }
};

let index = (_dec = Controller(), _dec2 = POST("/login"), _dec3 = GET("/code"), _dec(_class = (_class2 = class index {
    async findUser(ctx, next) {
        var { name, password, code, code_token } = ctx.request.body;
        var resCode = await verifycode(code, code_token);
        if (resCode) return ctx.body = await ctx.error(resCode.mssage);

        if (!name || !password) return ctx.body = await ctx.error("登录失败，用户名和密码不能为空");
        var res = await ctx.Model.findOne({ table: "tk_user", where: { name, password: Aes.aesEncrypt(password) } });
        if (!res) {
            //用户是否存在
            return ctx.body = await ctx.error("登录失败，用户名或者密码错误");
        }
        if (res.status != 1 && res.user_type != 1) {
            //用户是否启用(超级用户除外)
            return ctx.body = await ctx.error("你的账号已冻结禁止登陆，请联系超级管理员");
        }

        try {
            await logsLoginModle.add({ login_name: res.name, login_ip: getClientIp(ctx.request) });
        } catch (error) {}
        //签发token
        var data = { user_type: res.user_type, username: res.name, userId: res.id, expiresIn: new Date().getTime() + expiresIn };
        var token = await TOKENS.Set(data);
        data["token"] = token;
        ctx.body = await ctx.success({ data });
    }

    async code(ctx, next) {
        ctx.type = "html";
        let codeConfig = {
            size: 4, // 验证码长度
            width: 120,
            height: 32,
            fontSize: 50,
            ignoreChars: '0oO1ilI', // 验证码字符中排除 0o1i
            noise: 2, // 干扰线条的数量
            color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
            background: '#fff' // 验证码图片背景颜色
        };
        var captcha = svgCaptcha.create(codeConfig);
        let code = captcha.text.toLocaleLowerCase();
        var token_random = Math.floor(Math.random() * 1000000);
        var code_token = Aes.aesEncrypt(JSON.stringify({ code, token_random, time: new Date().getTime() + 10000 * 60 * 5 }), code + "---" + app_code_key);
        ctx.set({
            code_token: code_token
        });
        ctx.body = captcha.data;
    }

}, (_applyDecoratedDescriptor(_class2.prototype, "findUser", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "findUser"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "code", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "code"), _class2.prototype)), _class2)) || _class);

module.exports = index;