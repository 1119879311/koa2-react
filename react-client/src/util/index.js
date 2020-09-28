 //时间格式化：dataFormat(时间，时间的显示的格式)
    //如 (new Date(),yyyy-MM-dd)//2017-6-28
    //如 (new Date(),yyyy-MM-dd hh:mm:ss)//2017-6-28 15:02:30
    export  let dataFormat=  (date, format ="yyyy-MM-dd hh:mm:ss") =>{//参数一:时间，参数，要显示的时间格式
      if(!date) return date;
      date = new Date(Number(date));
      if (Object.prototype.toString.call(date) !== "[object Date]") return false;

      var o = {
          "M+": date.getMonth() + 1,                 //月份 
          "d+": date.getDate(),                    //日 
          "h+": date.getHours(),                   //小时 
          "m+": date.getMinutes(),                 //分 
          "s+": date.getSeconds(),                 //秒 
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
          "S": date.getMilliseconds()             //毫秒 
      };
      if (/(y+)/.test(format)) {
          format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
          if (new RegExp("(" + k + ")").test(format)) {
              format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
          }
      }
      return format;
  }

  //实现一维数据结构
  export  let recurOne = function (data = [],children="children") {//关联值 id and tid  = 0(定级)
    if (Object.prototype.toString.call(data) !== '[object Array]') return data;
    var arr = [];
    data.forEach(function (itme, index) {
        var childData = itme[children];
        delete  itme[children];
        arr.push(itme);
        arr = arr.concat(recurOne(childData, children));
    })
    return arr
}

export let leveRecurOne = function(data=[], id = "id", pid = "pid", pidnum = 0, leve = 1){
    if (Object.prototype.toString.call(data) !== '[object Array]') return data;
        var arr = [];
        data.forEach(function (itme, index) {
            if (itme[pid] === pidnum) {
                itme['leve'] = leve;
                arr.push(itme)
                arr = arr.concat(leveRecurOne(data, id, pid, itme[id], leve + 1));
            }
        })
        return arr
}
 //递归找子集，返回一个数组(子集每一项的id)
export let filterChrildId = function(data=[], id = "id", pid = "pid", idNum = 0) {//默认没有子集，返回空数组
    if (!idNum || idNum === 0) return [];
    var arrId = [];
    if (Object.prototype.toString.call(data) !== '[object Array]') return [];
    data.forEach(ele => {
        if (ele[pid] === idNum) {
            arrId.push(ele[id]);
            arrId = arrId.concat(filterChrildId(data, id, pid, ele[id]))
        }
    });
    return arrId;

}

export  let  randomColor =  () =>{
    var colorStr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
    var colorArr = colorStr.split(",");
    var color = "#";
    for (let i = 0; i < 6; i++) {
        color += colorArr[Math.floor(Math.random() * 16)];
    }
    return color;
}