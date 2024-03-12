<template>
  <div id="container">
    <!-- 折叠控制按钮 -->
    <div id="fold" :class="collapse? 'info-unfold':'info-fold'">
      <div class="btn" @click="collapse=!collapse">
        <i :class="'el-icon-d-arrow-'+(collapse?'left':'right')"></i>
      </div>
      <!-- 展开后的内容 -->
      <div id="overview">
        <ul>
          <li v-for="value in labels" :key="value">{{value}}</li>
        </ul>
        <table class="table table-striped" style="width: 90%">
          <thead>
          <tr>
            <th colspan="2">properties</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(value,key) in properties" :key="key">
            <td>{{key}}</td>
            <td>{{value}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- 缩放控制按钮 -->
    <div id="zooms">
      <div class="btn" @click="zoomIn()">
        <i class="el-icon-zoom-in"></i>
      </div>
      <div class="btn" @click="zoomOut()">
        <i class="el-icon-zoom-out"></i>
      </div>
      <div class="btn" @click="zoomCenter()">
        <i class="el-icon-full-screen"></i>
      </div>
    </div>
    <!-- svg画布 -->
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: "Graph",
  data(){
    return {
      // template
      labels:[''],              // detail information box:labels
      relationship:'',          // detail information box:relationships
      properties:{name:''},     // detail information box:properties
      collapse: false,          // detail information box:collapse state
      // js
      width: null,              // the width of svg
      height: null,             // the height of svg
      svg: null,                // the svg instance
      graph:null,               // a <g> container to include all graphics
      simulation:null,          // an instance of the force-graph simulation
      maps:null,                // a Map instance to compute the link.cache.offset of each link
      zoom: null,               // zoom instance
      zoomMax: 3,               // the maximum scale of zoom
      zoomMin: 0.1,             // the minimum scale of zoom
      color:null,               // a color sequence
      data1:{                   //
        nodes:[],
        links:[]
      },
      data:{                    /* 全局node和link（画布中所有的link和node） */
        nodes:[
          {id:1,label:['Person',],properties:{name:'风风',age:23}},
          {id:2,label:['Person',],properties:{name:'张三',age:23}},
          {id:3,label:['Person',],properties:{name:'李四',age:23}},
          {id:4,label:['Person',],properties:{name:'王二',age:23}},
          {id:5,label:['Person','Teacher',],properties:{name:'小二',age:23}},
          {id:6,label:['Person','Teacher',],properties:{name:'陈二',age:23}},
          {id:7,label:['Person','Teacher',],properties:{name:'郭靖',age:23}},
          {id:8,label:['Person','Teacher',],properties:{name:'某人',age:23}},
          {id:9,label:['Person','Teacher',],properties:{name:'小李',age:23}},
          {id:10,label:['Student',],properties:{name:'小张',age:23}},
          {id:11,label:['Student',],properties:{name:'小王',age:23}},
          {id:12,label:['Student',],properties:{name:'三毛',age:23}},
          {id:13,label:['Student',],properties:{name:'Winds',age:23}},
        ],
        links:[
          {source:0, target:1, cache:{delta:0,offset:0}, relationship:'relationship_in',properties:{name:'relationship_in'}},
          {source:0, target:2, cache:{delta:0,offset:0}, relationship:'live_in',properties:{name:'live_in'}},
          {source:0, target:3, cache:{delta:0,offset:0}, relationship:'graduate_from',properties:{name:'graduate_from'}},
          {source:0, target:4, cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:0, target:5, cache:{delta:0,offset:0}, relationship:'live_in',properties:{name:'live_in'}},
          {source:2, target:6, cache:{delta:0,offset:0}, relationship:'graduate_from',properties:{name:'graduate_from'}},
          {source:2, target:7, cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:2, target:8, cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:3, target:9, cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:3, target:10,cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:3, target:11,cache:{delta:0,offset:0}, relationship:'acted_in',properties:{name:'acted_in'}},
          {source:3, target:12,cache:{delta:0,offset:0}, relationship:'relationship_in1',properties:{name:'acted_in1'}},
          {source:3, target:12,cache:{delta:0,offset:0}, relationship:'relationship_in2',properties:{name:'acted_in2'}},
          {source:3, target:12,cache:{delta:0,offset:0}, relationship:'acted_in3',properties:{name:'acted_in3'}},
          {source:12, target:3,cache:{delta:0,offset:0}, relationship:'acted_in4',properties:{name:'acted_in4'}},
          {source:12, target:3,cache:{delta:0,offset:0}, relationship:'acted_in5',properties:{name:'acted_in5'}},
          {source:12, target:3,cache:{delta:0,offset:0}, relationship:'relationship_in6',properties:{name:'acted_in6'}},
        ],
      },               // testing data of this graph
      nodes:null,               // the selection of all nodes
      links:null,               // the selection of all links
    }
  },
  mounted() {
    this.init();
    /* 从后台请求数据 */
    // this.getCenter('Person')
    this.draw()
  },
  methods: {
    /**
     * 初始化力布局视图
     */
    init(){
      const _this = this;
      // 创建颜色
      this.color = d3.scaleOrdinal(d3.schemeCategory10);

      // 创建画布
      this.svg = d3.select('#container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')

      // 设置画布最顶层的g容器，包含所有图形
      this.graph = this.svg
        .append('g')
        .attr('id','graph')

      // 所有link的容器
      this.links = this.graph
        .append('g')              // 添加一个group
        .attr('class','links')    // all links
        .selectAll('.link') // empty set

      // 所有node的容器
      this.nodes = this.graph
        .append('g')  // 添加group元素
        .attr('class','nodes')  // all node
        .selectAll('.node') // empty set

      // 定义一个svg箭头
      this.svg.append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")     //设置为strokeWidth箭头会随着线的粗细发生变化
        .attr("markerUnits", "userSpaceOnUse")  //
        .attr("viewBox", "0 -5 10 10")          //坐标系的区域
        .attr("refX", 9)                     //箭头相对偏移
        .attr("refY", 0)
        .attr("markerWidth", 12)        //标识的大小
        .attr("markerHeight", 12)
        .attr("orient", "auto")         //绘制方向，可设定为：auto（自动确认方向）和 角度值
        .attr("stroke-width", 2)        //箭头宽度
        .append("path")                 // 箭头使用path绘制
        .attr("d", "M0,-5 L10,0 L0,5")  //箭头的路径
        .attr('fill', '#999');          //箭头颜色

      // 设置画布的缩放(拖动是附带的)
      this.zoom = d3.zoom()
        .scaleExtent([this.zoomMin, this.zoomMax])  //设置缩放的范围，指定缩放比例的最大值和最小值
        .on('zoom',function(event) {
          _this.graph.attr('transform', event.transform);
        });
      this.svg
        .call(this.zoom)
        .on('dblclick.zoom', null); // 禁止双击缩放

      // 在元素创建后获取元素的size
      const size = document.getElementById('container');
      this.width = size.clientWidth;
      this.height = size.clientHeight;

      // 创建力模型
      this.simulation = d3
        .forceSimulation() // 创建力模型
        .force('link',d3.forceLink().distance(200))  // 施加连接力
        .force('charge',d3.forceManyBody().strength(-500))  // 电荷力，相互之间的作用力,负值为引力
        .force('center',d3.forceCenter(this.width/2,this.height/2)) // 施加一个向心力，根据整个画布尺寸计算中心位置：(width/2,height/2)
        .force('collision', d3.forceCollide().radius(28))

      // 监听tick,时钟触发并回调ticked函数
      this.simulation.on('tick',function(){
        // 更新连接线的位置,参数d是lines处理过的数据，表示一条线段对象
         _this.links
          //给g容器添加平移和旋转
          .attr("transform",function(d){
            let angle = Math.atan2(d.target.y-d.source.y,d.target.x-d.source.x)*180/Math.PI; // 向量方向角(单位π)
            const text = d3.select(this).select('.link-text')
            d3.select(this).select('.link-core')
              .attr('d',function(d1) {
                let distance = Math.sqrt(Math.pow(d1.target.y - d1.source.y, 2) + Math.pow(d1.target.x - d1.source.x, 2)) //向量长度
                let middle = distance / 2;
                if (d1.cache.delta >= middle-26-9) {
                  let theta = Math.atan2(d.cache.offset*1.8,middle);
                  let delta_x = 26*Math.cos(theta);
                  let delta_y = 26*Math.sin(theta);
                  text
                    .style('visibility','hidden');  // 隐藏文字
                  return "M"+delta_x+' '+delta_y+' Q'+(distance)/2+' '+d1.cache.offset*2+' '+(distance-delta_x)+' '+delta_y;
                } else {
                  text
                    .style('visibility','visible') // 显示文字
                    .attr('x',middle)
                    .attr('y',d1.cache.offset);
                  // 文字翻转
                  if(angle>90 || angle<-90){
                    text.attr('transform','rotate(180 '+middle+' '+d1.cache.offset+')');
                  }else{
                    text.attr('transform',null);
                  }
                  // 当offset=0时，没有必要使用复杂的算法
                  if(d1.cache.offset===0){
                    return "M 26 0"+"L"+(middle-d1.cache.delta)+' 0'+'Z '+'M'+(middle+d1.cache.delta)+' 0 L'+(distance-26)+' 0';
                  }else{
                    let theta = Math.atan2(d.cache.offset*1.8,middle);
                    let delta_x = 26*Math.cos(theta);
                    let delta_y = 26*Math.sin(theta);
                    return "M"+delta_x+' '+delta_y+"Q"+(delta_x+middle-d.cache.delta)/2+' '+(0.83*d.cache.offset)+' '+(middle-d.cache.delta)+' '+d.cache.offset
                      + "M"+(middle+d.cache.delta)+' '+d.cache.offset+" Q"+(middle+d.cache.delta+distance-delta_x)/2+' '+(0.83*d.cache.offset)+' '+(distance-delta_x)+' '+delta_y ;
                  }
                }
              });
            return 'translate('+(d.source.x)+','+d.source.y+') rotate('+angle+')';
          })
        // 更新整个node group的位置
        _this.nodes.attr('transform',function (d){
          return 'translate('+d.x+','+d.y+')';
        })
      });
    },
    /**
     * 绘制力布局视图
     */
    draw() {
      const _this = this
      /******************************************力导向图实现代码*****************************************/
      this.simulation.nodes(this.data.nodes)  // 在使用simulation添加数据之后，this.data.nodes和this.data.links都被格式化了
      this.simulation.force('link').links(this.data.links)
      /*
       * 参考:https://blog.csdn.net/p1967914901/article/details/108994623
       */
      // 绘制连线：likes表示线选择集
      let enter
      this.links
        .data(this.data.links)    // 绑定数据集
        .join(function(e){
          enter=e.append('g').attr('class','link')
        })
      this.links = enter.merge(this.links);
      enter
        .append('path')
        .attr('class','link-core')
        .attr('stroke','#999')
        .attr('stroke-width',1)
        .attr('fill','none')
        .attr('marker-end','url(#arrow)'); // 使用箭头
      enter
        .append('text')
        .attr('class','link-text')
        .text(d=>d.relationship)
        .attr('fill',d=>_this.color(d.relationship))
        .attr('text-anchor',"middle")
        .attr('alignment-baseline',"middle")
        .attr('font-size',18);
      enter
        .append('path')
        .attr('class','link-wrap')

      /*
       * 初始化link.cache.delta
       * 遍历所有link，获取每一个text的宽度,并计算delta值(text_len/2+4),以此提高计算速度
       */
      enter.selectAll('.link-text').each(function(d){
        d.cache.delta = d3.select(this).node().getComputedTextLength()/2+4;
      });
      // link点击事件
      enter.on('click',function(_,d){
        // 更新面板信息
        _this.properties = d.properties
      })
      /*
       * 初始化link.cache.offset
       */
      this.maps = new Map()
      enter.filter(function(d){
        if(!_this.maps.has(d.source.index+'-'+d.target.index)&&!_this.maps.has(d.target.index+'-'+d.source.index)){
          _this.maps.set(d.source.index+'-'+d.target.index,0);
        }else if(!_this.maps.has(d.source.index+'-'+d.target.index)&&_this.maps.has(d.target.index+'-'+d.source.index)) {
          d.cache.offset = 20;
          _this.maps.set(d.source.index+'-'+d.target.index,d.cache.offset);
        }else {
          d.cache.offset = _this.maps.get(d.source.index+'-'+d.target.index)+20;
          _this.maps.set(d.source.index+'-'+d.target.index,d.cache.offset);
        }
      });

      // 绘制结点:nodes表示节点选择集
      this.nodes
        .data(this.data.nodes)
        .join(function(e){
          enter = e.append('g').attr('class','node')
        })
      this.nodes = enter.merge(this.nodes)
      enter
        .append('circle')
        .attr('class','node-wrap')
        .attr('r',25)  // 外圈circle半径
      enter
        .append('circle')
        .attr('class','node-core')
        .attr('r',25)   // 设置circle半径
        .style('fill',d=>_this.color(d.label[0]))
        .style('stroke',d=>this.darken((_this.color(d.label[0]))))
        .style('stroke-width',2);
      enter
        .append('text')
        .attr('class','node-text')
        .attr('dy','.33em')
        .text(d=>d.properties.name)   // text内容
        .attr('font-size',12)
        .attr('text-anchor','middle')
        .attr('fill','#eee')
        .attr('pointer-event',null);
      // 节点拖拽效果
      enter.call(
        d3.drag()
          .on('start',function(event){  // 监听拖拽开始事件
            if(!event.active) _this.simulation.alphaTarget(0.1).restart();
            /* 初始化节点的固定位置 */
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
          })
          .on('drag',function(event){   // 监听拖拽事件
            /* 在拖拽过程中，更新node的固定位置 */
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end',function (event){
            if(!event.active) _this.simulation.alphaTarget(0);
            /* fx是节点的固定位置，如果不将fx设置为null，那么拖拽结束后，节点将位置固定 */
            // event.subject.fx = null;
            // event.subject.fy = null;
          })
      );
      // node点击事件
      enter.on('dblclick',function (event,d){  // node双击事件
        event.preventDefault()  //组织双击默认事件
        // d是被点击的目标node
        _this.generate(d); // 随机添加节点
      });
      enter.on('click',function(event,d){ // node单击事件
        event.preventDefault();
        console.log(d)
        if(d.fx!==null){
          /*
           * 当 fx 和 fy 属性都为 null 时，节点将不再被固定在特定位置，而是受到力导向图算法的影响，可以自由移动到合适的位置
           */
          d.fx = null;
          d.fy = null;
          _this.simulation.alpha(0.3).restart();
        }
        // 更新面板信息
        _this.properties = d.properties;
      });

      // 重新启动simulation
      this.simulation.alpha(0.3).restart()
    },
    /**
     * 获取指定标签的所有节点数据
     */
    getCenter(label){
      this.$http.get(
        'http://localhost:3000/graph/nodes'
      ).then(res=>{
        console.log(res)
      }).catch(err=>{
        // 请求失败使用随机数据
        // console.log("使用随机数据")
        this.generate(node)
      })
    },
    /**
     * 从后台请求指定节点的所有相邻节点
     */
    getAround(node){
      this.$http.get(
        'http://localhost:3000/graph/relationships'
      ).then(res=>{
        console.log(res)
      }).catch(err=>{
        // 请求失败使用随机数据
        // console.log("使用随机数据")
        this.generate(node)
      })
    },
    /**
     * 给指定节点随机添加若干相连节点
     */
    generate(current){
      // 如果是从后端请求数据，需要考虑避免重复
      const l = Math.floor(Math.random()*this.data.nodes.length); // 生成l个link
      const n = Math.floor(Math.random()*l); // n<=l,使用的已有节点数
      // 生成节点
      const nodes = Array.from({length: l-n}, (_, i)=>({
        id: Math.floor(Math.random()*1000),
        label:this.generateString(5),
        properties:{
          name:this.generateString(5),
        }
      }));
      for (let i=0;i<l; i++){
        let index
        do{
          index = Math.floor(Math.random()*(this.data.nodes.length))
        } while(index===current.index);
        const link = {
          source:current,
          target:i<l-n? nodes[i]:this.data.nodes[index],
          cache:{
            delta:0,
            offset:0,
          },
          relationship:current.properties.name+"_"+this.generateString(2),
          properties: {
            name: this.generateString(10),
          },
        }
        this.data.links.push(link)
      }
      for(let i=0;i<l-n;i++){
        this.data.nodes.push(nodes[i])
      }
      console.log(this.data.nodes.length)
      console.log(this.data.links.length)
      this.draw() // 重新绘制
    },
    generateString(length) {
      let result = '';
      let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    },
    /**
     * 放大
     */
    zoomIn(){
      this.svg.transition().call(this.zoom.scaleBy, 1.3);
    },
    /**
     * 缩小
     */
    zoomOut() {
      this.svg.transition().call(this.zoom.scaleBy, 0.7);
    },
    /**
     * 图像居中显示
     */
    zoomCenter(){
      // 获取#box容器的bbox
      const graph = d3.select('#graph').node().getBBox();

      // 计算X,Y方向的缩放比例
      const scaleX = this.width / graph.width;
      const scaleY = this.height / graph.height;
      // 计算scale因子k
      let k = Math.min(scaleX, scaleY) * 0.9;
      k = Math.max(k, this.zoomMin);
      k = Math.min(k, this.zoomMax); // 用画布大小 / 当前svg得大小 获取到比例值

      /*
       * 算出居中得x、y坐标（往俩盒子 一个大盒子（画布）和另外一个盒子（图形撑起来得））怎么让图形撑起来得居中呢！！！
       * 用画布自身得一半 减去 group得一半 * 缩放 K, 再减去group得translate
       */
      const translateByX = this.width / 2 - (graph.width / 2) * k - (graph.x * k);
      const translateByY = this.height / 2 - (graph.height / 2) * k - (graph.y * k);

      const transform = d3.zoomIdentity
        .translate(translateByX, translateByY)
        .scale(k); // 获取到目标 transform

      this.svg.transition() // 过渡效果
        .duration(100) // 100ms
        .call(this.zoom.transform, transform);
    },
    /**
     * 颜色加深算法
     * color必须是'#xxxxxx'的形式
     */
    darken(color){
      /*
       * rgb值越小颜色越深，rgb越大颜色越浅。当同时将r，g，b，改变相同delta时，颜色将边深或变浅
       */
      const delta = 30; // 颜色
      let r = parseInt('0x' + color.slice(1, 3)) - delta;
      let g = parseInt('0x' + color.slice(3, 5)) - delta;
      let b = parseInt('0x' + color.slice(5, 7)) - delta;
      r = r>=0? r:0;
      g = g>=0? g:0;
      b = b>=0? b:0;
      return 'rgb('+r+','+g+','+b+')';
    },
  },
}
</script>

