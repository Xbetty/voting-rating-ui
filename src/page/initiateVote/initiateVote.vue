<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>发起投票</h3>
        </el-row>
      </div>
      <el-row>
        <el-form ref="formVote" :rules="rules" :model="formVote" label-width="120px">
          <el-form-item label="项目标题：" prop="projectName">
            <el-input maxlength="30" v-model="formVote.projectName" placeholder="请输入项目标题"></el-input>
          </el-form-item>
          <el-form-item label="项目简介：" prop="projectDesc">
            <el-input maxlength="300" type="textarea" :rows="5" v-model="formVote.projectDesc" placeholder="请输入项目简介"></el-input>
          </el-form-item>
          <el-form-item label="投票选项：">
            <el-input
              maxlength="6"
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              style="width:220px"
              placeholder="请输入项目选项"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            >
            </el-input>
            <el-button v-else type="primary" size="small" @click="showInput" style="width:220px;color:#ffffff;">+ 新选项</el-button>
            <div v-for="(option, key) in projectOption" :key="key" class="options-content">
              <el-radio label="" style="margin-top:7px;">{{option}}</el-radio>
              <i id="icon" class="el-icon-close delete-option-icon" @click="deleteOption($event)" style="position:absolute;top:10px;right:5px;display:block;"></i>
            </div>
          </el-form-item>
          <!-- <el-form-item label="投票期限：">
            <el-date-picker
              v-model="voteRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="项目状态：">
            <el-switch v-model="formVote.projectStatus"></el-switch>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" size="large" @click="initiateProject()">立即发起</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import projectAPI from './../../api/project.api.js'
export default {
  data () {
    return {
      // 表单验证
      rules: {
        // 项目标题
        projectName: [
          { required: true, message: '请输入项目标题', trigger: 'change' }
        ],
        // 项目描述
        projectDesc: [
          { required: true, message: '请输入项目描述', trigger: 'change' }
        ]
      },
      // 投票选项
      projectOption: [],
      formVote: {
        // 发布者
        publisher: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : '',
        // 项目标题
        projectName: '',
        // 项目描述
        projectDesc: '',
        // 投票选项
        projectOption: [],
        // 开始时间
        timeStart: '',
        // 结束时间
        timeEnd: '',
        // 项目状态
        projectStatus: true,
        // 项目类型
        votingType: 2
      },
      voteRange: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  watch: {
    voteRange () {
      if (this.voteRange.length !== 0) {
        this.formVote.timeStart = (this.voteRange)[0].getTime()
        this.formVote.timeEnd = (this.voteRange)[1].getTime()
      } else {
        this.formVote.timeStart = ''
        this.formVote.timeEnd = ''
      }
    }
  },
  methods: {
    // 发起项目
    initiateProject () {
      this.$refs.formVote.validate((valid) => {
        if (valid) {
          if (!this.projectOption.length || this.projectOption.length < 2) {
            this.$message.warning('投票选项不能少于两个喔~')
            return false
          }
          for (let i in this.projectOption) {
            let obj = {}
            obj.name = this.projectOption[i]
            this.formVote.projectOption.push(obj)
          }
          projectAPI.initiateScoreOrVote(this.formVote).then((res) => {
            console.log('res:', res)
            if (res.code === '0000') {
              this.$message.success(res.msg)
              // 跳转至我发起的
              this.$router.push({path: '/waitVote'})
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 动态增加选项
    handleClose (tag) {
      this.projectOption.splice(this.projectOption.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        if (this.projectOption.indexOf(inputValue) === -1) {
          this.projectOption.push(inputValue)
        } else {
          this.$message.warning('该选项已存在!')
        }
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    // 移除选项
    deleteOption (e) {
      var curOption = e.currentTarget.parentElement.firstElementChild.innerText
      var optionIndex = this.projectOption.indexOf(curOption)
      if (optionIndex > -1) {
        this.projectOption.splice(optionIndex, 1)
        this.$message.success('移除成功！')
      }
    }
  }
}
</script>
<style scoped>
.box-card >>> .el-card__body {
  padding: 50px;
}
.box-card >>> .el-row {
  width: 700px;
}
h3 {
  float: left;
}
/* 动态增加选项 */
.el-tag + .el-tag {
    margin-left: 10px;
  }
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.options-content {
  height: 30px;
  line-height: 30px;
  display: flex;
  padding: 0 10px;
  margin-top: 10px;
  font-size: 12px;
  color: #797979;
  position: relative;
}
.options-content:hover {
  cursor: pointer;
  color: #22D7BB;
  background-color: #f5f7fa;
  border-radius: 4px;
}
.delete-option-icon {
  position:absolute;
  top:10px;
  right:5px;
  display:none;
}
.options-content:hover .delete-option-icon {
  display: block;
}
</style>
