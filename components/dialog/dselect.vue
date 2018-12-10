<template>
  <div class="dialog-wrapper" >
    <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
             <div  v-for="item in Options" style="margin-top: 10px">
               <el-radio v-model="id" :label="item.id"  @change="handleClose"><span style="font-size:20px;">{{ item.name }}</span></el-radio>
             </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'dialog-select',
    props: {
      Options: {
        type: Array,
        default: []
      },
    },
//     computed: {
//     imageUrl: {
//       // return this.value
//     get:function(){
//       return this.path
//     },
//     set:function (newvalue) {
//       this.path =newvalue
//     }
//     }
    
//   },
    data(){
        return {
            dialogVisible:true,
            id:undefined,
            idStr:undefined
        }
    },
    methods:{
    handleClose(){
      this.dialogVisible = false
      // this.idStr = this.displayNameFilter(this.id, this.Options)
      this.$emit('get-info',$this.id)
    },
     handleOpen(){
      this.dialogVisible = true
    },
    displayNameFilter(id, options) {
      		const finded = options.find((option) => option.id === id)
      		if (finded) {
        		return finded.name
      			} else {
        			console.log(id)
      			}
    	},
    }
  }
</script>

<style lang="stylus" scoped>

</style>
