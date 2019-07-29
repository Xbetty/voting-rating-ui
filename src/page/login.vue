<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <div class="grid-content">
          <div class="header-title">
            <h2>投票评分管理系统</h2>
          </div>
          <el-form label-position="right" :rules="rules" ref="formLogin"  :model="formLogin">
            <el-form-item label="" prop="phone">
              <el-input v-model="formLogin.phone" prefix-icon="el-icon-mobile-phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="" prop="pwd">
              <el-input v-model="formLogin.pwd" type='password' prefix-icon="el-icon-goods" placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn_login" @click="loginCheck">确认登录</el-button>
            </el-form-item>
          </el-form>
          <!-- <div class="div_forget_password" @click="forgetPassword">忘记密码？</div> -->
        </div>
        </el-col>
    </el-row>
  </div>
</template>
<script>
import md5 from 'js-md5'
import userAPI from './../api/user.api.js'
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
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不少于6位'))
      } else {
        callback()
      }
    }
    return {
      // 验证规则
      rules: {
        pwd: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        phone: [
          { required: true, validator: checkPhoneNo, trigger: 'change' }
        ]
      },
      // 表单数据
      formLogin: {
        phone: '',
        pwd: ''
      }
    }
  },
  methods: {
    // 登录验证
    loginCheck () {
      this.$refs.formLogin.validate((valid) => {
        if (this.formLogin.phone && this.formLogin.pwd) {
          this.formLogin.pwd = md5(this.formLogin.pwd)
          userAPI.userLogin(this.formLogin).then((res) => {
            if (res.code === '0000') {
              this.$message.success(res.msg)
              localStorage.setItem('userInfo', JSON.stringify(res.data))
              this.$router.push({name: 'waitScore'})
            } else {
              this.$message.error(res.msg)
              this.$nextTick(_ => {
                this.$refs.formLogin.resetFields()
              })
            }
          })
        }
      })
    },
    // 忘记密码
    forgetPassword () {
    }
  }
}
</script>
<style scoped>
h2 {
  margin:150px 0 20px 0;
  text-align: center;
}
.header-title {
  display: flex;
  justify-content: center;
}
.btn_login {
  width: 100%;
  background-color: #22D7BB;
  color: #ffffff;
}
.div_forget_password {
  color: #22D7BB;
  font-size: 13px;
  float: right;
}
</style>
