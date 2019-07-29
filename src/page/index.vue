<template>
  <div class="admin_index">
    <el-container>
      <el-scrollbar style="height:100%;background-color:#F2F2F2">
        <el-aside style="width:260px;">
          <el-col>
            <el-menu
              router
              :default-active="defaultActive"
              class="el-menu-vertical-demo"
              background-color="#F2F2F2"
              text-color="#797979"
              active-text-color="#22D7BB">
              <div class="div_logo">
                <img src="/static/image/logo.png" width="100px"/>
              </div>
              <h5>欢迎你，{{userInfo.username}}</h5>
              <el-submenu index="1" v-if="userInfo.role === 'admin' || userInfo.role === 'operator'">
                <template slot="title">
                  <i class="icon-initiate-score"></i>
                  <span>发起评分</span>
                </template>
                <el-menu-item index="/initiateScore">
                  发起评分
                </el-menu-item>
                <el-menu-item index="/myInitiateScore">
                  我发起的评分
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2" v-if="userInfo.role === 'admin' || userInfo.role === 'operator'">
                <template slot="title">
                  <i class="icon-initiate_vote"></i>
                  <span>发起投票</span>
                </template>
                <el-menu-item index="/initiateVote">发起投票</el-menu-item>
                <el-menu-item index="/myInitiateVote">我发起的投票</el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="icon-my-data"></i>
                  <el-badge v-if="myDataCounts" :value="myDataCounts">
                    <span size="small">我的数据</span>
                  </el-badge>
                  <span v-else>我的数据</span>
                </template>
                <el-menu-item-group>
                  <template slot="title">关于评分</template>
                  <el-menu-item index="/waitScore">
                    <el-badge v-if="waitScoreCount" :value="waitScoreCount">
                      <span size="small">待评分项目</span>
                    </el-badge>
                    <span v-else>待评分项目</span>
                  </el-menu-item>
                  <el-menu-item index="/myScoredProject">已评分项目</el-menu-item>
                  <el-menu-item index="/mySharedProject">我分享的项目</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                  <template slot="title">关于投票</template>
                  <el-menu-item index="/waitVote">
                    <el-badge v-if="waitVoteCount" :value="waitVoteCount">
                      <span size="small">待投票项目</span>
                    </el-badge>
                    <span v-else>待投票项目</span>
                  </el-menu-item>
                  <el-menu-item index="/myVotedProject">已投票项目</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="/scoreStatic" v-if="userInfo.role === 'admin'">
                <i class="icon-score-static"></i>
                <span slot="title">评分统计</span>
              </el-menu-item>
              <el-menu-item index="/voteStatic" v-if="userInfo.role === 'admin'">
                <i class="icon-vote-static"></i>
                <span slot="title">投票统计</span>
              </el-menu-item>
              <el-menu-item index="/personManage" v-if="userInfo.role === 'admin'">
                <i class="icon-person-manage"></i>
                <span slot="title">人员管理</span>
              </el-menu-item>
              <el-menu-item index="/updatePassword">
                <i class="icon-update-password"></i>
                <span slot="title">修改密码</span>
              </el-menu-item>
              <el-menu-item index="/loginout">
                <i class="icon-loginout-one"></i>
                <span slot="title">退出登录</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
      </el-scrollbar>
      <el-scrollbar style="height:100%;width:100%;">
      <el-main>
        <router-view/>
      </el-main>
      </el-scrollbar>
    </el-container>
  </div>
</template>
<script>
// 引入辅助函数
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      defaultActive: '', // 默认菜单项
      userInfo: {},
      waitingScoreCount: 0,
      waitingVoteCount: 0
    }
  },
  computed: {
    ...mapState({
      waitScoreCount: state => state.waitScoreCount,
      waitVoteCount: state => state.waitVoteCount
    }),
    myDataCounts () {
      return parseInt(this.waitScoreCount) + parseInt(this.waitVoteCount)
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'loginout') {
      this.$confirm('退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('userInfo')
        next()
      }).catch(() => {
        next(false)
      })
    }
  },
  methods: {
    ...mapActions(['getWaitScoreCount', 'getWaitVoteCount'])
  },
  mounted () {
    this.defaultActive = this.$route.fullPath
    console.log('defaultActive:', this.defaultActive)
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log('userInfo', this.userInfo)
    this.getWaitScoreCount().then(() => {
      this.waitingScoreCount = this.waitScoreCount
      console.log('this.waitingScoreCount', this.waitingScoreCount)
    })
    this.getWaitVoteCount().then(() => {
      this.waitingVoteCount = this.waitVoteCount
    })
  }
}
</script>
<style scoped>
.admin_index, .el-container {
  width: 100%;
  height: 100%;
}
.el-aside {
  background-color: #F2F2F2;
  text-align: center;
}
.el-aside >>> .el-badge__content.is-fixed {
  top: 8px;
  right: 5px;
}
.admin_index >>> .el-scrollbar__wrap {
  padding-right: 60px;
}
.el-aside i {
  margin-right: 5px;
  font-size: 15px;
}
.el-aside .el-menu {
  border: 0px;
}
.el-aside .div_logo {
  margin: 50px 0 30px 0;
  color: #797979;
  font-size: 14px;
  font-weight: bold;
}
.el-aside h5 {
  margin-bottom: 20px;
}
.el-main {
  background-color: #fff;
  margin-left: 20px;
  margin-right: 30px;
}
</style>
