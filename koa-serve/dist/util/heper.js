var _this = this;

const crypto = require("crypto");
exports._proto_ = type => {
    return Object.prototype.toString.call(type);
};
exports.isNull = val => {
    return _this._proto_(val) == "[object Null]";
};
exports.isFunction = val => {
    return _this._proto_(val) == "[object Function]";
};
exports.isUndefined = val => {
    return _this._proto_(val) == "[object Undefined]";
};
exports.isNumber = val => {
    return _this._proto_(val) == "[object Number]";
};
exports.isSymbol = val => {
    return _this._proto_(val) == "[object Symbol]";
};
exports.isBooleam = val => {
    return _this._proto_(val) == "[object Booleam]";
};
exports.isString = val => {
    return _this._proto_(val) == "[object String]";
};
exports.isObject = val => {
    return _this._proto_(val) == "[object Object]";
};
exports.isArray = val => {
    return _this._proto_(val) == "[object Array]";
};
exports.isStringNumber = val => {
    return _this.isString(val) || _this.isNumber(val);
};
exports._proto_ = type => {
    return Object.prototype.toString.call(type);
};
exports.objLen = val => {
    if (_this.isObject(val)) return Object.keys(val).length;
    return 0;
};
exports.splitobj = (obj = {}, live = "=") => {
    //对象键值拼接
    var str = '';
    for (var i in obj) {
        str += `${i} ${live}'${obj[i]}'`;
    }
    return str;
};
exports.signRonder = (n = 30) => {
    //取随机数
    var str = "123456789aAbBcCdDeEfFgGhHiIjJkKlLmMoOpPqQurRsStTuUvVwWxXyYzZ_-";
    if (n < 3) n = 30;
    var ronderstr = "";
    for (var i = 0; i < n; i++) {
        var index = Math.floor(Math.random() * str.length);
        ronderstr += str[index];
    }
    return ronderstr;
};
exports.md5 = (pwd, key = pwd) => {
    //md5 加密
    if (typeof pwd != "string") pwd = JSON.stringify(pwd);
    if (typeof key != "string") key = JSON.stringify(key);
    let hash = crypto.createHash("md5");
    hash.update(key + '--' + key);
    return hash.digest("hex");
};

exports.Aes = {
    //加密
    aesEncrypt: function (val, key = '---jiami') {
        if (typeof val != "string") val = JSON.stringify(val);
        if (typeof key != "string") key = JSON.stringify(key);
        const cipher = crypto.createCipher('aes192', key);
        var cipval = cipher.update(val, 'utf8', 'hex');
        cipval += cipher.final('hex');
        return cipval;
    },
    //解密
    aesDecrypt: function (val, key = '---jiami') {
        if (typeof val != "string") val = JSON.stringify(val);
        if (typeof key != "string") key = JSON.stringify(key);
        const decipher = crypto.createDecipher('aes192', key);
        var decval = decipher.update(val, 'hex', 'utf8');
        decval += decipher.final('utf8');
        return decval;
    }

};
exports.ip = ips => {
    if (!ips || ips == "" || typeof ips != "string") return ips;
    //ipv4 前缀
    if (ips.startsWith("::ffff:")) {
        ips = ips.substr(coede.length);
    }
    if (ips == "::1") {
        ips = "127.0.0.1";
    }
    return ips;
};
exports.dataFormat = (date, format = "yyyy-MM-dd") => {
    //参数一:时间，参数，要显示的时间格式
    if (Object.prototype.toString.call(date) != "[object Date]") return false;

    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//递归对象， 实现一维数据结构
let recurOne = function (data = [], id = "id", pid = "pid", pidnum = 0, leve = 1) {
    //关联值 id and tid  = 0(定级)
    if (Object.prototype.toString.call(data) !== '[object Array]') return data;
    var arr = [];
    data.forEach(function (itme, index) {
        if (itme[pid] == pidnum) {
            itme['leve'] = leve;
            arr.push(itme);
            arr = arr.concat(recurOne(data, id, pid, itme[id], leve + 1));
        }
    });
    return arr;
};
exports.recurOne = recurOne;

//递归 实现无限极树状结构
let recurMany = (data = [], id = "id", pid = "pid", pidnum = 0, leve = 1) => {
    if (Object.prototype.toString.call(data) !== '[object Array]') return data;
    var result = new Array();
    data.forEach(function (itme) {
        if (itme[pid] == pidnum) {
            itme["leve"] = leve;
            itme["children"] = recurMany(data, id, pid, itme[id], leve + 1);
            result.push(itme);
        }
    });
    return result;
};
exports.recurMany = recurMany;
//递归找子集，返回一个数组(子集每一项的id)
let filterChrildId = (data = [], id = "id", pid = "pid", idNum = 0, field = null) => {
    //默认没有子集，返回空数组
    if (!idNum || idNum == 0) return [];
    var arrId = [];
    if (Object.prototype.toString.call(data) !== '[object Array]') return [];
    data.forEach(ele => {
        if (ele[pid] == idNum) {
            if (field) {
                arrId.push(ele);
            } else {
                arrId.push(ele[id]);
            }
            arrId = arrId.concat(filterChrildId(data, id, pid, ele[id], field));
        }
    });
    return arrId;
};
exports.filterChrildId = filterChrildId;
// 递归添加子集的数据
let diGuiAdd = (data = [], idField = "id", pidField = "pid", countField = "count") => {
    if (Object.prototype.toString.call(data) !== '[object Array]') return data;
    var cloneData = JSON.parse(JSON.stringify(data));
    function fn(cloneData, cid, count) {
        var counts = count;
        cloneData.forEach(async ele => {
            if (ele[pidField] == cid) {
                counts += ele[countField];
                counts += await fn(cloneData, ele[idField], counts);
            }
        });
        return counts;
    }
    data.forEach(ele => {
        ele[countField] = fn(cloneData, ele[idField], ele[countField]);
    });
    return data;
};
exports.diGuiAdd = diGuiAdd;
let deepCopy = obj => {
    //对象拷贝：深拷贝
    if (typeof obj != "object") return obj;
    var newObj = new Object();
    for (var i in obj) {
        newObj[i] = deepCopy(obj[1]);
    }
    return newObj;
};
exports.deepCopy = deepCopy;

let weightAllocation = class weightAllocation {
    constructor(data) {
        this.data = this.upset(this.compentArr(data));
    }
    //重置/打乱数组 增加随机率
    upset(arr) {
        for (let i = 0; i < arr.length; i++) {
            var index = parseInt(Math.random() * arr.length);
            [arr[i], arr[index]] = [arr[index], arr[i]];
        }
        return arr;
    }
    //计算概率数组 exact：放大10 倍，增加随机率
    compentArr(data = [], weight = "weight", exact = 10) {
        if (!data || !data.length) return [];
        var resArr = [];
        data.forEach(itme => {
            var weightVal = Number(itme[weight]);
            // 权重(概率)必须为数字且大于0，等于0或者这小于0 说明不在随机队列中 
            if (/\d/g.test(weightVal) && weightVal > 0) {
                for (let j = 0; j < weightVal * exact; j++) {
                    resArr.push(itme);
                }
            }
        });
        return resArr;
    }
    init() {
        if (!this.data || !this.data.length) return "";
        var index = Math.floor(Math.random() * this.data.length);
        return this.data[index];
    }
};

exports.weightAllocation = weightAllocation;

exports.getClientIp = req => {
    try {
        return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.ip;
    } catch (error) {
        return '';
    }
};