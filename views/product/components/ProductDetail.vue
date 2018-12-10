<template>
<div class="createPost-container">
  <el-form class="form-container" label-position="right" :model="postForm" :rules="rules" ref="postForm" label-width="100px">
    <sticky :className="'sub-navbar '+postForm.status" :zIndex="100">
      <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布
      </el-button>
      <el-button v-loading="loading" type="warning" @click="draftForm">草稿</el-button>
    </sticky>

    <!-- <el-form-item label-width="45px" label="作者:" class="postInfo-container-item"> -->
      <!--                     <el-select v-model="postForm.author" filterable remote placeholder="搜索用户" :remote-method="getRemoteUserList"> -->
        <!--                         <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item"> -->
          <!--                           </el-option> -->
        <!--                       </el-select> -->
      <!--   </el-form-item> -->
    <!-- <el-form-item label="发布时间:" class="postInfo-container-item"> -->
      <!--   <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"> -->
        <!--   </el-date-picker> -->
      <!-- </el-form-item> -->
    <!-- <el-form-item label="重要性:" class="postInfo-container-item" required> -->
      <!--   <el-input width="100%" v-model="postForm.author"></el-input> -->
      <!-- </el-form-item> -->

    <div class="createPost-main-container">
      <el-row>
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row >
              <el-col :span="8">
                <el-form-item label="店铺:" class="postInfo-container-item"  prop="sid">
                  <el-select v-model.number="postForm.sid" placeholder="选择店铺" @change="getCat()">
                    <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name +'(' + item.id +')' " :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="显示次序:" class="postInfo-container-item" prop="showId" required>
                  <el-input v-model.number="postForm.showId"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品名称:" class="postInfo-container-item" prop="name" required>
                  <el-input v-model="postForm.name"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item label="商品分类:" class="postInfo-container-item" required prop="catID">
                  <el-select v-model.number="postForm.catID" placeholder="选择分类" filterable >
                    <el-option v-for="(item,index) in catOptions" :key="item.id" :label="item.name +'(' + item.id +')' " :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="单位" class="postInfo-container-item" required prop="unit">
                  <el-input v-model="postForm.unit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="价格" class="postInfo-container-item" required prop="price">
                  <el-input type="number" v-model.number="postForm.price"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item label="精品(推荐)" class="postInfo-container-item" required prop="isFine">
                  <el-switch v-model="postForm.isFine" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
             <el-col :span="8">
                <el-form-item label="是否排行" class="postInfo-container-item" required prop="isRank">
                  <el-switch v-model="postForm.isRank" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
               <el-col :span="8">
                <el-form-item label-width="120px" label="sku库存功能:" class="postInfo-container-item" required prop="isUseSKU">
                  <el-switch v-model="postForm.isUseSKU" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售状态" class="postInfo-container-item" required prop="isSale">
                  <el-select v-model.number="postForm.isSale" placeholder="是否上架" >
                    <el-option v-for="(item,index) in saleTypeOptions" :key="item.key" :label="item.name +'(' + item.key + ')' " :value="item.key">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="加工时间" class="postInfo-container-item" required prop="opMinute">
                  <el-input placeholder="" v-model.number="postForm.opMinute">
                    <el-tooltip slot="prefix" class="item" effect="dark" content="-1不生成加工记录;0产品无需加工；大于0需现场加工项目" placement="top">
                      <i class="el-input__icon el-icon-question"></i>
                    </el-tooltip>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计价方式" class="postInfo-container-item" required prop="isbyMass">
                  <el-select v-model="postForm.isbyMass" placeholder="是否上架" >
                    <el-option v-for="(item,index) in isbyMassOptions" :key="item.key" :label="item.name +'(' + item.key + ')' " :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>



      <el-row :gutter="10">
        <el-col :span="24">
          <div class="postInfo-container">
            <el-row>

              <el-col :span="8">
                <el-form-item label="库存类型" prop="stockType" required >
                  <el-select v-model="postForm.stockType" placeholder="选择库存类型">
                    <el-option v-for="(item,index) in stockTypeOptions" :key="item.key" :label="item.name+'('+item.key+')'" :value="item.key"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产品层级" class="postInfo-container-item" required prop="isSub">
                  <el-select v-model="postForm.isSub" placeholder="是否从属产品" >
                    <el-option v-for="(item,index) in isSubOptions" :key="item.key" :label="item.name + '('+item.key+')'" :value="item.key" >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="最低起购:" class=" " prop="stepMass">
                  <el-input placeholder="最低起购" v-model.number="postForm.stepMass"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

         <el-row>
        <el-col :span="24">
          <div class="postInfo-container">
            <!-- <el-row> -->
              <el-col :span="8" v-if="postForm.stockType != 0">
                <el-form-item label="总库存:" class="postInfo-container-item"  :required="postForm.stockType != 0 " prop="stockNum">
                  <el-input placeholder="" v-model.number="postForm.stockNum">
                    <el-tooltip slot="prefix" class="item" effect="dark" content="总库存(每日清算模式下为每日重新初始化的库存量)" placement="top">
                      <i class="el-input__icon el-icon-question"></i>
                    </el-tooltip>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="postForm.stockType != 0">
                <el-form-item label="当前库存:" class="postInfo-container-item"  :required="postForm.stockType != 0 " prop="stockNumLeft">
                  <el-input placeholder="" v-model.number="postForm.stockNumLeft"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item v-show="postForm.isSub" label="父级商品:" class="postInfo-container-item" filterable :required="postForm.isSub !=0 " prop="parentIDs">
                  <el-select v-model="postForm.parentIDs" placeholder="产品层级非0时必需(可搜索)" filterable remote  :remote-method="getRemoteProducts" required multiple>
                    <el-option v-for="(item,index) in parentIDsOptions" :key="item.id" :label="item.name + '(' + item.id +')' " :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item v-show="postForm.isSub" label="套餐价:" class="postInfo-container-item" :required="postForm.isSub !=0" prop="subPrice">
                  <el-input placeholder="与主商品结合时的价" v-model.number="postForm.subPrice" >
                  </el-input>
                </el-form-item>
              </el-col>
            <!-- </el-row> -->
          </div>
        </el-col>
      </el-row>

      <el-form-item style="margin-bottom: 40px;" label-width="90px" label="产品介绍">
        <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.remark">
        </el-input>
        <span class="word-counter" v-show="remarkLength">{{remarkLength}}字</span>
      </el-form-item>
      <el-form-item style="margin-bottom: 40px;" label-width="90px" label="商品特性">
        <el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.feature">
        </el-input>
        <span class="word-counter" v-show="featureLength">{{featureLength}}字</span>
      </el-form-item>

      <div class="editor-container">
        <Tinymce :height=400 ref="editor" v-model="postForm.content" />
      </div>
        <div style="margin-bottom: 20px;">
          <Upload v-model="picUrl" :productId="parseInt(postForm.id)"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/productImgMain'
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'// 使用的一个多选框组件，element-ui的select不能满足所有需求
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchProductList, fetchProduct, createProduct, updateProduct } from '@/api/product'
import { fetchClassList } from '@/api/product'
import { userSearch } from '@/api/remoteSearch'
import { dict } from '@/store'



