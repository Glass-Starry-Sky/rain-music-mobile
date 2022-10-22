<template>
    <div class="login-area">
        <!-- <div @click="youkeLogin" class="youke">点我游客登录</div> -->
        <!-- <div @click="test" class="">登录状态</div> -->
        <div class="glass"></div>
    
        <!-- <div class="title" style="z-index:1;">雨音乐</div> -->
        <img src="@/assets/images/title2.png" class="title" alt="">
    

        <div class="login">
            <div class="login-title">登 录</div>
            <div>
                <input type="text" v-model="phoneNumber" placeholder="输入您的手机号" ref="input">
    
            </div>
            <div>
                <div class="code-box">
                    <input type="text" placeholder="输入您的验证码" ref="input" >
                    <!--   -->
                    <transition name="message" mode="out-in">

                        <div v-if="isShow" @click.stop="messageLogin" class="message" @click="isShow = !isShow;">发送短信</div>        
                    </transition>


                </div>
                
                
                <div @click="check" class="check">确定</div>
            </div>
            <div class="backup">若登录失败，请点击下方按钮</div>
            <!-- loginState   testLogin-->
            <a @click="testLogin" class="test">测试账号登录</a>
            <!-- <a @click="logout" class="test">登出</a>
            <a @click="refreshLoginState" class="test">refreshLoginState</a>
            <a @click="codeVerify" class="test">codeVerify</a> -->
        </div>
       
        
    </div>   
</template>
<script>

