<template>
<div class="app-container">
  <div class="filter-container">
    <el-select clearable  style="width: 140px" v-model="listQuery.sid" class="filter-item" placeholder="所属店铺" @change="getArea1()">
				<el-option v-for="item in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
		</el-select>
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="设置名称" v-model="listQuery.title">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 列表开始 -->
  <el-table :key='tableKey' :data="lists" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="ID" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="店铺" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.sid | displayNameFilter(shopOptions)}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="设置名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.title}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center"  label="开饭时间" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.fromT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="结束时间" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.toT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="费用" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.fee}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="说明" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.remark}}</span>
      </template>
    </el-table-column>
     <el-table-column align="center"  label="小程序图片" min-width="140">
      <template slot-scope="scope">
         <el-button type="success" @click="showPic(scope.row)" size="small">查看小程序图片</el-button>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="200">
      <template slot-scope="scope">
        <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" @click="handleDelete(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
   <!-- 选择界面 -->
    <div id="choose">
        <el-dialog title="查看和下载小程序图片" :visible.sync="dialogShowPicVisible" width="60%" center> 
         <div style="text-align:center;"><img :src="ACodeUrl" alt="员工饭堂小程序图片"></div><br>
        <span slot="footer" class="dialog-footer">
        <el-button type="success" style="width:30%;"@click="dialogShowPicVisible=false"> 返 回 </el-button>
          <a :href = "ACodeUrl" :download="picName">
        <el-button style="width:30%;background:red;color:#fff" >
            下载文件
        </el-button>
          </a>
        </span>
        </el-dialog>
    </div>
  <!-- 店铺列表结束 -->
  <div class="pagination-container">
			<el-pagination  @current-change="handleCurrentChange" :current-page="listQuery.p"  
       layout="total, prev, pager,next, jumper" :total="total"  page-size.sync="10"></el-pagination>
		</div>
  <!-- 创建或修改分类 -->
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="120px" style='margin-left:0px;'>
      <el-form-item label="店铺" prop="sid">
        <el-select v-model="temp.sid" placeholder="">
          <el-option v-for="(item,index) in shopOptions" :key="item.id" :label="item.name+'('+item.id+')'" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设置名称" prop="title">
        <el-input placeholder="设置名称 如 员工早餐" v-model="temp.title"></el-input>
      </el-form-item>
      <el-form-item label="开饭时间" prop="fromT">
        <el-time-select placeholder="开饭时间" v-model="temp.fromT":picker-options="{start: '03:30',step: '00:15',end: '23:30'}"></el-time-select>
      </el-form-item>
      <el-form-item label="结束时间" prop="toT">
        <el-time-select placeholder="结束时间" v-model="temp.toT":picker-options="{start: '03:30',step: '00:15',end: '23:30',minTime: temp.fromT}"></el-time-select>
      </el-form-item>
      <el-form-item label="费用" prop="fee">
        <el-input placeholder="费用 " v-model="temp.fee"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input placeholder="备注 " v-model="temp.remark"></el-input>
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
import { fetchStaffMealCFGList, fetchStaffMealCFG, createStaffMealCFG, updateStaffMealCFG } from '@/api/staffCfg'
import {fetchShopAreaList } from '@/api/shop'
import { dict } from '@/store'
import { displayShopFilter } from '@/filters'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'staff-cfg',
  directives: {
    waves
  },

  data() {
    return {
      tableKey: 0,
      lists: null,
      total: null,
      listLoading: false,
      listQuery: {
        p:1,
        sid:undefined,
        title: undefined
      },
      shopOptions: [],
      showReviewer: false,
      temp: {
        id: undefined,
        sid: undefined,
        title: undefined,
        fromT:undefined,
        toT: undefined,
        fee: undefined,
        remark:undefined,
        ACodeUrl: undefined
      },

      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改员工用餐设置',
        create: '添加员工用餐设置'
      },
      rules: {
        // name: [{ required: true, fullField: '区域名称' }],	//
        // sid: [{ required: true, fullField: '店铺', type: 'integer' }],
        // showId: [{ required: true, fullField: '显示序号', type: 'integer' }]
      },
      dialogShowPicVisible:false,
      ACodeUrl:undefined,
      picName:undefined,
      baesUrl:process.env.BASE_API,
    }
  },
  filters: {
  },
  created() {
    dict('shop', 1,this.$store.getters.session.uid,this.$store.getters.session.sid).then(response => {
      this.shopOptions = displayShopFilter(this.$store.getters.session.sids,response)
    })
    this.getList()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchStaffMealCFGList(this.listQuery).then(response => {
        this.lists = response.data.list
        this.total = response.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.getList()
    },

    handleCurrentChange(val) {
      this.listQuery.p = val
      this.getList()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        sid: undefined,
        title: undefined,
        fromT:undefined,
        toT: undefined,
        fee: undefined,
        remark:undefined,
        ACodeUrl: undefined
      }
    },
    showPic(cfg){
      if(cfg.ACodeUrl === "" || cfg.ACodeUrl === null){
        getProductACode(cfg.id).then(response => {
          this.ACodeUrl = this.baesUrl + '/'+response.data.picUrl
        })
      }else{
        this.ACodeUrl = this.baesUrl + '/'+cfg.ACodeUrl
      }
        this.picName = '员工饭堂'+ cfg.title+'小程序图片'
      this.dialogShowPicVisible = true
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
          // tempData = this.remapData(tempData)
          createStaffMealCFG(tempData).then(response => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: response.msg,
              type: response.code == 200 ? 'success'  : 'denger',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      fetchStaffMealCFG(row.id).then(response => {
        this.temp = response.data
        // this.temp = this.mapData(this.temp)
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
          // tempData = this.remapData(tempData)
          updateStaffMealCFG(tempData.id, tempData).then(response => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '更新',
              message: response.msg,
              type: response.code == 200 ? 'success'  : 'denger',
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
  }
}
</script>

<style scoped>
.el-select { width: 100%; }
.el-date-editor--timerange.el-input__inner {
    width: 100%;
}
</style>
