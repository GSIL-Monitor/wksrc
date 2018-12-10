<template>
    <div class="password-container">
        <div>
        <el-dialog title="修改密码" :visible.sync="dialogFromVisible"  :before-close="handleClose">
            <el-form :model="FromData" status-icon :rules="rules2" ref="FromData" label-position="left" label-width="30%" class="demo-ruleForm">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password"  v-model="FromData.oldPassword" autocomplete="off"></el-input>
            <span v-if="showError" style="color:red;">{{ErrorMsg}}</span>
            </el-form-item>
            <el-form-item label="修改密码" prop="password">
                <el-input type="password"  v-model="FromData.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="FromData.checkPass" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button  class="MessageConfirm" @click="submitForm('FromData')">确认修改</el-button>
                <el-button class="MessageCancel" @click="resetForm('FromData')"> 取 消 </el-button>
        </span>
        </el-dialog>
    </div>
    </div>
</template>
<script>
    import { ChangePasswrod} from '@/api/user'

    export default {
        name:'change-password',
        
        data(){
            var validatePass = (rule, value, callback) => {
                console.log(this.$store.getters.session.user_type)
                if (value === '') {
                callback(new Error('请输入密码'));
                } else if(value.length<6){
                    callback(new Error('密码长度不能小于6位'));
                } else {
                if (this.FromData.checkPass !== '') {
                    this.$refs.FromData.validateField('checkPass');
                }
                callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请再次输入密码'));
                } else if (value !== this.FromData.password) {
                callback(new Error('两次输入密码不一致!'));
                } else {
                callback();
                }
            };
            return {
                dialogFromVisible:true,
                showError:false,
                ErrorMsg:'',
                FromData:{
                    oldPassword:'',
                    password:'',
                    checkPass:'',
                },
                rules2: {
                    oldPassword: [
                        { required:true}
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    checkPass: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                },

            }
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.$store.getters.session.user_type == 1){
                            ChangePasswrod({id:this.$store.getters.session.id,oldPassword:this.FromData.oldPassword,password:this.FromData.password}).then(response => {
                                if(response.msg ==='修改密码成功'){
                                this.resetForm()
                                 this.$notify({
                                     title:'修改密码',
                                     message:response.msg,
                                     type:'success'
                                 })
                                }else{
                                    if(response.msg.oldPassword ==undefined){
                                        this.ErrorMsg = '密码格式不对'
                                    }else{
                                        this.ErrorMsg = '原密码错误'
                                    }
                                 this.showError = true
                             }
                            // this.resetForm()
                        }) 
                    }else{

                    }
                } else {
                    console.log('修改失败');
                    return false;
                }
                });
            },
            resetForm() {
                this.dialogFromVisible = false
                this.$router.back(-1);
                // this.$refs[formName].resetFields();
            },
            handleClose(){
                // done();
                this.$router.back(-1);
            }
        }
        
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .MessageCancel  {
    background:#fff;
    width:42%;
    font-size:1rem;
    min-height:2.3rem;
    color :green;
    border-color:#67c23a;
}
.MessageConfirm {
    background:#fff;
    width:42%;
    font-size:1rem;
    min-height:2.3rem;
    color :red;
    border-color:red;
    margin-right: 1rem;
    margin-bottom: 40px
}
</style>