const defaultForm = {
  // status: 'draft',
  // title: '', // 文章题目
  content: '', // 文章内容
  // content_short: '', // 文章摘要
  // source_uri: '', // 文章外链
  // image_uri: '', // 文章图片
  // display_time: undefined, // 前台展示时间
  // id: undefined,
  // platforms: ['a-platform'],
  // comment_disabled: false,
  // importance: 0,

  sid: undefined, // 店铺id
  showId: undefined, // 显示次序
  name: undefined, // 产品名称
  catID: undefined, // 所属分类
  price: undefined, // 价格
  unit: undefined, // 单位
  remark: '', // 产品介绍
  feature: '', // 商品特性
  isbyMass: undefined, // 是否按重量计价0按数量1按重量
  stepMass: undefined, // 计重增减步长
  isSale: 0, // 是否上架（销售状态）0下架;1全部使用;2仅限内务;3仅限后台;4删除标记（用于软删除操作）
  stockType: 0, // 库存类型0不启用，1总库存，2每日清算
  stockNum: undefined, // 总库存(每日清算模式下为每日重新初始化的库存量)
  stockNumLeft: undefined, // 当前库存
  isUseSKU: 0, // 是否使用sku库存功能
  opMinute: -1, // 完成该产品所需时间（单位：分钟）。-1不生成加工记录;0产品无需加工；大于0需现场加工项目
  isFine: 0, // 精品(推荐)标志
  isRank: 1, // 不参加排行标志
  isSub: 0, // 产品层级(是否从属产品)0否;(非0，属某产品的子项目)1附加项目;2套餐项目;
  parentIDs: undefined, // 父级商品ID(isSub非0时必需)
  subPrice: undefined, // 套餐价(与主商品结合时的价)
  picUrl: ''
}

