<template>
<div class="app-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="店铺名称" v-model="listQuery.name">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 店铺列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="分类ID" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺地址" width="180">
      <template slot-scope="scope">
        <span>{{scope.row.addr}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺电话" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.phone}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="营业时间" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.openT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="微信二维码ticket" width="180">
      <template slot-scope="scope">
        <span>{{scope.row.qrTicket}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="小程序图片" min-width="120">
      <template slot-scope="scope">
         <el-button type="success" @click="showPic(scope.row)" size="small">查看小程序图片</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="250">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <el-button type="success" @click='handleUpdateCFG(scope.row)' size="small" icon="el-icon-edit">配置</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 店铺列表结束 -->
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[]" :page-size="listQuery.limit" layout="total" :total="total">
    </el-pagination>
  </div>
  <!-- 创建或修改分类 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="120px" style='margin-left:0px;'>
      <el-form-item label="店铺名称" prop="name">
        <el-input placeholder="输入店铺名称" v-model="temp.name"></el-input>
      </el-form-item>
      <el-form-item label="店铺地址" prop="addr">
        <el-input placeholder="输入店铺地址" v-model="temp.addr" ></el-input>
      </el-form-item>
      <el-form-item label="店铺电话" prop="phone">
        <el-input placeholder="输入店铺电话" v-model="temp.phone" ></el-input>
      </el-form-item>
      <el-form-item label="营业时间" prop="openT">
        <el-time-picker
          is-range
          v-model="temp.openT"
          value-format="HH:mm"
          format="HH:mm"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="结帐方式" prop="isPayNow">
        <el-select clearable v-model.number="temp.isPayNow" placeholder="选择结帐方式"  class="filter-item">
          <el-option v-for="(item,index) in pOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="120px" label="启用库存功能:" class=""  prop="isStock">
        <el-switch v-model="temp.isStock" active-text="是" inactive-text="否" ></el-switch>
      </el-form-item>
      <el-form-item label-width="120px" label="微信端显示库存:" class=""  prop="isShowStock">
        <el-switch v-model="temp.isShowStock" active-text="是" inactive-text="否" ></el-switch>
      </el-form-item>

      <el-form-item label="地理位置" prop="gpsInfo">
        <el-input placeholder="输入地理位置" v-model="temp.gpsInfo" ></el-input>
      </el-form-item>
      <el-form-item label="店铺qq" prop="qq">
        <el-input placeholder="输入qq号码" v-model.number="temp.qq" ></el-input>
      </el-form-item>

      <el-form-item label-width="120px" label="非营业时间下单" class=""  prop="isColseOrder">
        <el-switch v-model="temp.isColseOrder" active-text="是" inactive-text="否" ></el-switch>
      </el-form-item>
      <el-form-item label="配送区域描述" prop="sRangedesc">
        <el-input placeholder="配送区域描述" v-model="temp.sRangedesc" ></el-input>
      </el-form-item>
      <el-form-item label="服务范围" prop="sRange">
        <el-input placeholder="服务范围" v-model.number="temp.sRange" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
    </div>
  </el-dialog>
  <!-- 修改配置 -->
  <el-dialog :title="shopName" :visible.sync="dialogFormVisibleCFG">
    <el-form :rules="rules2" ref="dataForm2" :model="temp2" label-position="right" label-width="220px" style='margin-left:0px;'>
      <el-form-item label="店铺默认的vid" prop="shopvid">
        <el-input placeholder="店铺默认的vid" v-model="temp2.shopvid"></el-input>
      </el-form-item>
      <el-form-item label="	订单号前缀" prop="oPrefix">
        <el-input placeholder="	订单号前缀" v-model="temp2.oPrefix"></el-input>
      </el-form-item>
      <el-form-item label="	结帐是否自动打印小票" >
        <!-- <el-input placeholder="	结帐是否自动打印小票" v-model="temp2.printBill"></el-input> -->
        <el-switch v-model="temp2.printBill" active-text="自动打印" inactive-text="手工打印" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="	是否支持中英文切换">
        <el-switch v-model="temp2.lang2" active-text="支持" inactive-text="不支持" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item label="结帐金额是否取整">
        <el-switch v-model="temp2.isRoundPay" active-text="取整" inactive-text="保留两位小数" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisibleCFG = false">{{$t('table.cancel')}}</el-button>
      <el-button  type="primary" @click="updateDataCFG">{{$t('table.confirm')}}</el-button>
    </div>
  </el-dialog>

     <!-- 选择界面 -->
  <div id="choose">
        <el-dialog title="查看和下载小程序图片" :visible.sync="dialogShowPicVisible" width="60%" center>
         <div style="text-align:center;"><img :src="ACodeUrl" alt="商铺小程序图片"></div><br>
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
import { fetchShopList, fetchShop, updateShop, createShop } from '@/api/shop'
import { fetchShopAreaList, fetchShopArea, updateShopArea,getShopACode ,fetchShopConfig,updateShopConfig} from '@/api/shop'

import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { displayShopFilter } from '@/filters'

// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.displayName
//   return acc
// }, {})

export default {
  name: 'shop-index',
  directives: {
    waves
  },

  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        name: undefined
      },
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        name: undefined,	// string	店铺名称
        addr: undefined,	// string	店铺地址
        phone: undefined,	// string	电话
        openT: undefined,	// string	营业时间(最大支持三个时间段,各段用英文分号“;”分隔,开始时间与结束时间用空格分隔，格式：fromT1 toT1;fromT2 toT2;fromT3 toT3 )
        isStock: undefined,	// boolean	是否启用库存功能
        isShowStock: undefined,	// boolean	微信端显示库存
        gpsInfo: undefined,	// string	地理位置
        qq: undefined,	// integer	店铺QQ
        isColseOrder: undefined,	// boolean	是否非营业时间下单
        sRangedesc: undefined,	// string	配送区域描述
        sRange: undefined,	// integer	服务范围(离店铺多少公里内)
        isPayNow:undefined
      },
      temp2: {
        id:undefined,
        shopvid: undefined,	// string	顾客ID
        oPrefix: undefined,	// string	订单号前缀
        printBill: 1,	// string	结帐是否自动打印小票
        lang2: 0,	// 是否支持中英文切换
        isRoundPay: 0,	// 结账是否取整
      },
      shopName:undefined,
      pOptions:[{id:0,name:"后付(餐厅)"},{id:1,name:"即付(餐厅)"},{id:2,name:"快餐即付"}],
      dialogFormVisible: false,
      dialogFormVisibleCFG: false,
      dialogStatus: '',
      textMap: {
        update: '修改店铺设置',
        create: '添加店铺'
      },
      rules: {
        name: [{ required: true, fullField: '店铺名称' }],	// string	店铺名称
        addr: [{ type: 'string' }],	// string	店铺地址
        phone: [{ type: 'string', fullField: '电话' }],	// string	电话
        // openT: undefined,	// string	营业时间(最大支持三个时间段,各段用英文分号“;”分隔,开始时间与结束时间用空格分隔，格式：fromT1 toT1;fromT2 toT2;fromT3 toT3 )
        isStock: [{ type: 'boolean', fullField: '是否启用库存功能' }],	// boolean	是否启用库存功能
        isShowStock: [{ type: 'boolean', fullField: '微信端显示库存' }],	// boolean	微信端显示库存
        // gpsInfo: undefined,	// string	地理位置
        qq: [{ type: 'integer', fullField: '店铺QQ' }],	// integer	店铺QQ
        isColseOrder: [{ type: 'boolean', fullField: '是否非营业时间下单' }],	// boolean	是否非营业时间下单
        // sRangedesc: undefined,	// string	配送区域描述
        sRange: [{ type: 'integer', fullField: '服务范围' }],	// integer	服务范围(离店铺多少公里内)
        isPayNow:[{ required: true, type: 'integer', fullField: '结帐方式' }]
      },
      rules2: {
        shopvid: [{ required: true,type: 'integer', fullField: '店铺默认顾客ID' }],
        oPrefix:[{ fullField: '订单号前缀' }],
        // printBill:[{ required: true, type: 'integer', fullField: '结帐是否自动打印小票' }],
        // lang2:[{ required: true, type: 'integer', fullField: '是否支持中英文切换' }]
      },
      dialogShowPicVisible:false,
      ACodeUrl:undefined,
      picName:undefined,
      baesUrl:process.env.BASE_API,
    }
  },
  filters: {
    statusFilter(status) {
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    },
    upIdFilter(arg1, ops) {
      console.log(ops)
    },
    displayNameFilter(sid, options) {
      const finded = options.find((option) => option.key === sid)
      if (finded) {
        return finded.displayName
      } else {
        console.log(sid)
      }
    },

  },
  created() {
    this.getList()
  },
  computed: {
  },
  watch: {
    // list: function() {
    //   this.setUpClassOptions()
    // }
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.listQuery.p = this.listQuery.page
      fetchShopList(this.listQuery).then(response => {
        // this.list = response.data.list
        this.total = response.data.list.length
        this.list = displayShopFilter(this.$store.getters.session.sids,response.data.list)
        // this.list = this.list.map((row) => {
        //   return row
        // })
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: undefined,	// string	店铺名称
        addr: undefined,	// string	店铺地址
        phone: undefined,	// string	电话
        openT: undefined,	// string	营业时间(最大支持三个时间段,各段用英文分号“;”分隔,开始时间与结束时间用空格分隔，格式：fromT1 toT1;fromT2 toT2;fromT3 toT3 )
        isStock: undefined,	// boolean	是否启用库存功能
        isShowStock: undefined,	// boolean	微信端显示库存
        gpsInfo: undefined,	// string	地理位置
        qq: undefined,	// integer	店铺QQ
        isColseOrder: undefined,	// boolean	是否非营业时间下单
        sRangedesc: undefined,	// string	配送区域描述
        sRange: undefined,	// integer	服务范围(离店铺多少公里内)
        isPayNow:undefined
      }
    },
    resetWeek(showWeek) {
      return showWeek.join(',')
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
          let tempData = Object.assign({}, this.temp)
          tempData = this.remapData(tempData)
          createShop(tempData).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
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
    mapData(data) {
      data.openT = data.openT.split(' ')
      data.openT.splice(1, 1)
      return data
    },
    remapData(data) {
      if (Array.isArray(data.openT)) {
        data.openT.splice(1, 0, 'to')
        data.openT = data.openT.join(' ')
      }
      console.log(data)
      return data
    },
    handleUpdate(row) {
      fetchShop(row.id).then(response => {
        this.temp = response.data
        this.temp = this.mapData(this.temp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleUpdateCFG(row) {
      this.shopName = row.name
        this.temp2.id = row.id
      fetchShopConfig(row.id).then(response => {
        this.temp2.shopvid = response.data.shopvid
        this.temp2.oPrefix = response.data.oPrefix
        this.temp2.printBill = response.data.printBill*1
        this.temp2.lang2 = response.data.lang2*1
        this.temp2.isRoundPay = response.data.isRoundPay*1
        this.dialogFormVisibleCFG = true
        this.$nextTick(() => {
          this.$refs['dataForm2'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData = this.remapData(tempData)
          updateShop(tempData.id, tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.getList()
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
    updateDataCFG() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp2)
          tempData = this.remapData(tempData)
          updateShopConfig(tempData.id, tempData).then(() => {
            this.getList()
            this.dialogFormVisibleCFG = false
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
      deleteClass(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
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
    showPic(shop){
      if(shop.ACodeUrl === "" || shop.ACodeUrl === null){
        getShopACode(shop.id).then(response => {
          this.ACodeUrl = this.baesUrl + '/'+response.data.picUrl
        })
      }else{
        this.ACodeUrl = this.baesUrl + '/'+shop.ACodeUrl
      }
        this.picName = '商铺'+ shop.name+'小程序图片'
      this.dialogShowPicVisible = true
    },
  }
}
</script>

<style scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}
</style>
