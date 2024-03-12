<template>
  <div id="graph">
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "Transform",
  data(){
    return {

    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      const width = 1000;
      const height = 618;

      const svg = d3
        .select('#graph')
        .append('svg')
        .attr('width',width)
        .attr('height',height);

      // 长方形数据
      const dataset = [
        {
          id:'rect0',
          x:100,
          y:200,
          width:50,
          height:50,
          color:'red',
        },
        {
          id:'rect1',
          x:200,
          y:200,
          width:50,
          height:50,
          color:'green',
        },
        {
          id:'rect2',
          x:300,
          y:200,
          width:50,
          height:50,
          color:'blue',
        },
        {
          id:'rect3',
          x:400,
          y:200,
          width:50,
          height:50,
          color:'pink',
        },
        {
          id:'rect4',
          x:500,
          y:200,
          width:50,
          height:50,
          color:'yellow',
        },
      ];

      //
      const rects = svg
        .selectAll('rect') // 标签选择器
        .data(dataset)
        .enter()
        .append('rect')
        .attr('id',(d)=>{
          return d.id;
        })
        .attr('x',(d)=>{
          return d.x;
        })
        .attr('y',(d)=>{
          return d.y;
        })
        .attr('width',(d)=>{
          return d.width;
        })
        .attr('height',(d)=>{
          return d.height;
        })
        .style('fill',(d)=>{
          return d.color;
        })

      /*
       * D3.js中transform变换的坐标原点是(0,0),x轴为svg上边界线，y轴svg左边界线
       */
      // rect0:平移
      svg.select('#rect0')
        // Translate - 它有两个选项，tx是指沿 x 轴的平移，ty是指沿 y 轴的平移。例如：translate(30 30)。
        .attr('transform','translate(30,30)')
      // rect1:旋转
      svg.select('#rect1')
        // Rotate- 它需要三个选项，angle 是指旋转角度，cx和cy是指在 x 和 y 轴上的旋转中心。如果未指定cx和cy，则默认为坐标系的当前原点。例如：rotate(60)。
        .attr('transform','rotate(-20)');
      // rect2:缩放
      svg.select('#rect2')
        // Scale - 它有两个选项，sx是指沿 x 轴的缩放因子，sy是指沿 y 轴的缩放因子。此处，sy是可选的，如果未指定，则采用sx的值。例如：scale(10)。
        .attr('transform','scale(2)');
      // rect3:拉伸
      svg.select('#rect3')
        // Skew (SkewX 和 SkewY) - 它需要一个选项；skew-angle指的 SkewX 沿 x 轴的角度和 SkewY 沿 y 轴的角度。 例如 - skewx(20)。例如：skewx(20)。
        .attr('transform','skewX(20)')
      // rect4:综合使用
      svg.select('#rect4')
        //.attr('transform','skewX(30) scale(0.5) rotate(-20) translate(40,40)'); //变换顺序不同，会影响最终显示结果
        .attr('transform','translate(40,40) rotate(-20) scale(0.5) skewX(30)');
    }
  }
}
</script>

<style scoped>

</style>
