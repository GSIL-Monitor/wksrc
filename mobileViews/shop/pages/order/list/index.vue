<template>
<div>
  <mobile-header :visible.sync="dialogFormVisible" header-text="订单管理">
  </mobile-header>
  <!-- 订单列表开始 -->
  <div class="order-list" >
    <el-table :data="list" v-loading.body="listLoading" stripe border fit highlight-current-row
              :header-row-class-name="'header'"
              @row-click="orderInfo"
              style="width: 100%; line-height:1rem;">
      <el-table-column align="center" label="订单号">
        <template slot-scope="scope">
          <span>{{scope.row.number}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="房桌号">
        <template slot-scope="scope">
          <span>{{scope.row.roomNumber}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  label="状态">
        <template slot-scope="scope">
          <!-- <span>{{scope.row.status | displayNameFilter(oStatusOptions)}}</span><br> -->
          <span :style="scope.row.payflag === 0 ? 'color:red;' : ''">{{payStatusFilter(scope.row)}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center"  label="支付状态">
        <template slot-scope="scope">

        </template>
      </el-table-column> -->
      <el-table-column align="center"  label="时间">
        <template slot-scope="scope">
          <span>{{scope.row.createDT}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-button type="primary" @click="loadMore" class="submit-button">加载更多</el-button>
  </div>
  <!-- 订单列表结束 -->
    <!-- 选择界面 -->
    <div id="choose">
        <el-dialog title="选择操作" :visible.sync="dialogVisible1"  center>
        <el-button class="bg-option" @click="orderInfo()" icon="el-icon">查看订单详情</el-button>
        <el-button class="bg-option" @click="orderFBRePrint()" icon="el-icon">补打楼面单</el-button>

        </el-dialog>
    </div>

  <!-- 查询表单开始 -->
  <el-dialog title="查询订单" :visible.sync="dialogFormVisible">
    <!-- 弹窗层开始 -->
    <van-popup v-model="popupShow" :close-on-click-overlay="false"></van-popup>
    <!-- 弹窗层结束 -->
    <el-form ref="" :model="listQuery" label-position="left" label-width="5rem" style='margin-left:0px;'>
      <el-form-item label="所属店铺" prop="sid">
        <el-select clearable v-model.number="listQuery.sid" style="" placeholder="选择店铺" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单类型" prop="otype" >
        <el-select clearable v-model="listQuery.otype" placeholder="订单类型" style="" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in oTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="status" >
        <el-select clearable v-model="listQuery.status" placeholder="订单状态" style="" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in oStatusOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="订单编号" prop="number" >
        <el-input placeholder="订单编号" v-model="listQuery.number" style="" class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="下单时间" prop="createDT" >
        <el-input placeholder="下单时间" v-model="listQuery.createDT" style="" class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="桌房编号" prop="roomID" >
        <el-input placeholder="桌房编号" v-model="listQuery.roomName" style="" class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="顾客编号" prop="vid" >
        <el-input placeholder="顾客ID" v-model="listQuery.vid" style="" class="filter-item"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :class="'search-btn'" @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button :class="'search-btn'" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>
  </el-dialog>
  <!-- 查询表单结束 -->
</div>

<!-- 订单列表结束 -->

</template>

<script>
import MobileHeader from '@/components/header/MobileHeader'
import { fetchOrderList ,orderFBRePrint} from '@/api/order'
import { displayNameFilter } from '@/filters'
import { displayShopFilter } from '@/filters'
import { dict } from '@/store'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'm-order-list',
  directives: {
    waves
  },
  components: {
    MobileHeader
  },
  data() {
    const defaultQuery = {
      p: 1,             // 第p页
      sid: undefined,   // 店铺id
      otype: undefined, // 订单类型：0店内单;1外送单;,默认返回店内订单
      status: undefined, //	订单状态:0未确认;1已确认;2配送中;3配送成功;4配送失败;5已完成;6已取消;
      number:	undefined, //	订单号
      createDT:	undefined, //	下单时间,某天格式样列：2018-09-22 或某段时间格式样列： 2018-08-22,2018-09-22
      roomID:	undefined,   //	订单关联的餐桌(房间)id
      roomName:	undefined,     //	桌号
      vid: undefined,      //	顾客VID或会员卡号
      itemList:	0          //	是否返回订单项：1 返回 0 默认不返回。
    }
    const defaultForm = {
      id:	undefined,            //	订单ID
      number:	undefined,        //	订单号
      sid:	undefined,          //	店铺id
      roomID:	undefined,        //	关联餐桌(房间)id(负值为虚拟桌号)
      cid:	undefined,          //	顾客id
      otype:	undefined,        //	订单类型
      status:	undefined,        //	订单状态
      sumFee:	undefined,        //	订单总价
      createDT:	undefined, //	下单时间(返回格式样例：2018-09-22 13:03:26)
      remark:	undefined,   //
      opStaf:	undefined    //	操作员
    }
    return {
      list: [],
      total: null,
      listLoading: true,
      deskId: undefined,
      listQuery: defaultQuery,
      dataForm: defaultForm,
      shopOptions: [],
      oStatusOptions: [],
      oTypeOptions: [],
      payTypeOptions: [],
      dialogFormVisible: false,
      payStatusOptins:[{id:0,name:'待支付'},{id:1,name:this.payedText},{id:2,name:'挂账'}],
      popupShow: false,
      tempData:undefined,
      dialogVisible1:false,
    }
  },
  created() {
    this.listQuery.sid = parseInt(this.$store.getters.sid)
    this.listQuery.roomID = this.$route.params.did
    this.deskId = this.$route.params.did

    this.getList()
    dict('shop', 1, this.$store.getters.uid, 0).then(response => {
      // this.shopOptions = response
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    })
    dict('oStatus').then(response => {
      this.oStatusOptions = response
    })
    dict('oType').then(response => {
      this.oTypeOptions = response
    })
    dict('payType', 0, this.$store.getters.session.uid, -1).then(response => {
      this.payTypeOptions = response
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
        this.list = response.data.list
        this.listLoading = false
        this.total = response.count
      })
    },
    showChoose(row){
      this.tempData = row
      this.dialogVisible1 = true
    },
    orderInfo(row) {
      // orderInfo() {
      this.dialogVisible1 = false
      this.$router.push('/mobile/shop/order/add/' + row.roomID + '/' + row.id)
      // this.$router.push('/mobile/shop/order/add/' + this.tempData.roomID + '/' + this.tempData.id)
    },
    orderFBRePrint(){
      this.dialogVisible1 = false
      orderFBRePrint({oid:this.tempData.id}).then(response => {
        this.$message({
          message: response.msg,
          type: response.code === 200 ? "success" : "denger"
        });
      })
    },
    loadMore() {
      const oldPage = this.listQuery.p
      this.listQuery.p++
      this.listLoading = true
      fetchOrderList(this.listQuery).then(response => {
        if (response.data.count <= 0) {
          this.listLoading = false
          this.listQuery.p = oldPage
          this.$message({
            message: '暂无数据',
            type: 'error'
          })
        } else {
          this.list = this.list.concat(response.data.list)
          this.listLoading = false
          this.total += response.count
        }
      })
    },
    handleFilter() {
      this.listQuery.p = 1
      this.getList()
      this.dialogFormVisible = false
    },
    payStatusText(orderInfo) {
      const finded = this.payTypeOptions.find(v => {
        return v.id === orderInfo.oPayType
      })
      return finded ? finded.name : '未支付'
    },
    payStatusFilter(orderInfo) {
      if (orderInfo.payflag === 1) {
        return this.payStatusText(orderInfo)
      }else {
        return orderInfo.payflag === 0 && '待支付' || orderInfo.payflag === 2 && '挂账'
      }
    }
  },
  filters: {
  }
}
</script>

<style lang="scss">
.order-list {
    overflow: scroll;
    height: calc(100vh - 96px) !important;
    .el-table , .el-table__header-wrapper{
        font-size: 28px;
        line-height: 38px;
    }
    .el-table .cell, .el-table__header-wrapper .cell {
        line-height: 28px;
    }
    .el-select, .el-input { width: 100%; }
    .el-date-editor--timerange.el-input__inner {
        width: 100%;
    }
    .submit-button {
        /* height: 56px; */
        line-height: 36px;
        font-size: 28px;
        font-weight: 500;
        width: 730px;
        margin: 20px 10px;
        text-align: center;
        border: 0.03125rem solid #ececec;
        border-radius: 10px;
        color: #fff;
        background-color: main-red;
    }
}

.bg-option{
  background: green;
  color:#fff;
  width:95%;
  margin:15px;
  font-size:1.3rem;
  color:#fff;
  line-height:1.6rem;
}

</style>
