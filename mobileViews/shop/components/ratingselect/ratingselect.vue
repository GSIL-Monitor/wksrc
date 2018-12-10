<template>
    <div class="ratingselect">
        <div class="rating-type border-1px">
            <span class="block positive" :class="{'active': selectType===2}">{{desc.all}}<span class="count">
                </span>(47)</span>
            <span class="block positive" :class="{'active': selectType===0}">{{desc.positive}}<span class="count">
                </span>(40)</span>
            <span class="block negative" :class="{'active': selectType===1}">{{desc.negative}}<span class="count">
                </span>(7)</span>
        </div>
        <div class="switch">
            <div class="iconfont icon-rentongguli icon"></div>
            <span class="text">只看好评</span>
        </div>
    </div>
</template>

<script>
const POSITIVE = 0;
const HEGATIVE = 1;
const ALL = 2;
export default {

    props: {
        ratings: {
            type: Array,
            default() {
                return [];
            }
        },
        selectType: {
            type: Number,
            default: ALL
        },
        onlyContent: {
            default: false
        },
        desc: {
            type: Object,
            default() {
                return {
                    all: '全部',
                    positive: '好评',
                    negative: '差评'
                }
            }
        }
    },

}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin";
    .ratingselect
        .rating-type
            padding 36px 0
            margin 0 36px
            border-1px(rgba(7,17,27,.1))
            font-size 0
            .block
                display inline-block
                padding 16px 24px
                margin-right 16px
                border 1px solid #cccccc
                border-radius 5px
                font-size 24px
                line-height 32px
                color rgb(77,85,93)
                &.active
                    color #ffd161
                .count
                    margin-left 4px
                    font-size 16px
                &.positive
                    background #ffffff
                    &.active
                        background #fff8e9
                &.negative
                    background #fff
                    &.active
                        background rgb(77,85,93)
        .switch
            display flex
            padding 24px 36px
            line-height 48px
            border-bottom 1px solid rgba(7,17,27,.1)
            color rgb(147,153,159)
            font-size 0
            .icon
                color #ffd161
            .text
                font-size 24px
                padding-left 10px
</style>
