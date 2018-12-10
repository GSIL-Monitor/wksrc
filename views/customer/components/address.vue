<template>
<div class="app-container">
  <div class="filter-container">
    <el-input  @keyup.enter.native="handleFilter" style="width: 100px;"  placeholder="客户ID" v-model="listQuery.cid">
      <!-- <template slot="append">{{cust.vid + '('+cust.name + ')'}}</template> -->
      </el-input>
    <el-select  style="width: 140px" v-model="listQuery.invoice" placeholder="选择地址类型">
      <el-option v-for="(item,index) in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-button  type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button  style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div> 
  <!-- 地址列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="地址类型">
      <template slot-scope="scope">
        <span>{{scope.row.invoice | displayNameFilter(typeOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="顾客ID">
      <template slot-scope="scope">
        <span>{{cust.vid}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="名称">
      <template slot-scope="scope">
        <span>{{cust.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  :label="listQuery.invoice == 0 ? '联系人姓名' : '发票的抬头'">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="电话">
      <template slot-scope="scope">
        <span>{{scope.row.phone}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  :label=" listQuery.invoice == 0 ? '地址': '纳税人识别号'">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.sid}}</span> -->
        <span>{{scope.row.address}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" min-width="200">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <!-- <el-button type="danger" @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button> -->
      </template>
    </el-table-column>
  </el-table>
  <!-- 列表结束 -->
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[]" :page-size="listQuery.limit" layout="total" :total="total">
    </el-pagination>
  </div>
  <!-- 创建或修改 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="120px" style='margin-left:0px;'>
      <el-form-item label="地址类型" prop="invoice">
        <el-select v-model="temp.invoice" placeholder="选择地址类型">
          <el-option v-for="(item,index) in typeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <div v-if="temp.invoice == 0">
        <el-form-item label="联系人姓名" prop="name">
        <el-input v-model="temp.name" placeholder="选择联系人姓名"></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input placeholder="输入地址" v-model="temp.address"></el-input>
      </el-form-item>
      </div>
      <div v-if="temp.invoice == 1">
        <el-form-item label="发票的抬头" prop="name">
        <el-input v-model="temp.name" placeholder="选择发票的抬头"></el-input>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="address">
        <el-input placeholder="输入纳税人识别号" v-model="temp.address"></el-input>
      </el-form-item>
      </div>
      <el-form-item label="电话" prop="phone" :required="temp.invoice == 1">
        <el-input placeholder="电话" v-model.number="temp.phone" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
import { getAddressInfo, fetchAddressList, createAddress, updataAddress } from '@/api/address'
import {fetchGetCustomer} from '@/api/customer'
import { dict } from '@/store'
import { displayShopFilter } from '@/filters'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.displayName
//   return acc
// }, {})

export default {
  name: 'cust-addr',
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
        cid:undefined,
        vid:undefined,
        invoice:1,
      },
      typeOptions: [{id:0,name:'收货地址'},{id:1,name:'发票地址'},],
      showReviewer: false,
      temp: {
        id: undefined,
        cid: undefined,
        invoice:undefined,
        name:undefined,
        address: undefined,
        phone: undefined,
      },
      cust:{
        vid:undefined,
        name:undefined
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改地址',
        create: '添加地址'
      },
      rules: {
        invoice: [{ required: true, fullField: '类型' ,type:'integer'}],	//
        name: [{ required: true, fullField: '联系人'}],
        address: [{ required: true, fullField: '地址'}]
      }
    }
  },
  filters: {
  },
  created() {
    if (this.$route.params.id != null) {
        this.listQuery.cid = this.$route.params.id
        fetchGetCustomer(this.listQuery.cid).then(response => {
          this.cust = response.data
        })
      }
      
    this.getList()
    // dict('shop', 1,this.$store.getters.session.uid,0).then(response => {
    //   this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    // })

  //  this.listQuery.sid = this.$store.getters.session.sid
  },
  computed: { },
  watch: {},
  methods: {
    getList() {
      this.listLoading = true
      fetchAddressList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.list.length
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
        cid: undefined,
        invoice: 1,
        name:undefined,
        address: undefined,
        phone: undefined,
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
          let tempData = Object.assign({}, this.temp)
          tempData = this.remapData(tempData)
          createAddress(tempData).then(() => {
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
      return data
    },
    remapData(data) {
      return data
    },
    handleUpdate(row) {
      this.temp = row
      // this.temp = this.mapData(this.temp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      // getAddressInfo(row.id).then(response => {
      // this.temp = response.data
      // this.temp = this.mapData(this.temp)
      // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      //   this.$nextTick(() => {
      //     this.$refs['dataForm'].clearValidate()
      //   })
      // })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData = this.remapData(tempData)
          console.log(this.temp)
          console.log(tempData)
          updataAddress(tempData.id, tempData).then(() => {
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
    displayNameFilter(id, options){
      const finded  =options.find((option) =>option.id == id)
      if(finded){
        return finded.name
      }else{
        console.log(id)
      }
    }
    // displayNameFilter(sid, options) {
    // const finded = options.find((option) => option.id === sid)
    // if (finded) {
    //   return finded.name
    //   } else {
    //     console.log(sid)
    //   }
    // },
  }
}
</script>

<style scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}
</style>
