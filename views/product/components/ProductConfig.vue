<template>
<div class="createPost-container">
  <el-form :rules="rules" ref="postForm" :model="postForm" label-position="right" label-width="150px"  v-loading="loading" element-loading-text="请给我点时间！">
    <el-row :gutter="10">
      <el-col :span="12">
        <code> <span >使用优惠</span></code>
        <el-form-item label="使用优惠券" prop="isUseCP" class="h2">
          <el-switch v-model="postForm.isUseCP" active-text="是" class="h2" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="使用积分" prop="isUseS">
          <el-switch v-model="postForm.isUseS" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="使用店铺打折" prop="isUseD">
          <el-switch v-model="postForm.isUseD" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>

        <code> <span >会员相关</span></code>
        <el-form-item label="使用会员价" prop="isMemberPrice">
          <el-switch v-model="postForm.isMemberPrice" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-collapse-transition >
          <div v-show="postForm.isMemberPrice" class="transition-box">
            <el-card class="box-card">
              <el-form-item v-for="(item, index) in postForm.Mprices" :key="item.level" :label="item.level | displayNameFilter(memberLevelOptions)" prop="Mprices">
                <el-input placeholder="输入对应等级的价格" v-model.number="postForm.Mprices[index].price" ></el-input>
              </el-form-item>
            </el-card>
          </div>
        </el-collapse-transition >
        <el-form-item label="只限会员购买" prop="isMemberOnly">
          <el-switch v-model="postForm.isMemberOnly" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="会员价只限余额支付" prop="isMpByLfund">
          <el-switch v-model="postForm.isMpByLfund" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <code> <span >其他设置</span></code>
        <el-form-item label="出单打印机ID" prop="prtId">
          <!-- <el-input placeholder="输入出单打印机ID" v-model.number="postForm.prtId" ></el-input> -->
        <el-select clearable  style="width: 240px" v-model.number="postForm.prtId" class="filter-item" placeholder="选择厨房打印机">
				<el-option v-for="item in printCFGOptions" :key="item.id" :label="item.name+'('+item.codeNO+')'" :value="item.id"></el-option>
		    </el-select>
        </el-form-item>
        <el-form-item label="是否预打厨房单" prop="isSrvPrePrint">
          <el-switch v-model="postForm.isSrvPrePrint" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <code> <span >限购</span></code>
        <el-form-item label="是否限购" prop="isLimit">
          <el-switch v-model="postForm.isLimit" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="限购剩余总数量" prop="buyTotal">
          <el-input placeholder="输入数量" v-model.number="postForm.buyTotal" ></el-input>
        </el-form-item>
        <el-form-item label="每人限购数量" prop="buyLimit">
          <el-input placeholder="输入限购数量" v-model.number="postForm.buyLimit" ></el-input>
        </el-form-item>

        <code> <span >商品打折</span></code>
        <el-form-item label="是否打折" prop="isDiscount">
          <el-switch v-model="postForm.isDiscount" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>

        <el-collapse-transition >
          <div v-show="postForm.isDiscount" class="transition-box">
            <el-card class="box-card">
              <el-form-item label="顾客是否参与打折" prop="isDiscountLevel0">
                <el-switch v-model="postForm.isDiscountLevel0" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
              <el-form-item label="打折额度" prop="discount">
                <el-input placeholder="输入打折额度" v-model.number="postForm.discount" ></el-input>
              </el-form-item>
              <el-form-item label="打折时间段类型" prop="discountDTtype">
                <el-select v-model="postForm.discountDTtype" placeholder="选择打折时间类型" required>
                  <el-option v-for="(item,index) in discountDTtypeOptions" :key="item.key" :label="item.displayName+'('+item.key+')'" :value="item.key"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="打折时间段开始时间" prop="discountDT1">
                <el-date-picker
                  v-model="postForm.discountDT1"
                  type="datetime"
                  align="right"
                  placeholder="打折时间段开始时间"
                  value-format="timestamp"
                  default-time="12:00:00">
                </el-date-picker>
            </el-form-item>
              <el-form-item label="打折时间段结束时间" prop="discountDT2">
                <el-date-picker
                  v-model="postForm.discountDT2"
                  type="datetime"
                  align="right"
                  placeholder="打折时间段结束时间"
                  value-format="timestamp"
                  default-time="12:00:00">
                </el-date-picker>
            </el-form-item>
          </el-card>
          </div>
        </el-collapse-transition>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-button type="primary" @click='_updateConfig' size="small" icon="el-icon-edit">确认修改</el-button>
    </el-row>
  </el-form>
