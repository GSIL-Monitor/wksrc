<template>
<div class="tab-container">
  <el-tag> 产品ID:{{id}}</el-tag>
  <el-tag>mounted times ：{{createdTimes}}</el-tag>
  <el-alert style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" :closable="true">
  </el-alert>
  <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" >
    <el-tab-pane label="产品规格" key='prop' name="prop">
      <keep-alive>
        <product-prop type='prop'></product-prop>
      </keep-alive>
    </el-tab-pane>
    <el-tab-pane label="产品设置" key='conf' name="conf">
      <keep-alive>
        <product-config type='conf' ></product-config>
      </keep-alive>
    </el-tab-pane>
    <el-tab-pane label="SKU库存" key='sku' name="sku">
      <keep-alive>
        <product-sku type='sku' ></product-sku>
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import ProductProp from './components/ProductProp'
import ProductConfig from './components/ProductConfig'
import ProductSku from './components/ProductSKU'
export default {
  name: 'product-conf',
  components: { ProductProp, ProductConfig, ProductSku },
  data() {
    return {
      tabMapOptions: [
      ],
      id: this.$route.params.id,
      activeName: this.$route.params.activeName, // 被props属性代替
      createdTimes: 0
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    handleTabChange: function(newVal) {
      console.log('tab is changing to ' + newVal)
      if (newVal) {
        this.$router.push(newVal)
      }
    }
  }
}
</script>

<style scoped>
.tab-container{
    margin: 30px;
}
</style>
