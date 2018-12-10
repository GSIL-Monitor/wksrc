<template>
<div class="app-container">
  <div class="filter-container">
    <!-- <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="店铺名称" v-model="listQuery.name">
    </el-input> -->
      <el-select clearable v-model.number="listQuery.sid" style="width: 130px" placeholder="选择店铺" class="filter-item" >
      <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 店铺列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="区域ID" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="显示次序" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.showId}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="区域名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺" width="120">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.sid}}</span> -->
        <span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" min-width="200">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
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
      <el-form-item label="店铺" prop="sid">
        <el-select v-model="temp.sid" placeholder="">
          <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="区域名称" prop="name">
        <el-input placeholder="输入店铺名称" v-model="temp.name"></el-input>
      </el-form-item>
      <el-form-item label="显示次序" prop="showId">
        <el-input placeholder="显示次序" v-model.number="temp.showId" ></el-input>
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
import { fetchShopAreaList, fetchShopArea, createShopArea, updateShopArea } from '@/api/shop'
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
  name: 'shop-area',
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
        sid: undefined
      },
      shopOptions: [],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        sid: undefined,
        name: undefined,
        showId: undefined
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改店铺区域设置',
        create: '添加店铺区域'
      },
      rules: {
        name: [{ required: true, fullField: '区域名称' }],	//
        sid: [{ required: true, fullField: '店铺', type: 'integer' }],
        showId: [{ required: true, fullField: '显示序号', type: 'integer' }]
      }
    }
  },
  filters: {
    upIdFilter(arg1, ops) {
      console.log(ops)
    },
    // displayNameFilter(sid, options) {
    //   const finded = options.find((option) => option.key === sid)
    //   if (finded) {
    //     return finded.displayName
    //   } else {
    //     console.log(sid)
    //   }
    // }
  },
  created() {
    this.listQuery.sid = this.$store.getters.session.sid
    this.getList()
    dict('shop', 1,this.$store.getters.session.uid,0).then(response => {
      // this.shopOptions = response
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    })
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
      fetchShopAreaList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.list.length
        this.list = this.list.map((row) => {
          return row
        })
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
        sid: undefined,
        name: undefined,
        showId: undefined
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
          createShopArea(tempData).then(() => {
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
      fetchShopArea(row.id).then(response => {
        this.temp = response.data
        this.temp = this.mapData(this.temp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.temp)
          tempData = this.remapData(tempData)
          updateShopArea(tempData.id, tempData).then(() => {
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
