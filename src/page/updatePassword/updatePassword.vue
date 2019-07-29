<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>修改密码</h3>
        </el-row>
      </div>
      <el-row type="flex">
        <el-form label-width="120px" :model="formPersonal" :rules="rules" ref="formPersonal">
          <el-form-item label="新密码：" prop="password">
            <el-input v-model="formPersonal.password" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码：" prop="repassword">
            <el-input v-model="formPersonal.repassword" type="password" placeholder="请确认新密码"></el-input>
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
import md5 from 'js-md5'
export default {
  data () {
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6 || value.length > 15) {
        callback(new Error('密码长度请控制在6~15位'))
      } else {
        callback()
      }
    }
    var checkRepassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请确认密码'))
      } else if (this.formPersonal.repassword !== this.formPersonal.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formPersonal: {
        password: '',
        repassword: ''
      },
      rules: {
        password: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        repassword: [
          { required: true, validator: checkRepassword, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleUpdata () {
      this.$refs.formPersonal.validate((valid) => {
        if (valid) {
          this.formPersonal.password = md5(this.formPersonal.password)
          delete this.formPersonal.repassword
          userAPI.updatePassword(this.formPersonal).then((res) => {
            if (res.code === '0000') {
              this.formPersonal.password = ''
              this.formPersonal.repassword = ''
              this.$refs.formPersonal.resetFields()
              this.$confirm('修改密码成功,请重新登录!', '提示', {
                confirmButtonText: '确定',
                showCancelButton: false,
                type: 'success'
              }).then(() => {
                localStorage.removeItem('userInfo')
                window.location.href = window.location.origin + '/login'
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped>
h3 {
  float: left;
}
</style>
