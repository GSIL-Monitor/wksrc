<template>
<div class="">
  <mobile-header :visible.sync="dialogFormVisible" header-text="桌台管理">
  </mobile-header>
  <el-row :span="24" :gutter="0">
    <el-col v-for="(item, index) in list" :key="index" :span="8">
      <div v-if="item.isShow" class="item" :style="{backgroundImage: `url( ${backgroundImg(item.status)} )`}" >
        <div class="detail" @click="toggleControl(item)" >

          <br>
          <label :class="item.status | roomColorFilter" style="width:100%;font-size:1.7rem;">{{ item.name }}</label>
          <br>
          <label style="color: gray;">{{ item.rname }} </label><br>
          <label class="status" style="width: 100%; color: rgb(0, 0, 0);">
            <!-- {{ item.status}} -->
          </label>

          <label class="name" style="width: 100%; color: rgb(0, 0, 0); font-size:1rem">

            <!-- <label :class="item.status | roomColorFilter" style="width:100%;font-size:1.2rem;">
                 {{ item.status | displayNameFilter(statusOptions) }}<br></label> -->
            <label  v-if="item.status ==1 && item.payStatus ==0" style="color:red" >
              <span v-if="item.orderStatus == 2">叫起</span>
              {{ item.inuseDT }}
            </label>
            <label  v-else-if="item.status ==1 && item.payStatus ==1" style="color:gray" >{{ item.inuseDT }} </label><br v-else>
          </label>

          <!-- <label style="color:red;width:100%;height:3vw;font-size:5vw;">
               </label> -->

        </div>
        <div class="arrange-pro-one " style="width:30vw;height:auto;text-align:center;margin-top:3vw;margin-bottom:2vw;" @click="showMenu(item)">
          <div style="width:5.3vw;height:5.3vw; margin: auto;" >
            <!-- <div class='circular-bg' :class="item.status | bgColorFilter">{{ deskTypeName[item.rtype] }}</div> -->
            <div class='circular-bg' :class="item.orderStatus | bgColorFilter">{{ item.maxN }}</div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

  <!-- 房间管理操作开始 -->
  <div class="detail-control full-container">
    <el-dialog v-model="currentDesk" :visible.sync="dialogControlVisible" :show-close="false" class="tishi">
      <div v-if="listQuery.sid == sessionSid || listQuery.sid == undefined">
      <router-link :to="'/mobile/shop/index/newOrder/' + currentDesk.id">
        <!-- <el-button class="bg-option" @click='' icon="el-icon" v-if="currentDesk.payStatus != 0">立即点单</el-button> -->
        <el-button class="bg-option" @click='' icon="el-icon">立即点单</el-button>
      </router-link>
      <div><el-button class="bg-option" v-if='currentDesk.status ===0' @click='openDesk(currentDesk.id)' icon="el-icon"> 启用餐桌 </el-button></div>
      </div>
      <!-- <div><el-button class="bg-option" @click='bookDesk(currentDesk.id)' icon="el-icon"> 预订餐桌 </el-button></div> -->
      <div><el-button class="bg-option" v-if='currentDesk.status !=0' @click='emptyDesk(currentDesk.id)' icon="el-icon"> 空出餐桌 </el-button></div>
      <!-- <el-button class="bg-option" v-if='currentDesk.status ===3' @click='emptyDesk(currentDesk.id)' icon="el-icon"> 清理餐桌 </el-button> -->

      <router-link :to="'/mobile/shop/order/list/' + currentDesk.id" v-if="currentDesk.payStatus != 4 && isMoreOrder">
        <el-button class="bg-option" @click='' icon="el-icon">订单管理</el-button>
      </router-link>

      <router-link :to="'/mobile/shop/order/add/' + currentDesk.id + '/' + currentDesk.curOids" v-if="currentDesk.payStatus != 4 && !isMoreOrder">
        <el-button class="bg-option" @click='' icon="el-icon">订单查看</el-button>
      </router-link>
      <!-- <router-link to=""> -->
        <!-- <router-link to="">
             <el-button class="bg-option" @click='' icon="el-icon">更换操作</el-button>
        </router-link>

        <el-button class="bg-option" @click='' icon="el-icon">内务服务</el-button>
      </router-link> -->
      <!-- <router-link :to="'/mobile/desk/deskBook/' + currentDesk.id">
        <el-button class="bg-option" @click="toggleBookingDetail()" icon="el-icon">餐桌预订</el-button>
      </router-link> -->
        <br>
      <el-button  @click='dialogControlVisible = false' icon="el-icon">关闭</el-button>
    </el-dialog>
  </div>

  <!-- <div class="detail-control full-container">
       <el-dialog v-model="currentDesk"  :visible.sync="deskBookingVisible" :show-close="false" :modal="false">
         <router-link to="">
           <el-button class="bg-option" @click="" icon="el-icon">餐桌预订</el-button>
         </router-link>
         <router-link to="">
           <el-button class="bg-option" @click="" icon="el-icon">预订记录</el-button>
         </router-link>
         <el-button class="bg-option" @click="deskBookingVisible = false" icon="el-icon">关闭</el-button>
       </el-dialog>
  </div> -->
  <!-- 房间管理操作结束 -->

 <!-- 表单 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <van-popup v-model="popupShow" :close-on-click-overlay="false">  </van-popup>
    <el-form ref="" :model="listQuery" label-position="right" label-width="5rem" style='margin-left:0px;'>
      <el-form-item label="所属店铺" prop="sid">
        <el-select clearable v-model="listQuery.sid" style="" placeholder="选择店铺" class="filter-item" @visible-change="popupShow=!popupShow" @change="handleShopChange" :disabled="false">
          <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在区域" prop="areaId">
        <el-select clearable v-model="listQuery.areaId" style="" placeholder="选择楼层/区域" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in areaOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="餐桌类型" prop="rtype">
        <el-select clearable v-model.number="listQuery.rtype" placeholder="选择餐桌类型" style="" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in deskTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="桌房名称" prop="rname" >
        <el-input placeholder="餐桌(房间)名称" v-model="listQuery.rname" style="" class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="桌房编号" prop="name" >
        <el-input placeholder="餐桌(房间)号" v-model="listQuery.name" style="" class="filter-item"></el-input>
      </el-form-item>
      <el-form-item label="餐桌状态" prop="status" >
        <el-select clearable v-model="listQuery.status" placeholder="餐桌状态" style="" class="filter-item" @visible-change="popupShow=!popupShow">
          <el-option v-for="(item,index) in statusOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :class="'search-btn'" @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button :class="'search-btn'" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    </div>
  </el-dialog>
  <!-- 显示房间里的桌子的菜单 -->
  <el-dialog :visible.sync="dialogFormVisible2">
  <!-- <div style="color:#F56C6C">提示: 菜品在 <span style="font-size:0.8rem;color:#409EFF">未服务</span>状态是取消，其他是退菜操作</div> -->
 <div style="width:100%;text-align:center">
   <div v-for="(items,index) in menuList">
     <p style="font-size:1rem;margin:0px;">{{index}}</p>
     <hr>
    <el-button v-for="item in items" :key="item.id" class="button-style" :class="item.status | buttonBgColorFilter" @click="handleSrvCancel(item)" :disabled="item.status >2">{{ item.pName +(item.num >1 ? '*'+item.num : '') + ( item.payflag != 0 ? (item.payflag == 1 ? ' [已付]' : ' [挂账]'):'')}} </el-button>

 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible2 = false" plain style="width:80%;margin-top: 20px;">返回</el-button>
  </span>
 </div>
