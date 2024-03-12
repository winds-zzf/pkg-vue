<template>
  <div id="graph">

  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "Transition",
  data(){
    return {

    }
  },
  mounted(){
    this.draw()
  },
  methods:{
    draw(){
      const width = 1000;
      const height = 618;

      const svg = d3
        .select('#graph')
        .append('svg')
        .attr('width',width)
        .attr('height',height);

      const rect = svg
        .append('rect')
        .attr('x',100)
        .attr('y',100)
        .attr('width',150)
        .attr('height',150)
        .style('fill','red')
        //
        .transition()         // 启动过渡，该方法之前设置的属性为初始属性,之后设置的属性为最终属性，初始属性经过过渡之后变成最终属性，最终属性将作为rect该元素的属性
        .duration(2000)       // 指定过渡的持续时间，单位为毫秒。
        .delay(500)           // 指定延迟的时间，表示一定时间后才开始转变，单位同样为毫秒。此函数可以对整体指定延迟，也可以对个别指定延迟。
        // .ease("circle")      //指定过渡的方式，常用的有：{linear:普通的线性变化,circle:慢慢地到达变换的最终状态,elastic:带有弹跳的到达最终状态,bounce:在最终状态处弹跳几次}
        //
        .style('fill','steelblue')
        .attr('x',200)
        .attr('height',200);
    }
  }
}
</script>

<style scoped>

</style>

<!--
参考:
https://www.jikexueyuan.com/wiki/d3wiki?sectionId=56c4c6db4c7256dd0293df99bb3fe262&link=transition.html&from=Search
-->