import { getCurrentInstance,ref, watch } from 'vue'
import { useRouter  } from 'vue-router'
import 'vant/es/toast/style';
import { Toast } from 'vant';
export default {
   setup() {
    const $router=useRouter()
    //使用全局axios
    const { proxy } = getCurrentInstance()
    let isShow=ref(true)
    let input=ref(null)
    let phoneNumber=ref('')
        const youkeLogin=()=>{
     
            let cookie=''
            proxy.$http("/register/anonimous").then(res=>{
                    console.log('recommend->游客登录！',res.data)
                    cookie=res.data.cookie
                    localStorage.setItem('Authorization',cookie)
                    $router.replace({ path: '/' })    
             })
        }


        const  loginState=()=>{
            proxy.$http("/login/status").then(res=>{
                    console.log('登录状态',res.data)

            })
        }
        const refreshLoginState=()=>{
            proxy.$http("/login/refresh").then(res=>{
                    console.log('刷新登录状态',res.data)

            })   
        }
        //测试有没有登录
        const getAccountInfo=()=>{
            proxy.$http("/user/account").then(res=>{
                    console.log('账号信息：',res.data)

            })   
            
        }
        /**-------------------------------------------------------------
        *  退出登录
        --------------------------------------------------------------*/
        const logout=()=>{
            proxy.$http(`/logout`).then(res=>{
                console.log('退出登录',res.data)      
             },(err)=>{
                // Toast('登录失败');
            })

        }
        /**-------------------------------------------------------------
        *
        --------------------------------------------------------------*/
        const codeVerify=()=>{
            let captcha=input.value.value
            proxy.$http('/captcha/verify?phone=13356167360&captcha='+captcha).then(res=>{
                console.log('验证验证码是否正确',res.data)      
             },(err)=>{
                // Toast('登录失败');
            })

        }
        

        watch(isShow,(newVal,oldVal)=>{
            if(!newVal){
                setTimeout(()=>{
                    isShow.value=true
                },5000)
            }
        })

        /**-------------------------------------------------------------
        *   获取验证码
        --------------------------------------------------------------*/
        const  messageLogin=()=>{
            console.log(phoneNumber.value);
            if(phoneNumber.value.length==0){
                Toast('请先输入手机号');
                return;
            }
            if(phoneNumber.value.length!=11){
                Toast('手机号长度不匹配');
                return;
            }
  
            // let myphone='13356167360'

            Toast('验证码已发送,请耐心等待');  
            proxy.$http("/captcha/sent?phone="+phoneNumber.value).then(res=>{
                    console.log('验证码',res.data)     
                    if(res.data.code==400){
                        Toast(res.data.message);
                    }                          
            },(err)=>{
                Toast('不要频繁点击');
            })
            
        }
        //验证码登录
        const check=()=>{
            // console.log(input.value.value)
            let captcha=input.value.value

            if(phoneNumber.value.length!=11){
                Toast('手机号长度不匹配');
                return;
            }
            if(captcha.length==0){
                Toast('验证码不能为空');
                return;
            }
           
            console.log(captcha)
            proxy.$http("/login/cellphone?phone="+phoneNumber.value+"&captcha="+captcha).then(res=>{
                console.log('登录',res.data)     
                    let token=res.data.token
                    //3b8a9f3d8bd44649e24c0d0653ce35c020680d9d88dfe095746ed1ffab9a8edd993166e004087dd3524180c469c2a963523ee6e35a617f4aa142175968aa909afb271c7ca5ceb696a89fe7c55eac81f3
                    localStorage.setItem('Authorization',token)    
                    //查看登录状态
                    loginState()
                    $router.replace({ path: '/' })        
             },(err)=>{
                Toast('登录失败');
            })
        }
        /**-------------------------------------------------------------
        *   测试账号登录
        --------------------------------------------------------------*/
        const testLogin=()=>{
            let testToken='3b8a9f3d8bd44649e24c0d0653ce35c020680d9d88dfe095746ed1ffab9a8edd993166e004087dd3524180c469c2a963523ee6e35a617f4aa142175968aa909afb271c7ca5ceb696a89fe7c55eac81f3'
            localStorage.setItem('Authorization',testToken) 

            $router.replace({ path: '/' }) 
        }
      return {
        youkeLogin,messageLogin,check,
        input,
        isShow,
        phoneNumber,
        testLogin,loginState,logout,refreshLoginState,codeVerify,getAccountInfo
      }
   },
}
</script>
<style scoped lang='less'>
    .login-area{
        display: flex;
        padding-top: 15px;
        box-sizing: border-box;
        flex-direction: column;
        width: 100%;
        height:100vh;
        background: linear-gradient(to bottom,rgb(74, 148, 228),rgb(169, 208, 237));
        // background-image: url('@/assets/images/rain3.png') ;
        // background-repeat:no-repeat; 
        .youke{
            margin:auto auto;
        }
        .title{
            color: #eee;
            font-size: 25px;
            height:150px;
            width: 100%;
            z-index: 2;
        }
        .rain{
            display: inline;
            height: 50px;
            width: 100px;
            margin:0 auto;
            // z-index: -1;
            // position: fixed;
           
        }
        .glass{
            position: absolute;
            width: 100%;
            height:100vh;
            // height: 200px;
            // width: 200px;
            z-index: 0;
            /* background-color: rgba(157, 28, 28, 0.2); */
            margin:0 auto;
            /* backdrop-filter: blur(50px); */
        }
        .login{
            height: 60%;
            z-index: 1;
            display: flex;
            flex-direction: column;
            margin:auto 0;
            .login-title{
                color:#eee;
				width: 30%;
				margin:0 auto;
                /* box-shadow: 3px 3px 10px snow; */
				display: inline-block;
				border-bottom: 1px solid #eee;
                margin-bottom: 30px;
                font-size: 20px;
            }
            input{
                
                margin-bottom: 30px;
                border: none;
                outline: none;
                text-decoration: none;
 
                background: linear-gradient(to right,rgba(176, 211, 246, 0.7),rgb(67, 169, 247));
                color: rgb(235, 241, 252);
                border: 1px solid #eee;
                border-radius: 10px;
                height: 30px;
            }
            .check{
                flex:1;
                margin:0 auto;
                height: 30px;
                line-height: 30px ;
                width: 40%;
                color: #eee;
                border: 2px solid #eee;
                border-radius: 10px;
            }
            .code-box{
                display: inline-block;
                position: relative;
            }
            .message{
                position: absolute;
                top: 0%;
                left:69%;
                width: 30%;
                font-size: 14px;
                height: 32px;
                line-height: 30px;
                border-radius: 0 9px 9px 0;
                background-color: rgba(76, 170, 217,0.6);
                color: #eee;
                border: 1px solid transparent;
                // border-right: 2px solid #eee;
                border-left:1px solid #eee;
              
            }
            .backup{
                width: 55%;
                font-size: 13px;
                color:#ddd;
                margin-top:80px;
                margin-left:40%;
                margin-bottom:10px;
            }
            .test{
                width: 35%;
                color:#dbffe7;
                margin-left:50%;
                border-bottom: 1px solid #d4f1cd;
            }
        }
    }


    
  .message-enter-from,
  .message-leave-to {
    opacity: 0;
  }
  .message-enter-to, 
  .message-leave-from {
    opacity: 1; //这个其实是每个元素的默认值，因此可以省略
  }

  .message-enter-active,
  .message-leave-active {
    transition: opacity 2s ease;
  }

</style>