<style scoped>
#container{
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  box-sizing: border-box;
  //background-color: #182838;
  background-color: #192939;
}
#fold{
  position: absolute;
  top: 8px;
  left: 8px;
}
.info-fold{
  width: 32px;
  height: 32px;
  overflow: hidden;
}
.info-unfold{
  width: 300px;
  top: 8px;
  bottom: 8px;
  border-radius: 3px;
  background-color: #2c3a4a;
}
#zooms{
  position: absolute;
  bottom: 8px;
  right: 8px;

  width: 32px;
  height: 96px;
}
.btn{
  width: 30px;
  height: 30px;
  margin: 2px;
  box-sizing: border-box;
  line-height: 32px;
  text-align: center;
  font-size: 22px;
  border-radius: 3px;
  color: #aaaaaa;
}
.btn:hover{
  color: lime;
  font-size: 26px;
}
</style>

<style>
/* 所有连接 */
.links{

}
/* 单个连接 */
.link{

}
/* 连接核心 */
.link-core{

}
/* 连接文本 */
.link-text{
  //pointer-events: none;
}
/* 线段外壳 */
.link-wrap{

}
/* 所有节点 */
.nodes{

}
/* 单个节点 */
.node{

}
/* 节点核心 */
.node-core{

}
/*
.node-core:hover{
  .node-wrap{
    stroke-width: 16px;
  }
}
*/
/* 节点外壳 */
/*
.node-wrap{
  stroke:gray;
  stroke-width: 0;
}
*/
/*
.node-wrap:hover{
  stroke-width: 16px;
}
*/
/* 节点文本 */
.node-text{

}
</style>
