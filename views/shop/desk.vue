<template>
<div class="app-container">
  <div class="filter-container">
    <el-select clearable v-model.number="listQuery.sid" style="width: 130px" placeholder="选择店铺" class="filter-item" @change="getArea1()">
      <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-select clearable v-model="listQuery.areaId" style="width: 150px" placeholder="选择楼层/区域" class="filter-item">
      <el-option v-for="(item,index) in areaOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-select clearable v-model.number="listQuery.rtype" placeholder="选择餐桌类型" style="width: 130px" class="filter-item">
      <el-option v-for="(item,index) in deskTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-input placeholder="餐桌(房间)名称" v-model="listQuery.rname" style="width: 130px" class="filter-item"></el-input>
    <el-input placeholder="餐桌(房间)号" v-model="listQuery.name" style="width: 130px" class="filter-item"></el-input>
    <el-select clearable v-model="listQuery.status" placeholder="餐桌状态" style="width: 130px" class="filter-item">
      <el-option v-for="(item,index) in statusOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
    </el-select>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 店铺列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border :fit="true" highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="ID" min-width="100">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column :width="90" align="center" label="显示次序" :sortable="true" prop="showId">
      <template slot-scope="scope">
        <div @click.stop="scope.row.edit=true">
          <div>
            <el-input class="edit-input" size="small" v-model="scope.row.showId" style="width=2rem;" @change="updateData(scope)">            </el-input>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺" width="110">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.sid}}</span> -->
        <span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="区域" width="90">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.sid}}</span> -->
        <span>{{scope.row.areaId | displayNameFilter(areaOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="餐桌(房间)号" width="120"  :sortable="true" prop="name">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="餐桌(房间)名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.rname}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="餐桌类型" width="90">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.rtype}}</span> -->
        <span>{{scope.row.rtype | displayNameFilter(deskTypeOptions)}}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column align="center"  label="餐桌类型" width="60">
      <template slot-scope="scope">
        <span>{{scope.row.refID}}</span>
      </template>
    </el-table-column> -->
    <el-table-column align="center"  label="可容纳人数" width="110" :sortable="true" prop="maxN">
      <template slot-scope="scope">
        <span>{{scope.row.maxN}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="最低起订人数" width="115" :sortable="true" prop="minN">
      <template slot-scope="scope">
        <span>{{scope.row.minN}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="餐桌状态" width="80">
      <template slot-scope="scope">
        <!-- <span>{{scope.row.status}}</span> -->
        <span>{{scope.row.status | displayNameFilter(statusOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="启用时间" width="90" :sortable="true" prop="inuseDT">
      <template slot-scope="scope">
        <span>{{scope.row.inuseDT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="空出时间"  width="90" :sortable="true" prop="emptyDT">
      <template slot-scope="scope">
        <span>{{scope.row.emptyDT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="预定时间"  width="90" :sortable="true" prop="bookDT">
      <template slot-scope="scope">
        <span>{{scope.row.bookDT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="小程序图片" min-width="130">
      <template slot-scope="scope">
        <!-- <a href='ts' target="_blank">查看小程序图片</a> -->
         <el-button type="success" @click="showPic(scope.row)" size="small">查看小程序图片</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="200" fixed="right">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 餐桌列表结束 -->
  <!-- <div class="pagination-container">
    <el-pagination background @next-click="handleCurrentChange" @current-change="handleCurrentChange" :current-page="listQuery.p" layout="total, prev, next, jumper" :total="total" page-size="20">
    </el-pagination>
  </div> -->
    <div class="pagination-container">
    <el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"
       layout="total, prev, pager,next, jumper" :total="total" :page-size="200"></el-pagination>
		</div>
  <!-- 创建或修改 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="120px" style='margin-left:0px;'>
      <el-form-item label="店铺" prop="sid">
        <el-select clearable v-model="dataForm.sid" placeholder="请选择店铺" @change="handleShopChange">
          <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所在楼层/区域" prop="areaId">
        <el-select clearable v-model="dataForm.areaId" placeholder="请选择楼层/区域">
          <el-option v-for="(item,index) in areaOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示次序" prop="showId">
        <el-input placeholder="输入显示次序" v-model.number="dataForm.showId" ></el-input>
      </el-form-item>
      <el-form-item label="餐桌(房间)号" prop="name">
        <el-input placeholder="输入餐桌(房间)号" v-model="dataForm.name" ></el-input>
      </el-form-item>
      <el-form-item label="餐桌(房间)名称" prop="rname">
        <el-input placeholder="输入餐桌(房间)名称" v-model="dataForm.rname" ></el-input>
      </el-form-item>
      <el-form-item label="餐桌类型" prop="rtype">
        <el-select clearable v-model.number="dataForm.rtype" placeholder="选择餐桌类型">
          <el-option v-for="(item,index) in deskTypeOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="dataForm.rtype===0" label="餐桌所在房间" prop="rtype">
        <el-select clearable v-model="dataForm.refID" placeholder="选择餐桌所在房间(可搜索)" filterable remote :remote-method="getRemoteRooms">
          <el-option v-for="(item,index) in roomOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可容纳人数" prop="maxN">
        <el-input placeholder="输入可容纳人数" v-model.number="dataForm.maxN" ></el-input>
      </el-form-item>
      <el-form-item label="最低起订人数" prop="minN">
        <el-input placeholder="输入最低起订人数" v-model.number="dataForm.minN" ></el-input>
      </el-form-item>
      <el-form-item label="是否可以多单" prop="isMultiOrder">
        <el-switch v-model="dataForm.isMultiOrder" active-text="可以多单" inactive-text="不可以多单" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
    </div>
  </el-dialog>
   <!-- 选择界面 -->
    <div id="choose">
        <el-dialog title="查看和下载小程序图片" :visible.sync="dialogShowPicVisible" width="60%" center>
         <div style="text-align:center;"><img :src="picUrl" alt="桌子小程序图片"></div><br>
        <span slot="footer" class="dialog-footer">
        <el-button type="success" style="width:30%;"@click="dialogShowPicVisible=false"> 返 回 </el-button>
          <a :href = "picUrl" :download="picName">
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
import { fetchDeskList, createDesk, updateDesk, getDeskPic ,deleteClass} from '@/api/desk'
import { fetchShopAreaList } from '@/api/shop'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { dict } from '@/store'
import { displayShopFilter } from '@/filters'

// arr to obj ,such as { CN : "China", US : "USA" }
// const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
//   acc[cur.key] = cur.displayName
//   return acc
// }, {})
const defaultForm = {
  id: undefined, // 	餐桌(房间)ID
  sid: undefined, // 	店铺id
  areaId: undefined, // 	所在楼层/区域id
  name: undefined, // 	餐桌(房间)号
  rname: undefined, // 	餐桌(房间)名称
  rtype: undefined, // 	记录(餐桌)类型:0 餐桌;1 包房;2 房间
  refID: undefined, // 	餐桌所在房间id:0 大厅,非0为具体房间id,rtype为1,2时 为空
  maxN: undefined, // 	可容纳人数
  minN: undefined, // 	最低起订人数
  status: undefined, // 	餐桌状态:0空闲;1占用;2预订;3待清理
  inuseDT: undefined, // 	启用时间
  emptyDT: undefined, // 	空出时间
  bookDT: undefined, // 	预定时间
  isMultiOrder: undefined, // 是否可以多单
}

const defaultQuery = {
  p: undefined, // 	第p页
  sid: undefined, // 	店铺id
  areaId: undefined, // 	房间(餐桌)所在楼层/区域
  rtype: undefined, // 	类型:0 餐桌;1 包房;2 房间。 若该参数为空，默认返回 餐桌与包房的数据列表。
  rname: undefined, // 	支持按房间(餐桌)名称模糊查询
  name: undefined, // 	餐桌(房间)号
  status: undefined, // 	餐桌状态(0空闲;1占用;2预订;3待清理)
  initQList: undefined // 	该参数值为1时,返回数据会附加上 店铺列表 shopList(id,name) 若店铺列表只有一店铺，并返回该店铺的店铺楼层/区域列表 sRoomAreaList
}

export default {
  name: 'desk-index',
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
      listQuery: defaultQuery,
      dataForm: defaultForm,
      // sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // showReviewer: false,
      shopOptions: [],
      areaOptions: [],
      // allAreaOptions: [],
      roomOptions: [],
      statusOptions: [],
      deskTypeOptions: [],
      defaultAreaOptions: [],

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改餐桌(房间)',
        create: '添加餐桌(房间)'
      },
      rules: {
        sid: [{ required: true, type: 'integer', fullField: '店铺' }],	//
        areaId: [{ required: true, type: 'integer', fullField: '区域' }],	//
        name: [{ required: true, fullField: '餐桌(房间)号' }],	//
        rname: [{ required: true, fullField: '餐桌(房间)名称' }],	//
        rtype: [{ required: true, type: 'integer', fullField: '(餐桌)类型' }], //
        refID: [{ required: true, type: 'integer', fullField: '餐桌所在房间' }],
        maxN: [{ required: true, type: 'integer', min: 1, fullField: '可容纳人数' }],
        minN: [{ required: true, type: 'integer', min: 1, fullField: '最低起订人数' }],
        isMultiOrder: [{ required: true, type: 'integer'}]
      },
      baesUrl:process.env.BASE_API,
      picUrl:undefined,
      picName:undefined,
      dialogShowPicVisible:false,
    }
  },
  filters: {
    statusFilter(status) {
    },
    typeFilter(type) {
      // return calendarTypeKeyValue[type]
    },
    upIdFilter(arg1, ops) {
      // console.log(ops)
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
    this.listQuery.initQList = 1 // 获取店铺, 区域列表
    this.listQuery.sid = this.$store.getters.session.sid
    this.getList()
    this.listQuery.initQList = undefined

    dict('rType').then(response => {
      this.deskTypeOptions = response
    })
    dict('roomStatus').then(response => {
      this.statusOptions = response
    })
    dict('sArea',1,this.$store.getters.session.uid,this.listQuery.sid,).then(response => {
      this.areaOptions = response
      // this.allAreaOptions = response
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
    onCellClick(row) {
      row.edit = !row.edit
    },
    oRowClick(row, event, column) {
      if (column.label==='显示次序') {
        row.edit = true
      } else {
        row.edit = false
      }
    },

    getList() {
      this.listLoading = true
      // this.listQuery.p = this.listQuery.page
      fetchDeskList(this.listQuery).then(response => {
        this.list = response.data.list
        // this.shopOptions = Array.isArray(response.data.shopList) ? response.data.shopList : []
        this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response.data.shopList)
        // this.defaultAreaOptions = Array.isArray(response.data.areaOptions) ? response.data.sAreaList : []
        // this.areaOptions = Object.assign({}, this.defaultAreaOptions)
        this.total = response.data.count
        this.pageTotal = response.data.list.length
        // this.list = this.list.map((row) => {
        //   return row
        // })
        this.listLoading = false
      })

    },
    getRemoteRooms(query) {
      const tempQuery = Object.assign({}, this.defaultQuery)
      tempQuery.rname = query
      tempQuery.rtype = 2
      fetchDeskList(tempQuery).then(response => {
        this.roomOptions = response.data.list
          .filter(desk => { return desk.rtype !== 0 })
          .map(room => {
            return { id: room.id, name: room.rname }
          })
        // console.log(this.roomOptions)
      })
    },
    getArea1(){
      this.getList()

      fetchShopAreaList({ sid:this.listQuery.sid }).then(response => {
        this.areaOptions = response.data.list
        // this.allAreaOptions = response.data.list
        console.log(this.areaOptions)
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
    handleFilter() {
      this.listQuery.initQList = undefined
      this.getList()
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
    handleCreate() {
      this.resetDataForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let tempData = Object.assign({}, this.dataForm)
          tempData = this.remapData(tempData)
          createDesk(tempData).then(() => {
            this.list.unshift(this.dataForm)
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
      data.status = undefined
      data.inuseDT = undefined
      data.emptyDT = undefined
      data.bookDT = undefined
      return data
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.areaOptions=[]
      fetchShopAreaList( {sid:this.dataForm.sid} ).then(response => {
        this.areaOptions = response.data.list
        // this.areaOptions = response.data.list.sort((a, b) => {
        //   return a.showId - b.showId
        // })
      })
      this.dataForm = this.mapData(this.dataForm)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(scope) {
      if (scope.row) {
        const row = scope.row
        this.dataForm = Object.assign({}, row)
        this.doUpdateData()
      } else {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.doUpdateData()
          }
        })
      }
    },
    doUpdateData() {
      let tempData = Object.assign({}, this.dataForm)
      tempData = this.remapData(tempData)
      updateDesk(tempData.id, tempData).then(() => {
        for (const v of this.list) {
          if (v.id === this.dataForm.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.dataForm)
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
    displayNameFilter(sid, options) {
    const finded = options.find((option) => option.id === sid)
    if (finded) {
      return finded.name
      } else {
        // console.log(sid)
      }
    },
    showPic(desk){
      if(desk.picUrl === "" || desk.picUrl === null){
        getDeskPic(desk.id).then(response => {
          this.picUrl = this.baesUrl + '/'+response.data.picUrl
        })
      }else{
        this.picUrl = this.baesUrl + '/'+desk.picUrl
      }
        this.picName = '餐桌'+ desk.name+'小程序图片'
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

.inline-btn {
    display: inline-block;
}
</style>
