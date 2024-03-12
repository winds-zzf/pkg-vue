<template>
  <div id="container">

  </div>
</template>

<script>
import * as d3 from 'd3'
import data from './data/graph6.json'
export default {
  name: "Graph6",
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
    },
  },
}
</script>

<style scoped>

</style>
