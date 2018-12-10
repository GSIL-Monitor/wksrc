<template>
<div class="app-container">
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="ID" width="105"  v-loading="loading" element-loading-text="请给我点时间！"                     >
      <template slot-scope="scope">
        <span>{{scope.row.Pid}}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" label="字段名">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.FieldName"></el-input>
        </template>
        <span v-else>{{ scope.row.FieldName }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="100px" align="center" label="字段名称">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.Pname"></el-input>
        </template>
        <span v-else>{{scope.row.Pname}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="200px" align="center" label="字段描述">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.Pdesc"></el-input>
        </template>
        <span v-else>{{scope.row.Pdesc}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="300">
      <template slot-scope="scope">
        <div v-if="scope.row.edit">
          <el-button size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          <el-button type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确认</el-button>
        </div>
        <div v-else>
          <el-button type="success" @click='showDataValList(scope.row)' size="small" icon="el-icon-more">规格值</el-button>
          <el-button type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" @click="deleteData(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
        </div>

      </template>
    </el-table-column>
  </el-table>

  <el-row style="padding-top:15px">
    <el-col :span="24">
      <el-button type="primary" @click='dialogDataVisible = true' size="small" icon="el-icon-plus">新建规格</el-button>
    </el-col>
  </el-row>


  <!-- 添加规格开始 -->
  <el-dialog title="添加字典" :visible.sync="dialogDataVisible">
    <el-form :inline="true" :rules="propRules" ref="dataForm" :model="dataForm" label-position="left" label-width="80px">
      <el-form-item label="字段名" prop="Pname">
        <el-input placeholder="输入字段名" v-model="dataForm.Pname" ></el-input>
      </el-form-item>
      <el-form-item label="字段名称" prop="FieldName">
        <el-input placeholder="输入字段名称" v-model="dataForm.FieldName" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogDataVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmDataForm">确 定</el-button>
    </div>
  </el-dialog>


  <!-- 添加规格结束 -->

  <!-- 规格值列表开始 -->
  <el-dialog :title="dataId+'字典值'" :visible.sync="dialogDataValVisible" width="800px">
    <el-table :data="dataValList" :model="dataId" v-loading="loading" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column width="80px" align="center" label="ID">
        <template slot-scope="scope">
          <el-input class="edit-input" size="small" v-model="scope.row.id"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="140px" align="center" label="字典名称">
        <template slot-scope="scope">
          <el-input class="edit-input" size="small" v-model="scope.row.name" @change="updatePropVal(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="110" >
        <template slot-scope="scope">
          <el-button type="danger" @click="deletePropVal(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row :span="24" style="margin-top: 20px" >
      <el-form :inline="true" :rules="dataValRules" ref="dataValForm" :model="dataValForm" label-position="right" label-width="80px">
        <el-form-item label="字典名称" prop="value">
            <el-input class="prop-input" size="small" v-model="dataValForm.value" placeholder="输入规格值"></el-input>
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="createPropVal(dataValForm)" size="small" icon="el-icon-plus">添加</el-button>
          </el-form-item>
      </el-form>
    </el-row>
  <div slot="footer" class="dialog-footer">
  </div>
  </el-dialog>

  <!-- 规格值列表结束 -->
</div>
</template>

<script>
import { fetchProductPropList, createProductProp, updateProductProp, deleteProductProp } from '@/api/product'
import { fetchDList, fetchDict } from '@/api/system'
import { fetchProductPropVList, createProductPropV, updateProductPropV, deleteProductPropV } from '@/api/product'
import { Tools } from '@/views/utils/Tools'
import { parseTime } from '@/utils'
import { dict } from '@/store'

export default {
  props: {
    type: {
      type: String,
      default: 'prop'
    }
  },
  data() {
    const mapDataForm = (dataForm) => {
      dataForm.originalId = dataForm.Pid
      dataForm.originalName = dataForm.Pname
      dataForm.originalFieldName = dataForm.FieldName
      dataForm.originalDesc = dataForm.Pdesc
      return dataForm
    }

    const showDataValList = (row) => {
      dict(row.FieldName).then(response => {
        this.dataId = row.FieldName
        this.dataValList = response
        this.dataValForm = defaultDataValForm
        this.dialogDataValVisible = true
      })
    }
    const defaultDataForm = {
      Pid: undefined,
      Pname: undefined,
      FieldName: undefined,
      Pdesc: undefined
    }
    const defaultDataValForm = {
      id: undefined,
      name: undefined
    }
    return {
      list: null,
      dialogDataVisible: false,
      dataForm: defaultDataForm,
      mapDataForm,
      dataRules: {
        Pname: [{ required: true, message: '字段名必填', trigger: 'change' }],
        FieldName: [{ required: true, message: '字典名称必填', trigger: 'change' }]
      },

      dialogDataValVisible: false,
      dataValForm: defaultDataValForm,
      dataValRules: {
        name: [{ required: true, message: '字段名称必填', trigger: 'change' }]
      },
      dataValList: undefined, // 当前规格值列表
      dataId: undefined, // 当前行数据key
      showDataValList,
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
      fetchDList().then(response => {
        const items = response.data.list
        this.list = items.filter(i => !i.isM).map(v => {
          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
          v = this.mapDataForm(v)
          return v
        })
        this.loading = false
      })
    },
    cancelEdit(row) {
      row.Pid = row.originalId
      row.Pname = row.originalName
      row.FieldName = row.originalFieldName
      row.Pdesc = row.originalDesc
      row.edit = false
      this.$message({
        message: '已经恢复上一次编辑',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      this.dataForm.Pid = row.Pid
      this.dataForm.Pname = row.Pname
      this.dataForm.FieldName = row.FieldName
      this.dataForm.Pdesc = row.Pdesc
      updateProductProp(this.updatePost).then(response => {
        // this.getList()
        row.originalDesc = row.Pdesc
        row.originalName = row.Pname
        row.originalFieldName = row.FieldName
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
    },
    confirmPropForm(row) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createProductProp(this.dataForm).then(() => {
            // const dataForm = this.mapPropForm(this.dataForm)
            // this.list.unshift(dataForm)
            this.getList()
            this.dialogDataVisible = false
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
    showPropValues(row) {

    },
    deleteProp(row) {
      deleteProductProp(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        // this.getList()
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      })
    },
    deletePropVal(row) {
      deleteProductPropV(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除规格值成功',
          type: 'success',
          duration: 2000
        })
        // this.getList()
        const index = this.propValList.indexOf(row)
        this.propValList.splice(index, 1)
      })
    },
    updatePropVal(row) {
      updateProductPropV(row).then(response => {
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
    },
    createPropVal(dataValForm) {
      this.$refs['dataValForm'].validate((valid) => {
        if (valid) {
          createProductPropV(dataValForm).then(() => {
            // this.dialogPropValVisible = false
            fetchProductPropVList(dataValForm.pPid).then(response => {
              const items = response.data.list
              this.propValList = items
              this.$notify({
                title: '成功',
                message: '添加规格值成功',
                type: 'success',
                duration: 2000
              })
            })
          })
        }
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
