<template>
  <div class="vote_div">
    <el-card class="box-card">
      <el-row :gutter="100" class="details_top">
        <el-col :span="18">
          <div class="project_title">《 {{projectContent.projectName}} 》</div>
          <div class="project_teacher_name">发起人：{{projectContent.publisher}}</div>
          <div class="project_time">发起时间：{{formatTime(projectContent.createAt)}}</div>
        </el-col>
        <el-col class="project_average_score" :span="6">
          <div>投票结果：</div>
          <div style="margin-top:10px;">
            {{projectContent.votingResult}}
          </div>
        </el-col>
      </el-row>
      <div class="body_container">
        <el-row>
          <el-col :span="4">
            <div class="label_text">项目描述：</div>
          </el-col>
          <el-col :span="20">
            <div>{{projectContent.projectDesc}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">项目选项：</div>
          </el-col>
          <el-col :span="20">
            <div>
              <el-checkbox v-for="(item, key) in projectOption" :key="key" v-model="item.checked" disabled>{{item.name}}</el-checkbox>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">项目状态:</div>
          </el-col>
          <el-col :span="20">
            <div>{{projectContent.projectStatus?'开启':'关闭'}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">我的投票:</div>
          </el-col>
          <el-col :span="20">
            <div class="one_result" style="padding:0;" v-if="myOperated && myOperated.length>0">
            <div>{{myOperated[0].result.projectOption[0]}}</div>
            <div v-if="myOperated[0].result.message" class="one_result_msg">备 注 ： {{myOperated[0].result.message}}</div>
          </div>
          <div class="one_result" style="padding:0;" v-else>暂无</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">投票细则：</div>
          </el-col>
          <el-col :span="20">
            <div id="myChart" style="width:600px;height:400px;"></div>
            <div v-if="userInfo.role==='admin'">
              <div v-for="(item, key) in projectContent.record" :key="key" class="one_result">
                <div class="one_result_score">{{item.result.userName}} : {{item.result.projectOption[0]}}</div>
                <div v-if="item.result.message" class="one_result_msg">备注 ： {{item.result.message}}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import projectAPI from './../../api/project.api.js'
import moment from 'moment'
export default {
  data () {
    return {
      projectContent: {},
      formDetail: {},
      projectOption: [],
      projectOptionArr: [],
      projectOptionValue: [],
      userInfo: {},
      myOperated: []
    }
  },
  methods: {
    formatTime (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    // 获取详情内容
    getProjectDetails (form) {
      projectAPI.projectDetails(form).then((res) => {
        if (res.code === '0000') {
          this.projectContent = res.data
          // 查看我的投票结果
          this.myOperated = this.projectContent.record.filter((item) => {
            if (item.userId === this.userInfo._id) {
              return item
            }
          })
          for (let i in this.projectContent.projectOption) {
            this.projectOptionArr.push(this.projectContent.projectOption[i].name)
            this.projectOptionValue.push(this.projectContent.projectOption[i].value)
            let obj = {}
            obj.name = this.projectContent.projectOption[i].name
            if (obj.name === this.projectContent.projectResult) {
              obj.checked = true
            } else {
              obj.checked = false
            }
            this.projectOption.push(obj)
          }
          this.$nextTick(() => {
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            // 创建图表
            myChart.setOption({
              color: ['#3398DB'],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  data: this.projectOptionArr,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value'
                }
              ],
              series: [
                {
                  name: '得票情况',
                  type: 'bar',
                  barWidth: '60%',
                  data: this.projectOptionValue
                }
              ]
            })
          })
        }
      })
    }
  },
  mounted () {
    this.formDetail._id = this.$route.query._id
    this.formDetail.projectType = this.$route.query.projectType
    this.getProjectDetails(this.formDetail)
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
  }
}
</script>
<style scoped>
* {
   font-size: 15px;
}
.vote_div >>> .el-card__body {
  padding-top: 0px;
}
.details_top {
  padding: 10px 20px;
  color: #ffffff;
  background-color: #22D7BB;
  margin-bottom: 20px;
}
.details_top .project_title, .details_top .project_average_score {
  font-size: 16px;
  font-weight: bold;
  margin: 15px 0 ;
}
.details_top .project_teacher_name {
  margin-bottom: 5px;
}
.body_container .el-row {
  margin: 30px 0;
}
.label_text {
  padding-left: 25px;
}
.one_result {
  line-height: 30px;
  padding: 10px 0;
}
.one_result .one_result_score {
  font-size: 16px;
  font-weight: bold;
}
</style>
