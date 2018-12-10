<template>
<div>
  <div v-if="sort=='search'" class="search-container">
    <input class="search" name="" type="text" v-model="listQuery" placeholder="请输入菜品名称" />
    <span class="iconfont icon-search" @click="searchGoods"></span>
  </div>
  <div class="goods" :style="{ 'height': 'calc(100vh - 3rem - 2.5rem - ' + shopcartHeight +'rem' + ')' }">
    <el-scrollbar v-if="showLeftNav" key="menu" class="menu-wrapp">
      <ul>
        <li v-if="multiLang" class="menu-item" @click="switchLang">
          <span class="text border-1px">{{ langSwitched ? '中文' : 'English'}}</span>
        </li>
        <li class="menu-item" :class="{'active':changeGoods === item.id}" v-for="(item,index) in goods" :key="index" :data-id="item.id"
            @click="switchGoods(item.id)">
          <span class="text border-1px">
            {{$store.state.app.langSwitched && item.ename ? item.ename : item.name}}
            <span v-if="catFoodSum[item.id] > 0" class="catFoodSum">{{catFoodSum[item.id]}}</span>
          </span>
        </li>
      </ul>
    </el-scrollbar>
    <el-scrollbar key="goods" ref="goodsScrollComponent" class="foods-wrapper" :scroll-into-view="whereFood">
      <ul v-if="sort!=='isFine' && sort!=='totalSell' && sort!=='search'">
        <li v-for="(item,id) in goods" :key="id" :data-id="id" :id="item.id"  class="food-list " >
          <h1 v-if="item.id==changeGoods && item.foods && item.foods.length >0" class="title">{{item.name}}</h1>
          <ul v-if="item.id==changeGoods">
            <li v-for="(food, index) in item.foods" :key="index" :data-id="index"  class="food-item  border-1px">
              <div class="icon"  @click="selectFood(food,$event)">
                <img :src="food.icon" />
              </div>
              <div class="content">
                <h2 class="name" @click="handleOutStock(food)">{{$store.state.app.langSwitched && food.ename ? food.ename : food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count" v-if="food.mPrice > 0">VIP￥{{food.mPrice || '时价'}}</span>
                  <span class="rating" v-if="food.opMinute > 0">{{food.opMinute}}分钟</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price <= 0 ? '时价' : food.price }}/{{food.unit}}</span>
                                                      <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :propFoods="propFoods" :food="food" @changeCount="onChangeCount(arguments, food)" @chooseProp="showProp(food)" :isLoading="btnLoading"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <ul v-else>
        <li v-for="(food, index) in sortedFood" :key="index" :data-id="index"  class="food-item  border-1px">
          <div class="icon"  @click="selectFood(food,$event)">
            <img :src="food.icon" />
          </div>
          <div class="content">
            <h2 class="name"  @click="handleOutStock(food)">{{$store.state.app.langSwitched && food.ename ? food.ename : food.name}}</h2>
            <p class="desc">{{food.description}}</p>
            <div class="extra">
              <span class="count" v-if="food.mPrice > 0">VIP￥{{food.mPrice || '时价'}}</span>
              <span class="rating" v-if="food.opMinute > 0">{{food.opMinute}}分钟</span>
            </div>
            <div class="price">
              <span class="now">￥{{food.price <= 0 ? '时价' : food.price }}/{{food.unit}}</span>
                                                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :propFoods="propFoods" :food="food" @chooseProp="showProp(food)" @changeCount="onChangeCount(arguments, food)" :isLoading="btnLoading"></cartcontrol>
            </div>
          </div>
        </li>
      </ul>
    </el-scrollbar>
    <shopcart v-if="showShopCart" :select-foods.sync="propFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice" @remarkDetail="invokeDetail" :isLoading.sync="btnLoading"
              :deskId="deskId" :deskNum="deskNum" @changeCount="onChangeCount(arguments)" @chooseProp="showProp(arguments)">
    </shopcart>
  </div>
  <el-dialog :title="OutStockName" :visible.sync="dialogVisible">
		<el-form :rules="rules" ref="dataForm" :model="OutStockQuery" label-position="left" :label-width="'calc('+ maxLabelWidth+'rem'+')'"
             style='margin-left:0px;'>
      <div v-if="!noStock" v-for="(item, index) in OutStockList" >
			  <el-form-item :label="item.skuStrSimpleName" >
			 	  <el-input placeholder="沽清数量" v-model.number='OutStockQuery.stockNumLeft[index]'>
            <template slot="append" v-if="showEnd"><span style="color:red;">现已点{{item.frozeNum}}</span></template>
          </el-input>
			  </el-form-item>
      </div>
      <div v-if="noStock">
        <el-input v-model.number='OutStockQuery.stockNumLeft[0]' placeholder="沽清数量" style="">
        </el-input>
      </div>
			<!-- <el-form-item label="打印份数" prop="ptrNum">
			 	<el-input placeholder="输入打印份数" v-model.number='OutStockQuery.ptrNum'></el-input>
			</el-form-item> -->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="undoProductStock" v-if="!openStock" class="cancel-button" >撤销沽清</el-button>
      <el-button @click="dialogVisible = false" v-if="openStock" class="cancel-button"  >取消</el-button>
      <el-button class="submit-button" type="danger" @click="OProductStock">确认沽清</el-button>
		</div>
	</el-dialog>
  <!-- </div> -->
