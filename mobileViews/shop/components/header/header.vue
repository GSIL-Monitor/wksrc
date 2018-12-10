<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <image :src="seller.avatar" />
            </div>
           <div class="content">
               <div class="title">
                   <span class="brand"></span>
                   <span class="name">{{seller.name}}</span>
               </div>
                <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon decrease" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
           </div>
           <div v-if="seller.supports" class="support-count" @click="showDetail">
               <span class="count">{{seller.supports.length}}个</span>
               <i class="iconfont icon-icon icon"></i>
           </div>
        </div>
        <div class="bulletin-wrapper" @click="showDetail">
            <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>

        </div>
        <div class="background">
            <image :src="seller.avatar" width="100%" height="100%"/>
        </div>
        <div v-show="detailShow" class="detail" >
            <div class="detail-wrapper clearfix">
                <div class="detail-main">
                   <h1 class="name">{{seller.name}}</h1>
                   <div class="star-wrapper">
                       <star :size="48" :score="seller.score"></star>
                   </div>
                   <div class="title">
                       <div class="line"></div>
                       <div class="text">优惠信息</div>
                       <div class="line"></div>
                   </div>
                   <ul v-if="seller.supports" class="supports">
                       <li class="support-item" v-for="(item,index) in seller.supports" :key="index">
                           <span class="icon decrease" :class="classMap[seller.supports[index].type]"></span>
                            <span class="text">{{seller.supports[index].description}}</span>
                       </li>
                   </ul>
                   <div class="title">
                       <div class="line"></div>
                       <div class="text">商家公告</div>
                       <div class="line"></div>
                   </div>
                   <div class="bulletin">
                       <p class="content">{{seller.bulletin}}</p>
                   </div>
                </div>
            </div>
            <div class="detail-close" @click="hideDetail">x</div>
        </div>
    </div>
</template>

<script>
 import star from '../star/star.vue';
export default {
    data() {
        return{
            detailShow: false,
        }
    },
    props: {
       seller: {
            type: Object
        }
    },
    methods: {
        showDetail() {
            this.detailShow = true
        },
        hideDetail() {
            this.detailShow = false
        }
    },
    created() {
        this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    computed: {

    },
     components: {
        star
    }
};
</script>

<style lang="stylus" scoped>
    @import "../../common/stylus/mixin";
    @import "../../common/stylus/base";
    .header
        color: #ffffff
        position relative
        background: rgba(7,17,27,0.5)
        overflow hidden
        .content-wrapper
            position relative
            padding 48px 24px 48px 48px
            font-size 0
            .avatar
                display inline-block
                vertical-align top
                image
                    border-radius 4px
                    width 128px
                    height 128px
            .content
                display inline-block
                margin-left 32px
                .title
                    margin 4px 0 16px 0
                    .brand
                        display inline-block
                        vertical-align top
                        width 60px
                        height 32px
                        bg-image('brand')
                        background-size 60px 36px
                        background-repeat no-repeat
                    .name
                        margin-left 12px
                        font-size 32px
                        line-height 36px
                        font-weight bold
                .description
                    margin-bottom 20px
                    line-height 24px
                    font-size 24px
                .support
                    .icon
                        display inline-block
                        vertical-align top
                        width 24px
                        height 24px
                        margin-right 8px
                        background-size 24px
                        background-repeat no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        line-height 24px
                        font-size 20px
            .support-count
                display flex
                text-align center
                justify-content space-around
                position absolute
                right 24px
                bottom 36px
                padding 0 16px
                height 48px
                line-height 48px
                border-radius 28px
                background rgba(0,0,0,0.2)
                .count
                    font-size 20px
                .icon
                    font-size 25px
                    padding-left 5px


        .bulletin-wrapper
            height 56px
            line-height 56px
            padding 0 44px 0 24px
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            background rgba(7,17,27,.2)
            .bulletin-title
                display inline-block
                width 44px
                height 24px
                bg-image('bulletin')
                background-size 44px
                background-repeat no-repeat
                vertical-align top
                margin-top 16px
            .bulletin-text
                vertical-align top
                font-size 20px
                margin 0 8px
        .background
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            z-index -1
            filter blur(20px)
        .detail
            position fixed
            z-index 99999
            top 0
            left 0
            width 100%
            height 100%
            overflow auto
            background rgba(7,17,27,.8)
            .detail-wrapper
                min-height 100%
                width 100%
                .detail-main
                    margin-top 120px
                    padding-bottom 128px
                    .name
                        line-height 32px
                        text-align center
                        font-size 32px
                        font-weight 700
                    .star-wrapper
                        margin-top 36px
                        padding 4px 0
                        text-align center
                    .title
                        display flex
                        align-items center
                        width 80%
                        margin 56px auto 48px auto
                        .line
                            flex 1
                            top -12px
                            border-bottom 1px solid rgba(255,255,255,.2)
                        .text
                            padding 24px
                            font-weight 700
                            font-size 28px
                    .supports
                        width 80%
                        margin 0 auto
                        .support-item
                            padding 0 24px
                            margin-bottom 24px
                            font-size 0
                            $:last-child
                                margin-bottom 0
                            .icon
                                display inline-block
                                width 32px
                                height 32px
                                margin-top -12px
                                vertical-align top
                                margin-right 24px
                                background-size 32px 32px
                                background-repeat no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                line-height 2px
                                font-size 24px
                    .bulletin
                        width 80%
                        margin 0 auto
                        .content
                            padding 0 24px
                            line-height 48px
                            font-size 24px

            .detail-close
                position relative
                width 64px
                height 64px
                margin -48px auto 0 auto
                clear both
                font-size 64px
</style>
