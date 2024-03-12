<template>
  <div id="app">
    <keep-alive>
      <!-- 这个位置除了Framework之外还可能是一些登录、注册或登出页面 -->
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app{
  height:100%;
  margin: 0;
  padding: 0;
}
/* 隐藏el-scrollbar横向滚动条。这个样式如果写在<style scoped>中，则不会生效。*/
.el-scrollbar{
  height: 100%;
}
.el-scrollbar__wrap{
  overflow-x: hidden;
}
</style>
