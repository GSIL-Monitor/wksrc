<template>
    <div class="heard">
        <div class="heard-location" @click="searchAddress">
            <image src="/static/images/location.png" class="heard-location-icon"/>
            <text class="heard-location-text">{{location}}</text>
        </div>
        <div class="heard-search">
        <image src="/static/images/search.png" class="heard-search-icon"/>
        <span class="text">小龙虾</span>
        </div>
  </div>
</template>

<script>
    import QQMapWX from "../../utils/map";
    var qqmapsdk;
    qqmapsdk = new QQMapWX({
    key:'DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ'
    });
export default {
    data(){
        return {
            location
        }
    },
    onLoad() {
         wx.getLocation({
            type: "gcj02",
            success:(res)=>{
            qqmapsdk.reverseGeocoder({
                location: {
                    latitude: res.latitude,
                    longitude: res.longitude,
                },
            success:  (res) => {
                this.location = res.result.formatted_addresses.recommend
            },

        });
      }
         })
    },
    methods: {
        searchAddress() {
            wx.chooseLocation()
        }
    }
}
</script>

<style lang="stylus" scoped>
    .heard
        justify-content: space-around
        display flex
        width 100%
        height 80px
        background #FFC640
        .heard-location
            position relative
            font-size 25px
            padding 5px 15px
            margin 10px
            width 250px
            height 40px
            line-height 40px
            overflow hidden
            white-space nowrap
            text-overflow ellipsis
            background #B38B2D
            color white
            border-radius 20px
            &:after
                content ''
                position absolute
                top 20px
                left 250px
                width 8px
                height 8px
                border 3px solid #fff
                border-bottom none
                border-left none
                transform rotate(45deg)
            .heard-location-icon
                position absolute
                top 12px
                height 25px
                width 25px
            .heard-location-text
                left 47px
                height 30px
                width 190px
                padding-left 30px

        .heard-search
            font-size 25px
            padding 5px 15px
            margin 10px
            height 40px
            width 400px
            background white
            border-radius 20px
            line-height 40px
            .text
                padding-left 10px
                color #ccc
            .heard-search-icon
                height 21px
                width 21px

</style>
