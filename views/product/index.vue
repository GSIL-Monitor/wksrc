<template>
<div class="app-container">
  <div class="filter-container">
    <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.sid" :placeholder="$t('product.sid')" @change="getCat(listQuery.sid)">
      <el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id">
      </el-option>
    </el-select>
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.catID" :placeholder="$t('product.catID')">
      <el-option v-for="item in catOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id">
      </el-option>
    </el-select>
    <el-select clearable class="filter-item" style="width: 150px" v-model="listQuery.isSale" :placeholder="$t('product.isSale')">
      <el-option v-for="item in saleTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id">
      </el-option>
    </el-select>
    <el-input @keyup.enter.native="handleFilter" style="width: 130px;" class="filter-item" :placeholder="$t('product.name')" v-model="listQuery.name">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <router-link to="/product/create">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>
    </router-link>
    <!-- <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button> -->
  </div>
  <!-- 产品列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" :label="$t('product.id')" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.showId')" min-width="80">
      <template slot-scope="scope">
        <span>{{scope.row.showId}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.unit')" min-width="80">
      <template slot-scope="scope">
        <span>{{scope.row.unit}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.catID')" min-width="80">
      <template slot-scope="scope">
        <span>{{scope.row.catID}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.name')" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.isSale')" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.isSale}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.stockNumLeft')" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.stockNumLeft}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.sCount')" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.sCount}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" :label="$t('product.sCountToday')" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.sCountToday}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="小程序图片" min-width="140">
      <template slot-scope="scope">
        <el-button type="success" @click="showPic(scope.row)" size="small">查看小程序图片</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="220">
      <template slot-scope="scope">
        <el-dropdown trigger="hover">
          <el-button type="primary" size="small">
            产品设置<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <router-link :to="'/product/edit/'+scope.row.id">
              <el-dropdown-item>基础信息</el-dropdown-item>
            </router-link>
            <router-link :to="'/product/config/'+scope.row.sid+'/'+scope.row.id+'/prop'">
              <el-dropdown-item>产品规格</el-dropdown-item>
            </router-link>
            <router-link :to="'/product/config/'+scope.row.sid+'/'+scope.row.id+'/conf'">
              <el-dropdown-item>产品设置</el-dropdown-item>
            </router-link>
            <router-link :to="'/product/config/'+scope.row.sid+'/'+scope.row.id+'/sku'">
              <el-dropdown-item>SKU库存</el-dropdown-item>
            </router-link>
            <el-dropdown-item><span @click="handleDelete(scope.row)">删除产品</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button style="background:red;color:#fff"  @click="handleOutStock(scope.row)">
          沽  清
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 产品列表结束 -->
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.p"  layout="total, prev, next, jumper" :total="total" :page-size="20">
    </el-pagination>
  </div>
  <!-- 沽清界面 -->
  <el-dialog :title="OutStockName" :visible.sync="dialogVisible">
		<el-form :rules="rules" ref="dataForm" :model="OutStockQuery" label-position="left" label-width="150px"
             style='margin-left:0px;'>
      <div v-if="!noStock" v-for="(item, index) in OutStockList" >
			  <el-form-item :label="item.skuStrSimpleName" >
			 	  <el-input placeholder="沽清数量" v-model.number='OutStockQuery.stockNumLeft[index]'>
            <template slot="append" v-if="showEnd"><span style="color:red;">现已点{{item.frozeNum}}</span></template>
          </el-input>
			  </el-form-item>
      </div>
      <div v-if="noStock">
        <el-input v-model.number='OutStockQuery.stockNumLeft[0]' placeholder="沽清数量" style=""></el-input>
      </div>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="undoProductStock" v-if="!openStock" class="cancel-button" style="width:45%;">撤销沽清</el-button>
      <el-button @click="dialogVisible = false" v-if="openStock" class="cancel-button"  style="width:45%;">取消</el-button>
      <el-button class="submit-button" type="danger" @click="OProductStock" style="width:45%;">确认沽清</el-button>
		</div>
	</el-dialog>
  <!-- 沽清界面结束 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
      <el-form-item :label="$t('table.type')" prop="type">
        <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
          <el-option v-for="item in  shopOptions" :key="item.key" :label="item.display_name" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.date')" prop="timestamp">
        <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('table.title')" prop="title">
        <el-input v-model="temp.title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('table.status')">
        <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
          <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.importance')">
        <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
      </el-form-item>
      <el-form-item :label="$t('table.remark')">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
    </div>
  </el-dialog>

  <el-dialog title="Reading statistics" :visible.sync="dialogPvVisible">
    <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
      <el-table-column prop="key" label="Channel"> </el-table-column>
      <el-table-column prop="pv" label="Pv"> </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogPvVisible = false">{{$t('table.confirm')}}</el-button>
    </span>
  </el-dialog>

  <!-- 选择界面 -->
  <div id="choose">
    <el-dialog title="查看和下载小程序图片" :visible.sync="dialogShowPicVisible" width="60%" center>
      <div style="text-align:center;"><img :src="ACodeUrl" alt="产品小程序图片"></div><br>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" style="width:30%;"@click="dialogShowPicVisible=false"> 返 回 </el-button>
        <a :href = "ACodeUrl" :download="picName">
          <el-button style="width:30%;background:red;color:#fff" >
            下载文件
          </el-button>
        </a>
      </span>
    </el-dialog>
  </div>
</div>

</template>

<script>
  import { fetchProductList ,fetchClassList} from '@/api/product'
  import { fetchSKUStockList,OProductStock,fetchProductPropList,delProduct,getProductACode} from '@/api/product'
  import waves from '@/directive/waves' // 水波纹指令
  import { parseTime } from '@/utils'
  import { dict } from '@/store'
  import { displayShopFilter } from '@/filters'

  // arr to obj ,such as { CN : "China", US : "USA" }
  // const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  //   acc[cur.key] = cur.display_name
  //   return acc
  // }, {})
  export default {
  name: 'product-index',
  directives: {
  waves
  },
  data() {
  return {
  tableKey: 0,
  list: null,
  total: null,
  pageTotal: null,
  listLoading: true,
  listQuery: {
  p: 1, // page
  // limit: 20,
  catID: undefined,
  name: undefined,
  sid: undefined,
  isSale: undefined
  },
  importanceOptions: [1, 2, 3],
  saleTypeOptions: [],
  catOptions: [],
  shopOptions: [],
  sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
  statusOptions: ['published', 'draft', 'deleted'],
  showReviewer: false,
  temp: {
  id: undefined,
  importance: 1,
  remark: '',
  timestamp: new Date(),
  title: '',
  type: '',
  status: 'published'
  },
  dialogFormVisible: false,
  dialogStatus: '',
  textMap: {
  update: 'Edit',
  create: 'Create'
  },
  dialogPvVisible: false,
  pvData: [],
  rules: {
  type: [{ required: true, message: 'type is required', trigger: 'change' }],
  timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
  title: [{ required: true, message: 'title is required', trigger: 'blur' }]
  },
      downloadLoading: false,

      dialogVisible:false,
      OutStockList:[],
      OutStockName:undefined,
      OutStockQuery:{
        id:undefined,
        skuStr:[],
        stockType:1,
        stockNumLeft:[],
      },
      rules2:{},
      openStock:false,
      noStock:false,
      productStockList:[],
      num:0,
      showEnd:false,
      dialogShowPicVisible:false,
      ACodeUrl:undefined,
      picName:undefined,
      baesUrl:process.env.BASE_API,
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    }
  },
  created() {
    this.listQuery.sid = this.$store.getters.session.sid
    this.listQuery.initQList = 1 // 获取店铺, 分类列表
    this.getList()
    this.listQuery.initQList = undefined
    dict('isSaleType').then(response => {
      this.saleTypeOptions = response
    })
    dict('pcat',1,this.$store.getters.session.uid,this.$store.getters.session.sid).then(response => {
      this.catOptions = response
    })
  },
  methods: {
    handleOutStock(food){
      this.OutStockList = [];
      this.OutStockQuery.stockNumLeft = []
      this.OutStockQuery.skuStr = []
      this.OutStockQuery.id = undefined
      this.OutStockName =undefined
      this.OutStockName =food.name
      this.OutStockQuery.id = food.id
      this.OutStockQuery.stockType = 1
      this.noStock= false

        
          fetchSKUStockList(this.OutStockQuery.id).then(response =>{
            this.openStock = response.data.count == 0 ? true :false
            if(response.data.count == 0){
              if(food.isUseSKU === 0){
                  // this.showEnd = false
                  this.noStock =  true
                  // this.openStock = true
                  this.OutStockQuery.skuStr[0] = '';
                  this.OutStockQuery.stockNumLeft[0] = 0;
                }else{
                  this.getSkutOfList(this.OutStockQuery.id)
                }
                  this.showEnd = false
            }else{
              this.showEnd = true
              this.OutStockList = response.data.list
              this.OutStockQuery.skuStr = this.OutStockList.map(item => {
                return item.skuStr =="" ? '':item.skuStr
              })
              this.OutStockQuery.stockNumLeft = this.OutStockList.map(item => {
                return item.stockNumLeft == "" ? 0 :item.stockNumLeft
              })
            }
            // console.log(this.OutStockQuery)
          })
        // }

      this.dialogVisible = true
    },
    getSkutOfList(val){
        fetchProductPropList(val).then(response => {
          // console.log(response.data.list)
          const food =  response.data.list
          // console.log(food)
      if(this.isEmpty(food)){
        this.noStock =  true
        this.OutStockQuery.skuStr[0] = '';
        this.OutStockQuery.stockNumLeft[0] = 0;
      }else{
        var len = food.length
        
        if (len ===1) {
          if(food[0].valueA.length >0){
            for(var val of food[0].valueA){
              this.OutStockList.push({skuStrSimpleName:val.value,skuStr:food[0].id+':'+val.id})
            }
            this.OutStockQuery.skuStr = this.OutStockList.map(item => {
              return item.skuStr =="" ? '':item.skuStr
            });
          }else{
            this.noStock =  true
            this.OutStockQuery.skuStr[0] = '';
          }

        } else {
          if(len === 2){
            for(var i=0; i< len-1;i++){
            var len1 = food[i].valueA.length
            for(var j=0; j< len1;j++){
              var len2 = food[i+1].valueA.length
              console.log(len2)
              for(var k=0; k< len2;k++){
                var sku = food[i].id+':'+food[i].valueA[j].id +';'+food[i+1].id+':'+food[i+1].valueA[k].id
                this.OutStockList.push({skuStrSimpleName:food[i].valueA[j].value + '/'+food[i+1].valueA[k].value,skuStr:sku})
              }
            }
          }
          }else{
            for(var i=0; i< len-1;i++){
            var len1 = food[i].valueA.length
            for(var j=0; j< len1;j++){

              var len2 = food[i+1].valueA.length
              for(var k=0; k< len2;k++){
                // console.log(food[i+2])
                var len3 = food[i+2].valueA.length
                // console.log(len3)
              for(var s=0; s< len3;s++){
                 var sku = food[i].id+':'+food[i].valueA[j].id +';'+food[i+1].id+':'+food[i+1].valueA[k].id +';'+food[i+2].id+':'+food[i+2].valueA[s].id
                // console.log(sku)
                this.OutStockList.push({skuStrSimpleName:food[i].valueA[j].value + '/'+food[i+1].valueA[k].value + '/'+food[i+2].valueA[s].value,skuStr:sku})
              }
              }
            }
          }
            
          }
          
          this.OutStockQuery.skuStr = this.OutStockList.map(item => {
            return item.skuStr =="" ? '':item.skuStr
          });
        }
        this.OutStockQuery.stockNumLeft = this.OutStockList.map(item => {
            return  0
          })
          
      }
       })
    },
    undoProductStock(){
      this.OutStockQuery.stockType = 0
      this.OProductStock()
    },
    OProductStock(){
      //  console.log(this.OutStockList)
      this.dialogVisible = false

      this.OutStockQuery.skuStr = this.OutStockQuery.skuStr.join(",")
      this.OutStockQuery.stockNumLeft = this.OutStockQuery.stockNumLeft.join(",")
      console.log(this.OutStockQuery)
      OProductStock(this.OutStockQuery.id,this.OutStockQuery).then(response =>{
        this.$store.dispatch('SyncStock')
        this.$notify({
          title: '产品沽清',
          message: response.msg,
          type: response.code === 200?'success' : 'danger',
          duration: 2000
        })
      })
    },
    isEmpty(value) {
      return (Array.isArray(value) && value.length === 0) || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
    },
    getList() {
      this.listLoading = true
      fetchProductList(this.listQuery).then(response => {
        this.list = response.data.list
        // this.shopOptions = Array.isArray(response.data.shopList) ? response.data.shopList : []
        this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)
        // this.catOptions = Array.isArray(response.data.pCatList) ? response.data.pCatList : []
        // console.log(this.list)
        this.total = response.data.count
        this.pageTotal = response.data.list.length
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.p = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.p = val
      console.log(this.listQuery.p)
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      delProduct(row.id).then(response=>{
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getCat(){
      fetchClassList({sid:this.listQuery.sid}).then(response => {
         this.catOptions = response.data.list
      })
    },
    showPic(product){
      if(product.ACodeUrl === "" || product.ACodeUrl === null){
        getProductACode(product.id).then(response => {
          this.ACodeUrl = this.baesUrl + '/'+response.data.picUrl
        })
      }else{
        this.ACodeUrl = this.baesUrl + '/'+product.ACodeUrl
      }
        this.picName = '产品'+ product.name+'小程序图片'
      this.dialogShowPicVisible = true
    },
    // delProduct(id){
    //   delProduct(id).then(response=>{

    //   })
    // }
  }
}
</script>
