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
        headLine: '我发起的评分',
        // 我的数据项目类型
        myProjectType: 'initiated'
      }
    }
  }
}
</script>
