<template>
<div class="app-container">
  <div class="filter-container">
    <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.sid" :placeholder="$t('product.sid')">
      <el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id">
      </el-option>
    </el-select>
    <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.catID" placeholder="上级分类"> -->
    <!--   <el-option v-for="item in upClassOptions" :key="item.id" :label="item.displayName+'('+item.id+')'" :value="item.id"> -->
    <!--   </el-option> -->
    <!-- </el-select> -->
    <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.isSale" :placeholder="$t('product.isSale')"> -->
    <!--   <el-option v-for="item in saleTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"> -->
    <!--   </el-option> -->
    <!-- </el-select> -->
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="分类名称" v-model="listQuery.name">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 产品列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="分类ID" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="显示次序" width="80">
      <template slot-scope="scope">
        <span>{{scope.row.showId}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺" width="80">
      <template slot-scope="scope">
        <span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="分类名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="上级分类名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.upname}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="显示日期" min-width="120">
      <template slot-scope="scope">
        <span>{{scope.row.week}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="使用范围" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.isNotSale | displayNameFilter(isSaleOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="销售类型" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.isSaleType | displayNameFilter(saleTypeOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="出单打印机" width="120">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.prtId}}</span> -->
        <span>{{scope.row.prtId | displayNameFilter(printCFGOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="200">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 产品列表结束 -->
  <div class="pagination-container">
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.p"  layout="total, prev, next, jumper" :total="total" :page-size="20">
    </el-pagination>
  </div>
  <!-- 创建或修改分类 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="90px" style='margin-left:0px;'>
      <el-form-item label="店铺" prop="sid">
        <el-select clearable class="filter-item" v-model="temp.sid" placeholder="请选择店铺">
          <el-option v-for="item in  shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上级分类" prop="upid">
        <el-select class="filter-item" v-model="temp.upid" placeholder="请选择上级分类">
          <el-option v-for="item in  upClassOptions" :key="item.id" :label="item.name + '('+item.id+ ')' " :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示次序" prop="showId">
        <el-input placeholder="输入显示次序" v-model="temp.showId" required></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input placeholder="输入分类名称" v-model="temp.name" required></el-input>
      </el-form-item>
      <el-form-item label="显示日期" prop="showWeek">
        <el-select v-model="temp.showWeek" placeholder="选择显示日期"  multiple >
          <el-option v-for="(item,index) in weekOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用范围" prop="isNotSale">
        <el-select v-model="temp.isNotSale" placeholder="选择使用范围" required>
          <el-option v-for="(item,index) in isSaleOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="销售类型" prop="isNotSale">
        <el-select v-model="temp.isSaleType" placeholder="选择销售类型" required>
          <el-option v-for="(item,index) in saleTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出单打印机" prop="prtId">
        <el-select clearable  v-model.number="temp.prtId"  placeholder="选择厨房打印机">
				<el-option v-for="item in printCFGOptions" :key="item.id" :label="item.name+'('+item.codeNO+')'" :value="item.id"></el-option>
		    </el-select>
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
import { fetchClassList, updateClass, createClass, deleteClass ,fetchPtrCFGList} from '@/api/product'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { dict } from '@/store'
import { displayShopFilter } from '@/filters'
// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.displayName
//   return acc
// }, {})

export default {
  name: 'product-category',
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
        name: undefined,
        sid: undefined
        // isSale: undefined
      },
      // importanceOptions: [1, 2, 3],
      saleTypeOptions: [
        // { key: 0, displayName: '服务类型' },
        // { key: 1, displayName: '销售类型' },
        // { key: 2, displayName: '卡券类型' }
      ], // calendarTypeOptions,
      isSaleOptions: [
        // { key: 0, displayName: '微信前端销售' },
        // { key: 1, displayName: '内务厨房使用' },
        // { key: 2, displayName: '内务吧台使用' }
      ],
      weekOptions: [
        { id: 1, name: '星期一' },
        { id: 2, name: '星期二' },
        { id: 3, name: '星期三' },
        { id: 4, name: '星期四' },
        { id: 5, name: '星期五' },
        { id: 6, name: '星期六' },
        { id: 7, name: '星期七' }
      ],
      shopOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      upClassOptions: undefined,
      // statusOptions: ['published', 'draft', 'deleted'],
      // showReviewer: false,
      temp: {
        id:	undefined, // 要修改的记录id
        sid: undefined, // 店铺id
        upid:	undefined, // 上级分类id
        showId:	undefined, // 显示次序
        name:	undefined, // 分类名称
        showWeek:	undefined, // 显示日期 空表示每天都显示，保存值为1,3表示周一和周三显示
        // tempWeek: undefined, // week 数组
        isNotSale:	undefined, // 使用范围(0 微信前端销售用;1 内务厨房使用;2内务吧台使用;)
        isSaleType:	undefined, // 是否销售商品(0 服务类型;1 销售类型;2 卡券类型)
        prtId: undefined // 出单打印机ID
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改分类',
        create: '创建分类'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        showId: [{ required: true, message: '显示次序不能为空', trigger: 'change' }],
        isNotSale: [{ required: true, message: '使用范围不能为空', trigger: 'change' }],
        name: [{ required: true, message: '分类名称不能为空', trigger: 'change' }],
        sid: [{ required: true, message: '店铺不能为空', trigger: 'blur' }]
      },
      downloadLoading: false,
      printCFGOptions:[],
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
    },
    upIdFilter(arg1, ops) {
      console.log(ops)
    },
    displayNameFilter(sid, options) {
      const finded = options.find((option) => option.id === sid)
      if (finded) {
        return finded.name
      } else {
        console.log(sid)
      }
    }
  },
  created() {
    this.listQuery.sid = this.$store.getters.session.sid
    this.getList()
    dict('shop', 1,0,0).then(response => {
      // this.shopOptions = response
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    })
    dict('isSaleType').then(response => {
      this.saleTypeOptions = response
    })
    dict('isNotSale').then(response => {
      this.isSaleOptions = response
    })
    fetchPtrCFGList({ptrType:1,sid:this.$store.getters.sid}).then(response =>{
      this.printCFGOptions = response.data.list
    })
  },
  computed: {
  },
  watch: {
    list: function() {
      this.setUpClassOptions()
    }
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.listQuery.p = this.listQuery.page
      fetchClassList(this.listQuery).then(response => {
        this.list = response.data.list
        this.pageTotal = response.data.list.length
        this.total = response.data.count
        this.list = this.list.map((row) => {
          row.showWeek = row.showWeek.split(',').map((item) => parseInt(item))
          return row
        })
        this.listLoading = false
      })
       fetchPtrCFGList({ptrType:1,sid:this.listQuery.sid}).then(response =>{
      this.printCFGOptions = response.data.list
    })
    },
    setUpClassOptions() {
      if (!this.listLoading) {
        this.upClassOptions = this.list.map((row) => {
          return { id: row.id, name: row.name }
        })
      }
    },
    handleFilter() {
      this.getList()
    },
    handleSizeChange(val) {
      // this.listQuery.limit = val
      // this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.p = val
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
        id:	undefined, // 要修改的记录id
        sid: undefined, // 店铺id
        upid:	'', // 上级分类id
        showId:	undefined, // 显示次序
        name:	undefined, // 分类名称
        showWeek:	[], // 显示日期 空表示每天都显示，保存值为1,3表示周一和周三显示
        isNotSale:	undefined, // 使用范围(0 微信前端销售用;1 内务厨房使用;2内务吧台使用;)
        isSaleType:	undefined, // 是否销售商品(0 服务类型;1 销售类型;2 卡券类型)
        prtId: undefined // 出单打印机ID
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
          const tempData = Object.assign({}, this.temp)
          tempData.showWeek = this.resetWeek(tempData.showWeek)
          createClass(tempData).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          tempData.showWeek = this.resetWeek(tempData.showWeek)
          updateClass(tempData).then(() => {
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
    }
  }
}
</script>

<style scoped>
  .el-select { width: 100%; }
</style>
