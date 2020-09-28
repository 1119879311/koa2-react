// charts -bar 图
import React, {
    useEffect 
} from 'react'
import echarts from "echarts";
import "./index.css"

// 纵轴数据
function getYAxisData(){
    var monthCount = new Date().getMonth()+1;
    return Array.from(Array(monthCount), (v, k) => parseInt(Math.random() * (100 - 50) + 50));//横坐标数据 月份
}


function drawCharts(){
     // 基于准备好的dom，初始化echarts实例
     var myChart=echarts.init(document.getElementById('home-charts-bar'))
     // 横轴数据
     let xAxisData = Array.from(Array(12), (v,k) =>(k+1)+'月');//横坐标数据 月份
    

   
     myChart.setOption({
             title: { text: '平台统计' },
             tooltip: {
                trigger: 'axis',
              
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data: ['每月下单数', '每月访客数']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '每月下单数',
                    type: 'bar',
                    data: getYAxisData(),
                    color:"#CADEFB",
                    lineStyle:{
                        color: "#CADEFB",
                        opacity:1
                    },
                    areaStyle:{
                        color: "#CADEFB",
                        opacity:1
                    }
                },
                {
                    name: '每月访客数',
                    type: 'bar',
                    // stack: '广告',
                    data: getYAxisData(),
                    color:"#55A8FD",//折线上圆点的颜色
                    lineStyle:{
                        color: "#55A8FD",
                        opacity:1
                    },
                    areaStyle:{
                        color: "#55A8FD",
                        opacity:1
                    }
                },
              
            ]

          })
         
     
}
export default function () {
    useEffect (()=>{
        drawCharts()
    },[])
   
    return <div className = "home-charts"id ="home-charts-bar" > </div>
   
}