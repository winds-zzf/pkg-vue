<template>
  <div id="graph">

  </div>
</template>

<script>
import * as d3 from 'd3';
export default {
  name: "Drag",
  data(){
    return {

    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      // svg画布尺寸
      const width = window.innerWidth;
      const height = window.innerHeight;

      // 添加svg画布并设置属性
      const svg = d3
        .select('#graph')
        .append('svg')
        //设置svg标签的属性
        .attr('width',width)
        .attr('height',height);

      // 在svg中添加一个圆形
      const circle = svg
        .append('circle') //circle标签
        // 使用cx和cy设置circle的位置
        .attr('cx',100)
        .attr('cy',100)
        .attr('r',40)           // 设置circle标签属性
        .attr('fill','red')
        .attr('class',"my_circle");

      // 监听拖拽事件：选择集通过call函数调用回调函数时，会把选择集自身作为回调函数的参数
      // 1. 通过d3.drag()产生一个拖动事件
      const drag = d3.drag();
      // 2. 给drag事件添加三个阶段的监听函数，可以分开设置，也可以连续设置
      drag
        .on('start',(event)=>{
          console.log(event);
          console.log(this);
          // 事件被d3.js封装成d3.event对象，并以函数参数传递给回调函数。不可以直接使用d3.event访问事件对象。
          // console.log(d3.event)  // error
        })
        .on('drag',(event)=>{
          console.log(event);
          // 当某个事件被监听到时，D3会把当前的事件的各种参数存到d3.event 对象
          //d3.select(this)   // 监听器函数中使用 d3.select(this) 来表示选择当前的元素，this 存的是当前响应事件的元素(本程序中表示circle元素)
          circle // 但是v7中d3.select(this)无法使用
            // 使用event中记录的当前光标位置更新circle位置
            .attr('cx', event.x)
            .attr('cy', event.y);
        })
        .on('end',(event)=>{
          console.log(event);
        });
      // 3. circle调用call方法会将circle绑定到drag事件上
      circle.call(drag);
    }
  }
}
</script>

<style scoped>

</style>

<!--
d3.event
{
  "type": "drag",                   // 事件类型、阶段。这里分别是三个阶段对应的start，drag，end
  "subject": {"x":12.5,"y":-11.5},  // subject表示当前事件的目标对象，subject中的坐标就是start阶段的鼠标位置，并且在整个drag和end阶段保持不变
  "identifier": "mouse",            //
  "active": 1,                      // drag事件是否激活：(start、end阶段为0，drag阶段为1)
  "x": -30.5                        // 鼠标位置
  "y": -42.5
  "dx": -6                          // 鼠标相对于上次drag的x,y坐标变化
  "dy": -6
  "sourceEvent":MouseEvent(...)     //浏览器原生事件
}
-->
