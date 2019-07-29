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
        projectType: 1,
        headLine: '待评分项目',
        // 我的数据项目类型
        myProjectType: 'wait'
      }
    }
  }
}
</script>
