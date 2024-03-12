<template>
  <el-container>
    <el-aside style="width:auto;">
      <!-- Logo区域 -->
      <div style="height: 6%;display: flex; align-items: center;">
        <el-menu :collapse="isCollapse" :collapse-transition="true" background-color="#304156" text-color="white" class="logo-name">
          <el-submenu index="0">
              <template slot="title">
                <img src="../assets/logo/logo.png" alt="logo" style="height: 30px; width: 30px">
                <span class="title">Graph系统</span>
              </template>
          </el-submenu>
        </el-menu>
      </div>
      <!-- Menu区域 -->
      <div style="height: 94%">
        <el-scrollbar>
          <el-menu :collapse="isCollapse" :collapse-transition="true" text-color="#BFCBD9" background-color="#304156" active-text-color="yellow" :router="true">
            <!-- 点击el-submenu并不会引起页面跳转，只会展开相应的子模块 -->
            <el-submenu v-for="(submenu,index) in this.$router.options.routes[0].children" :key="index" :index="index+''">
              <template slot="title">
                <i :class="submenu.meta.icon"></i>
                <span class="title">{{submenu.meta.title}}</span>
              </template>
              <!-- 当el-menu的router属性设置为true时，el-menu-item根据index属性作为路径进行路由跳转 -->
              <el-menu-item v-for="(menuitem,idx) in submenu.children" :key="idx" :index="'/'+submenu.path+'/'+menuitem.path">
                <i :class="menuitem.meta.icon"></i>
                <span>{{menuitem.meta.title}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <!-- 主体部分 -->
    <el-container>
      <el-header style="height:50px">
        <!-- 导航条 -->
        <div style="height:50px">
          <!-- 控制菜单栏的展示与隐藏 -->
          <div class="switch">
            <i @click="isCollapse=!isCollapse" :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"></i>
          </div>
          <!-- 面包屑导航 -->
          <div  class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item v-for="(item,index) in breadcrumbs" :to="item.path" :key="index">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 用户头像 -->
          <div class="avatar">
            <el-avatar size="large" shape="square" src=""></el-avatar>
          </div>
          <!-- 用户工具栏 -->
          <div class="tools">
            <!-- Git图标-->
            <el-tooltip content="源码地址" effect="dark" placement="bottom">
              <i class="el-icon-location"></i>
            </el-tooltip>
            <!-- 文档图标 -->
            <el-tooltip content="文档地址" effect="dark" placement="bottom">
              <i class="el-icon-document"></i>
            </el-tooltip>
            <!-- 搜索图标 -->
            <el-tooltip content="搜索" effect="dark" placement="bottom">
              <i class="el-icon-search"></i>
            </el-tooltip>
            <!-- 设置图标 -->
            <el-tooltip content="设置" effect="dark" placement="bottom">
              <i class="el-icon-setting"></i>
            </el-tooltip>
          </div>
        </div>
        <!-- 状态条 -->
        <div>

        </div>
      </el-header>
      <el-main>
        <keep-alive>
          <!-- 路由占位符用来接收子菜单内容 -->
          <router-view/>
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:'Layout',
  methods: {
    generateBreadcrumb(){
      // 获取当前路由信息
      const matched = this.$route.matched
      // 初始化面包屑导航数据
      const breadcrumbs = []
      // 遍历路由信息，生成面包屑导航数据
      matched.forEach(item=>{
        const {meta,name,path} = item
        if (meta.breadcrumb){
          breadcrumbs.push({
            name,
            path,
          })
        }
      });
      // 保存面包屑导航数据
      this.breadcrumbs = breadcrumbs;
    }
  },
  mounted() {
    this.generateBreadcrumb();
  },
  watch:{
    $route(){
      this.generateBreadcrumb();
    }
  },
  data() {
    return {
      isCollapse: false,    // 未折叠
      breadcrumbs:[],
      avatar:'../assets/avatar/avatar.png',
    };
  },
}
</script>

<!-- the whole framework -->
<style>
.el-container{
  height: 100%;
}
.el-aside{
  background-color: #304156;
  /* 这段代码是一个CSS选择器，它的意思是选择所有class不包含el-menu--collapse的元素，并对其应用样式设置。*/
  .el-menu:not(.el-menu--collapse)  {
    width: 200px;
    border-right: none;
  }
  /* 由于上述代码排除了el-menu--collapse，因此这里单独设置 */
  .el-menu--collapse{
    border-right: none;
    width: 50px; /* 设置折叠后的宽度为50px */
  }
  /* 设置折叠前后图标位置 */
  .el-submenu__title{
    padding: 0 14px!important;
  }
}
.el-header{
  background-color: #FFFFFF;
  padding: 0;
}
/* 主体路由显示区域 */
.el-main{
  background-color: #E9EEF3;
  width: 100%;
  padding: 0;
}
</style>

<!-- Logo name -->
<style>
/* 取消el-submenu取消小箭头 */
.logo-name{
  .el-submenu__title {
    .el-icon-arrow-down {
      display: none;
    }
  }
  /* 取消el-submenu的悬停特效 */
  .el-submenu__title:hover {
    background-color: #304156!important;
  }
}
</style>

<!-- Header -->
<style scoped>
.switch,.breadcrumb,.tools,.avatar{
  height: 50px;
  line-height: 50px;
  font-size: 21px;
  margin: 0 10px;
}
.switch{
  float: left;
  color: green;
}
.breadcrumb{
  float: left;
  .el-breadcrumb{
    font-size: 18px;
    height: 30px;
    line-height: 30px;
    margin: 10px 10px 10px 0;
  }
}

.tools{
  float: right;
  .el-tooltip{
    margin-left: 8px;
    margin-right: 8px;
  }
}
.avatar{
  float: right;
  .el-avatar{
    margin: 5px;
  }
}
</style>
