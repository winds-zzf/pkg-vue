<template>
  <div id="container">

  </div>
</template>

<script>
import * as d3 from 'd3'
import data from './data/graph4.json'
export default {
  name: "Graph4",
  data(){
    return {

    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    draw() {
      const width = 1000;
      const height = 618;

      const svg = d3
        .select('#container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      const nodes = Array.from({length:13}, () => ({}));
      const links = [
          { source: 0, target: 1 },
          { source: 1, target: 2 },
          { source: 2, target: 0 },
          { source: 1, target: 3 },
          { source: 3, target: 2 },
          { source: 3, target: 4 },
          { source: 4, target: 5 },
          { source: 5, target: 6 },
          { source: 5, target: 7 },
          { source: 6, target: 7 },
          { source: 6, target: 8 },
          { source: 7, target: 8 },
          { source: 9, target: 4 },
          { source: 9, target: 11 },
          { source: 9, target: 10 },
          { source: 10, target: 11 },
          { source: 11, target: 12 },
          { source: 12, target: 10 }
        ]

      // Add a line for each link, and a circle for each node.
      const link = svg.append("g")
        .selectAll('.node')
        .data(links)
        .join("line")
        .classed('link',true) // 添加class="line"
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width",2);

      const node = svg.append("g")
        .selectAll()
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", 'red')
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .attr('class','node') //添加class="node"
        .classed('fixed',d=>d.fx!==undefined);  // 如果已经定义了d.fx那就使用fixed

      // Create a simulation with several forces.
      const simulation = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

      // Add a drag behavior.
      node.call(d3.drag()
        .on("start", function(event) {
          // 拖拽开始的时候，设置为fixed样式
          d3.select(this).classed("fixed", true);
        })
        .on("drag", (event,d) => {
          d.fx = this.clamp(event.x, 0, width);
          d.fy = this.clamp(event.y, 0, height);
          simulation.alpha(1).restart();
        })
        /*
         * 当不添加drag-end阶段时，node拖动后固定
         */
      );

      node.on('click', function click(event, d) {
        delete d.fx;
        delete d.fy;
        // 点击node时，解除锁定并删除fixed样式
        d3.select(this).classed("fixed", false);
        simulation.alpha(1).restart();
      })
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
    },
    clamp(x, lo, hi) {
      return x < lo ? lo : x > hi ? hi : x;
    }
  }
}
</script>

<style scoped>
.fixed {
  fill: #f00;
}
</style>
