module.exports = {
    port:3002, //服务run端口
    routerPrefix:"/api", //所有的接口一个前缀
    staticPath : "/theme", //静态资源根目录
    entryPath : process.env.NODE_ENV==="development"?"src":"dist",
    signed:"jJkK37aAbBcCdDeEXy89Y45Z_-6sStfFgGhHiIlLmMoOpPqQurRTuUvVwWxz",
    expiresIn:60*60*24,
    mysql:{
        "host": "localhost",//主机名/ip
        "user": "root",//用户名
        "password": "root",//密码
        "port": 3306,//端口
        "database": "nodemanage", //连接的库
        "debug":true
    },

}