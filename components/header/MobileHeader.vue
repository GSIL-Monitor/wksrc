<template>
<sticky :className="'top-navbar '" :zIndex="100">
  <div class="content phone-head-info" style="color: #AFB1B3;">
    <a :class="iconReturn + ' return'" style="" @click="!isPreventReturn && $router.go(-1)"></a>
    <router-link class="background title" to="/mobile"><label>{{headerText}}</label></router-link>
    <router-link :to="refreshAgentUrl" ref="refresh" :class="iconRefresh +' refresh'" style="" @click.native="refreshView"></router-link> <!--transform是css3中的-->
    <a to="" @click="toggleDialog()" :class="iconNav + ' nav'" style="" id="filtrate"></a>
  </div>
</sticky>
</template>

<script>
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from "@/utils/validate";

export default {
  name: 'mobile-header',
  components: {
    Sticky
  },
  data() {
    return {}
  },
  props: {
    headerText: {
      type: String,
      default: 'Header'
    },
    visible: {
      type: Boolean,
      default: false
    },
    isPreventReturn: {
      type: Boolean,
      default: false
    },
    // classes 字符串
    actionIcon: {
      type: String
    },
    returnIcon: {
      type: String
    },
    refreshIcon: {
      type: String
    }
  },
  computed: {
    refreshAgentUrl() {
      return { path: '/mobile/agent', query: { from: this.$route.fullPath }}
    },
    iconNav() {
      if (!this.actionIcon) {
        return 'iconfont icon-nav'
      } else {
        return this.actionIcon
      }
    },
    iconRefresh() {
      if (!this.refreshIcon) {
        return 'iconfont icon-refresh'
      } else {
        return this.actionIcon
      }
    },
    iconReturn() {
      if (!this.returnIcon) {
        return 'iconfont icon-arrow-left'
      } else {
        return this.actionIcon
      }
    }

  },
  created() {
    console.log(this.$route)
  },
  // header的dialog弹框参考navbar, 开关放在state
  methods: {
    refreshView() {
      // this.$router.replace({ path: this.$router.path, query: { t: Date.now() }})
      // this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
      // console.log(this.$route)
      // this.$router.replace({ path: '/mobile/agent', query: { from: this.$route.fullPath }})
      // })
    },
    toggleDialog() {
      // this.$store.dispatch('toggleHDialog')
      this.$emit('update:visible', !this.visible)
    }
  }

}
</script>

<style lang="scss" scoped>
.phone-head-info {
}

@media screen and (min-width: 600px) {
    .title {
        color: #AFB1B3;
        font-size: 35px;
        line-height: 105px;
        text-align: center;
    }
}
.title {
    font-size: 51px;
    line-height: 95px;
}
.iconfont {
    font-size: 60px;
    line-height: 75px;
    margin-top:0.2em;
}
.return {
    width:10vw;height:8vw;float:left;margin-left:4.3vw;
}
.refresh {
    width:12vw;height:8vw;float:right;margin-right:3vw;margin-left:3vw;
}
.nav {
    width:12vw;height:8vw;float:right;margin-left:5vw;
}
.background-return {
    background-image: url("~@/assets/images/header/return.png")
}
.background-refresh {
    background-image: url("~@/assets/images/header/refresh.png")
}
.background-nav {
    background-image: url("~@/assets/images/header/deploy-nav-round.png")
}
</style>
