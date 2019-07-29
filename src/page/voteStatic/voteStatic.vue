<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row>
          <h3>投票统计</h3>
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
            :picker-options="pickerOptions"
            style="margin-right:10px;width:380px;">
          </el-date-picker>
          <el-form-item>
            <el-input v-model="searchContent.keywords" placeholder="请输入项目名称或发起人姓名" style="margin-right:10px;width:200px;" clearable></el-input>
          </el-form-item>
          <el-select clearable v-model="searchContent.projectStatus" placeholder="请选择项目状态" style="margin-right:10px;width:200px;">
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
            label="序号"
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
            label="投票项目名称"
            width="200">
            <template slot-scope="scope">
              <span class="projects_link" @click="toProjectDetails(scope.row._id)">{{scope.row.projectName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="publisher"
            label="发起人">
          </el-table-column>
          <el-table-column
            prop="createAt"
            label="发起时间">
            <template slot-scope="scope">
              <span>{{formatTime(scope.row.createAt)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="projectStatus"
            label="项目状态">
            <template slot-scope="scope">
              <span>{{scope.row.projectStatus ? "开启" : "关闭"}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="votingResult"
            label="投票结果">
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
import moment from 'moment'
import projectAPI from './../../api/project.api.js'
export default {
  data () {
    return {
      dateTimeRange: [],
      total: 0,
      searchContent: {
        // 项目状态
        projectStatus: '',
        keywords: '',
        timeStart: '',
        timeEnd: '',
        limit: 10,
        page: 1,
        projectType: 2
      },
      tableUserData: [],
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
  methods: {
    formatTime (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    },
    // 跳转至项目详情
    toProjectDetails (_id) {
      this.$router.push({name: 'voteDetails', query: {_id: _id, projectType: 2}})
    },
    // 搜索操作
    handleSearch () {
      console.log('username:', this.searchName)
      this.searchContent.page = 1
      this.getProjectStatic(this.searchContent.page)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.searchContent.limit = val
      this.searchContent.page = 1
      this.getProjectStatic(this.searchContent.page)
    },
    // 翻页操作
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.searchContent.page = val
      this.getProjectStatic(this.searchContent.page)
    },
    // 获取统计数据
    getProjectStatic (page) {
      projectAPI.projectStatic(this.searchContent).then((res) => {
        console.log(res)
        this.tableUserData = res.data.list
        this.total = res.data.total
      })
    }
  },
  mounted () {
    this.getProjectStatic(this.searchContent.page)
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
