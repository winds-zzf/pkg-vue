<template>
  <div id="container">
    <button @click="zoomOut()">放大</button>
    <button @click="zoomIn()">缩小</button>
    <button @click="zoomCenter()">居中</button>
    <!--
    svg标签表示整个画布，可以设置通过(width,height)动态设置画布的大小
    <svg>
      g标签用作容器，里面放置所有的图形，对图形的缩放拖拽就是对g的拖拽和缩放
      <g>
        <graph><graph> //使用力导向图嵌入其中
      </g>
    </svg>
    -->
  </div>
</template>

<script>
import * as d3 from 'd3'
import graph from "./Graph.vue";
export default {
  name: "Zoom",
  data(){
    return {
      svg:null,
      zoom:null,
      zoomMax:null,
      zoomMin:null,
      width:null,
      height:null,
      data:null,
    }
  },
  mounted() {
    this.draw();
  },
  methods: {
    draw() {
      let transform = {
        x:0, // x坐标变化
        y:0, // y坐标变化
        k:1, // k缩放比例[zoomMin,zoomMax]
      }

      // 最大scale比例
      this.zoomMin = 0.3;
      // 最小scale比例
      this.zoomMax = 5;
      // 画布尺寸，画布大小可以动态修改
      this.width = 1000;
      this.height = 618;

      // 创建画布
      this.svg = d3.select('#container')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      // 设置画布最顶层的g容器，包含所有图形
      const container = this.svg
        .append('g')
        /*
         * 使用变换属性transform(可能需要转换svg坐标远点)
         * translate使得g可以拖动(拖动需要区分是对元素的拖动还是对布局的拖动)
         * translate使得g可以缩放
         * rotate使得g可以旋转
         */
        .attr(
          'transform',
          // transform封装了拖拽和缩放操作的参数(x,y,k)
          `translate(${transform.x},${transform.y} ) scale(${transform.k})`,
        );

      /*
       * 数据
       * 如果数据动态改变应该怎么处理？
       */
      this.data = [
        { id: 1, fill: 'black', x: 10, y: 10 },
        { id: 2, fill: 'green', x: 50, y: 50 },
        { id: 3, fill: 'blue', x: 100, y: 70 },
        { id: 4, fill: 'red', x: 20, y: 100 }
      ];

      /*******************************************************绘制图形***********************************************/
      const update = container.selectAll('rect')
        .data(this.data, d => d.id);   // d.id 是用来指定数据对象中的唯一标识符，以便在数据更新时正确识别每个数据对象。
      //修改层
      update
        .attr('x', (d, idx) => d.x)
        .attr('y', (d, idx) => d.y)
        .attr('fill', (d) => d.fill)

      //渲染层
      const enter = update.enter();
      //删除层
      const exit = update.exit();

      //添加不足的元素
      enter.append('rect')
        .attr('width', 20)            // 设置width属性
        .attr('height', 20)           // 设置height属性
        .attr('id', d => d.id)        // 元素id
        .attr('x', (d, i) => d.x)     // x轴坐标
        .attr('y', (d, i) => d.y)     // y轴坐标
        .attr('fill', (d) => d.fill)  // 填充颜色
        .attr('stroke', 'blue')       // 画笔颜色
        .attr('strokeWidth', 1)       // 画笔宽度

      // 移除多余的元素
      exit.remove();

      /********************************************************绑定zoom*********************************************************/
      this.zoom = d3.zoom()        // 创建一个缩放对象zoom,通过调用d3.zoom()方法来实例化一个缩放对象
        .scaleExtent([this.zoomMin, this.zoomMax])  //设置缩放的范围，指定缩放比例的最大值和最小值
        .on('zoom', function () { // 监听缩放事件
          /*
           * d3.zoomTransform()会返回一个表示当前缩放变换状态的对象，包括缩放比例 k（scale）、平移偏移量x和y
           * 通过this表示当前缩放变换的
           */
          transform = d3.zoomTransform(this);
          // g容器在container选择集中
          container.attr('transform', transform);
          // 输出自定义事件transform
          console.log(transform, 'transform...')
        })

      this.svg
        .call(this.zoom) // 将缩放对象zoom应用到svg上，使得svg元素能够响应缩放时间
        .on('dblclick.zoom', null);     // 禁用双击缩放功能

      /*******************************************************为容器中的图形添加拖拽效果*********************************************************/
      const drag = d3.drag()
      drag.on('start',function(event){
        console.log(event)
      }).on('drag',function(event){
        console.log(event)
        d3.select(this)
          .attr('x',event.x)
          .attr('y',event.y)
      }).on('end',function(event){
        console.log(event)
        // 拖动结束后更新subject(x,y)的坐标
        event.subject.x = event.x;
        event.subject.y = event.y;
      })
      const rects = this.svg.selectAll('rect');
      rects.call(drag);
    },
    zoomOut(){
      this.svg.transition().call(this.zoom.scaleBy, 1.3);
    },
    zoomIn() {
      this.svg.transition().call(this.zoom.scaleBy, 0.7);
    },
    zoomCenter(){
      // const containerX = this.data.map((item) => item.x);
      // const containerY = this.data.map((item) => item.y);
      //
      // const minX = Math.min.apply(null, containerX);
      // const maxX = Math.max.apply(null, containerX);
      // const minY = Math.min.apply(null, containerY);
      // const maxY = Math.max.apply(null, containerY);

      // 获取g容器的bbox
      const bbox = d3.select('#container').select('g').node().getBBox();

      const scaleX = this.width / bbox.width;
      const scaleY = this.height / bbox.height;

      let k = Math.min(scaleX, scaleY) * 0.7;
      k = Math.max(k, this.zoomMin);
      k = Math.min(k, this.zoomMax); // 用画布大小 / 当前svg得大小 获取到比例值

      // 算出居中得x、y坐标（往俩盒子 一个大盒子（画布）和另外一个盒子（图形撑起来得））怎么让图形撑起来得居中呢！！！
      // 用画布自身得一半 减去 group得一半 * 缩放 K, 再减去group得translate
      const translateByX = this.width / 2 - (bbox.width / 2) * k - (bbox.x * k);
      const translateByY = this.height / 2 - (bbox.height / 2) * k - (bbox.y * k);


      const transform = d3.zoomIdentity
        .translate(translateByX, translateByY)
        .scale(k); // 获取到目标 transform

      this.svg.transition() // 过渡效果
        .duration(100) // 100ms
        .call(this.zoom.transform, transform);
    }
  }
}
</script>

<style scoped>

</style>