export default {
  name: 'product-detail',
  components: { Tinymce, MDinput, Upload, Multiselect, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const saleTypeOptions =
          [
            { key: 0, name: '下架' },
            { key: 1, name: '全部使用' },
            { key: 2, name: '仅限内务' },
            { key: 3, name: '仅限后台' },
            { key: 4, name: '删除标记' }
          ]
    // 库存类型
    const stockTypeOptions =
          [
            { key: 0, name: '不启用' },
            { key: 1, name: '总库存' },
            { key: 2, name: '每日清算' }
          ]
    const shopOptions = dict('shop', 1,0,0).then(response => {
      this.shopOptions = response
    })

    const isSubOptions =
          [
            { key: 0, name: '否' },
            { key: 1, name: '附加项目' },
            { key: 2, name: '套餐项目' }
          ]

    const isbyMassOptions =
          [
            { key: 0, name: '按数量' },
            { key: 1, name: '按重量' }
          ]

    const validateRequire = (rule, value, callback) => {
      if (value === '' || value === undefined) {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(null)
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(null)
        }
      } else {
        callback()
      }
    }
    return {
      postForm: {},
      loading: false,
      userListOptions: [],
      parentIDsOptions: [],
      isSubOptions,
      saleTypeOptions,
      stockTypeOptions,
      isbyMassOptions,
      catOptions: [],
      shopOptions: [],
      rules: {
        content: [{ validator: validateRequire }],
        // sid: [{ fullField: '店铺', required: true }],
        showId: [{ fullField: '显示次序', type: 'integer', required: true }],
        name: [{ required: true, fullField: '产品名称', type: 'string' }],
        catID: [{ required: true, fullField: '产品分类', type: 'integer' }],
        unit: [{ required: true, fullField: '单位' }],
        price: [{ required: true, fullField: '价格', type: 'number' }],
        isSale: [{ required: true }],
        isbyMass: [{ required: true, fullField: '计价方式', type: 'integer' }],
        // stepMass: [{  fullField: '计重步长', type: 'number' }],
        stockNum: [{ fullField: '总库存', type: 'number' }],
        stockNumLeft: [{ fullField: '当前库存', type: 'number' }],
        isUseSKU: [{ required: true, fullField: 'SKU库存功能', type: 'integer' }],
        opMinute: [{ required: true, fullField: '加工时间', type: 'number' }],
        isFine: [{ required: true, fullField: '精品推荐', type: 'integer' }],
        isRank: [{ required: true, fullField: '精品推荐', type: 'integer' }],
        isSub: [{ required: true, fullField: '产品层级', type: 'integer' }],
        subPrice: [{ fullField: '套餐价格', type: 'number' }],
        parentIDs: [{ fullField: '父级商品', type: 'array' }]

      }
    }
  },
  computed: {
    remarkLength() {
      return this.postForm.remark && this.postForm.remark.length
    },
    featureLength() {
      return this.postForm.feature && this.postForm.feature.length
    },
    picUrl() {
      return this.postForm.picUrl ? process.env.BASE_API +'/' + this.postForm.picUrl : process.env.BASE_API +'/image/nopic.png'
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.postForm.id = id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
      this.postForm.sid = this.$store.getters.session.sid
    }
    console.log(this.postForm.id)
    this.getRemoteProducts()
    this.getRemoteCategorys()
  },
  methods: {
    fetchData(id) {
      fetchProduct(id).then(response => {
        this.postForm = response.data
        this.postForm.parentIDs = this.postForm.parentIDs.split(',').map((item) => parseInt(item))
        // Just for test
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      const tempData = Object.assign({}, this.postForm)
      tempData.parentIDs = tempData.parentIDs.join(',')
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            updateProduct(tempData).then(response => {
              this.$notify({
                title: '成功',
                message: '修改产品信息成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            createProduct(tempData).then(response => {
              this.$notify({
                title: '成功',
                message: '新建产品信息成功',
                type: 'success',
                duration: 2000
              })
            })
          }
          this.loading = false
        } else {
          console.log('error product submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    },

    getRemoteProducts(query) {
      const listQuery = {}
      listQuery.name = query
      fetchProductList(listQuery).then(response => {
        this.parentIDsOptions = response.data.list
      })
    },

    getRemoteCategorys(query) {
      const listQuery = {}
      listQuery.name = query
      fetchClassList(listQuery).then(response => {
        this.catOptions = response.data.list
        // this.list = this.list.map((row) => {
        //   row.tempWeek = row.showWeek.split(',').map((item) => parseInt(item))
        //   return row
        // })
        this.listLoading = false
      })
    },
    getCat(){
      fetchClassList({sid:this.postForm.sid}).then(response => {
         this.catOptions = response.data.list
         this.postForm.catID = undefined
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-select{
    width: 100%;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        /* float: left; */
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
