<template>
    <div class="password-container">
        <div>
        <van-dialog v-model="passwordVisible" show-cancel-button title="修改密码"  :before-close="handleClose">
        <!-- <van-dialog v-model="passwordVisible" show-cancel-button title="修改密码" @confirm="submitForm" :before-close="handleClose"> -->
        <van-field  v-model="FromData.oldPassword"  type="password" label="旧密码"  placeholder="请输入旧密码" required :error-message="oldmsg" @focus="restText"/>
        <van-field  v-model="FromData.password"  type="password" label="新密码"  placeholder="输入新密码"  required :error-message="newmsg" @focus="restText"/>
        <van-field  v-model="FromData.checkPass"  type="password" label="再次输入"  placeholder="确认密码"  required :error-message="checkmsg" @focus="restText"/>
        </van-dialog>
    </div>
    </div>
</template>
<script>
    import { ChangePasswrod} from '@/api/user'

    export default {
        name:'mchange-password',
        props:{
            passwordVisible: {
              type: Boolean,
              default: false
            }
        },
        data(){
         
            return {
                oldmsg:'',
                newmsg:'',
                checkmsg:'',
                FromData:{
                    oldPassword:'',
                    password:'',
                    checkPass:'',
                },
            }
        },
        methods:{
            checkpsw(value){
                if (value === '') {
               return '请输入密码';
                } else if(value.length<6){
                   return '密码长度不能小于6位';
                } 
                return true
            },
            checkag(value){
                if (value === '') {
               return '请输入密码';
                } else if(value != this.FromData.password){
                    return '两次输入密码不一致'
                }
                return true
            },
            restText(){
                this.oldmsg=''
                this.newmsg=''
                this.checkmsg=''
            },
            restFromt(){
                this.FromData={
                    oldPassword:'',
                    password:'',
                    checkPass:'',
                }
            },
            check(){
                if(this.checkpsw(this.FromData.oldPassword)=== true){
                    if(this.checkpsw(this.FromData.password)=== true){
                        if(this.checkag(this.FromData.checkPass)=== true){
                            return true
                        }else{
                            this.checkmsg = this.checkag(this.FromData.checkPass)
                        }
                    }else{
                        this.newmsg = this.checkpsw(this.FromData.password)
                    }
                }else{
                    this.oldmsg = this.checkpsw(this.FromData.oldPassword)
                }
            },

            handleClose(action, done) {
            if (action === 'confirm') {
                console.log(this.check())
                if(this.check() === true){
                    ChangePasswrod({id:this.$store.getters.session.id,oldPassword:this.FromData.oldPassword,password:this.FromData.password}).then(response => {
                                if(response.msg ==='修改密码成功'){
                                this.$emit('update:passwordVisible', !this.passwordVisible)
                                done();
                                 this.$notify({
                                     title:'修改密码',
                                     message:response.msg,
                                     type:'success'
                                 })
                                }else{
                                    if(response.msg.oldPassword ==undefined){
                                        this.newmsg = '密码格式不对'
                                    }else{
                                        this.oldmsg = '原密码错误'
                                    }
                             }
                        })
                }else{
                    done(false) 
                }
            } else {
                this.$emit('update:passwordVisible', !this.passwordVisible)
                done();
            }
            },
            handleClose1(){

                this.$emit('update:passwordVisible', !this.passwordVisible)
                // this.passwordVisible = false
                // this.$router.back(-1);
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