</el-dialog>
  <!-- 退菜和取消菜品 -->

  <van-popup v-model="dialogSrvCancelVisible">
   <div class="srvCance">
      <van-panel :title="title"  :status="srvStatus">
      <div>
        <van-row type="flex">
          <van-col span="2">
          </van-col>
          <van-col span="22">
            {{desc}}
          </van-col>
        </van-row>
        <van-row type="flex" justify="space-around" class="rowstyle">
          <van-col span="6"> {{titleN}}</van-col>
          <van-col span="14">
            <van-stepper v-model="srvNum"  :max="temp.num" @change="checkMass"/>
            </van-col>
        </van-row>
   
        <van-row type="flex" justify="space-around" class="rowstyle">
          <van-col span="6"> 选择原因</van-col>
          <van-col span="14">
            <el-select clearable v-model.number="remark" placeholder="选择原因" @visible-change="popupShow=!popupShow">
                <el-option v-for="(item,index) in capinonOptions" :key="item.id" :label="item.content+'('+item.id+')'" :value="item.content"></el-option>
            </el-select>
          </van-col>
        </van-row>
        <div v-if="remark == '其他'">
        <van-row type="flex" justify="space-around" class="rowstyle">
          <van-col span="6"> 填写原因</van-col>
          <van-col span="14">
          <van-field v-model="remark2" placeholder="输入其他原因"/>
          </van-col>
        </van-row>
        </div>
        <div v-if="temp.status != 0">
          <van-row type="flex" justify="space-around" class="rowstyle">
            <van-col span="6">是否作废</van-col>
            <van-col span="14">
               是 <van-switch v-model="isReuse" size="20px" active-color="#4b0" inactive-color="green" style="margin:0 1.5rem;"/> 否
            </van-col>
            
          </van-row>
        </div>

         <div slot="footer">
            <van-row class="rowstyle">
              <van-col span="12"><div  class="mcancel" @click="dialogSrvCancelVisible = false">取消</div></van-col>
              <van-col span="12"> <div class="msubmit" @click="srvCancel()">确认</div></van-col>
            </van-row>
          </div>

      </div>
    </van-panel>
   </div>
      <!-- <van-field v-model="remark" placeholder="输入原因" @click="chooseCapion()"/> -->
      <!-- <p>选择原因</p> -->
      
   <!-- <van-dialog v-model="dialogSrvCancelVisible" show-cancel-button title="取消菜品"
              @confirm="srvCancel"/>
    </van-dialog> -->
  </van-popup>

    <!-- <van-dialog v-model="dialogSrvCancelVisible" show-cancel-button title="退菜"  :before-close="handleClose">
        <van-field  v-model="FromData.oldPassword"  type="password" label="旧密码"  placeholder="请输入旧密码" required :error-message="oldmsg" @focus="restText"/>
        <van-field  v-model="FromData.password"  type="password" label="新密码"  placeholder="输入新密码"  required :error-message="newmsg" @focus="restText"/>
        <van-field  v-model="FromData.checkPass"  type="password" label="再次输入"  placeholder="确认密码"  required :error-message="checkmsg" @focus="restText"/>
        </van-dialog> -->

