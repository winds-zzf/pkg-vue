<template>
  <div id="container" style="padding: 50px">

  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "Custom",
  mounted() {
    this.draw()
  },
  methods:{
    draw() {
      const width = 1000;
      const height = 618;

      const svg = d3
        .select('#container')
        .append('svg')
        .attr('width',width)
        .attr('height',height)
      svg
        .append('rect')
        .attr('x',0)
        .attr('y',0)
        .attr('width','100%')
        .attr('height','100%')
        .attr('fill','lightblue');
      const graph = svg
        .append('g')
        .attr('class','graph')
      /*
       * 箭头标记
       */
      svg.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")   //设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX", 9)//箭头坐标
        .attr("refY", 0)
        .attr("markerWidth", 12)//标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 1)//箭头宽度
        .append("path")
        .attr("d", "M0,-5 L10,0 L0,5")//箭头的路径
        .attr('fill', '#999');//箭头颜色

      graph.append('g')
        .append('circle')
        .attr('r',25)
        .attr('cx',0)
        .attr('cy',0)
        .attr('stroke','#eee')
        .attr('stroke-width',2)
        .attr('fill','red');

      graph.append('g')
        .append('circle')
        .attr('r',25)
        .attr('cx',100)
        .attr('cy',0)
        .attr('stroke','#eee')
        .attr('stroke-width',2)
        .attr('fill','green');

      const path = graph.append('g')
        .append('path')
        .attr('stroke', '#999')
        .attr('stroke-width', 1)
        .attr('fill','none')
        .attr('marker-end','url(#arrow)')


      let radius = 26                   // 小球半径
      let source = {x:0, y:0}       // 向量起点
      let target = {x:100, y:0}       // 向量终点
      let distance = Math.sqrt(Math.pow(target.x-source.x,2)+Math.pow(target.y-source.y,2))
      let middle = distance/2;
      let offset = 100
      let delta = 0

      let theta = Math.atan2(offset*1.8,middle);
      let delta_x = radius*Math.cos(theta);
      let delta_y = radius*Math.sin(theta);

      path.attr('d',function (d){
        return "M"+(delta_x)+' '+(delta_y)+' Q'+(target.x)/2+' '+(offset)+' '+(target.x-delta_x)+' '+(delta_y);
        //  return "M"+delta_x+' '+delta_y+"Q"+(middle-delta)/2+' '+(5*offset/6)+' '+(middle-delta)+' '+offset
        //    + "M"+(middle+delta)+' '+offset+" Q"+(middle+delta+distance)/2+' '+(5*offset/6)+' '+(target.x-delta_x)+' '+delta_y ;
      })

      /*===========================================================================================*/
      svg
        .call(d3.zoom()
          .scaleExtent([0.1, 3])  //设置缩放的范围，指定缩放比例的最大值和最小值
          .on('zoom',function(event) {
            graph.attr('transform', event.transform);
          }))
        .on('dblclick.zoom', null); // 禁止双击缩放
    },
  },
}
</script>

<style scoped>
</style>
