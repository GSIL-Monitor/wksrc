<template>
<div class="app-container">
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="ID" width="105"  v-loading="loading" element-loading-text="请给我点时间！"                     >
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" label="SKU">
      <template slot-scope="scope">
        <span>{{ scope.row.skuStr }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100px" align="center" label="展示名">
      <template slot-scope="scope">
        <span>{{scope.row.skuStrName}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="200px" align="center" label="总库存">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.stockNum"></el-input>
        </template>
        <span v-else>{{scope.row.stockNum}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="200px" align="center" label="剩余库存">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.stockNumLeft"></el-input>
        </template>
        <span v-else>{{scope.row.stockNumLeft}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="120px" align="center" label="条码信息">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.barCode"></el-input>
        </template>
        <span v-else>{{scope.row.barCode}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="200">
      <template slot-scope="scope">
        <div v-if="scope.row.edit">
          <el-button size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          <el-button type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确认</el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">修改</el-button>
        </div>

      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
import { fetchSKUStockList, updateSKUStock, initSKUStock } from '@/api/product'
import { Tools } from '@/views/utils/Tools'
import { parseTime } from '@/utils'

export default {
  name: 'product-sku',
  props: {
    type: {
      type: String
    }
  },
  data() {
    const mapDataForm = (dataForm) => {
      // dataForm.originalId = dataForm.id
      dataForm.originalSkuStr = dataForm.skuStr
      dataForm.originalSkuStrName = dataForm.skuStrName
      dataForm.originalStockNum = dataForm.stockNum
      dataForm.originalStockNumLeft = dataForm.stockNumLeft
      dataForm.originalBarCode = dataForm.barCode
      return dataForm
    }

    const showDataValList = (row) => {
      // fetchDict(row.FieldName).then(response => {
      // this.dataId = row.FieldName
      // this.dataValList = response.data.list
      // this.dataValForm = defaultDataValForm
      // this.dialogDataValVisible = true
      // })
    }
    const defaultDataForm = {
      id: undefined, // 库存记录id
      pid: undefined, // 产品id
      skuStr: undefined, // sku串
      skuStrName: undefined, // sku串展示名,
      stockNum: undefined, // 总库存
      stockNumLeft: undefined, // 当前剩余库存
      barCode: undefined // 条码信息
    }
    const defaultDataValForm = {

    }
    return {
      productId: this.$route.params.id,
      list: null,
      dialogDataVisible: false,
      dataForm: defaultDataForm,
      mapDataForm,
      dataRules: {
        stockNum: [{ required: true, message: '总库存数量必填', trigger: 'change' }],
        stockNumLeft: [{ required: true, message: '剩余库存数量必填', trigger: 'change' }],
        barCode: [{ required: true, message: 'sku条码必填', trigger: 'change' }]
      },

      dialogDataValVisible: false,
      dataValForm: defaultDataValForm,
      dataValRules: {
        // name: [{ required: true, message: '字段名称必填', trigger: 'change' }]
      },
      // dataValList: undefined, // 当前规格值列表
      dataId: undefined, // 当前行数据key
      // showDataValList,
      listQuery: {
      },
      loading: false
    }
  },
  filters: {
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchSKUStockList(this.productId).then(response => {
        const items = response.data.list
        this.list = items.map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v = this.mapDataForm(v)
          return v
        })
        this.loading = false
      })
    },
    cancelEdit(row) {
      row.stockNum = row.originalStockNum
      row.stockNumLeft = row.originalStockNumLeft
      row.barCode = row.originalBarCode
      row.edit = false
      this.$message({
        message: '已经恢复上一次编辑',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      this.dataForm.id = row.id
      this.dataForm.stockNum = row.stockNum
      this.dataForm.stockNumLeft = row.stockNumLeft
      this.dataForm.barCode = row.barCode
      updateSKUStock(this.dataForm).then(response => {
        this.getList()
        row.originalStockNum = row.stockNum
        row.originalStockNumLeft = row.stockNumLeft
        row.originalBarCode = row.barCode
        this.$message({
          message: '已经成功修改',
          type: 'success'
        })
      }).catch(err => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
//padding-right: 100px;
}

.prop-input {
    width:100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
