<template>
  <div id="container" style="height: 100%;width: 100%">

  </div>
</template>

<script>
import * as d3 from 'd3'
import data from './data/graph2.json'
export default {
  name: "Graph2",
  mounted() {
    this.draw()
  },
  methods:{
    draw(){
      const width = 1000;
      const height = 618;

      const svg = d3
        .select('#container')
        .append('svg')
        .attr('width',width)
        .attr('height',height);

      // Specify the color scale.
      const color = d3.scaleOrdinal(d3.schemeCategory10);

      /*
       * 在 JavaScript 中，map() 是一个数组方法，用于创建一个新数组，其中的每个元素都是原始数组中的对应元素经过处理后得到的结果。在这里，data.links.map(d => ({...d})) 和 data.nodes.map(d => ({...d})) 分别是对 data.links 和 data.nodes 数组中的每个元素进行浅拷贝的操作。
       * ...d 是 ES6 中的语法，称为展开运算符。它可以用来将一个对象展开为另一个对象，实现对象的浅拷贝。在这里，{...d} 表示创建一个包含对象 d 所有属性的新对象。
       */
      const links = data.links.map(d => ({...d}));
      const nodes = data.nodes.map(d => ({...d}));
      console.log(links);
      console.log(nodes);

      // Create a simulation with several forces.
      const simulation = d3.forceSimulation(nodes)
        /*
         * id() 函数用于指定链接力(forceLink)使用的节点标识符函数。这个函数会根据传入的参数 d 返回节点的标识符。在这里，d => d.id 表示使用节点对象的 id 属性作为节点的标识符。
         */
        .force("link", d3.forceLink(links).id(d => d.id))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("charge", d3.forceManyBody())
        .force("x", d3.forceX())
        .force("y", d3.forceY());

      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
        .attr("stroke", "#999")
        //stroke-opacity 属性指定了当前对象的轮廓的不透明度。它的默认值是 1。
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line") // 比使用append('line方便')，不用调用enter、exit等函数
        .attr("stroke-width", d => Math.sqrt(d.value));

      const node = svg.append("g")
        // circle的border颜色与背景相同，因此显示连线是断开的
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 5)
        // 分组染色，可以用标签作为分组的依据
        .attr("fill", d => color(d.group));

      node.append("title")
        .text(d => d.id);

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", (event)=>{
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event)=>{
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", (event)=>{
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        }));

      // Set the position attributes of links and nodes each time the simulation ticks.
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

      // When this cell is re-run, stop the previous simulation. (This doesn’t
      // really matter since the target alpha is zero and the simulation will
      // stop naturally, but it’s a good practice.)
      // invalidation.then(() => simulation.stop());

      //return svg.node();
    }
  }
}
</script>

<style scoped>

</style>


<!--
 .join("line") 和 .append("line") 是 D3.js 中用于处理数据绑定的两个方法，它们的作用略有不同。

.join("line")：

.join() 方法用于指定如何处理数据绑定的更新、输入和退出阶段。
在这里，.join("line") 表示将数据绑定到选择集上，并根据数据的状态来更新、输入和退出元素。这里的元素类型是线条(line)。
如果数据中存在新的数据项，它们会被添加为新的线条元素；如果数据中有已存在的数据项，它们会被更新；如果数据中有多余的数据项，对应的线条元素会被移除。
.append("line")：

.append() 方法用于在选择集中添加新元素。
在这里，.append("line") 表示在选择集中添加新的线条元素。如果选择集中已经存在元素，那么每个元素都会添加一个新的线条元素。
在这段代码中，使用 .join("line") 可以更好地处理数据的更新、输入和退出，确保选择集中的元素与数据的状态保持一致。如果使用 .append("line")，则可能会导致选择集中存在多余的线条元素或者无法正确更新已存在的元素。

如果你想要在选择集中添加不同类型的元素，可以使用 .join() 方法并在其中指定不同的元素类型，例如 .join("circle")。这样可以根据数据的状态来处理不同类型的元素，使得数据的展示更加灵活和动态。
-->
