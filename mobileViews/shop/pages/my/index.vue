<template>
    <div class="my">
      <div class="container">
        <div class="header">

          <div class="userImg">
             <open-data class="thumb" type="userAvatarUrl"></open-data>
          </div>
          <div class="userName">
            <open-data class="nackname" lang="zh_CN" type="userNickName"></open-data>
          </div>
        </div>
        <div class="content">
          <div class="coupon">
            <image style="width:30px;height:30px;" src="/static/images/hongbao.png"/>
            <span class="text">美团红包</span>
            <i class="iconfont icon-icon icon"></i></div>
          </div>

          <div class="address">
             <image style="width:30px;height:30px;" src="/static/images/address.png"/>
            <span class="text"> 我的收货地址</span>
            <i class="iconfont icon-icon icon"></i>
          </div>

          <div class="tel">
            <image style="width:30px;height:30px;" src="/static/images/liping.png"/>
            <span class="text">邀请有礼</span>
            <i class="iconfont icon-icon icon"></i>
          </div>

          <div class="tel">
            <image style="width:30px;height:30px;" src="/static/images/tel.png"/>
            <span class="text">客服电话  101-097-77</span>
            <i class="iconfont icon-icon icon"></i>
          </div>

          <div class="signOut">退出账号</div>


        </div>

    </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
  .my
    font-size 30px
    background #ECECEC
    height 100vh
    .header
      height 300px
      background #FFD161
      display flex
      flex-direction column
      justify-content center
      align-items center
      .userImg
        width 120px
        height 120px
        border-radius 50%
        margin-bottom 30px
        .thumb
          border-radius 50%

    .content
       background #ECECEC
      .coupon,.signOut,.address,.tel
        background white
        height 70px
        line-height 70px
        padding-left 15px
        margin-top 20px
        .icon
          float right
          color #b4b4b4
        .text
          padding-left 30px
      .signOut
        text-align center
        font-size 35px











</style>
