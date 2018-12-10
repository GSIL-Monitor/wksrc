<template>
  <div class="dashboard-container">
    <div class='dashboard-text'>name:{{name}}</div>
    <div class='dashboard-text'>role:<span v-for='role in roles' :key='role'>{{role}}</span></div>
    <el-button @click="getSession()" :loading="loadings">点击测试请求</el-button>
    <!-- <component :is="currentRole"></component> -->
  </div>
</template>

<script>
import { getInfo as getInfoBySession } from "@/api/session";
import {testRequest} from "@/api/test"
import {Tools} from "@/views/utils/Tools";
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      sessionInfo: [],
      leaderInfo: [],
      loadings:false
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  methods: {
    getSession() {
      this.loadings = true
      testRequest().then(()=>{
      this.loadings = false

      })
      // getInfoBySession().then(res => {
      //   this.sessionInfo = res.data;
      // }).catch(err => {
      //   console.log(error)
      // })
    },
    getLeader() {
      getInfoByLeader().then(res => {
        this.leaderInfo = res.data;
      }).catch(err => {
        this.$message({
          type: 'error',
          message: err.response.data.message
        })
      })
    }
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
