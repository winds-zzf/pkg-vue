<template>
  <div id="container">

  </div>
</template>

<script>
import * as d3 from 'd3'
import data from './data/graph5.json'
export default {
  name: "Graph5",
  data() {
    return {}
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

      let simulation = d3
        .forceSimulation()  // 未添加数据
        .force('link',d3.forceLink()) // 未添加数据
        .force('charge',d3.forceManyBody().strength(-100))
        .force('center',d3.forceCenter(width/2,height/2))

      d3.json('./data/graph5.json')
        .then(function(data){
          simulation
            .nodes(data.nodes)
            .on(this.tick)
          simulation
            .force('link')
            .links(data.links)
            .distance(200);
        });

      const color = d3.scaleOrdinal(d3.schemeCategory10);
    },
  },
}
</script>

<style scoped>

</style>
