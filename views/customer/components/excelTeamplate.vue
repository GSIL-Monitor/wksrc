<template>
  <!-- $t is vue-i18n global function to translate lang -->
  <div class="app-container">

    <label class="radio-label" style="padding-left:0;">文件名: </label>
    <el-input style='width:340px;' :placeholder="$t('excel.placeholder')" prefix-icon="el-icon-document" v-model="filename"></el-input>
    <label class="radio-label">单元格是否自动调整 </label>
    <el-radio-group v-model="autoWidth">
      <el-radio :label="true" border>是</el-radio>
      <el-radio :label="false" border>否</el-radio>
    </el-radio-group>
    <el-button style='margin:0 0 20px 20px;' type="primary" icon="document" @click="handleDownload" :loading="downloadLoading">{{$t('excel.export')}} 批量充值模板</el-button>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit highlight-current-row>
      <el-table-column align="center" label='id'>
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column label="vid">
        <template slot-scope="scope">
          {{scope.row.vid}}
        </template>
      </el-table-column>
      <el-table-column label="cNo"  align="center">
        <template slot-scope="scope"  align="center">
          {{scope.row.cNo}}
          <!-- <el-tag>{{scope.row.cNo}}</el-tag> -->
        </template>
      </el-table-column>
      <el-table-column label="name"  align="center">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="phone"  align="center">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="fee"  align="center">
        <template slot-scope="scope">
          {{scope.row.fee}}
        </template>
      </el-table-column>
      <el-table-column label="giftFund"  align="center">
        <template slot-scope="scope">
          {{scope.row.giftFund}}
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="phone" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import { getTemplate } from '@/api/customer'
import { parseTime } from '@/utils'

export default {
  name: 'excel-teamplate',
  data() {
    return {
      list: null,
      listLoading: true,
      downloadLoading: false,
      filename: '会员批量充值模板',
      autoWidth: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getTemplate().then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'vid', 'cNo', 'name', 'phone', 'fee', 'giftFund']
        const filterVal = ['id', 'vid', 'cNo', 'name', 'phone', 'fee', 'giftFund']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        // const data = this.list
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth
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

<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
