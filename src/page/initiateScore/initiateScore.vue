<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>发起评分</h3>
        </el-row>
      </div>
      <el-row>
        <el-form ref="formScore" :rules="rules" :model="formScore" label-width="120px">
          <el-form-item label="讲师姓名：" prop="teacherName">
            <el-select style="width:100%;" v-model="formScore.teacherName" filterable placeholder="请选择讲师">
              <el-option
                v-for="item in teacherNames"
                :key="item._id"
                :label="item.username"
                :value="item.username">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目标题：" prop="projectName">
            <el-input v-model="formScore.projectName" placeholder="请输入项目标题" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="项目描述：" prop="projectDesc">
            <el-input type="textarea" :rows="5" v-model="formScore.projectDesc" maxlength="300" placeholder="请输入项目简介"></el-input>
          </el-form-item>
          <el-form-item label="上传附件：">
            <el-upload
              action="http://111.230.19.105:8899/file/uploadFile"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-remove="removeFile"
              :on-exceed="fileExceed"
              accept="image/png, image/jpeg, .xls, .xlsx, .doc, .docx, .pdf, .zip, .rar, .ppt, .pptx, .md"
              :before-upload="beforeUploadFile"
              multiple
              :limit="5"
              :file-list="formScore.projectFiles">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传不超过5M大小的文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="分享日期：" prop="shareTime">
            <el-date-picker
              v-model="formScore.shareTime"
              type="date"
              placeholder="请选择分享日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="评分选项：">
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
              <span style="line-height:30px;">{{option}}</span>
              <span style="line-height:30px;margin:0 5px;">:</span>
              <el-rate style="padding:5px 0;"></el-rate>
              <i class="el-icon-close delete-option-icon" @click="deleteOption($event)"></i>
            </div>
          </el-form-item>
          <!-- <el-form-item label="评分期限：">
            <el-date-picker
              v-model="scoreRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="项目状态：">
            <el-switch v-model="formScore.projectStatus"></el-switch>
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
import envConfig from './../../config/index.js'
import userAPI from './../../api/user.api.js'
import projectAPI from './../../api/project.api.js'
export default {
  data () {
    return {
      // 上传文件
      uploadHeaders: {},
      uploadData: {
        access_token: ''
      },
      // 表单验证
      rules: {
        // 讲师姓名
        teacherName: [
          { required: true, message: '请选择讲师', trigger: 'change' }
        ],
        // 项目标题
        projectName: [
          { required: true, message: '请输入项目标题', trigger: 'change' }
        ],
        // 项目描述
        projectDesc: [
          { required: true, message: '请输入项目描述', trigger: 'change' }
        ],
        // 分享时间
        shareTime: [
          { required: true, message: '请选择分享时间', trigger: 'change' }
        ]
      },
      teacherNames: [],
      // 评分选项
      projectOption: [],
      formScore: {
        // 发布者
        publisher: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).username : '',
        // 教师名字
        teacherName: '',
        // 项目标题
        projectName: '',
        // 项目描述
        projectDesc: '',
        // 项目附件
        projectFiles: [],
        // 分享时间
        shareTime: '',
        // 评分选项
        projectOption: [],
        // 开始时间
        timeStart: '',
        // 结束时间
        timeEnd: '',
        // 项目状态
        projectStatus: true,
        // 项目类型
        votingType: 1
      },
      scoreRange: [],
      inputVisible: false,
      inputValue: '',
      uploadApi: envConfig.apiHost
    }
  },
  watch: {
    scoreRange () {
      if (this.scoreRange.length !== 0) {
        this.formScore.timeStart = (this.scoreRange)[0].getTime()
        this.formScore.timeEnd = (this.scoreRange)[1].getTime()
      } else {
        this.formScore.timeStart = ''
        this.formScore.timeEnd = ''
      }
    }
  },
  methods: {
    // 发起项目
    initiateProject () {
      this.$refs.formScore.validate((valid) => {
        if (valid) {
          if (!this.projectOption.length || this.projectOption.length < 3) {
            this.$message.warning('评分选项不能少于3个喔~')
            return false
          }
          this.formScore.shareTime = (this.formScore.shareTime).getTime()
          for (let i in this.projectOption) {
            let obj = {}
            obj.name = this.projectOption[i]
            this.formScore.projectOption.push(obj)
          }
          projectAPI.initiateScoreOrVote(this.formScore).then((res) => {
            if (res.code === '0000') {
              this.$message.success(res.msg)
              // 跳转至我发起的
              this.$router.push({path: '/waitScore'})
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
      console.log(this.projectOption)
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
    },
    // -----------------上传文件
    // 上传之前
    beforeUploadFile (file) {
      if (this.formScore.projectFiles && this.formScore.projectFiles.length) {
        // 判断当前存在此文件
        const existFile = this.formScore.projectFiles.filter((item) => {
          return item.name === file.name
        })
        console.log('existFile', existFile)
        if (existFile && existFile.length) {
          this.$message.warning('请不要选择相同的文件喔~')
          return false
        } else {
          // const isJPG = file.type === 'image/jpeg' || 'text/html' || 'application/pdf'
          const isLt2M = file.size / 1024 / 1024 < 5
          // if (!isJPG) {
          //   this.$message.error('上传文件支持JPG,html,pdf等格式!')
          //   return false
          // }
          if (!isLt2M) {
            this.$message.error('上传文件大小不能超过 5MB!')
            return false
          }
        }
      }
    },
    // 上传成功
    uploadSuccess (response, file, fileList) {
      if (response.code === 200) {
        console.log('response', response)
        this.formScore.projectFiles.push(response.data)
      }
      console.log('response', response)
      console.log('file', file)
      console.log('fileList', fileList)
    },
    // 上传失败
    uploadError (err, file, fileList) {
      this.$message.error('上传失败')
      console.log('err', err)
      console.log('file', file)
      console.log('fileList', fileList)
    },
    // 移除文件
    removeFile (file, fileList) {
      this.formScore.projectFiles = fileList
    },
    // 文件超出最大上传个数
    fileExceed () {
      this.$message.warning('最多只能上传五个文件喔~')
    }
  },
  mounted () {
    let accessToken = JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    this.uploadData.access_token = accessToken
    this.uploadHeaders['x-auth-token'] = accessToken
    // 讲师列表
    userAPI.getInfos().then(({data}) => {
      this.teacherNames = data.list
      console.log('data:', data)
    })
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
  display: block !important;
}
</style>
