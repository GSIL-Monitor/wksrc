<template>
<div class="app-container">
  <el-table :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="规格ID" width="105"  v-loading="loading" element-loading-text="请给我点时间！"                     >
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="显示次序">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.showId"></el-input>
        </template>
        <span v-else>{{scope.row.showId}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="400px" label="规格名称">
      <template slot-scope="scope">
        <template v-if="scope.row.edit">
          <el-input class="edit-input" size="small" v-model="scope.row.name"></el-input>
        </template>
        <span v-else>{{ scope.row.name }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="300">
      <template slot-scope="scope">
        <div v-if="scope.row.edit">
          <el-button size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          <el-button type="success" @click="confirmEdit(scope.row)" size="small" icon="el-icon-circle-check-outline">确认</el-button>
        </div>
        <div v-else>
          <el-button type="success" @click='showPropValList(scope.row)' size="small" icon="el-icon-more">规格值</el-button>
          <el-button type="primary" @click='scope.row.edit=!scope.row.edit' size="small" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" @click="deleteProp(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
        </div>

      </template>
    </el-table-column>
  </el-table>

  <el-row style="padding-top:15px">
    <el-col :span="24">
      <el-button type="primary" @click='dialogPropVisible = true' size="small" icon="el-icon-plus">新建规格</el-button>
    </el-col>
  </el-row>


  <!-- 添加规格开始 -->
  <el-dialog title="添加规格" :visible.sync="dialogPropVisible">
    <el-form :inline="true" :rules="propRules" ref="propForm" :model="propForm" label-position="left" label-width="80px">
      <el-form-item label="显示序号" prop="showId">
        <el-input placeholder="输入显示序号" v-model="propForm.showId" ></el-input>
      </el-form-item>
      <el-form-item label="规格名称" prop="name">
        <el-input placeholder="输入规格名称" v-model="propForm.name" ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogPropVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmPropForm">确 定</el-button>
    </div>
  </el-dialog>


  <!-- 添加规格结束 -->

  <!-- 规格值列表开始 -->
  <el-dialog title="产品规格值" :visible.sync="dialogPropValVisible" width="90%">
    <el-table :data="propValList" :model="propId" v-loading="loading" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column width="80px" align="center" label="显示次序">
        <template slot-scope="scope">
          <el-input class="edit-input" size="small" v-model="scope.row.showId" @change="updatePropVal(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="规格值">
        <template slot-scope="scope">
          <el-input class="edit-input" size="small" v-model="scope.row.value" @change="updatePropVal(scope.row)"></el-input>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="价格">
        <template slot-scope="scope">
          <el-input class="edit-input" size="small" v-model="scope.row.price" @change="updatePropVal(scope.row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="会员价">
        <template slot-scope="scope">
          <span >{{scope.row.Mprices}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="附加计价">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isPricePar" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" @change="updateParRule(scope.row)" ></el-switch>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="附加计价参数">
        <template slot-scope="scope">
          <span >{{scope.row.parRule + (scope.row.parUnit !=''?'; 单位:'+scope.row.parUnit :'')}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="操作员">
        <template slot-scope="scope">
          <span >{{scope.row.opStaf}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="修改时间">
        <template slot-scope="scope">
          <span>{{scope.row.modifyDT | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="updateMprices(scope.row)" size="small" >修改会员价</el-button>
          <el-button type="danger" @click="deletePropVal(scope.row)" size="small" icon="el-icon-delete">删除</el-button>
           <el-button type="primary"  @click="showParRule(scope.row)"  >查看附加参数</el-button>
        </template>
      </el-table-column>
    </el-table>


      <el-card class="box-card">
      <el-form :inline="true" :rules="propValRules" ref="propValForm" :model="propValForm" label-position="right" label-width="80px">
    <el-row :span="24" style="margin-top: 20px" >

          <el-form-item label="显示次序" prop="showId">
            <el-input class="prop-input"   placeholder="输入显示次序" v-model="propValForm.showId"></el-input>
          </el-form-item>

          <el-form-item label="规格值" prop="value">
            <el-input class="prop-input"  v-model="propValForm.value" placeholder="输入规格值"></el-input>
          </el-form-item>

          <el-form-item label="价格" prop="price">
          <el-input class="prop-input"  v-model="propValForm.price"></el-input>
          </el-form-item>
          <el-form-item label="附加计价" prop="isPricePar">
                  <el-switch v-model="propValForm.isPricePar" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0" @change="showParRuleFrom()"></el-switch>
            </el-form-item>
          <el-form-item >
            <el-button type="primary" v-if="!showMprices" @click="addMprices()"  icon="el-icon-plus">添加会员价</el-button>
            <el-button type="primary" v-if="showMprices" @click="dialogMPropVisible = true"  >查看修改会员价</el-button>
           
          </el-form-item>
          <el-form-item >
            <el-button type="primary" @click="createPropVal(propValForm)"  icon="el-icon-plus">添加</el-button>
          </el-form-item>
        <!-- </el-col> -->
    </el-row>
    <!-- <el-row :span="24" style="margin-top:10px;" v-if="showMprices">
      <el-form-item v-for="(item, index) in propValForm.Mprices" :key="item.level" :label="item.level | displayNameFilter(memberLevelOptions)" prop="Mprices">
          <el-input placeholder="输入对应等级的价格" v-model.number="propValForm.Mprices[index].price" ></el-input>
      </el-form-item>
    </el-row> -->
      </el-form>
      </el-card>


  <div slot="footer" class="dialog-footer">
  </div>
  </el-dialog>

  <!-- 规格值列表结束 -->
  <!-- 会员价 -->
  <el-dialog title="规格会员价" :visible.sync="dialogMPropVisible">
    <el-form :rules="propValRules" ref="propValForm" :model="propValForm" label-position="right" label-width="80px">
      <el-form-item v-for="(item, index) in propValForm.Mprices" :key="item.level" :label="item.level | displayNameFilter(memberLevelOptions)" prop="Mprices">
          <el-input placeholder="输入对应等级的价格" v-model.number="propValForm.Mprices[index].price" ></el-input>
      </el-form-item>
      <el-button type="primary" @click="backToCareate()"  icon="el-icon-plus">确认修改</el-button>
    </el-form>
  </el-dialog>
  <el-dialog title="规格会员价" :visible.sync="dialogMPropVisible1">
    <el-form label-position="right" label-width="80px">
      <el-form-item v-for="(item, index) in MpricesOption.Mprices" :key="item.level" :label="item.level | displayNameFilter(memberLevelOptions)" >
          <el-input placeholder="输入对应等级的价格" v-model.number="MpricesOption.Mprices[index].price"></el-input>
      </el-form-item>
      <el-button type="primary" @click="updatePropV()"  icon="el-icon-plus">确认修改</el-button>
    </el-form>
  </el-dialog>
  <!-- 附加价 -->
  <el-dialog title="附加计价参数设置" :visible.sync="dialogParRuleVisible">
    <el-form  :model="ParRule" label-position="right" label-width="100px">
      <el-form-item label='最小值'>
          <el-input placeholder="输入最小值" v-model="ParRule.min"></el-input>
      </el-form-item>
      <el-form-item label='最大值'>
          <el-input placeholder="输入最大值" v-model="ParRule.max"></el-input>
      </el-form-item>
      <!-- <el-form-item label='是否支持小数'>
          <el-switch v-model="ParRule.isfraction" active-text="支持小数" inactive-text="支持整数" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item> -->
      <el-form-item label='支持类型'>
          <!-- <el-switch v-model="ParRule.isfraction" active-text="模拟空值" inactive-text="不是空值" :active-value="2" :inactive-value="0"></el-switch> -->

      <el-select clearable v-model="ParRule.isfraction" placeholder="支持类型">
				<el-option label="支持整数" value="0"></el-option>
				<el-option label="支持小数" value="1"></el-option>
				<el-option label="模拟空值" value="2"></el-option>
			</el-select>
      </el-form-item>
      <el-form-item label='单位'>
          <el-input placeholder="输入单位" v-model="parUnit"></el-input>
      </el-form-item>
      <el-button type="success" @click="dialogParRuleVisible=false">确认和返回</el-button>
      <el-button v-if="isShow" type="danger" @click="updatePropVParRule()">修改附加参数</el-button>
    </el-form>
  </el-dialog>

</div>
</template>

<script>
import {
  fetchProductPropList,
  createProductProp,
  updateProductProp,
  deleteProductProp
} from "@/api/product";
import {
  fetchProductPropVList,
  createProductPropV,
  updateProductPropV,
  deleteProductPropV
} from "@/api/product";
import { Tools } from "@/views/utils/Tools";
import { parseTime } from "@/utils";
import { dict } from "@/store";

export default {
  props: {
    type: {
      type: String,
      default: "prop"
    }
  },
  data() {
    const mapPropForm = propForm => {
      propForm.originalShowId = propForm.showId;
      propForm.originalName = propForm.name;
      return propForm;
    };
    const showPropValList = prop => {
      fetchProductPropVList(prop.id).then(response => {
        this.propValList = response.data.list
      })
      // this.propValList = prop.valueA;
      this.propId = prop.id;
      this.propValForm.pPid = prop.id;
      this.propValForm.showId = undefined;
      this.propValForm.value = undefined;
      this.propValForm.price = undefined;
      this.propValForm.Mprices = [];
      this.dialogPropValVisible = true;
      this.showMprices = false;
    };
    return {
      list: null,
      productId: this.$route.params.id,
      sid: this.$route.params.sid,
      updatePost: {
        sid: undefined,
        pid: undefined,
        id: undefined,
        showId: undefined,
        name: undefined
      },
      dialogPropVisible: false,
      propForm: {
        sid: undefined,
        pid: undefined,
        showId: undefined,
        name: undefined
      },
      mapPropForm,
      propRules: {
        showId: [
          { required: true, message: "显示次序必填", trigger: "change" }
        ],
        name: [{ required: true, message: "规格名字必填", trigger: "change" }]
      },

      dialogPropValVisible: false,
      propValForm: {
        pPid: undefined,
        showId: undefined,
        value: undefined,
        price: undefined,
        Mprices: undefined,
        isPricePar: undefined,
        parRule:undefined
      },
      propValRules: {
        value: [{ required: true, message: "规格值必填", trigger: "change" }]
      },
      propValList: undefined, // 当前规格值列表
      propId: undefined, // 当前规格id
      showPropValList,

      listQuery: {
        page: 1,
        limit: 5,
        type: this.type,
        sort: "+id"
      },
      loading: false,
      memberLevelOptions: [],
      showMprices: false,
      dialogMPropVisible: false,
      dialogMPropVisible1: false,
      MpricesOption: [],
      updateStr: {},
      ppid:undefined,
      dialogParRuleVisible:false,
      dialogParRuleVisible1:false,
      ParRule:{
        min:'',
        max:'',
        isfraction:0
      },
      parUnit:'',
      nowPProv:[],
      isShow:false
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    dict("cLevel").then(response => {
      this.memberLevelOptions = response;
    });
  },
  methods: {
    showParRuleFrom(){
      this.isShow = false
      if(this.propValForm.isPricePar ==1 ){
        // if(propValForm.parRule == undefined){
          this.resetParRule()
          this.dialogParRuleVisible = true
        // }else{

        // }
      }
    },
    showParRule(data){
      // console.log(data)
      this.isShow = true
      this.ppid = data.ppid
      this.nowPProv = data
        this.parUnit = data.parUnit
      if(data.parRule ==''|| data.parRule ==null){
        this.resetParRule()
        this.dialogParRuleVisible = true
      }else{
        const temp =  data.parRule.split(':')
        this.ParRule.min = temp[0]
        this.ParRule.max = temp[1]
        this.ParRule.isfraction = temp[2]
        this.dialogParRuleVisible = true
        }
         
    },
    updatePropVParRule(){
      if(this.ParRule.isfraction == 2){
        this.nowPProv.parRule = '0:0:2'
      }else{
        this.nowPProv.parRule = this.ParRule.min+':'+this.ParRule.max+':'+this.ParRule.isfraction
      }
      this.nowPProv.parUnit = this.parUnit
      console.log(this.nowPProv)
      this.updatePropVal(this.nowPProv)
       for (const v of this.propValList) {
            if (v.id === this.nowPProv.id) {
              const index = this.propValList.indexOf(v)
              this.propValList.splice(index, 1, this.nowPProv)
              // fetchProductPropVList(this.ppid).then(response => {
              //   const items = response.data.list;
              //   this.propValList = items;
              // });
              break
            }
          }
      
      this.dialogParRuleVisible = false
    },
    getList() {
      this.loading = true;
      this.$emit("create"); // for test
      fetchProductPropList(this.productId).then(response => {
        const items = response.data.list;
        this.list = items.map(v => {
          this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
          v = this.mapPropForm(v);
          return v;
        });
        this.loading = false;
      });
    },
    resetParRule() {
      this.ParRule = {
        min:'',
        max:'',
        isfraction:'0'
      };
      this.parUnit = ''
    },
    reset() {
      this.propValForm = {
        pPid: undefined,
        showId: undefined,
        value: undefined,
        price: undefined,
        Mprices: undefined,
        parRule:undefined
      };
    },
    cancelEdit(row) {
      row.name = row.originalName;
      row.showId = row.originalShowId;
      row.edit = false;
      this.$message({
        message: "已经恢复上一次编辑",
        type: "warning"
      });
    },
    confirmEdit(row) {
      row.edit = false;
      this.updatePost.showId = row.showId;
      this.updatePost.name = row.name;
      this.updatePost.id = row.id;
      this.updatePost.pid = this.productId;
      this.updatePost.sid = this.sid;
      updateProductProp(this.updatePost)
        .then(response => {
          // this.getList()
          row.originalShowId = row.showId;
          row.originalName = row.name;
          this.$message({
            message: "已经成功修改",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: "修改失败",
            type: "error"
          });
          console.log(err);
        });
    },
    confirmPropForm(row) {
      this.$refs["propForm"].validate(valid => {
        if (valid) {
          this.propForm.sid = this.sid;
          this.propForm.pid = this.productId;
          createProductProp(this.propForm).then(() => {
            // const propForm = this.mapPropForm(this.propForm)
            // this.list.unshift(propForm)
            this.getList();
            this.dialogPropVisible = false;
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        }
      });
    },
    showPropValues(row) {},
    deleteProp(row) {
      deleteProductProp(row.id).then(() => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
        // this.getList()
        const index = this.list.indexOf(row);
        this.list.splice(index, 1);
      });
    },
    deletePropVal(row) {
      deleteProductPropV(row.id).then(() => {
        this.$notify({
          title: "成功",
          message: "删除规格值成功",
          type: "success",
          duration: 2000
        });
        // this.getList()
        const index = this.propValList.indexOf(row);
        this.propValList.splice(index, 1);
      });
    },
    updatePropVal(row) {
      updateProductPropV(row)
        .then(response => {
          this.$message({
            message: "已经成功修改",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: "修改失败",
            type: "error"
          });
          console.log(err);
        });

    },
    updateParRule(row) {
      this.isShow = true
      if(row.isPricePar == 1){
        this.nowPProv = Object.assign({},row);
        this.ppid = this.nowPProv.ppid
      this.resetParRule()
        this.dialogParRuleVisible = true
      }else{
        row.parRule =''
        this.parUnit = ''
      }
      row.parUnit = this.parUnit
      updateProductPropV(row)
        .then(response => {
          this.$message({
            message: "已经成功修改",
            type: "success"
          });
        })
        .catch(err => {
          this.$message({
            message: "修改失败",
            type: "error"
          });
          console.log(err);
        });

    },
    createPropVal(propValForm) {
      this.$refs["propValForm"].validate(valid => {
        if (valid) {
          const temp = Object.assign({}, propValForm)
          if (temp.Mprices) {
            temp.Mprices = temp.Mprices.filter(
              i => i.price > 0
            ).map(v => {
              return [v.level, v.price].join(":");
            });
            temp.Mprices = temp.Mprices.join(",");
          }
          if(temp.isPricePar==1){
            if(this.ParRule.isfraction == 2){
              temp.parRule = '0:0:2';
            }else{

              temp.parRule = this.ParRule.min+':'+this.ParRule.max+':'+this.ParRule.isfraction
            }
            temp.parUnit = this.parUnit
          }
          createProductPropV(temp).then(() => {
            // this.dialogPropValVisible = false
            fetchProductPropVList(propValForm.pPid).then(response => {
              const items = response.data.list;
              this.propValList = items;
              this.showMprices = false
              this.propValForm.isPricePar = 0 //初始化
              // this.reset();
              this.$notify({
                title: "成功",
                message: "添加规格值成功",
                type: "success",
                duration: 2000
              });
            });
          });
        }
      });
    },
    addMprices() {
      this.dialogMPropVisible = true;
        this.propValForm.Mprices = this.memberLevelOptions.map(item => {
          return { level: item.id, price: 0 };
      });
    },
    updateMprices(row) {
      this.ppid = row.ppid
      this.MpricesOption = []
      this.MpricesOption = Object.assign({}, row);
      if (this.MpricesOption.Mprices === null) {
        this.MpricesOption.Mprices = this.memberLevelOptions.map(item => {
          return { level: item.id, price: 0 };
        });
      } else {
        this.MpricesOption.Mprices = this.MpricesOption.Mprices.split(",").map(
          item => {
            let { 0: level, 1: price } = item.split(":");
            level = parseInt(level);
            price = parseFloat(price);
            return { level, price };
          }
        );
        this.MpricesOption.Mprices = this.memberLevelOptions.map(item => {
          const finded = this.MpricesOption.Mprices.find(v => {
            return v.level === item.id;
          });
          const price = finded ? finded.price : 0;
          return { level: item.id, price: price };
        });
      }
      // this.showMprices = true
      this.dialogMPropVisible1 = true;
    },
    updatePropV() {
      // console.log(this.MpricesOption);
      this.dialogMPropVisible1 = false;
      this.MpricesOption.Mprices = this.MpricesOption.Mprices.filter(
        i => i.price > 0
      ).map(v => {
        return [v.level, v.price].join(":");
      });
      this.MpricesOption.Mprices = this.MpricesOption.Mprices.join(",");

      updateProductPropV(this.MpricesOption).then(response => {
        fetchProductPropVList(this.ppid).then(response => {
              const items = response.data.list;
              this.propValList = items;
              this.showMprices = false

              this.$message({
                message: response.msg,
                type: response.code === 200 ? "success" : "denger"
              });
          });
      });
    },
    backToCareate() {
      this.showMprices = true;
      this.dialogMPropVisible = false;
    }
  }
};
</script>

<style scoped>
/* .edit-input {
padding-right: 100px;
} */

.prop-input {
  width: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
