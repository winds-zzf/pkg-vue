<template>
  <div id="main" class="main">
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
    <div class="item"><p></p></div>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "GraphV",
  mounted() {
    this.draw();
  },
  methods:{
    draw(){
      // 选择集就是一个选中元素的集合，不过d3.js对这个集合进行了封装，可以支持批量操作等复杂的操作
      // 选择集中同时保存了这些元素的父节点,通过选择集可以对选中的元素进行批量的处理，比如批量设置样式，设置class设置属性等
      const main = d3.select("#main");  // main选择集中是div元素
      console.log(main);
      /*
       * g对应的也是d3.js的一个标签，执行main.append('g')将在main的选择集中的元素(<div></div>)后面添加一个<g></g>元素，即<div><g></g></div>
       * g用作svg中的容器元素，通常用于组合其他图形元素，可以将多个图形元素放在同一个<g>元素中进行统一的变换、样式设置等操作。
       */
      const p = main.selectAll('div').append('g');
      // const ps = d3.selectAll('p').insert('g');
    }
  },
}
</script>

<style scoped>

</style>


<!--
 在d3.js中，选择集是指一组已选定的元素，可以对这些元素进行操作或者绑定数据。选择集可以通过选择器选中特定的元素，然后可以对这些元素进行各种操作，比如修改样式、绑定数据、添加事件等。选择集的概念类似于CSS选择器，但在d3.js中，选择集不仅可以选中元素，还可以对选中的元素进行更复杂的操作和处理。
 在d3.js中，使用d3.select()或者d3.selectAll()来创建选择集。例如，d3.select('div')会选择文档中第一个<div>元素，而d3.selectAll('p')会选择文档中所有的<p>元素。选择集可以用来绑定数据、设置样式、添加事件监听器等操作，是d3.js中非常重要的概念之一。
-->
<!--
insert和update都是为选择集中的所有元素添加子元素,知识这个子元素位置不同
在d3.js中，append('g')用于在选择集中的每个元素后追加一个新的<g>元素。<g>元素是SVG中的一个容器元素，通常用于组合其他图形元素，可以将多个图形元素放在同一个<g>元素中进行统一的变换、样式设置等操作。
使用append('g')可以创建一个新的<g>元素，并将其添加到选择集中的每个元素后面。这样可以方便地将多个元素组合在一起，并对它们进行统一的处理。例如，可以将多个图形元素放在同一个<g>元素中，然后对这个<g>元素进行平移、旋转、缩放等操作，从而实现对这些图形元素的统一控制。
-->
