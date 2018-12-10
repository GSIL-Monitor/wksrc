<template>
    <el-table :data="list" style="width: 100%">
    <el-table-column align="center" label="合计">
        <template slot-scope="scope">
        <span>{{scope.row.sum}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="微信支付">
    <template slot-scope="scope">
        <span>{{scope.row.wxPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="现金">
    <template slot-scope="scope">
        <span>{{scope.row.xjPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="刷卡">
    <template slot-scope="scope">
        <span>{{scope.row.skPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="挂账">
    <template slot-scope="scope">
        <span>{{scope.row.gzPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="公司招待">
    <template slot-scope="scope">
        <span>{{scope.row.gsPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="余额支付">
    <template slot-scope="scope">
        <span>{{scope.row.yePay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="转卡">
    <template slot-scope="scope">
        <span>{{scope.row.zkPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="转账">
    <template slot-scope="scope">
        <span>{{scope.row.zzPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="一卡通">
    <template slot-scope="scope">
        <span>{{scope.row.yktPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="网购">
    <template slot-scope="scope">
        <span>{{scope.row.wgPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="消费劵">
    <template slot-scope="scope">
        <span>{{scope.row.xfjPay}}</span>
        </template>
    </el-table-column>
    <el-table-column  align="center" label="支付宝">
    <template slot-scope="scope">
        <span>{{scope.row.zfbPay}}</span>
        </template>
    </el-table-column>
    </el-table>
</template>
<script>
export default {
name: 'pay-info',
  props: {
    list: {
      type: Array,
    }
  },

  filters: {

  },
  created() {

  },
  methods: {
  }
}
</script>