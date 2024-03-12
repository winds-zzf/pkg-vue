<template>
  <div id="container">
    <div id="fold" :class="collapse? 'info-unfold':'info-fold'">
      <div class="btn" @click="collapse=!collapse">
        <i :class="'el-icon-d-arrow-'+(collapse?'left':'right')"></i>
      </div>
      <div>

      </div>
    </div>
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
    <div id="svg">

    </div>
  </div>
</template>

<script>
export default {
  name: "Relative",
  data(){
     return {
       collapse:false,
     }
  },
  methods:{
    zoomIn() {

    },
    zoomOut() {

    },
    zoomCenter() {

    },
  }
}
</script>

<style scoped>
#container{
  position: relative;
  width: 80%;
  height: 80%;
  background-color: lightblue;
  margin: 50px;
}
#svg{
  width: 100%;
  height: 100%;
  background-color: lightblue;
}
#fold{
  position: absolute;
  top: 8px;
  left: 8px;
}
.info-fold{
  width: 32px;
  height: 32px;
}
.info-unfold{
  width: 200px;
  top: 8px;
  bottom: 8px;
  border-radius: 3px;
  background-color: green;
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
  color: cornsilk;
}
.btn:hover{
  background-color: #43ffce;
}
</style>