<!-- <el-dialog :visible.sync="dialogFormVisible3" >

 <div style="width:100%;text-align:center">
   <div v-if="title === '取消'">
     <p class="mtext">请注意：本次操作是<span style="color:red">取消操作</span>，退菜之后厨房不会做这道菜了</p>
  </div>
 <div v-if="title === '退菜'">
    <p class="mtext">请注意：本次操作是<span style="color:red">退菜操作</span><br>请对本道菜选择处理方式</p>
    <el-radio-group v-model="radioChoose">
      <el-radio-button label=" 作 废 "></el-radio-button>
      <el-radio-button label="不作废"></el-radio-button>
    </el-radio-group>
    <el-input v-model="remark" placeholder="(选)填写退菜原因，备注"></el-input>
 </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible3 = false" plain >返回</el-button>
    <el-button v-if="title === '退菜'" @click="srvWithdraw" plain class="submit-button">退菜</el-button>
    <el-button v-if="title === '取消'" @click="srvCancel" plain class="submit-button">取消菜品</el-button>
  </span>
 </div>
</el-dialog> -->
</div>
</template>

<script>
import { fetchDeskList ,openDesk ,emptyDesk, orderSrv, srvCancel, srvWithdraw} from '@/api/desk'
import { fetchShopAreaList } from '@/api/shop'
import { orderItemUpdate } from '@/api/order'
import { fetchCapionList } from '@/api/general'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { dict } from '@/store'
import { displayNameFilter } from '@/filters'
import { displayShopFilter } from '@/filters'
import MobileHeader from '@/components/header/MobileHeader'