<!-- 规格选择弹框 -->
<div class="food border-1px" v-if="foodFlg" ref="refRemark">
  <div class="icon"  v-show="showPic">
    <img :src="selectedFood.picUrl" style="" />
  </div>
  <div class="content">
    <div class="extra">
      <h2 class="name">{{$store.state.app.langSwitched && selectedFood.ename ? selectedFood.ename : selectedFood.name}}
        <span class="now">￥{{selectedFood.newPrice || selectedFood.propPrice || selectedFood.price || '时价' }}/{{selectedFood.unit}}</span>
        <span class="mprice" v-if="selectedFood.mpropPrice > 0">VIP￥{{selectedFood.mpropPrice || '时价'}} |</span>
      </h2>
      <!-- <span class="now">￥{{selectedFood.newPrice || selectedFood.propPrice || selectedFood.price }}/{{selectedFood.unit}}</span> -->
      <!-- <div class="desc"> -->
        <!--   <span class="count">库存{{selectedFood.sellCount}}</span> -->
        <!--   <span class="rating">好评率{{selectedFood.rating}}%</span> -->
        <!-- </div> -->
      <div v-if="hasProps && !showPic">
        <div class="desc">
          <!-- <span class="count">规格:</span> -->
        </div>
        <eprops v-for="(item, index) in selectedFood.pts" :key="index" :foodFlg="foodFlg" :propList="selectedFood.propList" :propT="item" @selected="propSelected"> {{item.pn}} </eprops>
      </div>
      <div v-if="hasProps && !showPic && selectedFood.propList">
        <div v-for="(item, index) in selectedFood.propList" :key="index">
          <div v-if="item.pv.pa === 1 && item.pv.par && item.pv.par.split(':')[2] != 2" class="pa-container">
            <div class="pa-text">{{item.pv.vn}}:</div> <div class="pa-remark">
              <input v-model.number="item.paCount" placeholder="请输入数量/重量" type="number"
                     @click="paCountInput(item, $event)" @change="onPaCountChange($event, item)"/>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!showPic || !hasProps" class="remark">
          <!-- <span>其他要求请填写在这里:</span> -->
          <input v-model="selectedFood.remark" @change="syncRemark" @click="onClickRemark($event)" type="text" placeholder="其他要求请填写在这里"/>
        </div>
      </div>
      <div class="price">
        <div class="cartcontrol-wrapper">
          <div v-if="hasProps && showPic"  @click="showPic=false" >
            <cartcontrol :food="selectedFood" :propFoods="propFoods" :foodFlg="!foodFlg" class="dialog-cartcontrol"></cartcontrol>
          </div>
          <div v-else>
            <cartcontrol ref="popupAdd" :food="selectedFood" :propFoods="propFoods" :foodFlg="foodFlg" class="dialog-cartcontrol" @changeCount="onChangeCount(arguments, selectedFood, $event)" :isLoading="btnLoading"></cartcontrol>
          </div>
          <div class="confirm-btn" @click="close">确定</div>
        </div>
      </div>

    </div>
    <div class="close" @click="close">
      <span class="text">x</span>
    </div>
  </div>
  <div class="list-mask" v-show="foodFlg" @click="close"></div>
</div>
</template>
<script>
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import eprops from '../props'
import { fetchClassList, fetchProductList ,fetchSKUStockList,OProductStock } from '@/api/product'
import { OrderConfig, orderItemUpdate, orderItemAdd, fetchOrder, orderSubmit, fetchOrderList, orderAdd, orderItemPropUpdate } from '@/api/order'
import { parseTime } from '@/utils'
import { deepClone } from '@/utils/index'
import { fuzzyQuery, itemsToFoods } from '../../utils/util'

