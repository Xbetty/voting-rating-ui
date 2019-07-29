<template>
  <div>
    <project-list :projectList="projectList"></project-list>
  </div>
</template>
<script>
import projectList from './../../components/projectList/projectList'
export default {
  components: {
    projectList
  },
  data () {
    return {
      projectList: {
        projectType: 2,
        headLine: '待投票项目',
        // 我的数据项目类型
        myProjectType: 'wait'
      }
    }
  }
}
</script>
