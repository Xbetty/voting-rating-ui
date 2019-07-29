<template>
  <div class="score_div">
    <el-card class="box-card">
      <el-row :gutter="100" class="details_top">
        <el-col :span="16">
          <div class="project_title">《 {{projectContent.projectName}} 》</div>
          <div class="project_teacher_name">讲师：{{projectContent.teacherName}}</div>
          <div class="project_time">分享时间：{{formatTime(projectContent.shareTime)}}</div>
        </el-col>
        <el-col :span="8">
          <div v-if="projectContent.scoreResult" class="project_average_score">平均分:{{projectContent.scoreResult.toFixed(2)}}分</div>
          <div>
            <div v-for="(item, key) in projectContent.projectOption" :key="key" style="display:flex;">
              <span>{{item.name}}：</span>
              <el-rate
                :value="item.value.toFixed(2)"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}">
              </el-rate>
            </div>
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
            <div class="label_text">项目附件:</div>
          </el-col>
          <el-col :span="20">
            <div class="added_file" @click="downloadFile(item)" title="点击下载" v-for="(item, key) in projectContent.projectFiles" :key="key">
              {{item}}
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">发起人：</div>
          </el-col>
          <el-col :span="20">
            <div>{{projectContent.publisher}}</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">发起时间：</div>
          </el-col>
          <el-col :span="20">
            <div>{{formatTime(projectContent.createAt)}}</div>
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
            <div class="label_text">我的评分:</div>
          </el-col>
          <el-col :span="20">
            <div class="one_result" style="padding:0;" v-if="myOperated && myOperated.length>0">
              <div>{{myOperated[0].result.score}}分</div>
                <div v-for="(item, key) in myOperated[0].result.projectOption" :key="key" style="display:flex;">
                  <span>{{item.name}}：</span>
                  <el-rate
                    v-model="item.value"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value}">
                  </el-rate>
                </div>
              <div v-if="myOperated[0].result.message" class="one_result_msg">备 注 ： {{myOperated[0].result.message}}</div>
            </div>
            <div class="one_result" style="padding:0;" v-else>暂无</div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <div class="label_text">评分细则：</div>
          </el-col>
          <el-col :span="20">
            <div id="myChart" style="width:600px;height:400px;"></div>
            <div v-if="userInfo.role==='admin'">
              <div v-for="(item, key) in projectContent.record" :key="key" class="one_result">
                <div class="one_result_score">{{item.result.userName}} : {{item.result.score}}分</div>
                <div class="one_result_details" v-for="(i, k) in item.result.projectOption" :key="k">{{i.name}} ： {{i.value}}分</div>
                <div v-if="item.result.message" class="one_result_msg">备 注 ： {{item.result.message}}</div>
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
      // 详情内容
      projectContent: {},
      projectOptionArr: [],
      formDetail: {},
      userInfo: {},
      myOperated: []
    }
  },
  methods: {
    downloadFile (item) {
      window.open(`http://111.230.19.105:8899/file/downloadFile/${item}`, '_self')
    },
    formatTime (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    // 获取详情内容
    getProjectDetails (form) {
      projectAPI.projectDetails(form).then((res) => {
        if (res.code === '0000') {
          this.projectContent = res.data
          for (let i in this.projectContent.projectOption) {
            this.projectOptionArr.push(this.projectContent.projectOption[i].name)
          }
          // 查看我的评分结果
          this.myOperated = this.projectContent.record.filter((item) => {
            if (item.userId === this.userInfo._id) {
              return item
            }
          })
          console.log('myOperated', this.myOperated)
          this.$nextTick(() => {
            // 创建图表
            let myChart = this.$echarts.init(document.getElementById('myChart'))
            myChart.setOption({
              title: {
                text: this.projectContent.projectName,
                x: 'center'
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              legend: {
                orient: 'vertical',
                left: 'left',
                data: this.projectOptionArr
              },
              series: [
                {
                  name: '评分选项',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '60%'],
                  data: this.projectContent.projectOption,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
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
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.getProjectDetails(this.formDetail)
  }
}
</script>
<style scoped>
* {
   font-size: 15px;
}
.score_div >>> .el-card__body {
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
.added_file {
  text-decoration: underline;
  padding: 5px;
  color: #22D7BB;
  cursor: pointer;
}
.one_result {
  line-height: 30px;
  padding: 10px 0;
}
.one_result .one_result_score {
  font-size: 18px;
  font-weight: bold;
}
</style>
