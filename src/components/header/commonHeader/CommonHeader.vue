<template>
    <div class="header">
     
       <span class="iconfont icon-zhedie-zhankai open" >
            <div class="popup" @click="showPopup"></div>
           <van-popup v-model:show="show" position="left" 
           :style="{ width: '75%',height:'100%',backgroundColor:'#ececec' }" >
                    <div class="pop-header">                     
                        <div class="top-left">
                            <span><img class="avatar" :src="avatarUrl" alt=""></span>
                            <div @click="goToMyView">
                                <span style="margin-left:8px">{{username}}</span>
                                <span class="iconfont icon-youjiantou"></span>
                            </div>                      
                        </div>
                        <div class="scan iconfont icon-saoyisao" ></div>
                    </div>
                <div class="pop-container">
                    
                    <CommonCard :cardList="cardList.card1.content" :hasBorder="cardList.card1.hasBorder"></CommonCard>
                    <CommonCard :cardList="cardList.card2.content" :hasBorder="cardList.card2.hasBorder">
                        <template v-slot:title>
                            <div class="title">
                                {{cardList.card2.title}}
                            </div>
                        </template>
                    </CommonCard>
                    <CommonCard :cardList="cardList.card3.content" :hasBorder="cardList.card3.hasBorder">
                        <template v-slot:title>
                            <div class="title">
                                {{cardList.card3.title}}
                            </div>
                        </template>
                    </CommonCard>
                    <CommonCard :cardList="cardList.card4.content" :hasBorder="cardList.card4.hasBorder"></CommonCard>
                    <van-button type="default" class="quit" @click="quit">退出登录</van-button>
                </div>
                
            </van-popup>
       </span>
       <div class="middle">
            <slot name="middle"></slot>
       </div>
      
       <div class="right">
            <!-- 选择主题的下拉框 -->
            <van-popover v-model:show="showPopover" :actions="actions" >
                <div v-for="item,index in actions" :key="index" class="pifu-item" :data-text="item.text"
                @click="changeTheme" >
         
                    <!-- <div class="pifu-icon" :style="{'backgroundColor':item.color}"></div> -->
                    <div class="pifu-icon" :style="{'background': `linear-gradient(to top,${item.color},${item.textCol})`}"></div>
                    <div>{{item.text}}</div>
                </div>
                
                <template #reference>
                    <span class="iconfont icon-pifu pifu" ></span>
                </template>
            </van-popover>
            
           <slot name="right"></slot>
           <!-- <span class="iconfont icon-tinggeshiqu recogniseMusic"></span>  -->
       </div>

    </div>     
</template>
<script>

import '@/assets/fonts/header/iconfont.css'

