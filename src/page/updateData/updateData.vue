<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>修改个人信息</h3>
        </el-row>
      </div>
      <el-row type="flex">
        <!-- 表单搜索 -->
        <el-form  :model="formPersonal" :rules="rules" ref="formPersonal" label-width="80px">
          <el-form-item label="姓名：" prop="username">
            <el-input v-model="formPersonal.username" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="电话：" prop="phoneNo">
            <el-input v-model="formPersonal.phoneNo" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%;" @click="handleUpdata()">确认修改</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import userAPI from './../../api/user.api.js'
export default {
  data () {
    var checkPhoneNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (value && !value.match(/^1[0-9]{10}$/)) {
        callback(new Error('手机号不合法'))
      } else {
        callback()
      }
    }
    var checkUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入姓名'))
      } else {
        callback()
      }
    }
    return {
      userInfo: {},
      formPersonal: {
        username: '',
        phoneNo: ''
      },
      rules: {
        username: [
          { required: true, validator: checkUserName, trigger: 'change' }
        ],
        phoneNo: [
          { required: true, validator: checkPhoneNo, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleUpdata () {
      this.$refs.formPersonal.validate((valid) => {
        if (valid) {
          userAPI.updatePersonal(this.formPersonal).then((res) => {
            if (res.code === '0000') {
              this.$message.success(res.msg)
            }
          })
        }
      })
    }
  },
  mounted () {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.formPersonal.username = this.userInfo.username
    this.formPersonal.phoneNo = this.userInfo.phoneNo
  }
}
</script>
<style scoped>
h3 {
  float: left;
}
</style>
