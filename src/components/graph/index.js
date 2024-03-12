export default      {
  path:'graph',
  name:'Graph',
  component:()=>import('../graph/Index.vue'),
  meta:{title:'可视化',icon:'el-icon-document'},
  children:[
    {
      path:'pkg',
      name:'Pkg',
      component:()=>import('../graph/Graph.vue'),
      meta:{title:'Graph',icon:'el-icon-document'},
    }
  ]
}
