<template>
<!-- 规格选择组件 -->
<div>
  <div class="props" >
    <div class="prop" v-show="propT.pvs.length > 0">
      <span>{{propT.pn}}:</span>
      <div v-for="(item, index) in propT.pvs"
         @click="propSelected(propT, item)"
         :class="{'prop-active': item.vid === selectedProp.vid, 'prop-value': true}">
      {{item.vn}}
    </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'eprops',
  props: {
    propT: {
      type: Object
    },
    propList: {
      type: Array
    },
    foodFlg: {
      type: Boolean
    }
  },
  data() {
    return {
      selectedProp: {}
    }
  },
  methods: {
    propSelected(prop, value) {
      console.log(value.vn)
      if (this.selectedProp === value) {
        // this.selectedProp = undefined
      } else {
        this.selectedProp = value
      }
      // this.selectedProp = this.getSelectedProp(value)
      const paCount = this.selectedProp.pa ? parseInt(this.selectedProp.par.split(':')[0]) : undefined
      // 通知上层, 修改选中产品对应的规格值串
      this.$emit('selected', { pid: prop.pid, pname: prop.pn, pv: this.selectedProp, paCount: paCount })
    },

    initPropSelect() {
      this.propT.pvs = this.propT.pvs.sort((v1, v2) => { return v1.sw - v2.sw })
      // 初始化为默认第一个规格值
      this.selectedProp = this.propT.pvs.length > 0 ? this.propT.pvs[0] : undefined
      this.selectedProp = this.getSelectedProp()
      if (this.selectedProp) {
        const paCount = this.selectedProp.pa ? parseInt(this.selectedProp.par.split(':')[0]) : undefined
        this.$emit('selected', { pid: this.propT.pid, pname: this.propT.pn, pv: this.selectedProp, paCount: paCount })
      }
      console.log(this.propT.pvs[0].vn)
    },

    getSelectedProp(defaultProp) {
      const finded = this.propList.find(v => {
        return this.propT.pid === v.pid
      })
      defaultProp = defaultProp || this.propT.pvs.length > 0 ? this.propT.pvs[0] : undefined
      return finded ? Object.assign({}, finded.pv) : defaultProp
    }
  },
  watch: {
    propT(newValue) {
      // 更换规格, 初始化
      this.initPropSelect()
    },
    foodFlg(newValue) {
      // 打开规格弹窗, 初始化
      if (newValue) {
        this.initPropSelect()
      }
    }
  },
  mounted() {
    this.initPropSelect()
  },
  updated() {
    // this.initPropSelect()
  }
}
</script>

<style lang="stylus" scoped>
@import "../common/stylus/variables";
.props
    .prop
        width 100%
        display flex
        flex-wrap wrap
        justify-content flex-start
        margin-bottom 18px
        span
          font-size 30px
          line-height 38px
          padding 10px
        .prop-value
            font-size 30px
            padding 10px 40px
            line-height 38px
            margin-left 15px
            margin-bottom 10px
    .prop-value
        border 1px solid #ececec
    .prop-active
        color: btn-red
        border: 1px solid btn-red
</style>
