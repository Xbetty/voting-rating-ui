<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>{{projectList.headLine}}</h3>
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
            style="margin-right:10px;width:380px;"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-form-item>
            <el-input v-model="searchContent.keywords" placeholder="请输入项目名称" style="margin-right:10px;width:200px;" clearable></el-input>
          </el-form-item>
          <el-select v-if="this.searchContent.myProjectType !== 'wait'" clearable v-model="searchContent.projectStatus" placeholder="请选择项目状态" style="margin-right:10px;width:200px;">
            <el-option
              label="开启"
              :value="1">
            </el-option>
            <el-option
              label="关闭"
              :value="2">
            </el-option>
          </el-select>
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
        <el-row v-else :gutter="100" v-for="(item,key) in projectListContent" :key="key" class="project_content_one">
          <el-col :span="17">
            <div class="project_detail">
              <div @click="toProjectDetails(item._id)" class="project_detail_title" v-if="item.isOperated">《 {{item.projectName}} 》</div>
              <div class="project_title" v-else>《 {{item.projectName}} 》</div>
              <div class="project_detail_teacher_name">{{projectListLabel.teacherName}}：&nbsp;{{item.teacherName ? item.teacherName : item.publisher}}</div>
              <div class="project_detail_time">{{projectListLabel.time}}：&nbsp;{{formatTime(item.shareTime ? item.shareTime : item.createAt)}}</div>
              <div class="project_detail_description" :title="item.projectDesc">{{projectListLabel.description}}：&nbsp;{{item.projectDesc}}</div>
              <div class="project_detail_status">{{projectListLabel.status}}：&nbsp;{{item.projectStatus?'开启':'关闭'}}</div>
            </div>
          </el-col>
          <el-col :span="7" class="project_result_detail">
            <div v-if="item.isOperated && item.scoreResult" class="project_result">{{projectListLabel.result}}：{{item.scoreResult.toFixed(2)}}分</div>
            <div v-if="item.isOperated && item.votingResult" class="project_result">{{projectListLabel.result}}：{{item.votingResult}}</div>
            <el-button v-if="!item.isOperated && item.votingType === 1 " type="primary" class="score_button" @click="operateScorePro(item)">立即评分</el-button>
            <el-button v-if="!item.isOperated && item.votingType === 2" type="primary" class="score_button" @click="operateVotePro(item)">立即投票</el-button>
            <div v-else class="operated_success">
              <img v-if="item.isOperated && item.votingType === 1 " src="./../../assets/已评分.png" width="100px;"/>
              <img v-if="item.isOperated && item.votingType === 2 " src="./../../assets/已投票.png" width="100px;"/>
            </div>
            <div v-if="searchContent.myProjectType === 'initiated' || userInfo && userInfo.role==='admin'" class="project_operate">
              <span class="operate_link" @click="deleteProject(item._id)">删除</span>
              <span class="operate_link" @click="changeProjectStatus(item)" v-if="item.projectStatus">关闭项目</span>
              <span class="operate_link" @click="changeProjectStatus(item)" v-else>开启项目</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-if="total">
        <!-- 分页 -->
        <el-row type="flex" justify="space-between" style="margin:30px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchContent.page"
            :page-size="searchContent.limit"
            :page-sizes="[10, 20, 30, 50]"
            layout="sizes, total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
      </div>
      <!-- 立即评分模态框 -->
      <el-dialog :title="`《 ${currentProject.projectName} 》`" :visible.sync="dialogScoreFormVisible" width="400px" @open="handleScoreOpen()">
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
            <el-button @click="dialogScoreFormVisible = false">取消</el-button>
            <el-button type="primary" @click="handleScore()">确认评分</el-button>
          </div>
      </el-dialog>
      <!-- 立即投票模态框 -->
      <el-dialog :title="`《 ${currentProject.projectName} 》`" :visible.sync="dialogVoteFormVisible" width="400px" @open="handleVoteOpen()">
        <el-form  ref="formVote"  :model="formVote"  label-width="100px" style="padding:0 30px;">
          <el-form-item label="投票选项：">
            <el-radio-group v-model="projectOption">
              <el-radio v-for="(item, key) in currentProject.projectOption" :key="key" :label="item.name" style="width:100%;margin:10px;"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="projectOption" label="投票结果：">
            <div>{{projectOption}}</div>
          </el-form-item>
          <el-form-item label="备 注：">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
              v-model="formVote.scoreResult.message">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVoteFormVisible = false">取消</el-button>
           <el-button type="primary" @click="handleVote()">确认投票</el-button>
        </div>
    </el-dialog>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import projectAPI from './../../api/project.api.js'
