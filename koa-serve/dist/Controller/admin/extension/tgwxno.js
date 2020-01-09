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

const { Controller, POST, GET } = imports("Lib/router");
const { userAuth, roleAuth } = imports("Lib/permission");
const wxnoModel = imports("models/wxno");
let index = (_dec = Controller("/extension"), _dec2 = GET("/getRadomWxno"), _dec3 = userAuth(), _dec4 = roleAuth(), _dec5 = GET("/getHostPath"), _dec6 = userAuth(), _dec7 = roleAuth(), _dec8 = POST("/saveHostPath"), _dec9 = userAuth(), _dec10 = roleAuth(), _dec11 = POST("/saveWxno"), _dec12 = userAuth(), _dec13 = roleAuth(), _dec14 = POST("/delWxno"), _dec(_class = (_class2 = class index {
  async getRadomWxno(ctx, next) {
    ctx.body = await ctx.send((await wxnoModel.getRadomWxno(ctx)));
  }
  /**
  *获取域名与后缀
  * @param {*} ctx 
  * @param {*} next 
  */

  async getHostPath(ctx, next) {
    ctx.body = await ctx.send((await wxnoModel.getHostPathWxno()));
  }
  /**
  * 保存和编辑域名与后缀
  * @param {*} ctx 
  * @param {*} next 
  */

  async saveHostPath(ctx, next) {
    ctx.body = await ctx.send((await wxnoModel.saveHostPath(ctx.request.body)));
  }
  /**
  * 保存和编辑微信
  * @param {*} ctx 
  * @param {*} next 
  */

  async saveWxno(ctx, next) {
    let { name, path_id, host_id } = ctx.request.body;
    if (!name) return ctx.error("name is require");
    if (!path_id) return ctx.error("path_id is require");
    if (!host_id) return ctx.error("path_id is require");
    ctx.body = await ctx.send((await wxnoModel.saveWxno(ctx.request.body)));
  }
  /**
  * 删除一个微信
  * @param {*} ctx 
  * @param {*} next 
  */

  async delWxno(ctx, next) {
    ctx.body = await ctx.send((await wxnoModel.delWxno(ctx.request.body)));
  }
}, (_applyDecoratedDescriptor(_class2.prototype, "getRadomWxno", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getRadomWxno"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getHostPath", [_dec3, _dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "getHostPath"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "saveHostPath", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "saveHostPath"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "saveWxno", [_dec9, _dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "saveWxno"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "delWxno", [_dec12, _dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "delWxno"), _class2.prototype)), _class2)) || _class);

module.exports = index;