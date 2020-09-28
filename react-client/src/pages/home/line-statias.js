// charts -line 图
import React, {
    useEffect 
} from 'react'
import echarts from "echarts";
import "./index.css"

// 获取当前月一共有多少天
function getCountDays() {
    var curDate = new Date();
    /* 获取当前月份 */
    var curMonth = curDate.getMonth() + 1;
    /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
    curDate.setMonth(curMonth);
    /* 将日期设置为0,*/
    curDate.setDate(0);
    /* 返回当月的天数 */
    return curDate.getDate();
}
// 绘制
function drawLine() {
    // 初始化echarts实例
    let myChart = echarts.init(document.getElementById('home-charts-line'))
    // 绘制图表
    var month = new Date().getMonth() + 1;
    //横坐标数据 月份
    var xAxisData = Array.from(Array(getCountDays()), (v, k) => month + '月' + (k + 1) + '日');
    //纵轴数据
    // var yAxisData = [10,50,0,10,20]
    var yAxisData = Array.from(Array((new Date().getDay()) + 1), (v, k) => parseInt(Math.random() * (100 - 50) + 50))
    myChart.setOption({
        title: {
            text: '本月(' + month + '月)每日下单走势图'
        },
        tooltip: { //鼠标在经过点显示悬浮提示
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        toolbox: { //右上角转换小工具条
            show: true,
            feature: {
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            }
        },
        grid: {
            left: '2%',
            right: '3%',
            bottom: '2%',
            containLabel: true
        },
        xAxis: [{
            nameGap: 0,
            boundaryGap: false,
            data: xAxisData
        }],
        yAxis: [{
            type: 'value'
        }],
        series: [{
            name: '当天订单数为(单位/个)',
            type: 'line',
            data: yAxisData,
            color: "#55A8FD", //折线上圆点的颜色
            lineStyle: {
                color: "#55A8FD",
                opacity: 1
            },
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
        }]

    })

}

export default function () {
    useEffect (()=>{
        drawLine()
    },[])
   
    return <div className = "home-charts"id ="home-charts-line" > </div>
   
}