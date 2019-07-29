<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>人员管理</h3>
        </el-row>
      </div>
      <el-row type="flex" justify="space-between">
        <div class="div_add" @click="showDialog(dialogConfig.addDialog)">
          <i class="el-icon-circle-plus-outline"></i>
          <span>添加用户</span>
        </div>
        <!-- 表单搜索 -->
        <el-form :inline="true" style="float:right;">
          <el-form-item>
            <el-input v-model="userRequestParam.keywords" placeholder="请输入姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <div>
        <el-table
          :header-cell-style="{background:'#F2F2F2'}"
          border
          :data="tableUserData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            label="序号"
            width="120">
            <template slot-scope="scope">
              <span>{{(userRequestParam.page - 1 ) * userRequestParam.limit + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="Id"
            width="120"
            prop="_id"
            v-if="false">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="120">
          </el-table-column>
          <el-table-column
            prop="phoneNo"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="roles"
            label="权限">
            <template slot-scope="scope">
              <span>{{(scope.row.roles === 'admin') ? '超级管理员' : (scope.row.roles === 'operator') ? '管理员' : '普通用户'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span @click="showDialog(dialogConfig.updateDialog, scope.row)" class="operate_link">修改</span>
              <span @click="handleDelete(scope.row._id)" class="operate_link">删除</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="space-between" style="margin:30px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="userRequestParam.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="userRequestParam.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
      </div>
    </el-card>
    <!-- 添加/修改用户的模态框 -->
    <el-dialog :title="typeStr" :visible.sync="dialogAddVisible" width="400px">
      <el-form :rules="rules" ref="formUser"  :model="formUser"  label-width="55px" style="padding:0 50px;">
        <el-form-item label="姓名:"  prop="username">
          <el-input v-if="typeCode==='add'" v-model="formUser.username" placeholder="请输入姓名"  autocomplete="off"></el-input>
          <el-input v-else v-model="formUser.username" placeholder="请输入姓名"  autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机:"  prop="phoneNo">
          <el-input v-if="typeCode==='add'" v-model="formUser.phoneNo" placeholder="请输入手机号"  autocomplete="off"></el-input>
          <el-input v-else v-model="formUser.phoneNo" placeholder="请输入手机号"  autocomplete="off" disabled></el-input>
        </el-form-item>
         <el-form-item label="密码:"  prop="password">
          <el-input v-model="formUser.password" placeholder="请输入密码" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限:"  prop="roles">
          <el-select v-model="formUser.roles" placeholder="请选择权限" style="width:100%;">
            <el-option label="超级管理员" value="admin"></el-option>
            <el-option label="管理员" value="operator"></el-option>
            <el-option label="普通用户" value="user"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleDialogBtn('formUser')">{{btnStr}}</el-button>
        <el-button @click="dialogAddVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from 'js-md5'
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
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    var checkRoles = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择用户权限'))
      } else {
        callback()
      }
    }
    return {
      // 模态框的类型
      typeCode: '',
      typeStr: '',
      btnStr: '',
      dialogConfig: {
        addDialog: {
          title: '添加用户',
          type: 'add',
          btnStr: '确认添加'
        },
        updateDialog: {
          title: '修改用户',
          type: 'update',
          btnStr: '确认修改'
        }
      },
      // 是否显示添加模态框
      dialogAddVisible: false,
      // 添加人员表单字段
      formUser: {
        _id: '',
        username: '',
        password: '',
        phoneNo: '',
        roles: ''
      },
      // 验证规则
      rules: {
        username: [
          { required: true, validator: checkUserName, trigger: 'change' }
        ],
        password: [
          { required: true, validator: checkPassword, trigger: 'change' }
        ],
        phoneNo: [
          { required: true, validator: checkPhoneNo, trigger: 'change' }
        ],
        roles: [
          { required: true, validator: checkRoles, trigger: 'change' }
        ]
      },
      // 请求人员列表参数
      userRequestParam: {
        // 姓名关键字
        keywords: '',
        limit: 10,
        page: 1
      },
      total: 0,
      // 人员列表数据
      tableUserData: []
    }
  },
  methods: {
    // 搜索操作
    handleSearch () {
      this.userRequestParam.page = 1
      this.userList(this.userRequestParam.page)
    },
    handleSizeChange (val) {
      this.userRequestParam.limit = val
      this.userRequestParam.page = 1
      this.userList(this.userRequestParam.page)
    },
    // 翻页操作
    handleCurrentChange (val) {
      this.userRequestParam.page = val
      this.userList(this.userRequestParam.page)
    },
    // 显示添加/修改人员模态框
    showDialog (dialogType, row) {
      console.log('dialogConfig', dialogType)
      console.log('row', row)
      this.typeStr = dialogType.title
      this.btnStr = dialogType.btnStr
      this.typeCode = dialogType.type
      if (dialogType.type === 'update') {
        console.log('update:', this.typeCode)
        // 修改用户
        this.formUser._id = row._id
        this.formUser.username = row.username
        this.formUser.password = row.password
        this.formUser.phoneNo = row.phoneNo
        this.formUser.roles = row.roles
      } else {
        console.log('add:', this.typeCode)
        this.formUser._id = ''
        this.formUser.username = ''
        this.formUser.password = ''
        this.formUser.phoneNo = ''
        this.formUser.roles = ''
        this.$nextTick(() => {
          this.$refs.formUser.resetFields()
        })
      }
      this.dialogAddVisible = true
    },
    // 添加用户/修改用户
    handleDialogBtn (formUser) {
      this.$refs[formUser].validate((valid) => {
        if (valid) {
          if (this.typeCode === 'add') {
            console.log('确认添加用户')
            this.$delete(this.formUser, '_id')
            this.formUser.password = md5(this.formUser.password)
            userAPI.addInfos(this.formUser).then((data) => {
              this.$message.success('添加成功！')
              this.dialogAddVisible = false
              this.userRequestParam.page = 1
              this.userList(this.userRequestParam.page)
            })
          } else if (this.typeCode === 'update') {
            console.log('确认修改用户')
            this.formUser.password = md5(this.formUser.password)
            userAPI.updateInfos(this.formUser).then((data) => {
              this.$message.success('修改成功！')
              this.dialogAddVisible = false
              this.userRequestParam.page = 1
              this.userList(this.userRequestParam.page)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 删除用户
    handleDelete (_id) {
      console.log('id', _id)
      this.$confirm('删除此用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          userAPI.removeInfos(_id).then((data) => {
            console.log('_id:', _id)
            console.log('data:', data)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.userRequestParam.page = 1
            this.userList(this.userRequestParam.page)
          })
            .catch((error) => {
              console.log('error', error)
              this.$message.error('删除失败！')
            })
        })
    },
    // 用户列表
    userList (page) {
      this.userRequestParam.page = page
      userAPI.getInfos(this.userRequestParam)
        .then(({data}) => {
          this.tableUserData = data.list
          this.total = data.total
        })
    }
  },
  mounted () {
    this.userRequestParam.page = 1
    this.userList(this.userRequestParam.page)
  }
}
</script>
<style scoped>
h3 {
  float: left;
}
.div_add{
  color: #22D7BB;
  font-size: 14px;
}
.div_add:hover {
  cursor: pointer;
}
.div_add i{
  font-size: 24px;
}
.el-table >>> .cell {
  padding: 0;
  text-align: center;
}
.operate_link {
  padding: 0 5px;
  color: #22D7BB;
}
.operate_link:hover {
  text-decoration: underline;
  cursor: pointer;
}
/* .input_add {
  width: 80%;
} */
</style>
<style>
.el-dialog  .el-dialog__header {
  background-color: #22D7BB;
  color: #FFFFFF;
}
.el-dialog  .el-dialog__header .el-dialog__title {
  color: #FFFFFF;
}
.el-dialog .el-dialog__body {
  padding-bottom: 0px;
}
</style>
