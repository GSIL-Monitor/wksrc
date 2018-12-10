<template>
<div class="dashboard-container">
  <el-row :gutter="0">
    <div class="banner">
      <img alt="" :src="require('@/assets/dashboard/banner.jpg')"/>
    </div>
  </el-row>
  <el-row>
    <div class="component">
      <el-row :gutter="0">
        <el-col :span="8">
          <div class="item" @click="toDeskManage">
            <!-- <router-link to="/mobile/desk"> -->
              <img alt="" :src="require(`@/assets/dashboard/ht_11.png`)"/>
              <br />
              <span>{{deskManagerText}}</span>
            <!-- </router-link> -->
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <router-link to="/mobile/shop/order/list">
              <img alt="" :src="require('@/assets/dashboard/ht_12.png')"/>
              <br />
              <span>订单管理</span>
            </router-link>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <img alt="" :src="require('@/assets/dashboard/ht_13.png')"/>
            <br />
            <span>预订管理</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="8">
          <div class="item">
            <router-link to="/mobile/member/mopen">
            <img alt="" :src="require('@/assets/dashboard/ht_14.png')"/>
            <br />
            <span>会员开通</span>
            </router-link>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <router-link to="/mobile/member/mtopup">
            <img alt="" :src="require('@/assets/dashboard/ht_15.png')"/>
            <br />
            <span>会员充值</span>
          </router-link>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <!-- <router-link to="/mobile/member/mergeId"> -->
            <img alt="" :src="require('@/assets/dashboard/ht_16.png')"/>
            <br />
            <span>菜单管理</span>
            <!-- </router-link> -->
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="0">
        <el-col :span="8">
          <div class="item">
            <img alt="" :src="require('@/assets/dashboard/ht_17.png')"/>
            <br />
            <span>卡券管理</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <img alt="" :src="require('@/assets/dashboard/ht_18.png')"/>
            <br />
            <span>积分管理</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="item">
            <router-link to="/mobile/member/mergeId">
            <img alt="" :src="require('@/assets/dashboard/ht_19.png')"/>
            <br />
            <span>顾客ID合并</span>
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-row>

  <el-row>
    <div class="footer">
      <el-col :span="8">
        <router-link to="/">
          <div class="item">
          <img alt="" :src="require('@/assets/dashboard/nav2.png')"/>
          <span>服务</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link to="/mobile">
          <div class="item">
          <img alt="" :src="require('@/assets/dashboard/nav11.png')"/>
          <span>工作台</span>
          </div>
        </router-link>
      </el-col>
      <el-col :span="8">
        <router-link to="/mobile/userCentre/index">
          <div class="item">
          <img alt="" :src="require('@/assets/dashboard/nav3.png')"/>
          <span>个人中心</span>
          </div>
        </router-link>
        <!-- <router-link to="/mobile/login">
          <div class="item"  @click="$store.dispatch('FedLogOut')">
          <img alt="" :src="require('@/assets/dashboard/nav3.png')"/>
          <span>退出登录</span>
          </div>
        </router-link> -->
      </el-col>
    </div>
  </el-row>
</div>
</template>

<script>
import { getInfo as getInfoBySession } from "@/api/session";
import {Tools} from "@/views/utils/Tools";
import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'dashboard',
  // components: { adminDashboard, editorDashboard },
  data() {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      sessionInfo: [],
      leaderInfo: [],
      // currentRole: 'adminDashboard'
      tableData: Array(20).fill(item),
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ]),
    deskManagerText() {
      if (!this.$store.state.shop.isPayNow2) {
        return '桌台管理'
      } else {                  // 快餐即付模式
        return '立即点餐'
      }
    }
  },
  methods: {
    toDeskManage() {
      if (!this.$store.state.shop.isPayNow2) {
        this.$router.push('/mobile/desk')
      } else {                  // 快餐即付模式, 直接进入点餐
        this.$router.push('/mobile/shop/index/newOrder/' + 0)
      }
    }
  },
  created() {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
    &-container {
        /* margin: 30px; */
        .banner {
            margin-bottom: -2px;
            img{
                width: 100%;
                height: 100%;
            }
        }
        img {
        }
        .footer {
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 0.8rem;
            position: fixed;
            left: 0px;
            background: #fff;
            right: -2px;
            margin: auto;
            z-index: 900;
            color: #979fae;
            /* text-shadow: 0 1px rgba(255, 255, 255, 0.3); */
            img {
                width: 1.6rem;
                height: 1.6rem;
            }
            .item {
                padding-top: 0.8rem;
            }
            span {
                display: block;
                line-height: 1.5rem;
            }
            >div {
                /* margin: 0 -1px 0 0; */
                /* border: 1px solid #E5E5E5; */
                border-right:1px solid #E5E5E5;
                border-top: 1px solid #E5E5E5;
            }
        }
        .component {
            text-align: center;
            color: #979fae;
            border-spacing: 0;
            border-collapse: collapse;
            .item {
                font-size: 1em;
                padding-top: 1.5em;
                padding-bottom: 1em;
                margin:-1px 0 0 -1px;
                border: 1px solid #E5E5E5;
            }
            img {
                width: 3.3rem;
                height: 3.3rem;
            }
            .el-row {
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    &-text {
        font-size: 30px;
        line-height: 46px;
    }
}
</style>