const defaultForm = {
  id: undefined, //   餐桌(房间)ID
  sid: undefined, //  店铺id
  areaId: undefined, //   所在楼层/区域id
  name: undefined, //   餐桌(房间)号
  rname: undefined, //  餐桌(房间)名称
  rtype: undefined, //  记录(餐桌)类型:0 餐桌;1 包房;2 房间
  refID: undefined, //  餐桌所在房间id:0 大厅,非0为具体房间id,rtype为1,2时 为空
  maxN: undefined, //   可容纳人数
  minN: undefined, //   最低起订人数
  status: undefined, //   餐桌状态:0空闲;1占用;2预订;3待清理
  inuseDT: undefined, //  启用时间
  emptyDT: undefined, //  空出时间
  bookDT: undefined //  预定时间
}

const defaultQuery = {
  p: undefined, //  第p页
  sid: undefined, //  店铺id
  // sid: this.$store.getters.sid, //  店铺id
  areaId: undefined, //   房间(餐桌)所在楼层/区域
  rtype: undefined, //  类型:0 餐桌;1 包房;2 房间。 若该参数为空，默认返回 餐桌与包房的数据列表。
  rname: undefined, //  支持按房间(餐桌)名称模糊查询
  name: undefined, //   餐桌(房间)号
  status: undefined, //   餐桌状态(0空闲;1占用;2预订;3待清理)
  initQList: undefined //   该参数值为1时,返回数据会附加上 店铺列表 shopList(id,name) 若店铺列表只有一店铺，并返回该店铺的店铺楼层/区域列表 sRoomAreaList
}