export default {
  props: {
    showLeftNav: { type: Boolean, default: false },
    // deskId: { type: Number, default: -1 },
    // deskNum: { type: String, default: '' },
    sort: { type: String, default: 'isFine' }
  },
  data() {
    return {
      goodsScrollComponent: null,
      goods: [],
      seller: {},
      changeGoods: 'id-10',
      whereFood: 'id-10',
      foodFlg: false,
      showPic: true,
      selectedFood: {},
      productList: [],          // api接口返回的productList
      propFoods: [],
      catOptions: [],
      propActive: false,
      activeColor: 'blue',
      selectedProp: {},
      listQuery: '',
      btnLoading: false,
      deskId: parseInt(this.$route.params.did),               // 桌台
      deskNum: '',
      dialogVisible:false,
      OutStockList:[],
      OutStockName:undefined,
      OutStockQuery:{
        id:undefined,
        skuStr:[],
        stockType:1,
        stockNumLeft:[],
      },
      rules:{},
      openStock:false,
      noStock:false,
      productStockList:[],
      num:0,
      showEnd:false,
      countDialogVisible: false,
      selectedPaCount: undefined,

      langSwitched: false       // 是否切换成第二语言
    }
  },
  // onLoad() {
  //     this.getList();
  // },
  components: {
    shopcart,
    cartcontrol,
    eprops
  },
  methods: {
    switchGoods(targetId) {
      this.$nextTick(() => {
        const container = this.$el.querySelector('.foods-wrapper')
        const target = this.$el.querySelector('#' + targetId)
        // const current = e.currentTarget.dataset.id;
        // console.log(container)
        // console.log(target)
        console.log('#' + targetId)
        // container.scrollTop = target.offsetTop
        target.scrollIntoView()
        this.changeGoods = targetId
        this.whereFood = targetId
        this.fetchGoods()
      })
    },
    selectFood(food, event) {
      this.selectedFood = food
      this.foodFlg = true
      this.showPic = true
    },
    // 规格值附加参数input点击
    paCountInput(prop, event) {
      // prop = Object.assign({}, prop)
      prop.paCount = prop.paCount ? prop.paCount : 0
      this.selectedProp = prop
      this.selectedPaCount = prop.paCount
      event.target.select()
      event.target.scrollIntoView(true)
      // this.countDialogVisible = true
    },
    // 附加价的数量确认后促发事件, 生成新的pPropIDPars
    onPaCountChange(event, prop) {
      if (!this.$refs.popupAdd.assertPa(prop)) {
        // 调用cartcontrol字组件的校验方法,如果不通过,paCount编程最低起购值
        prop.paCount = prop.pv.pa ? parseInt(prop.pv.par.split(':')[0]) : undefined
        return
      }
      const pPropIDPars = this.selectedFood.propList.some(
        item => { return item.pv.pa === 1 }) ? this.selectedFood.propList
            .filter(p => { return p.pv !== undefined })
            .map(p => {
              return p.pv.vid + ':' + (p.paCount ? p.paCount : 0)
            }).join(',') : undefined
      this.selectedFood.pPropIDPars = pPropIDPars
      this.selectedFood.propList.splice(this.selectedFood.propList.findIndex(prop => {
        return prop.pid === this.selectedProp.pid
      }), 1, this.selectedProp)
      // 重新计算价格
      let price = 0
      this.selectedFood.propList.filter(item => { return item.pv.pa === 1 }).forEach(prop => {
        price += prop.pv.vp * (prop.paCount ? prop.paCount : 0)
      })
      this.selectedFood.propList.filter(item => { return item.pv.pa === 0 }).forEach(prop => {
        price += prop.pv.vp
      })
      // 重新计算会员价格
      let mPrice = this.selectedFood.mPrice
      this.selectedFood.propList.forEach(prop => {
        const count = prop.pv.pa === 1 && prop.paCount > 0 ? prop.paCount : 1
        mPrice += parseFloat(prop.pv.mp ? prop.pv.mp : 0) * count
      })
      this.selectedFood.mpropPrice = mPrice.toFixed(2)
      this.selectedFood.propPrice = price.toFixed(2)
      const itemId = this.selectedFood.fid
      if (itemId && parseFloat(event.target.value) >= 0 && this.selectedFood.count > 0) {             // 有订单项id才需要更新规格参数
        const temp = {
          modifyDT: this.$store.state.shop.order.modifyDT,
          pPropIDs: this.selectedFood.pPropIDs,
          pPropIDPars: this.selectedFood.pPropIDPars,
          remarkList: this.genRemarkList()
        }
        orderItemPropUpdate(itemId, this.$route.params.oid, temp).then(response => {
          this.syncShopcart(response)
        })
      }
    },
    // 生成订单项的备注, 因为一个订单项里面可能有多个相同的菜
    genRemarkList(food) {
      const selectedFood = food || this.selectedFood
      if (selectedFood.isbyMass) {
        return selectedFood.remark ? [selectedFood.remark] : []
      }
      let list = []
      for(var i = 0; i < selectedFood.count; i++) {
        list.push(selectedFood.remark || '')
      }
      return list
    },
    // 选中规格值促发事件的处理
    propSelected(propS) {
      const findedIndex = this.selectedFood.propList.findIndex(v => { return v.pid === propS.pid })
      // this.selectedProp = propS
      if (findedIndex === -1) {
        this.selectedFood.propList.push(propS)
      } else if (this.selectedFood.propList[findedIndex].pv.vid !== propS.pv.vid) {
        this.selectedFood.propList.splice(findedIndex, 1, propS) // 替换
      }
      // 重新计算价格
      let price = this.selectedFood.price
      this.selectedFood.propList.filter(item => { return item.pv.pa !== 1 }).forEach(prop => {
        price += prop.pv.vp
      })
      this.selectedFood.propList.filter(item => { return item.pv.pa === 1 }).forEach(prop => {
        price += prop.pv.vp * (prop.paCount ? prop.paCount : 0)
      })
      this.selectedFood.propPrice = price.toFixed(2)
      // 重新计算会员价格
      let mPrice = this.selectedFood.mPrice
      this.selectedFood.propList.forEach(prop => {
        const count = prop.pv.pa === 1 && prop.paCount > 0 ? prop.paCount : 1
        mPrice += parseFloat(prop.pv.mp ? prop.pv.mp : 0) * count
      })
      this.selectedFood.mpropPrice = mPrice.toFixed(2)

      // 重新计算数量
      const pPropIDs = this.selectedFood.propList
            .filter(p => {
              // const rule = p.pv.pa === 1 && p.pv.par.split(':').map(p => parseFloat(p))[2]
              return p.pv !== undefined
            })
            .map(p => {
              return p.pv.vid
            }).join(',')
      // 附加参数串
      const pPropIDPars = this.hasPa ? this.selectedFood.propList
            .filter(p => { return p.pv !== undefined && p.pv.pa === 1 })
            .map(p => {
              return p.pv.vid + ':' + (p.paCount ? p.paCount : 0)
            }).join(',') : undefined
      // 如果有附加参数的,
      if (this.selectedFood.pPropIDPars) {
        const kvs = this.selectedFood.pPropIDPars.split(',')
        kvs.forEach(kv => {
          kv = kv.split(':')
          const finded = this.selectedFood.propList.find(p => {
            return p.pv.vid === parseInt(kv[0])
          })
          if (finded) {
            finded.paCount = parseFloat(kv[1])
            this.selectedFood.propList.splice(this.selectedFood.propList.indexOf(finded), 1, finded)
          }
        })
        this._shopcartToCurrent(this.propFoods)
      }
      const pSkuStr = this.selectedFood.propList.filter(p => { return p.pv !== undefined }).map(p => {
        return p.pid + ':' + p.pv.vid
      }).join(';')
      this.selectedFood.pPropIDs = pPropIDs
      this.selectedFood.pSkuStr = pSkuStr
      this.selectedFood.pPropIDPars = pPropIDPars
      const propFoodIndex = this.propFoods.findIndex(v => {
        return v.pPropIDs === pPropIDs
      })
      if (propFoodIndex !== -1) {
        // console.log(this.propFoods[propFoodIndex].count)
        this.selectedFood.count = this.propFoods[propFoodIndex].count
        this.selectedFood.remark = this.propFoods[propFoodIndex].remark
        this.selectedFood.fid = this.propFoods[propFoodIndex].fid
      } else {
        // 重置food的count数量, 以便增加count的时候, 就默认确定选中规格对应的food
        this.$set(this.selectedFood, 'count', 0)
        this.$set(this.selectedFood, 'remark', '')
      }
    },
    syncRemark() {
      if (this.selectedFood.propList) {
        const pPropIDs = this.selectedFood.propList.filter(p => { return p.pv !== undefined }).map(p => {
          return p.pv.vid
        }).join(',')
        const propFoodIndex = this.propFoods.findIndex(v => {
          return v.pPropIDs === pPropIDs
        })
        if (propFoodIndex !== -1) {
          this.propFoods[propFoodIndex].remark = this.selectedFood.remark
        }
      }
    },
    onClickRemark(event) {
      // 备注填写输入定位
      this.$nextTick(() => {
        event.target.select()
        event.target.parentNode.scrollIntoView()
      })
    },
    commitRemark() {
      const itemId = this.selectedFood.fid
      if (this.remarkChanged && itemId && this.selectedFood.count > 0) { // 有订单项id才需要更新规格参数
        const temp = {
          modifyDT: this.$store.state.shop.order.modifyDT,
          pPropIDs: this.selectedFood.pPropIDs,
          pPropIDPars: this.selectedFood.pPropIDPars || '',
          remarkList: this.genRemarkList()
        }
        orderItemPropUpdate(itemId, this.$route.params.oid, temp).then(response => {
          this.syncShopcart(response)
          this.remarkChanged = false
        })
      }
    },
    close() {
      this.foodFlg = false
      this.commitRemark()
    },
    invokeDetail(food) {
      if (food.propList && food.propList.length > 0) {
        let temp = {}
        this.goods.forEach(v => {
          v.foods.forEach(item => {
            if (item.id === food.id) {
              temp = item
            }
          })
        })
        // this.selectedFood = temp
        this.selectedFood = food
      } else {
        this.selectedFood = food
      }
      this.foodFlg = true
    },
    goodsScrollAct() {
      // const container = this.goodsScrollComponent
      // console.log(container.scrollTop)
      // console.log(container.scrollHeight)
      // var height =  e.mp.detail.scrollHeight;

      // const scrollTop = e.mp.detail.scrollTop

      // console.log(scrollTop)
    },
    // 初始化产品列表
    fetchGoods(initOrder) {
      this.$store.dispatch('GetProductList').then(response => {
        const productList = response
        const goods = []
        // console.log(this.catOptions)
        this.catOptions.forEach(cat => {
          goods.push({
            id: 'id-' + cat.id,
            name: cat.name,
            ename: cat.ename,
            foods: [],
            type: cat.id
          })
        })
        // const canShowList = []
        productList.forEach(item => {
          const finded = goods.find(v => {
            return v.id === 'id-' + item.catID && v.id === this.changeGoods
          })
          if (finded) {
            const temp = finded
            finded.foods.push(item)
            goods.splice(goods.indexOf(temp), 1, finded)
            // canShowList.push(item)
          } else {
            // console.log(item)
          }
        })
        // this.productList = canShowList
        // 同步购物车里的food到产品列表
        goods.forEach(list => {
          list.foods.forEach(food => {
            let finded = this.propFoods.find(item => {
              return food.id === item.id
            })
            if (finded) {
              if (finded.propList && finded.propList.length > 0) {
                finded = deepClone(finded)
                list.foods.splice(list.foods.indexOf(food), 1, finded)
              } else {
                list.foods.splice(list.foods.indexOf(food), 1, finded)
              }
            } else {
              food.count = 0
              food.remark = ''
            }
          })
        })

        this.goods = goods
        if (initOrder) {
          this.initOrder()
        }
      })
    },
    searchGoods() {
      this.searchFoods
    },
    onChangeCount(args, food, event) {
      const oldCount = args[0]
      const newCount = args[1]
      if (!food)  {
        food = args[2]
      }
      this.btnLoading = true
      // 添加订单项
      if (oldCount === 0) {
        const temp = {
          oid: this.$route.params.oid,
          cid: this.$store.getters.cid,
          pid: food.id,
          pNum: food.isbyMass ? 0 : food.count,
          pMass: food.isbyMass ? food.count : 0,
          pPropIDs: food.pPropIDs,
          pPropIDPars: food.pPropIDPars,
          pSkuStr: food.pSkuStr,
          modifyDT: this.$store.state.shop.order.modifyDT,
          remarkList: food.remark ? this.genRemarkList(food) : undefined
        }
        orderItemAdd(temp).then(response => {
          this.syncShopcart(response)
          this.btnLoading = false
        }).catch(error => {
          const temp = food
          temp.count = oldCount // 直接修改数量, 不会促发vue自动更新视图
          this.propFoods.splice(this.propFoods.indexOf(food), 1, temp)
          this.syncOrderInfo()
          this.btnLoading = false
        })
      } else {
        const itemId = food.fid ? food.fid : food.id
        const temp = {
          pNum: food.isbyMass ? 0 : newCount,
          pNumOld: food.isbyMass ? 0 : oldCount,
          pMass: food.isbyMass ? newCount : 0,
          pMassOld: food.isbyMass ? oldCount : 0,
          modifyDT: this.$store.state.shop.order.modifyDT,
          remarkList: food.remark ? this.genRemarkList(food) : undefined
        }
        orderItemUpdate(itemId, this.$route.params.oid, temp)
          .then(response => {
            this.syncShopcart(response)
            this.btnLoading = false
          })
          .catch(error => {
            const temp = food
            temp.count = oldCount // 直接修改数量, 不会促发vue自动更新视图
            this.propFoods.splice(this.propFoods.indexOf(food), 1, temp)
            this.syncOrderInfo()
            this.btnLoading = false
          })
      }
    },
    // 加菜自动提交订单
    submitRobot() {
      const data = { isHold: this.isHold, modifyDT: this.$store.state.shop.order.modifyDT }
      orderSubmit(this.$route.params.oid, data).then(response => {
        this.propFoods = []
        this.shopcartToFoods(this.goods)
        this.$message.success(response.msg)
      })
    },
    syncShopcart(response) {
      this.$store.commit('SET_MODIFYDT', response.data ? response.data.modifyDT : response.modifyDT)
      const itemList = response.data ? response.data.list || response.data.itemList || []: response.itemList || []
      const temp = itemList.filter(item => {
        // return item.isSubmit === 0 && item.pNum >= 0 && item.pMass >= 0
        return item.isSubmit === 0
      })
      this.propFoods = itemsToFoods(temp, this)
      this.propFoods = this.propFoods.filter(food => {
        return !food.isGift
      })
      this.shopcartToFoods(this.goods)
    },
    shopcartToFoods(goods) {
      // 同步购物车里的food到产品列表
      goods.forEach(list => {
        this._shopcartToFoods(list.foods)
      })
      // 如果还没同步数据到产品, 就打开了产品弹窗, 需要再次同步
      this._shopcartToCurrent(this.propFoods.filter(item => item.count > 0))
    },
    _shopcartToFoods(foods) {
      return foods.forEach(food => {
        let finded = this.propFoods.find(item => {
          return food.id === item.id && item.count > 0
        })
        if (finded) {
          if (finded.propList && finded.propList.length > 0) {
            finded = deepClone(finded)
            foods.splice(foods.indexOf(food), 1, finded)
          } else {
            foods.splice(foods.indexOf(food), 1, finded)
          }
        } else {
          food.count = 0
          food.remark = ''
        }
      })
    },
    _shopcartToCurrent(foods) {
      foods.forEach(food => {
        let finded = false
        if (this.hasProps) {
          const pPropIDs = this.selectedFood.propList.filter(p => { return p.pv !== undefined }).map(p => {
            return p.pv.vid
          }).join(',')
          finded = food.pPropIDs === pPropIDs
        } else {
          finded = food.id === this.selectedFood.id
        }
        if (finded) {
          if (food.propList && food.propList.length > 0) {
            // this.selectedFood = deepClone(this.selectedFood, food)
            // this.selectedFood.propList.splice(0, this.selectedFood.propList.length, ...food.propList)
            this.selectedFood.propList = deepClone(food.propList)
            this.selectedFood.fid = food.fid
            // this.selectedFood.price = food.price
            this.selectedFood.propPrice = food.price
            this.selectedFood.count = food.count
            this.selectedFood.remark = food.remark
            if (this.selectedProp) { // 带参数的规格值才需要同步
              this.selectedProp = this.selectedFood.propList.find(p => {
                return p.pid === this.selectedProp.pid
              })
            }
            // this.selectedFood.pts = food.pts
          } else {
            this.selectedFood = food
          }
        }
      })
    },
    initOrder() {
      const today = parseTime(Date.now(), '{y}-{m}-{d}')
      const query = this.$route.params
      // 只有桌号
      if (query.did && !query.oid) {
        fetchOrderList({ roomID: query.did, createDT: today, itemList: 1 })
          .then(response => {
            const currentOrder = response.data.list.find((item) => {
              return item.payflag === 0
            })
            if (currentOrder !== undefined) {
              this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
              this.joinOrder(currentOrder)
              this.syncShopcart(currentOrder)
            } else {
              this.newOrder()
            }
          })
      }
      // 桌号, 单号都有
      if (query.did && query.oid) {
        fetchOrder(query.oid)
          .then(response => {
            const currentOrder = response.data
            this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
            if (currentOrder !== undefined && currentOrder.payflag === 0) {
              this.joinOrder(currentOrder)
              this.syncShopcart(response)
            } else {
              this.$message({
                message: '订单已完成, 或不存在,请选择其他订单',
                type: 'error',
                duration: 2000
              })
              this.$route.push('/mobile/shop/order/list')
            }
          })
      }
    },
    // 新建空单
    newOrder() {
      const sid = this.$store.getters.sid
      const data = {
        sid: parseInt(sid),                // 当前店铺id
        roomID: this.deskId,               // 房间id
        cid: this.$store.getters.cid,      // 当前顾客id
        otype: OrderConfig.otype.INSHOP,   // 订单类型
        remark: '',                        //
        itemList: []
      }
      orderAdd(data).then(response => {
        const orderId = response.data.id
        this.orderId = orderId
        this.type = 'newOrder'
        fetchOrder(orderId).then(response => {
          const currentOrder = response.data
          this.$store.commit('SET_MODIFYDT', currentOrder.modifyDT)
          this.$route.params.type = 'newOrder'
          this.$route.params.oid = currentOrder.id
          this.$route.params.did = currentOrder.roomID
          this.deskNum = response.data.roomNumber
        })
      })
    },
    joinOrder(currentOrder) {
      const submitted = currentOrder.itemList && currentOrder.itemList.findIndex(item => {
        return item.isSubmit === 1 }) > -1
      this.$route.params.type = submitted ? 'addItem' : 'newOrder'
      this.$route.params.oid = currentOrder.id
      this.$route.params.did = currentOrder.roomID
      this.type = this.$route.params.type
      this.orderId = this.$route.params.oid
      this.deskNum = currentOrder.roomNumber
    },
    showProp(food) {
      this.selectedFood = food
      this.foodFlg = true
      this.showPic = false
    },
    getSkutOfList(food){
      // console.log(food)
      // if(this.isEmpty(food.pts)){
      //   this.noStock =  true
      //   this.OutStockQuery.skuStr[0] = '';
      //   this.OutStockQuery.stockNumLeft[0] = 0;
      // }else{
      // var len =0
      // for(var item of food.pts){
      //   len++
      // }
      var len = food.pts.length
      if (len ===1) {
        if(food.pts[0].pvs.length >0){
          for(var val of food.pts[0].pvs){
            this.OutStockList.push({skuStrSimpleName:val.vn,skuStr:food.pts[0].pid+':'+val.vid})
          }
          this.OutStockQuery.skuStr = this.OutStockList.map(item => {
            return item.skuStr =="" ? '':item.skuStr
          });
        }else{
          // this.OutStockList = [{skuStrSimpleName:'',skuStr:'',stockNumLeft:0}]
          this.noStock =  true
          this.OutStockQuery.skuStr[0] = '';
        }

      } else {
        for(var i=0; i< len-1;i++){

          var len1 = food.pts[i].pvs.length
          for(var j=0; j< len1;j++){

            var len2 = food.pts[i+1].pvs.length
            for(var k=0; k< len2;k++){
              var sku = food.pts[i].pid+':'+food.pts[i].pvs[j].vid +';'+food.pts[i+1].pid+':'+food.pts[i+1].pvs[k].vid
              this.OutStockList.push({skuStrSimpleName:food.pts[i].pvs[j].vn + '/'+food.pts[i+1].pvs[k].vn,skuStr:sku})
            }
          }
        }
        // console.log(len + '==='+ len1 + '==='+len2)
        // console.log(this.OutStockList)
        this.OutStockQuery.skuStr = this.OutStockList.map(item => {
          return item.skuStr =="" ? '':item.skuStr
        });
      }
      this.OutStockQuery.stockNumLeft = this.OutStockList.map(item => {
        return  0
      })
      // }
    },
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
          if(food.isSku === 0){
            // this.showEnd = false
            this.noStock =  true
            // this.openStock = true
            this.OutStockQuery.skuStr[0] = '';
            this.OutStockQuery.stockNumLeft[0] = 0;
          }else{
            this.getSkutOfList(food)
          }
          this.showEnd = false
        }else{
          this.showEnd=true
          this.OutStockList = response.data.list
          this.OutStockQuery.skuStr = this.OutStockList.map(item => {
            return item.skuStr =="" ? '':item.skuStr
          })
          this.OutStockQuery.stockNumLeft = this.OutStockList.map(item => {
            return item.stockNumLeft == "" ? 0 :item.stockNumLeft
          })
        }
      })
      this.dialogVisible = true
    },
    undoProductStock() {
      this.OutStockQuery.stockType = 0
      this.OProductStock()
    },
    OProductStock(){
      this.dialogVisible = false
      this.OutStockQuery.skuStr = this.OutStockQuery.skuStr.join(",")
      this.OutStockQuery.stockNumLeft = this.OutStockQuery.stockNumLeft.join(",")
      OProductStock(this.OutStockQuery.id,this.OutStockQuery).then(response =>{
        this.$store.dispatch('SyncStock').then(response => {
          this.syncOrderInfo()
        })
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
    syncOrderInfo() {
      fetchOrder(this.$route.params.oid).then(response => {
        this.$store.commit('SET_MODIFYDT', response.data.modifyDT)
        this.syncShopcart(response)
        this.btnLoading = false
      })
    },
    // 切换语言
    switchLang() {
      this.$store.dispatch('setLanguage', 'en')
      this.langSwitched = this.$store.state.app.langSwitched
    }
  },
  created() {
    fetchClassList().then(response => {
      this.catOptions = response.data.list
      this.catOptions = this.catOptions.filter((item) => {
        // updated Sat Dec  1 21:20:04 2018
        // // 不是前端销售类型, 不显示
        // if (item.isNotSale !== 0) {
        //   return false
        // }
        // 不是今天显示的, 不显示
        const today = new Date()
        if (item.showWeek && item.showWeek.split(',').indexOf(today.getDay() + 1 + '') === -1) {
          return false
        }
        return true
      }).sort((a, b) => {
        return a.showId - b.showId
      })

      this.fetchGoods(true)
      this.changeGoods = 'id-' + this.catOptions[0].id
      this.whereFood = 'id-' + this.catOptions[0].id
    })
  },
  mounted() {
    const container = this.$el.querySelector('.foods-wrapper .el-scrollbar__wrap')
    this.goodsScrollComponent = container
    this.goodsScrollComponent.addEventListener('scroll', this.goodsScrollAct)
    // this.initOrder()
  },

  beforeDestroy() {
    this.goodsScrollComponent.removeEventListener('scroll', this.goodsScrollAct)
  },
  destroyed() {
    // window.removeEventListener('scroll', this.goodsScrollAct)
  },
  computed: {
    hasProps() {
      return this.selectedFood.pts && this.selectedFood.pts.length > 0 && this.selectedFood.propList
    },
    // 选中产品是否有附加参数
    hasPa() {
      return this.selectedFood.propList.some(
        item => { return item.pv.pa === 1 && item.paCount >= 0 })
    },
    selectFoods() {
      let foods = []
      if (!this.goods.length) {
        return []
      }
      // this.propFoods = []
      // this.goods.forEach((good) => {
      //   good.foods.forEach((food) => {
      //     if (food.propList && food.propList.length <= 0 && food.count) {
      //       foods.push(food)
      //     }
      //   })
      // })
      // foods = this.propFoods.concat(foods)
      // return foods
      return this.propFoods
    },
    // 推荐产品
    isFineFoods() {
      return this.$store.state.shop.productList.filter(food => {
        return food.isFine === 1
      })
    },
    // 按销量排序产品, 只返回前30个
    totalSellFoods() {
      return this.$store.state.shop.rankList
    },
    searchFoods() {
      const productList = this.$store.state.shop.productList
      if (productList) {
        return fuzzyQuery(productList, this.listQuery, 'name').slice(0, 30)
      }
    },
    sortedFood() {
      if (this.sort === 'isFine') {
        this._shopcartToFoods(this.isFineFoods)
        return this.isFineFoods
      } else if (this.sort === 'totalSell') {
        this._shopcartToFoods(this.totalSellFoods)
        return this.totalSellFoods
      } else if (this.sort === 'search') {
        this._shopcartToFoods(this.searchFoods)
        return this.searchFoods
      } else {
        return []
      }
    },
    shopcartHeight() {
      return  (this.showShopCart ? 1 : 0) * 3
    },
    showShopCart() {
      return this.propFoods && this.propFoods.length > 0 &&
        this.propFoods.findIndex(food => { return food.count > 0 }) > -1
    },
    catFoodSum() {
      let foodSum = 0
      const sumList = {}
      // if (this.propFoods && this.propFoods.length > 0) {
      this.goods.forEach(list => {
        foodSum = 0
        this.propFoods.filter(item => {
          return list.id === 'id-' + item.catID
        }).forEach(v => {
          foodSum += v.count
        })
        sumList[list.id] = foodSum
      })
      // }
      return sumList
    },
    // 店铺是否有多语言设置
    multiLang() {
      return parseInt(this.$store.state.shop.config.lang2) === 1
      // return true
    },
    // 估清最大label长度
    maxLabelWidth(){
      const width = 4
      const lenArr = this.OutStockList.map(item => {
        return item.skuStrSimpleName ? item.skuStrSimpleName.length : width
      })
      return Math.max(...lenArr) + 0.2

    }
  },
  watch: {
    sort(type) {

    },
    'selectedFood.remark': function(val, oldval) {
      this.remarkChanged = true
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../../common/stylus/mixin";
  @import "../../common/stylus/variables";
    .goods
        display flex
        // top 248px
        // bottom 192px
        // height calc(100vh - 96px - 80px - 3rem)
        overflow hidden
        h1
          margin:0
        .menu-wrapp
            flex 0 0 175px
            width 175px
            background #f7f8f9
            .active
                position relative
                background #ffffff
                color main-red
                z-index 10
                margin-top -2px
                font-weight 700
                .text
                    border-none()
            .menu-item
                display table
                height 108px
                width 175px
                line-height 28px
                padding 0 16px
                .icon
                    width 32px
                    height 32px
                    vertical-align top
                    margin-right 4px
                    background-size 32px 32px
                    background-repeat no-repeat
                    &.decrease
                        bg-image('decrease_3')
                    &.discount
                        bg-image('discount_3')
                    &.guarantee
                        bg-image('guarantee_3')
                    &.invoice
                        bg-image('invoice_3')
                    &.special
                        bg-image('special_3')
                .text
                    display table-cell
                    font-size 32px
                    width 200px
                    border-1px(rgba(7,17,27,.1))
                    vertical-align middle
                .catFoodSum
                   position absolute
                   top 20px
                   right -10px
                   width 28px
                   height 28px
                   line-height 28px
                   text-align center
                   border-radius 20px
                   font-size 18px
                   font-weight 700
                   color #ffffff
                   background rgb(240,20,20)
        .foods-wrapper
            flex 1
            .title
                padding-left 28px
                height 52px
                line-height 52px
                border-left 4px solid #d9dde1
                font-size 30px
                color rgb(147,153,159)
                background #f3f5f7
            .food-item
                display flex
                margin 24px
                padding-bottom 36px
                border-1px(rgba(7,17,27,.1))
                &:last-child
                    border-none()
                    margin-bottom 0
                img
                    width: 114px
                    height: 114px
                .icon
                    flex 0 0 114px
                    margin-right 20px
                .content
                    flex 1
                    .name
                        margin 4px 0 16px 0
                        font-size 36px
                        line-height 36px
                        color rgb(7,17,27)
                    .desc, .extra
                        line-height 26px
                        font-size 26px
                        color rgb(147,153,159)
                    .desc
                        margin-bottom 16px
                    .extra
                        .count
                            margin-right 24px
                            margin-left 6px
                     .price
                        font-weight 700
                        line-height 48px
                        vertical-align top
                        .now
                            margin-right 16px
                            font-size 32px
                            color rgb(240,20,20)
                        .old
                            text-decoration line-through
                            font-size 20px
                            color rgb(147,153,159)
                    .cartcontrol-wrapper
                        position absolute
                        right 0
                        top 0
                        bottom 30px
                        margin-top 70px
    .food
        position fixed
        z-index 999
        margin auto
        left 0
        right 0
        top 0
        bottom 0
        width 650px
        max-height 1065px
        overflow scroll
        .icon
            height 650px
            img
                width 650px
                height 650px
        .content
            // height 210px
            height auto
            width 100%
            box-sizing border-box
            background #fff
            .extra
                display flex
                flex-direction column
                justify-content center
                padding-left 16px
                // height 120px
                height auto
                background #fff
                .name
                    display block
                    font-size 38px
                    line-height 38px
                    color #333333
                .mprice
                  color #93999f
                  float right
                .now
                  margin-right 16px
                  font-size 38px
                  color rgb(240,20,20)
                  float right
                  // padding-right 18px
                .desc
                    padding-top 18px
                    .count, .rating
                        font-size 28px
                        line-height 28px
                        color #8c8c8c
                    .rating

                        padding-left 30px
            .remark
              width 100%
              span
                margin 0 5%
                color text-grey
                font-size 26px
              input
                height 64px
                width 600px
                margin 20px
                border 1px solid #cecaca
                border-radius 10px
                padding 10px
            .price
                height 90px
                background #fafafa
                box-sizing border-box
                line-height 90px
                padding-right: 10px;
                .now
                    padding-left 30px
                    font-size 40px
                    color red
                .cartcontrol-wrapper
                    // float right
                    display flex
                    justify-content space-between
                    .confirm-btn
                      background main-red
                      color #fff
                      width 35%
                      margin-right -10px
                      text-align: center
                      height 90px
                      font-weight 500
                      line-height 90px
                    .cartcontrol
                      margin-left 20px
        .close
            margin-top 40px
            margin-left auto
            margin-right auto
            width 80px
            height 80px
            line-height 80px
            text-align center
            background #3d3d3d
            border-radius 50%
            .text
                font-size 50px
                line-height 30px
                color #ffffff

         .pa-container
            display flex
            justify-content start
            margin-bottom 10px
            .pa-text
              font-size 30px
              line-height 40px
              padding 10px
            .pa-remark
              input
                height 64px
                max-width 400px
                padding 10px
    .list-mask
        position fixed
        top 0
        left 0
        width 100%
        height 100%
        z-index 990
        background #666666
        opacity .7



.search-container
  display flex
  border 1px solid border-grey
  border-radius 48px
  margin 10px 25px
  height 80px
  input
    height 75px
    width 100%
    // border-radius 48px
    border 0
    text-align center
    margin-left 30px
  .icon-search
    font-size 48px
    line-height 70px
    padding-right 20px
    padding-top 5px
</style>
