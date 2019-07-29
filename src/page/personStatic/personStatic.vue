<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>人员统计</h3>
        </el-row>
      </div>
      <el-row type="flex" justify="start">
        <!-- 表单搜索 -->
        <el-form :inline="true" v-model="searchContent">
          <el-form-item>
            <el-input v-model="searchContent.keywords" placeholder="请输入姓名" style="margin-right:10px;" clearable></el-input>
          </el-form-item>
          <el-select v-model="searchContent.type" placeholder="请选择" style="margin-right:10px;">
            <el-option
              label="按平均得分排名"
              :value="1"
              selected="true">
            </el-option>
            <el-option
              label="按分享次数排名"
              :value="2">
            </el-option>
            <el-option
              label="按投票次数排名"
              :value="3">
            </el-option>
          </el-select>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">统计</el-button>
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
            label="排名"
            width="120">
            <template slot-scope="scope">
              <span>{{(searchContent.page - 1 ) * searchContent.limit + scope.$index + 1}}</span>
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
            label="分享次数">
            <template slot-scope="scope">
              <span class="projects_link">{{scope.row.shareTimes}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="平均得分">
            <template slot-scope="scope">
              <span>{{scope.row.averageScore}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="投票次数">
            <template slot-scope="scope">
              <span class="projects_link">{{scope.row.voteTimes}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row type="flex" justify="space-between" style="margin:30px 0;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchContent.page"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="searchContent.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import userAPI from './../../api/user.api.js'
// import moment from 'moment'
export default {
  data () {
    return {
      total: 0,
      searchContent: {
        keywords: '',
        type: 1,
        limit: 10,
        page: 1
      },
      // 人员列表数据
      tableUserData: [],
      // 日期快速选择器
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
  methods: {
    // 搜索操作
    handleSearch () {
      this.searchContent.page = 1
      this.userList(this.searchContent.page)
      console.log('searchContent:', this.searchContent)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.searchContent.limit = val
      this.searchContent.page = 1
      this.userList(this.searchContent.page)
    },
    // 翻页操作
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.searchContent.page = val
      this.userList(this.searchContent.page)
    },
    // 用户列表
    userList (page) {
      userAPI.userStatic(this.searchContent).then(({data}) => {
        this.tableUserData = data.list
        this.total = data.total
        console.log('data:', data)
      })
    }
  },
  mounted () {
    this.userList(this.searchContent.page)
  }
}
</script>
<style scoped>
h3 {
  float: left;
}
.el-table >>> .cell {
  padding: 0;
  text-align: center;
}
.projects_link {
  padding: 0 5px;
  color: #22D7BB;
}
.projects_link:hover {
  cursor: pointer;
}
</style>
