<template>
    <div class="centre-content">
        <el-card shadow="always" class="headCentre">
        <div class="userInfo">
            <span>{{this.$store.getters.session.name}}</span><span>个人中心</span>
        </div>
        </el-card>

        <div  class="contetnCentre">
        <van-cell-group>
            <van-cell title="修改密码"  is-link @click="changePasswrod()"/>
            <!-- <hr> -->
            <van-cell title="退出登录"  is-link @click="hanleLogout()"/>
            <!-- <hr> -->
        </van-cell-group>
        </div>
        <div  class="footerCentre">
        <div class="backHome" @click="BackHome()">
            <span>返回主页</span>
        </div>
        </div>
      <change-password :passwordVisible.sync="passwordDialogVisible"></change-password>

        <van-dialog v-model="dialogVisible" show-cancel-button title="注销"
              message="你确定要退出登录吗？"
              @confirm="logout"/>
      <!-- <div class="chooes">
          <el-dialog :title="textMap[prompt]" :visible="dialogVisible" :show-close="false">
              <div>{{message}}</div>
              <span slot="footer" class="dialog-footer">
                  <el-button class="cancelButton" @click="dialogVisible = false">取消</el-button>
                  <el-button class="submitButton" v-if="prompt == 'logout'" @click="logout()"> 退出登录 </el-button>
              </span>
          </el-dialog>
      </div> -->
    </div>
</template>
<script>

    import ChangePassword from '@/components/User/MchangePassword'
    export default {
    name : 'user-centre',
    data(){
        return {
            dialogVisible:false,
            passwordDialogVisible:false,
            textMap:{
                logout:"退出登录"
            },
            prompt:undefined,
            message:'',
        }
    },
    created(){

    },
    components:{
        ChangePassword
    },
    methods:{
        hanleLogout(){
            // this.prompt = 'logout'
            // this.message = '你确定要退出登录吗？'
            this.dialogVisible = true
        },
        logout(){
            this.$store.dispatch('FedLogOut')
            this.$router.push({path:'/mobile/login'})
        },
        changePasswrod(){
            this.passwordDialogVisible = true
            // this.$router.push({path:'/mobile/userCentre/changePassword'})
        },
        BackHome(){
            this.$router.push({path:'/mobile/dashboard'})
        },
    },

    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .centre-content{
      flex:1;
      height: 100%;
      .headCentre{
          margin: 20px;
          min-height:150px;
          text-align: center;
            background-image: url('/static/img/banner.a85f970.jpg');
            background-size:cover; 
          .userInfo{
            margin-top: 1rem;
            text-align: center;
          }
      }
      .contetnCentre{
          margin: 20px;
          height: 100%;
      }
      .footerCentre{
          bottom: 0;
          text-align: center;
          position: fixed;
          width: 100%;
          margin-bottom: 50px;

          .backHome{
            font-size: 1rem;
              background:green;
              color: aliceblue;
              min-height: 2rem;
              padding-top: 0.5rem;
          }
      }

  }
</style>
