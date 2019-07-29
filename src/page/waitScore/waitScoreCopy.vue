<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>待评分项目</h3>
        </el-row>
      </div>
      <el-row type="flex" justify="start">
        <!-- 表单搜索 -->
        <el-form :inline="true" v-model="searchContent">
          <el-date-picker
            v-model="dateTimeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="margin-right:10px;">
          </el-date-picker>
          <el-form-item>
            <el-input v-model="searchContent.keywords" placeholder="请输入项目名称" style="margin-right:10px;" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <div class="project_content">
        <el-row v-if="!total" class="no-data">
          <div class="no-data-content">
            <img src="./../../../static/image/no-data.png" width="120px"/>
            <div>暂无数据</div>
          </div>
        </el-row>
        <el-row v-else  v-for="(item,key) in projectContent" :key="key" class="project_content_one">
            <div class="project_detail">
              <div class="project_detail_title">《 {{item.projectName}} 》</div>
              <div class="project_detail_name">讲师姓名 ： {{item.teacherName}}</div>
              <div class="project_detail_time">分享时间 ： {{formatTime(item.shareTime)}}</div>
              <div class="project_detail_description">项目介绍 ： {{item.projectDesc}}</div>
              <div class="project_detail_status">项目状态：&nbsp;{{item.projectStatus?'开启':'关闭'}}</div>
              <el-button  type="primary" class="score_button" @click="operatePro(item)">立即评分</el-button>
            </div>
          </el-row>
        </div>
      <div>
      <el-dialog :title="`《 ${currentProject.projectName} 》`" :visible.sync="dialogFormVisible" width="400px" @open="handleOpen()">
        <el-form  ref="formScore"  :model="formScore"  label-width="100px" style="padding:0 30px;">
          <el-form-item v-for="(item, key) in formScore.scoreResult.projectOption" :label="`${item.name}:`" :key="key">
            <el-rate v-model="item.value" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" @change="changeScore()"></el-rate>
          </el-form-item>
          <el-form-item label="总 分：">
            <div>{{countScore}}分</div>
          </el-form-item>
          <el-form-item label="备 注：">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
              v-model="formScore.scoreResult.message">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
           <el-button type="primary" @click="handleScore()">确认评分</el-button>
        </div>
    </el-dialog>
        <!-- 分页 -->
        <el-row v-if="total" type="flex" justify="space-between" style="margin:30px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchContent.page"
            :page-size="searchContent.limit"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import projectAPI from './../../api/project.api.js'
export default {
  data () {
    return {
      // 立即评分模态框显示
      dialogFormVisible: false,
      // 当前项目信息
      currentProject: {},
      // 评分表单
      formScore: {
        _id: '',
        projectType: 1,
        scoreResult: {
          projectOption: [],
          score: 0,
          message: ''
        }
      },
      // 时间期限
      dateTimeRange: [],
      // 搜索内容表单
      searchContent: {
        // 搜素项目名称关键字
        keywords: '',
        // 开始时间
        timeStart: '',
        // 结束时间
        timeEnd: '',
        limit: 10,
        page: 1,
        // 项目类型
        projectType: 1,
        // 我的数据项目类型
        myProjectType: 'wait',
        projectStatus: 1
      },
      // 列表数据总数
      total: 0,
      // 列表数据
      projectContent: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        },
        {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    dateTimeRange () {
      console.log('11', this.dateTimeRange)
      if (this.dateTimeRange && this.dateTimeRange.length) {
        this.searchContent.timeStart = (this.dateTimeRange)[0].getTime()
        this.searchContent.timeEnd = (this.dateTimeRange)[1].getTime()
      } else {
        this.searchContent.timeStart = ''
        this.searchContent.timeEnd = ''
      }
    }
  },
  computed: {
    countScore () {
      let sum = 0
      this.formScore.scoreResult.projectOption.forEach(item => {
        sum += item.value
      })
      return sum
    }
  },
  methods: {
    // 搜索操作
    handleSearch () {
      this.searchContent.page = 1
      this.getProjectList(this.searchContent.page)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    // 翻页操作
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.searchContent.page = val
      this.getProjectList(this.searchContent.page)
    },
    // 打开立即评分模态框
    handleOpen () {
      this.formScore.scoreResult.message = ''
      this.formScore.scoreResult.score = ''
    },
    // 获取待评分项目列表数据
    getProjectList (page) {
      projectAPI.projectList(this.searchContent).then((res) => {
        console.log('res', res)
        if (res.code === '0000') {
          this.projectContent = res.data.list
          this.total = res.data.total
        }
      })
      projectAPI.waitOperateCounts({votingType: 1}).then((res) => {
        if (res.code === '0000') {
          this.$store.commit('getWaitScoreCount', res.data.total)
        }
      })
    },
    // 改变评分数值
    changeScore () {
      this.formScore.scoreResult.score = this.countScore
      console.log(this.formScore.scoreResult.score)
    },
    // 立即评分操作
    operatePro (item) {
      this.formScore._id = item._id
      let arr = []
      this.currentProject = item
      this.currentProject.projectOption.forEach((key, value) => {
        let objOption = {}
        objOption.name = key.name
        objOption.value = 0
        arr.push(objOption)
      })
      this.formScore.scoreResult.projectOption = arr
      this.dialogFormVisible = true
    },
    formatTime (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    // 确认评分
    handleScore () {
      console.log(this.formScore)
      if (this.formScore.scoreResult.score) {
        projectAPI.userOperate(this.formScore).then((res) => {
          if (res.code === '0000') {
            this.dialogFormVisible = false
            this.$message.success(res.msg)
            this.formScore.page = 1
            this.getProjectList(this.formScore.page)
          }
        })
      } else {
        this.$message.warning('请评分~')
      }
    }
  },
  mounted () {
    this.getProjectList(this.searchContent.page)
  }
}
</script>
<style scoped>
h3 {
  float: left;
}
.project_content .no-data {
  width:100%;
  height:400px;
  position:relative;
}
.no-data .no-data-content {
  position:absolute;
  left:50%;
  top:50%;
  margin-left:-120px;
  margin-top:-120px;
}
.no-data .no-data-content div {
  font-size:14px;
  color:#cacaca;
  text-align:center;
  margin-top:10px;
}
.project_content .project_content_one {
  display: flex;
  border: solid 1px #f2f2f2;
  padding: 10px 20px;
  color: #445161;
}
.project_content_one .project_detail {
  font-size: 14px;
  width: 100%;
}
.project_content_one .project_detail .project_detail_title {
  font-size: 16px;
  font-weight: bold;
  padding: 10px 0;
  color: #22D7BB;
}
.project_content_one .project_detail .project_detail_title:hover {
  /* cursor: pointer; */
}
.project_content_one .project_detail .project_detail_name {
  font-size: 14px;
  padding: 5px 0;
}
.project_content_one .project_detail .project_detail_time {
  font-size: 14px;
  padding: 5px 0;
}
.project_content_one .project_detail .project_detail_description {
  font-size: 15px;
  padding: 5px 0;
  line-height: 25px;
}
.project_content_one .project_detail .score_button {
  /* background-color: #22D7BB;
  color: #fff; */
  margin-top: 10px;
  float: right;
}
.box-card >>> .el-dialog  .el-dialog__header {
  background-color: #22D7BB;
  color: #FFFFFF;
}
.box-card >>> .el-dialog  .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
}
.box-card >>> .el-dialog .el-dialog__body {
  padding-bottom: 0px;
}
.box-card >>> .el-rate {
  margin-top:10px;
}
</style>
