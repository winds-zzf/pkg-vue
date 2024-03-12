<template>
  <div id="graph">

  </div>
</template>

<script>
// 导入d3
import * as d3 from 'd3'
import transform from "./Transform.vue";
export default {
  name: "Graph",
  data() {
    return {

    }
  },
  mounted() {
    this.draw();
  },
  methods:{
    draw() {
      // 画布尺寸
      const width = 1000;
      const height = 618;
      // 添加svg画布
      const svg = d3
        .select("#graph")
        .append('svg')
        .attr('width',width)
        .attr('height',height);

      // 节点
      const data={
        nodes:[
          {name:'风风'},
          {name:'张三'},
          {name:'李四'},
          {name:'王二'},
          {name:'小二'},
          {name:'陈二'},
          {name:'郭靖'},
          {name:'某人'},
          {name:'小李'},
        ],
        links:[
          {source:0, target:1, relationship:'关系01'},
          {source:0, target:2, relationship:'关系02'},
          {source:0, target:3, relationship:'关系03'},
          {source:0, target:4, relationship:'关系04'},
          {source:0, target:5, relationship:'关系05'},
          {source:0, target:6, relationship:'关系06'},
          {source:0, target:7, relationship:'关系07'},
          {source:0, target:8, relationship:'关系08'},
          {source:2, target:1, relationship:'关系01'},
          {source:2, target:3, relationship:'关系02'},
          {source:3, target:7, relationship:'关系03'},
          {source:3, target:8, relationship:'关系04'},
          {source:4, target:5, relationship:'关系05'},
          {source:4, target:6, relationship:'关系06'},
          {source:5, target:7, relationship:'关系07'},
          {source:5, target:8, relationship:'关系08'},
        ]
      }

      // const color = d3.scaleOrdinal(d3.schemeCategory10);

      // 创建力模型
      let simulation = d3
        .forceSimulation(data.nodes) // 创建力模型
        .force('charge',d3.forceManyBody().strength(-300))  // 电荷力，相互之间的作用力,负值为引力
        .force('center',d3.forceCenter(width/2,height/2)) // 施加一个向心力，根据整个画布尺寸计算中心位置：(width/2,height/2)
        .force('link',d3.forceLink(data.links).distance(100))  // 施加连接力

      svg.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")   //设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")
        .attr("viewBox", "0 -5 10 10")//坐标系的区域
        .attr("refX", 25+1+5)//箭头坐标
        .attr("refY", 0)
        .attr("markerWidth", 12)//标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")//绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 2)//箭头宽度
        .append("path")
        .attr("d", "M0,-5 L10,0 L0,5")//箭头的路径
        .attr('fill', '#999');//箭头颜色

      // 绘制连线
      let lines = svg
        .append('g')    // 添加一个group
        .attr('class','lines')  // 给group属性添加class:nodes-box
        .selectAll('.line') // 使用类选择器
        .data(data.links)    // 绑定数据集
        .join('g')
        .attr('class','line');
      lines
        .append('path') // 添加形状:线段
        .attr('class','line-core')    // 设置元素class
        .attr('id',d=>d.source.index+'_'+d.relationship+'_'+d.target.index)   // 设置path的id
        .attr('stroke','#999')  // 设置画笔颜色
        .attr('stroke-width',1)  //设置画笔宽度
        .attr('marker-end','url("#arrow")')

      let texts = svg.append('g')
        .selectAll('.line-text')
        .data(data.links)
        .join('text')
        .append('textPath')
        .text(d=>d.relationship)
        .attr('xlink:href',d=>'#'+d.source.index+'_'+d.relationship+'_'+d.target.index)
        .attr('startOffset',"50%")
        .attr('text-anchor',"middle")
        .attr('alignment-baseline',"middle")
        .attr('font-size',10)
        .attr('fill','black');

      let nodes = svg
        .append('g')  // 添加group元素
        .attr('class','nodes')  // all node
        .selectAll('.node')
        .data(data.nodes)
        .join('g')
        .attr('class','node')
      nodes
        .append('circle')
        .attr('class','node-wrap')
        .attr('r',25)  // 外圈circle半径
      nodes
        .append('circle')
        .attr('class','node-core')
        .attr('r',25)   // 设置circle半径
        .style('fill','red')
        .style('stroke','white')
        .style('stroke-width',2);
      nodes
        .append('text')
        .attr('class','node-text')
        .attr('dy','.33em')
        .attr('text-anchor','middle')
        .text(d=>d.name);   // text内容

      // 监听tick,时钟触发并回调ticked函数
      simulation.on('tick',function(){
        // 更新连接线的位置,参数d是lines处理过的数据，表示一条线段对象
        lines.selectAll('.line-core')
          .attr('d',function(d){
             return 'M '+d.source.x+' '+d.source.y+' L '+d.target.x+' '+d.target.y;
          })
        // 更新整个node group的位置
        nodes.attr('transform',function (d){
          return 'translate('+d.x+', '+d.y+ ')';          // d.fx=d.x;d.fy=d.y 固定位置
        })
      });

      // 给所有节点添加拖拽效果
      nodes.call(
        d3.drag()
          .on('start',function(event){  // 监听拖拽开始事件
            //拖放开始时，alphaTarget设置为比alphaMin更大的值，即会在拖放的过程中力导向图持续运算（防止拖到一半结束的情况）
            if(!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag',function(event){   // 监听拖拽事件
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end',function(event){    // 监听拖拽结束事件
            // 拖放结束时，alphaTarget设置为0，即在拖放结束后的一段时间内，力导向图停止运算。
            if(!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          })
      );
    },
  }
}
</script>

<style scoped>
</style>

<!--
attr()方法用于给标签元素添加属性
style()方法用于给标签添加样式
attr和style都支持回调函数作为参数，用法相同
-->