import CommonCard from '@/components/commonCard/CommonCard';
import { onBeforeMount, ref,computed, getCurrentInstance, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import setTheme from '@/assets/js/setTheme'
import jsonCardList from '@/assets/json/commonHeaderCardList.json'

export default {
    components:{
        CommonCard
    },

  setup() {
        const store=useStore()
        const { proxy }=getCurrentInstance()
        const $router=useRouter()
        
        let showPopover = ref(false);

    /**-------------------------------------------------------------
    *  获取头像和用户名，和myView中一致
    --------------------------------------------------------------*/
    const avatarUrl=computed(()=>store.state.forMyView.info.avatarUrl)
    const username=computed(()=>store.state.forMyView.info.username)
        const actions = [
        { text: '天苍蓝', icon: 'more-o'  , color:'var(--theme-color-blue)',  textCol:'var(--theme-text-blue)'},
        { text: '树叶绿', icon: 'add-o'   , color:'var(--theme-color-green)', textCol:'var(--theme-text-green)'},
        { text: '樱色粉', icon: 'music-o' , color:'var(--theme-color-pink)',  textCol:'var(--theme-text-pink)'}
        
        ];

        //用json模拟接收的部分数据
        let cardList=jsonCardList
        

        // let cardList={
        //         card1:{
        //             hasBorder:true,
        //             content:[
        //             {label:'我的消息'},
        //             {label:'创作者中心'},        
        //             ]
        //         },          
        //         card2:{
        //             hasBorder:false,
        //             title:'其他',
        //             content: [
        //             {label:'设置'},
        //             {label:'夜间模式'},     
        //             {label:'定时关闭'},    
        //             {label:'个性装扮'},    
        //             ]
        //         },
        //         card3:{
        //             hasBorder:false,  
        //             title:'音乐服务',                 
        //             content: [
        //             {label:'听歌识曲'},
        //             {label:'音乐黑名单'},     
        //             {label:'歌手黑名单'},    
        //             {label:'音乐闹钟'},
        //             {label:'歌曲推荐'},  
        //             ]
        //         },
        //         card4:{
        //             hasBorder:false,                   
        //             content: [
        //             {label:'订单'},
        //             {label:'优惠券'},     
        //             {label:'个人信息与隐私保护'},    
        //             {label:'第三方权限'},
        //             {label:'关于'},  
        //             ]
        //         }
            
        // }
        
        /**-------------------------------------------------------------
        *   退出
        --------------------------------------------------------------*/
        const quit=()=>{
            //3b8a9f3d8bd44649e24c0d0653ce35c020680d9d88dfe095746ed1ffab9a8edd993166e004087dd3524180c469c2a963523ee6e35a617f4aa142175968aa909afb271c7ca5ceb696a89fe7c55eac81f3
            // localStorage.setItem('Authorization',null)
            
            proxy.$http(`/logout`).then(res=>{
                console.log('退出登录',res.data)    
                localStorage.removeItem('Authorization')  
             },(err)=>{
                // Toast('登录失败');
            })
            
            $router.replace({path:'login'})

        }

        /**-------------------------------------------------------------
        *   设置主题
        --------------------------------------------------------------*/
        const changeTheme=(e)=>{
            //具体查看src/assets/js/setTheme
            setTheme(e.currentTarget.dataset.text);      
            showPopover.value = false   
        }


       const show = ref(false);
       const showPopup = () => {
        //获取用户信息
        if(avatarUrl.value==''||username.value==''){
            try {
                proxy.$http("/user/account").then(res=>{
                //如果以后使用其他方式获取数据，修改要解构的值
                let {profile} =res.data
                console.log('my',res.data)
                let avatarUrl=null
                let username=null
                if(profile!=null){
                    avatarUrl=profile.avatarUrl
                    username=profile.nickname
                    store.commit("saveInfo",{avatarUrl,username})
                }else{
                    avatarUrl=require('@/assets/images/rain3.png')
                    username='时光棋'
                    store.commit("saveInfo",{avatarUrl,username})
                }
              
                },(err)=>{
                    let avatarUrl=require('@/assets/images/rain3.png')
                    let username='时光棋'
                    store.commit("saveInfo",{avatarUrl,username})
                })
            } catch (error) {
                    let avatarUrl=require('@/assets/images/rain3.png')
                    let username='时光棋'
                    store.commit("saveInfo",{avatarUrl,username})
            }
            
        }
       show.value = true;
       };
 
       const goToMyView=()=>{
            $router.push({path:'my'})
       }

    onMounted(()=>{     
        // console.log(username.value,avatarUrl.value); 
    })

     return {
       show,
       showPopup,
       cardList,
       avatarUrl,username,
       goToMyView,
       changeTheme,
       actions, showPopover,
       quit
     }
  },
}
</script>

<style scoped lang='less'>
   //注：引入less一定要在此处引入
   @import '@/assets/less/theme.less';


  
   .header{
       display: flex;
       justify-content: space-between;
       align-items: center;
       padding: 0 15px;
       padding-top: 15px;

       height: 10vh;
       box-sizing: border-box;
       width: 100vw;
       background-color: var(--theme-color);
       .right{
            display: flex;        
            height: 100%;  
            align-items: center;
            
       }
      
       .open{
            position: relative;
            font-weight: 500;
             margin-left:2px;
           .popup{
            position: absolute;
            top:0%;
            left:0%;
            
            width: 100%;
            height: 16.8px;
           }
       }
       
   }
   .pifu-item{
                display: flex;
                align-items: center;
                padding: 0 15px;
                box-sizing: border-box;
                width: 120px;
                height: 40px;
                .pifu-icon{
                    // flex:1;
                    height: 20px;
                    width: 20px;
                    margin-right:10px;
                }
            }
   .pop-header{
        display: flex;
        box-sizing: border-box;
        
        position: sticky;
        height: 75px;
        width:100%;
        top:0%;
        padding: 0 15px;
        padding-top: 32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        align-items: center;
        background-color: var(--theme-color);
        
        justify-content: space-between;
        .scan{
            display: flex;
            float:right;
            font-size: 20px;
           
        }
        .top-left{
            display: flex;
            align-items: center;
            .avatar{
                height: 35px;
                width: 35px;
                border-radius: 20px;
            }
        }
        
    }
   .pop-container{
    margin: 0 15px;
    height: 100%;
    // margin-top:50px;   //防止header挡住底下的内容  
    
    
    .title{
        display: flex;
        width: 100%;
        height: 30px;
        border-bottom: 0.5px solid #ddd;
        font-size: 13px;
        color: #888;
        align-items: center;
    }
    .quit{
        border-radius: 10px;
        width: 100%;
        margin-bottom: 20px;
        color:var(--theme-color);
    }
   }

   .icon-pifu{
    font-size: 17px;
    font-weight: 600;
   }
</style>
