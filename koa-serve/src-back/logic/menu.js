const  Joi = require("joi");
module.exports= new class {
    constructor() {
        this.verytitle = Joi.string().required().error(new Error("name is must required"));
        this.verypath = Joi.string().required().error(new Error("path is required"));
        this.veryname = Joi.string().required().regex(/^[a-zA-Z]{1,}$/).error(new Error("identName必填且是字母，不区分大小写"));
        
    }
    async  veryMenu(data={}){
        var _this = this;
        var schema = Joi.object().keys({
            name:_this.veryname ,
            path: _this.verypath,
            title: _this.verytitle,
            // groupName: _this.veryGroupName,

        })

        var resVali = Joi.validate(data,schema,{allowUnknown: true});
        if(resVali.error) return  await {errmsg:resVali.error.message};
        return null
    }
}