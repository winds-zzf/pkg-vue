<template>
  <div id="container" style="padding-top: 50px">

  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "Paths",
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
      const container = svg
        .append('g')
        .attr('class','container')
      /*
       * 箭头标记
       */
      svg.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")   //设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX", 0)//箭头坐标
        .attr("refY", 0)
        .attr("markerWidth", 12)//标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 2)//箭头宽度
        .append("path")
        .attr("d", "M0,-5 L10,0 L0,5")//箭头的路径
        .attr('fill', '#999');//箭头颜色

      const line = container.append('g')
      const path = line.append('path')
        .attr('stroke', '#999')
        .attr('stroke-width', 2)
        .attr('fill','#999')
        .attr('marker-end','url(#arrow)')
      const text = line.append('text')
        .text('acted_in')
        .attr('y',0)           //fixed:0
        .attr('text-anchor',"middle")
        .attr('alignment-baseline',"middle");

      var path1 = d3.path()
      path1.moveTo(100,100)
      path1.quadraticCurveTo(200,150,300,150)
      container.append('g')
        .append('path')
        .attr('d', path1.toString())
        .style('fill','none')
        .style('stroke','red')
        .style('stroke-width','2')
        .attr('marker-end','url(#arrow)')

      /*==========================================================================*/
      // 接口参数
      let radius = 26                   // 小球半径
      let source = {x:100, y:100}       // 向量起点
      let target = {x:200, y:200}       // 向量终点
      let textLength = text.node().getComputedTextLength(); //文本长度
      /*=========================================================================*/
      // 相关计算
      let translateX = source.x;     // x方向的translate
      let translateY = source.y;     // y方向的translate
      let angle = Math.atan2(target.y-source.y,target.x-source.x)*180/Math.PI; // 向量方向角(单位π)
      let length = Math.sqrt(Math.pow(target.y-source.y,2)+Math.pow(target.x-source.x,2)) //向量长度
      length -= 2*radius;            // 除去两端的小球半径
      let delta = textLength/2 + 4;  // 向量文本长度的一半+两侧的空白4px
      let middle = length/2;         // 向量中点
      /*=========================================================================*/
      line
        .attr('transform','translate('+(translateX+radius)+','+translateY+') rotate('+angle+')');
      path
        // 可以在直线上直接绘制箭头
        // .attr('d', "M 0 0 L 100 0 Z M 200 0 L 300 0 L 300 5 L 312 0 L 300 -5 L 300 0 Z")
        .attr('d',function(d){
          /* 文本长度问题 */
          if(delta <= middle){
            // 添加文字
            text
              .attr('transform','translate('+(middle)+','+0+') rotate('+180+')');
            return "M 0 0 L "+ (middle-delta)+" 0 Z M "+(middle+delta)+" 0 L "+length+" 0";  // 结尾不能加Z，否则箭头绘制出错
          } else {
            // 不添加文字
            text.text('')
            return "M 0 0 L "+length+" 0";  // 结尾不能加Z，否则箭头绘制出错
          }
        })

      /*===========================================================================================*/
      svg
        .call(d3.zoom()
          .scaleExtent([0.1, 3])  //设置缩放的范围，指定缩放比例的最大值和最小值
          .on('zoom',function(event) {
            container.attr('transform', event.transform);
          }))
        .on('dblclick.zoom', null); // 禁止双击缩放
    }
  }
}
</script>

<style scoped>
</style>