export default {
  props: ['projectList'],
  data () {
    return {
      // 立即评分模态框显示
      dialogScoreFormVisible: false,
      // 立即投票模态框显示
      dialogVoteFormVisible: false,
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
      // 投票结果
      projectOption: '',
      // 投票表单
      formVote: {
        _id: '',
        projectType: 2,
        scoreResult: {
          // 投票结果
          projectOption: [],
          // 备注
          message: ''
        }
      },
      // 搜索的时间范围
      dateTimeRange: [],
      // 总记录数
      total: 0,
      // 搜索内容
      searchContent: {
        // 项目名称关键字
        keywords: '',
        // 开始时间
        timeStart: '',
        // 结束时间
        timeEnd: '',
        limit: 10,
        page: 1,
        projectType: '',
        // 我的数据项目类型
        myProjectType: '',
        // 项目状态
        projectStatus: ''
      },
      // 列表内容
      projectListContent: [],
      // 缓存信息
      userInfo: {},
      // 标签
      projectListLabel: {
        // 发起人姓名
        teacherName: '',
        // 发起时间
        time: '',
        // 项目状态
        status: '',
        // 项目描述
        description: '',
        // 项目结果
        result: ''
      },
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
      if (this.dateTimeRange) {
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
    // 格式化时间
    formatTime (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    // 搜索操作
    handleSearch () {
      this.searchContent.page = 1
      this.getProjectList(this.searchContent.page)
    },
    // 改变每页显示的数据数量
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.searchContent.limit = val
      this.searchContent.page = 1
      this.getProjectList(this.searchContent.page)
    },
    // 翻页操作
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.getProjectList(val)
    },
    // 获取项目列表
    getProjectList (page) {
      this.searchContent.page = page
      this.searchContent.projectType = this.projectList.projectType
      this.searchContent.myProjectType = this.projectList.myProjectType
      if (this.searchContent.myProjectType === 'wait') {
        this.searchContent.projectStatus = 1
      }
      projectAPI.projectList(this.searchContent).then((res) => {
        if (res.code === '0000') {
          this.projectListContent = res.data.list
          this.total = res.data.total
        }
      })
      let projectType = parseInt(this.searchContent.projectType)
      projectAPI.waitOperateCounts({votingType: projectType}).then((res) => {
        if (res.code === '0000') {
          this.$store.commit(projectType === 1 ? 'getWaitScoreCount' : 'getWaitVoteCount', res.data.total)
        }
      })
    },

    // -------------------------评分操作
    // 打开立即评分模态框
    handleScoreOpen () {
      this.formScore.scoreResult.message = ''
      this.formScore.scoreResult.score = ''
    },
    // 改变评分数值
    changeScore () {
      this.formScore.scoreResult.score = this.countScore
      console.log(this.formScore.scoreResult.score)
    },
    // 立即评分操作
    operateScorePro (item) {
      this.formScore._id = item._id
      this.currentProject = item
      if (this.currentProject.projectStatus) {
        let arr = []
        this.currentProject.projectOption.forEach((key, value) => {
          let objOption = {}
          objOption.name = key.name
          objOption.value = 0
          arr.push(objOption)
        })
        this.formScore.scoreResult.projectOption = arr
        this.dialogScoreFormVisible = true
      } else {
        this.$message.warning('项目未开启,无法评分~')
      }
    },
    // 确认评分
    handleScore () {
      console.log(this.formScore)
      if (this.formScore.scoreResult.score) {
        projectAPI.userOperate(this.formScore).then((res) => {
          if (res.code === '0000') {
            this.dialogScoreFormVisible = false
            this.$message.success(res.msg)
            this.formScore.page = 1
            this.getProjectList(this.formScore.page)
          }
        })
      } else {
        this.$message.warning('请评分~')
      }
    },
    // ------------------------------投票操作
    // 打开投票模态框
    handleVoteOpen () {
      this.formVote.scoreResult.message = ''
      this.projectOption = ''
    },
    // 立即投票
    operateVotePro (item) {
      this.formVote._id = item._id
      this.currentProject = item
      if (this.currentProject.projectStatus) {
        this.dialogVoteFormVisible = true
      } else {
        this.$message.warning('项目未开启,无法投票~')
      }
    },
    // 确认投票
    handleVote () {
      console.log(this.formVote)
      if (this.projectOption) {
        this.formVote.scoreResult.projectOption.push(this.projectOption)
        projectAPI.userOperate(this.formVote).then((res) => {
          if (res.code === '0000') {
            this.dialogVoteFormVisible = false
            this.$message.success(res.msg)
            this.formVote.page = 1
            this.getProjectList(this.formVote.page)
          }
        })
      } else {
        this.$message.warning('请投票~')
      }
    },
    // -----------------------------
    // 跳转至项目详情
    toProjectDetails (_id) {
      if (this.projectList.projectType === 1) {
        this.$router.push({name: 'scoreDetails', query: {_id: _id, projectType: this.projectList.projectType}})
      } else {
        this.$router.push({name: 'voteDetails', query: {_id: _id, projectType: this.projectList.projectType}})
      }
    },
    // 删除项目
    deleteProject (_id) {
      console.log('id', _id)
      this.$confirm('删除此项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          projectAPI.deleteProject(_id).then((data) => {
            console.log('_id:', _id)
            console.log('data:', data)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.searchContent.page = 1
            this.getProjectList(this.searchContent.page)
          })
            .catch((error) => {
              console.log('error', error)
              this.$message.error('删除失败！')
            })
        })
    },
    // 更改项目状态
    changeProjectStatus (item) {
      this.$confirm(item.projectStatus ? '关闭此项目, 是否继续?' : '开启此项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          projectAPI.changeProjectStatus({
            id: item._id,
            projectStatus: !item.projectStatus
          }).then((data) => {
            console.log('data:', data)
            this.$message({
              type: 'success',
              message: data.msg
            })
            this.searchContent.page = 1
            this.getProjectList(this.searchContent.page)
          })
            .catch((error) => {
              console.log('error', error)
              this.$message.error('关闭失败！')
            })
        })
    }
  },
  mounted () {
    console.log('projectList:', this.projectList)
    if (this.projectList.projectType === 1) {
      this.projectListLabel.teacherName = '讲师姓名'
      this.projectListLabel.time = '分享时间'
      this.projectListLabel.status = '项目状态'
      this.projectListLabel.description = '项目描述'
      this.projectListLabel.result = '平均得分'
    } else {
      this.projectListLabel.teacherName = '发起人'
      this.projectListLabel.time = '发起时间'
      this.projectListLabel.status = '项目状态'
      this.projectListLabel.description = '项目描述'
      this.projectListLabel.result = '投票结果'
    }
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
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
}
.project_content_one .project_detail .project_detail_title, .project_title {
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0 10px 0;
  color: #22D7BB;
}
.project_content_one .project_detail .project_detail_title:hover {
  cursor: pointer;
}
.project_content_one .project_detail .project_detail_time, .project_detail_teacher_name, .project_detail_teacher_status, .project_detail_description{
  font-size: 14px;
  padding: 5px 0;
}
.project_content_one .project_detail .project_detail_description {
  line-height: 25px;
}
.project_content_one .project_result_detail {
  padding: 5px 0;
  position: relative;
}

.project_content_one .project_result_detail .project_result {
  font-size: 16px;
  font-weight: bold;
  width: 100%;
}
.project_content_one .project_result_detail .operated_success {
  margin-top: 20px;
  margin-bottom: 20px;
}
.project_content_one .project_result_detail .project_operate {
  position: absolute;
  bottom: 5px;
  left: 50px;
}
.project_operate .operate_link {
  color: #22D7BB;
  font-size: 14px;
  margin-right: 15px;
}
.project_operate .operate_link:hover {
  cursor: pointer;
}
.box-card >>> .el-dialog  .el-dialog__header {
  background-color: #22D7BB;
  color: #FFFFFF;
}
.box-card >>> .el-dialog  .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
}
.box-card >>> .el-dialog .el-dialog__body .el-form-item{
  margin-bottom: 5px;
}
.box-card >>> .el-dialog .el-dialog__body .el-form-item .el-form-item__label{
  text-align: center;
}
.box-card >>> .el-dialog .el-dialog__body {
  padding-bottom: 0px;
}
.box-card >>> .el-rate {
  margin-top:10px;
}
.box-card >>> .el-dialog .el-dialog__footer {
  padding-top: 20px;
}
.project_detail_description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
}
</style>