</div>
</template>

<script>
import Sticky from '@/components/Sticky'
import { fetchProductCFG, updateProductCFG ,fetchPtrCFGList} from '@/api/product'
import { dict } from '@/store'

const defaultForm = {
  id:	undefined, //	商品ID
  isUseCP:	undefined, //	是否使用优惠券
  isUseS:	undefined, //	是否使用积分
  isUseD:	undefined, //	是否使用店铺打折
  isMemberPrice:	undefined, //	是否使用会员价
  Mprices:	undefined, //	会员等级会员价列表,用“，”分隔的元组，元组格式为：等级ID:等级ID对应的价格
  isMemberOnly:	undefined, //	是否只限会员购买
  isMpByLfund:	undefined, //	会员价是否只限余额支付
  isLimit:	undefined, //	是否限购
  buyTotal:	undefined, //	限购剩余总数量
  buyLimit:	undefined, //	每人限购数量
  isDiscount:	undefined, //	是否打折
  isDiscountLevel0:	undefined, //	顾客是否参与打折
  discount:	undefined, //	打折额度
  discountDTtype:	undefined, //	打折时间段类型 1每天;2指定日期
  discountDT1:	undefined, //	打折时间段开始时间
  discountDT2:	undefined, //	打折时间段结束时间
  prtId:	undefined, //	出单打印机ID
  isSrvPrePrint:	undefined, //	厨房单是否预打
}

export default {
  name: 'product-config',
  components: { Sticky },
  props: {
    type: {
      type: String
    }
  },
  data() {
    // validateFuns
    return {
      productId: this.$route.params.id,
      loading: false,
      postForm: Object.assign({}, defaultForm),
      Mprices: [],
      // options
      discountDTtypeOptions: [
        { key: 1, displayName: '每天' },
        { key: 2, displayName: '按时间段' }
      ],
      memberLevelOptions: [],
      printCFGOptions:[],
      rules: {
        // prtId: [
        //   {type: 'integer', fullField:'打印机ID'}
        // ]
        // buyTotal: [
        //   { type: 'number', message: '限购剩余总数量必须是数字' }
        // ],
        // buyLimit: [
        //   { type: 'number', message: '每人限购数量必须是数字' }
        // ],
        // discount: [
        //   { type: 'number', message: '打折额度必须是数字' }
        // ]
      },
      watch: {

      }
    }
  },
  computed: {

  },
  filter: {

  },
  created() {
    this._fetchData()
    fetchPtrCFGList({ptrType:1}).then(response =>{
      this.printCFGOptions = response.data.list
    })
  },
  methods: {
    _fetchData() {
      this.loading = true
      fetchProductCFG(this.productId).then(response => {
        this.postForm = response.data
        dict('cLevel').then(response => {
			    this.memberLevelOptions = response
          if (!this.postForm.Mprices) {
            this.postForm.Mprices = this.memberLevelOptions.map(item => {
              return { level: item.id, price: '' }
            })
          } else {
            this.postForm.Mprices = this.postForm.Mprices
              .split(',').map(item => {
                let { 0: level, 1: price } = item.split(':')
                level = parseInt(level)
                price = parseFloat(price)
                return { level, price }
              })
            this.postForm.Mprices = this.memberLevelOptions.map(item => {
              const finded = this.postForm.Mprices.find(v => { return v.level === item.id })
              const price = finded ? finded.price : ''
              return { level: item.id, price: price }
            })
          }
		    })
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    _updateConfig() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.Mprices  = this.postForm.Mprices
            .filter(i => i.price > -1 && i.price !== '')
            .map(v => {
              return [v.level, v.price].join(':')
            })
          this.postForm.Mprices = this.postForm.Mprices.join(',')
          updateProductCFG(this.postForm).then(response => {
            this._fetchData()
            this.loading = false
            this.$notify({
              title: '成功',
              message: '产品配置修改成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  code {
      font-size: 18px;
      text-align: center;
  }
  .el-select {
      width: 100%;
  }
</style>