export default {
  name: 'm-desk-index',
  components: { MobileHeader },
  directives: {
    waves
  },
  data() {
    return {
      srvStatus:'',
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: defaultQuery,
      dataForm: defaultForm,
      shopOptions: [],
      areaOptions: [],
      statusOptions: [],
      deskTypeOptions: [],
      defaultAreaOptions: [],
      deskTypeName:{0:'餐',1:'包',2:'房'},
      servercOptions:{0:'取消',1:'退',2:'退',3:'已取消',4:'已退'},


      dialogFormVisible: false,
      dialogControlVisible: false,
      deskBookingVisible: false,
      dialogStatus: '',
      hideIsActive: false,
      currentDesk: {},   // 当前被选中的desk
      textMap: {
        update: '修改餐桌(房间)',
        create: '添加餐桌(房间)'
      },
      rules: {
        sid: [{ required: true, type: 'integer', fullField: '店铺' }],
        areaId: [{ required: true, type: 'integer', fullField: '区域' }],
        name: [{ required: true, fullField: '餐桌(房间)号' }],
        rname: [{ required: true, fullField: '餐桌(房间)名称' }],
        rtype: [{ required: true, type: 'integer', fullField: '(餐桌)类型' }],
        refID: [{ required: true, type: 'integer', fullField: '餐桌所在房间' }],
        maxN: [{ required: true, type: 'integer', min: 1, fullField: '可容纳人数' }],
        minN: [{ required: true, type: 'integer', min: 1, fullField: '最低起订人数' }]
      },
      // filters
      displayNameFilter,
      dialogFormVisible2:false,
      menuList:[],
      // ispay:undefined,
      dialogFormVisible3: false,
      title:undefined,
      radioChoose:" 作 废 ",
      remark:'',
      remark2:'',
      temp:{
        num:undefined
      },
      isReuse:false,
      popupShow: false,
      sessionSid:this.$store.getters.sid,
      isMoreOrder:false,
      capinonOptions:[],
      dialogSrvCancelVisible:false,
      srvNum:undefined,
      desc : '',
      titleN:'',
    }
  },

  created() {
    this.resetQuery()
    this.listQuery.sid = this.$store.getters.sid
    this.listQuery.initQList = 1 // 获取店铺, 区域列表
    this.getList()
    this.shopChange()
    this.listQuery.initQList = undefined
    dict('rType').then(response => {
      this.deskTypeOptions = response
      })
    dict('roomStatus').then(response => {
      this.statusOptions = response
      this.statusOptions.push({id:3,name:'待清理'})
    })
  },

  filters: {
    roomColorFilter(status) {
      return 'status-' + status
    },
    bgColorFilter(orderStatus) {
      if(orderStatus == 0){
        return 'bg-' + 0
      }else{
        return 'bg-' + 1
      }
    },
    buttonBgColorFilter(status) {
      if(status ===0){
        return 'bg-0'
      }else if(status ===1){
        return 'bg-1'
      }else if(status ===2){
        return 'bg-2'
      }else{
        return 'bg-3'
      }

    },
  },

  watch: {

  },

  computed: {

  },

  methods: {
    getList() {
      this.listLoading = true
      fetchDeskList(this.listQuery).then(response => {
        this.list = response.data.list
        // this.shopOptions = Array.isArray(response.data.shopList) ? response.data.shopList : []
        this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)
        this.defaultAreaOptions = Array.isArray(response.data.areaOptions) ? response.data.sAreaList : []
        this.areaOptions = Object.assign({}, this.defaultAreaOptions)
        this.total = response.data.count
        this.list = this.list
          .map((row) => {
            row.sortKey = parseInt(row.showId)
            row.isShow = !(Number.isInteger(row.refID) && row.refID > 0)
            return row
          })
          .sort((row1, row2) => {
            // return row2.sortKey - row1.sortKey
            return row1.sortKey - row2.sortKey
          })
        this.listLoading = false
      })
    },

    getRemoteRooms(query) {
      const tempQuery = Object.assign({}, this.defaultQuery)
      tempQuery.rname = query
      fetchDeskList(tempQuery).then(response => {
        this.roomOptions = response.data.list
          .filter(desk => { return desk.rtype !== 0 })
          .map(room => {
            return { id: room.id, name: room.rname }
          })
        console.log(this.roomOptions)
      })
    },
    handleShopChange(sid) {
      this.listQuery.areaId = undefined
      fetchShopAreaList({ sid }).then(response => {

        this.areaOptions = response.data.list.sort((a, b) => {
          return a.showId - b.showId
        })
      })
    },
    shopChange() {
      this.listQuery.areaId = undefined
      fetchShopAreaList({ sid:this.listQuery.sid}).then(response => {

        this.areaOptions = response.data.list.sort((a, b) => {
          return a.showId - b.showId
        })
      })
    },

    handleFilter() {
      this.listQuery.initQList = undefined
      this.getList()
      this.dialogFormVisible = false
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.listQuery.p = val
      this.getList()
      console.log(val)
    },
    resetDataForm() {
      this.dataForm = defaultForm
    },
    mapData(data) {
      return data
    },
    remapData(data) {
      data.status = undefined
      data.inuseDT = undefined
      data.emptyDT = undefined
      data.bookDT = undefined
      return data
    },

    // 房间背景图
    backgroundImg(status) {
      return require('@/assets/images/desk/room0' + status + '.png')
    },
    toggleControl(item) {
      // console.log(item)
      if (item.rtype === 2) {
        this.list.forEach((v, indexV) => {
          if (v.refID === item.id) {
            const index = this.list.indexOf(v)
            this.list.splice(indexV, 1) // 删除原来的v
            v.isShow = !v.isShow        // 显示房间里的桌子
            this.list.splice(index, 0, v) // v放到item后面
          }
        })
      } else {
        this.isMoreOrder = false
        if(item['curOids'] ==null || item['curOids'].indexOf(',') > 0){
          this.isMoreOrder = true
        }
        this.currentDesk = item
        this.dialogControlVisible = true
      }
    },
    toggleBookingDetail() {
      this.dialogControlVisible = false
      setTimeout(() => { // workround 没想到把上层dialog动画关掉的好方法
        this.deskBookingVisible = true
      }, 300)
    },
    resetQuery(){
    this.listQuery.sid = undefined
    this.listQuery.areaId = undefined
    this.listQuery.rtype = undefined
    this.listQuery.rname = undefined
    this.listQuery.name = undefined
    this.listQuery.status = undefined
    this.listQuery.initQList = undefined

    },
    openDesk(id){
      openDesk(id).then(response=>{
        this.dialogControlVisible = false
        this.getList()
        this.$toast(response.msg);

      })
    },
     emptyDesk(id){
       this.dialogControlVisible = false
       this.$dialog.confirm({
        title: '提示',
        message: '你是否确认空桌吗?'
      }).then(() => {
          emptyDesk(id).then(response=>{
            this.getList()
            this.$toast.success(response.msg)
          })
      }).catch(() => {
         $toast.fail('已取消空桌')
      });
    },
    showMenu(item)
    {
      if(item.payStatus == 4){
        this.$toast.fail('该餐桌没有菜品');
        return
      }
      orderSrv(item.curOids).then(response => {
        this.menuList = response.data.list
        this.dialogFormVisible2 = true
      })
    },
    checkMass()
    {
       this.srvStatus = ''
      if((this.temp.num -this.srvNum) < this.temp.stepMass && this.srvStatus ==''){
        this.srvStatus = '不得低于起购量';
      }
    },
  handleClose(){
    this.dialogFormVisible2 = false
  },
  handleSrvCancel(row){
    if(row.payflag != 0 ){
      this.dialogFormVisible2 = false
      this.$toast.fail('本菜品已经 结账 不能操作');
      return 
    }
    this.srvStatus = ''
    //  this.dialogFormVisible3 = true;
    this.dialogSrvCancelVisible = true;
    this.dialogFormVisible2 = false;
     this.temp = row;
    //  this.stepMass
     if(this.temp.isbyMass == 0){
       this.srvNum =1
       this.temp.stepMass =parseInt(this.temp.stepMass); 
     }else{
       this.temp.stepMass = parseFloat(this.temp.stepMass);
       this.srvNum =0.1
     }
      if(this.temp.num <= this.temp.stepMass){
        this.srvStatus = '不得低于起购量'
      }
    this.desc = this.temp.pName + this.temp.num + this.temp.unit + ',起购量：' + this.temp.stepMass + this.temp.unit  
    if(row.status === 0){
      this.title = '取消菜品操作'
      this.titleN = '取消数量'
      fetchCapionList({type:1}).then(response => {
        this.capinonOptions = response.data.list
      })
    }else{
        fetchCapionList({type:2}).then(response => {
          this.capinonOptions = response.data.list
        })
      this.title = '退菜操作'
      this.titleN = '退菜数量'
    }
  },
  srvCancel(){
    const row = this.temp
    if(this.remark == '其他'){
      this.remark  = this.remark2
    }
    if(row.isbyMass ===0){
      row.id = row.id.toString()
      const ids = row.id.split(',')
        if((row.num - this.srvNum) < row.stepMass){
            this.srvNum = row.num
        }
        var idStr=''
        for (let index = 0; index < this.srvNum; index++) {
          if(idStr == ''){
            idStr = ids[index] 
              }else{
                idStr = idStr + ',' +ids[index]
              }
             }
      if(row.status == 0){
        // console.log(idStr)
           srvCancel(idStr,{oitemid:row.oItemID,remark:this.remark}).then(response =>{
             if(response.code === 200){
               this.dialogSrvCancelVisible = false
               this.$toast.success(response.msg)
             }
            });
      }else{
        // for (let index = 0; index < this.srvNum; index++) {
        //      srvWithdraw(ids[index],row.oid,row.oItemID,{isReuse:this.isReuse,remark:this.remark})
        //   }
          srvWithdraw(idStr,row.oid,row.oItemID,{isReuse:this.isReuse,remark:this.remark}).then(response =>{
             if(response.code === 200){
               this.dialogSrvCancelVisible = false
               this.$toast.success(response.msg)
             }
            });
      }
    }else{
        if((row.num - this.srvNum) <= row.stepMass){
            this.srvWithdraw().then(response =>{
           if(response.code === 200){
             this.dialogSrvCancelVisible = false
             this.$toast.success(response.msg)
           }
          });
        }else{
          orderItemUpdate(row.oItemID,row.oid,{pMass:this.srvNum,pMassOld:row.num,remarkList:this.remark}).then(response =>{
           if(response.code === 200){
             this.dialogSrvCancelVisible = false
             this.$toast.success(response.msg)
           }
          });
        }
      
    }
  },
  srvOneCancel(){
        srvCancel(row.id,row.oid,row.oItemID).then(response =>{
            // orderSrv(row.oid).then(response => {
            //   this.menuList = response.data
            // })
            if(response.code !== 200){
              return fales
            }
          });
  },
  srvWithdraw(){
    const row = this.temp

     srvWithdraw(row.id,row.oid,row.oItemID,{isReuse:this.isReuse,remark:this.remark}).then(response =>{
       this.dialogFormVisible3 = false
       this.dialogFormVisible2 = false
            orderSrv(row.oid).then(response => {
              this.menuList = response.data
            })
            this.$notify({
			          title: '成功',
			          message: response.msg,
			          type: response.code === 200?'success' : 'danger',
			          duration: 2000
            });
            })
  },
  }

}
</script>
<style>
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}
.detailHide {
    animation: none;
}
.dialog-fade-leave-active {
}
.item {
    background-size: 30vw 100%;
    width: 30vw;
    height: auto;
    margin: 1.4vw 1.6vw 0 1.6vw;
    float: left;
    background-repeat: no-repeat;

    label {
        display: inline-block;
        font-weight: bold;
    }
    .detail {
        width: 30vw;
        height: auto;
        text-align: center;
        margin-top: 2vw;
    }
    img {
        padding: 0.5rem;
        width: 100%;
        height: 100%;
    }
}
 .status-0 {
        color: green;
    }
    .status-1 {
        color: red;
    }
    .status-2 {
        color: #AA8800;
    }
    .status-3 {
        color: grey;
    }
    .status-4 {
        color: #3339B5;
    }
