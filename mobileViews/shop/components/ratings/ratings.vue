<template>
    <div class="ratings">
        <div class="rating-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="scroe-wrapper">
                        <span class="title">服务态度</span>
                        <div class="star"><star :size="36" :score="seller.serviceScore"></star></div>
                        <span class="scroe">{{seller.serviceScore}}</span>
                    </div>
                    <div class="scroe-wrapper">
                        <span class="title">商品评分</span>
                        <div class="star"> <star :size="36" :score="seller.serviceScore"></star></div>
                        <span class="scroe">{{seller.foodScore}}</span>
                    </div>
                     <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="deliver">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingselect :select-type="selectType" :desc="desc"></ratingselect>
        </div>
        <div class="ratings-wrapper">
                <ul>
                    <li v-for="(rating,index) in ratings" :key="index" class="rating-wrapper">
                        <div class="avater">
                            <image :src="rating.avatar" style="width:56px;height:56px"/>
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <div class="star"> <star :size="24" :score="rating.score"></star></div>

                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <!-- <div class="recommend" v-show="rating.recommend"></div> -->
                            <div class="time">{{rating.rateTime}}</div>
                        </div>
                    </li>
                </ul>
            </div>
    </div>
</template>

<script>
 import star from '../star/star.vue';
 import ratingselect from '../ratingselect/ratingselect.vue';
 import split from "../split/split.vue"
export default {
     data() {
        return {
           ratings: {},
        }
    },
    created() {
        this.getList();
    },
    components: {
        star,
        split,
        ratingselect
    },
    props: {
      seller: {
            type: Object
        }
    }
}
</script>

<style lang="stylus" scoped>
 @import "../../common/stylus/mixin";
    .ratings
        position absolute
        top 348px
        bottom 0
        left 0
        width 100%
        .rating-content
            .overview
                display flex
                padding 36px 0
                .overview-left
                    flex 0 0 274px
                    padding 12px 0
                    width 274px
                    border-right  1px solid rgba(7,17,27,.2)
                    text-align center
                    .score
                        margin-bottom 12px
                        line-height 56px
                        font-size 48px
                        color rgb(255,153,0)
                    .title
                        margin-bottom 16px
                        line-height 24px
                        font-size 24px
                        color rgb(7,17,27)
                    .rank
                        line-height 20px
                        font-size 20px
                        color rgb(147,153,159)
                .overview-right
                    flex 1
                    padding 12px 0 12px 48px
                    .scroe-wrapper
                        margin-bottom 16px
                        font-size 0
                        .title
                            display inline-block
                            line-height 36px
                            font-size 24px
                            color rgb(7,17,27)
                        .star
                            display inline-block
                            margin 0 24px
                            vertical-align top
                        .scroe
                            display inline-block
                            vertical-align top
                            line-height 36px
                            font-size 24px
                            color rgb(250,153,0)
                    .delivery-wrapper
                        font-size 0
                        .title
                            line-height 36px
                            font-size 24px
                            color rgb(7,17,27)
                        .deliver
                            margin-left  24px
                            font-size 24px
                            color rgb(147,153,159)
        .ratings-wrapper
            padding 0 36px
            margin-top 36px
            margin-bottom 36px
            .rating-wrapper
                display flex
                border-1px(rgba(7,17,27,.1))
                margin-top 36px
                .avater
                    flex  0  0 56px
                    width 56px
                    margin-right 24px
                    image
                        border-radius 50%
                .content
                    display flex
                    flex-direction column
                    .name
                        line-height 24px
                        font-size 20px
                        color rgb(7,17,27)
                    .star-wrapper
                        .star
                            display inline-block
                        .delivery
                            padding-left 12px
                            font-size 20px
                            font-weight 200
                            color rgb(147,153,159)
                            line-height 24px
                    .text
                        font-size 24px
                        line-height 36px
                        color rgb(7,17,27)
                        padding-bottom 36px
                    .time
                        position absolute
                        right 36px
                        font-size 20px
                        font-weight 200
                        color rgb(147,153,159)
                        line-height 24px














</style>
