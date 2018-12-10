<template>
<div class="app-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 100px;" class="filter-item" placeholder="软件名称" v-model="listQuery.name">
    </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
    <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate" kicon="el-icon-edit">{{$t('table.add')}}</el-button>
  </div>
  <!-- 店铺列表开始 -->
  <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row
            style="width: 100%">
    <el-table-column align="center" label="ID" width="65">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="软件名称" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="版本号" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.versionNo}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="版本描述" width="180">
      <template slot-scope="scope">
        <span>{{scope.row.remark}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="是否强制" width="120">
      <template slot-scope="scope">
        <span>{{scope.row.isForce == 1 ? '是':'否'}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center"  label="最后修改时间" width="180">
      <template slot-scope="scope">
        <span>{{scope.row.modifyDT}}</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" min-width="250">
      <template slot-scope="scope">
        <!-- <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">修改</el-button>
        <el-button type="danger" @click="" size="small" icon="el-icon-delete">删除</el-button> -->
        <!-- <el-button type="primary" @click='handleUpdate(scope.row)' size="small" icon="el-icon-edit">上传版本文件</el-button> -->
        <el-upload class="upload-demo" ref="upload" :action="postUrl" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList"  :multiple="false" :limit="1"  name='android' >
          <el-button  size="small" type="primary" @click="changedata(scope.row)">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">上传软件，只能上传一个,会覆盖当前版本的软件</div>
        </el-upload>
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
      <el-form-item label="软件名称" prop="name">
        <el-input placeholder="name" v-model="temp.name"></el-input>
      </el-form-item>
      <el-form-item label="版本号" prop="versionNo">
        <el-input placeholder="输入版本号" v-model="temp.versionNo" ></el-input>
      </el-form-item>
      <el-form-item label="版本描述" prop="remark">
        <el-input placeholder="输入店铺电话" v-model="temp.remark" ></el-input>
      </el-form-item>
     
      <el-form-item label-width="120px" label="是否强制:" class=""  prop="isForce">
        <el-switch v-model="temp.isForce" active-text="是" inactive-text="否" inactive-value="0" active-value="1"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
      <!-- <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button> -->
    </div>
  </el-dialog>
</div>
</template>

<script>
import {fetchList, fetchGetAndroidv,updateAndroidv,createAndroidv } from '@/api/appversion'

import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'android-version',
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
        name: undefined
      },

      temp: {
        name: undefined,	
        remark: undefined,	
        versionNo: undefined,	
        isForce: undefined,	
      },
      postUrl: process.env.BASE_API + '/api/uploadAndroid',
      fileList:[],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改版本信息',
        create: '添加新版本号'
      },
      rules: {
        name: [{ required: true, fullField: '软件名称' }],
        remark: [{ type: 'string' ,fullField: '版本描述'}],
        versionNo: [{ required: true,type: 'string', fullField: '版本号' }],
   
      },

    }
  },
  filters: {
    displayNameFilter(sid, options) {
      const finded = options.find((option) => option.key === sid)
      if (finded) {
        return finded.displayName
      } else {
        console.log(sid)
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    getList() {
      this.listLoading = true
      // this.listQuery.p = this.listQuery.page
      fetchList(this.listQuery).then(response => {
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
        name: undefined,
        remark: undefined,
        versionNo: undefined,	
        force: undefined,	
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
          createAndroidv(tempData).then(() => {
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
      changedata(row){
         this.postUrl = process.env.BASE_API + '/api/uploadAndroid'
          this.postUrl = this.postUrl + '?name=' + row.name
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(this.postUrl);
      },

    // handleUpdate(row) {
    //   fetchGetAndroidv(row.id).then(response => {
    //     this.temp = response.data
    //     this.dialogStatus = 'update'
    //     this.dialogFormVisible = true
    //     this.$nextTick(() => {
    //       this.$refs['dataForm'].clearValidate()
    //     })
    //   })
    // },

    // updateData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       let tempData = Object.assign({}, this.temp)
    //       updateAndroidv(tempData.id, tempData).then(() => {
    //         for (const v of this.list) {
    //           if (v.id === this.temp.id) {
    //             const index = this.list.indexOf(v)
    //             this.list.splice(index, 1, this.temp)
    //             break
    //           }
    //         }
    //         this.getList()
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: '成功',
    //           message: '更新成功',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
 
    // handleDelete(row) {
    //   deleteClass(row.id).then(response => {
    //     this.$notify({
    //       title: '成功',
    //       message: '删除成功',
    //       type: 'success',
    //       duration: 2000
    //     })
    //     const index = this.list.indexOf(row)
    //     this.list.splice(index, 1)
    //   })
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