.circular-bg {
  width:100%;
  height:100%;
  border-radius:50%;
  font-size:1rem;
  line-height:26px;
  color:#fff;
  margin: auto;
  padding-top: 8px;
}
.bg-0 {
    background: green;

}
.bg-1 {
    background: red;
}
.bg-2 {
    background: #AA8800;
}
.bg-3 {
    background: grey;
}
.button-style{
  width:90%;
  margin:10px auto;
  font-size:1.3rem;
  color:#fff;
  line-height:1.6rem;

  // padding: 6px 12px
  // background:green
}
.bg-option{
  background: green;
  color:#fff;
}
.submit-button{
  background: red;
  color:#fff;
  margin-top: 20px;
}
.cancel-button{
  width: 45%;
  background: green;
  color:#fff;
  font-size: 1rem;
  margin-top: 20px;
}
.srvCance{
  width: 20rem;
  .rowstyle{
    margin: 40px 10px;
    text-align: center;
    line-height: 2rem;
    
  }
  .mcancel{
    width:100%;
    height: 100%;
    }
    .msubmit{
    width:100%;
    height: 100%;
    color:red;
    }
}

</style>
<style>
.MessageCancel{
    background:#67c23a;
    color:#fff;
    width:38%;
    font-size:1rem;
    min-height:2.5rem;
    /* color :green;
    border-color:#67c23a; */
}
.MessageConfirm{
    /* background:#fff; */
    width:38%;
    font-size:1rem;
    min-height:2.5rem;
    color :red;
    border-color:red;
}
</style>
