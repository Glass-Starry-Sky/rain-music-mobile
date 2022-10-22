<template>
     <div ref="avatarContainer" class="avatar-container" >
        <div class="avatar-box">
            <img ref="avatar" class="avatar" :src="avatarUrl" alt="" @click="avatarMove">
        </div>
     </div>
     <div class="main-cantainer">
            <div class="count-card">
                <div class="username">{{username}}</div>
                <div class="count">
                    <div>
                    <span><img src="" alt="">关注</span>
                    <span>10</span>
                    </div>
                    <div>
                        <span><img src="" alt="">粉丝</span>
                        <span>10</span>
                    </div>
                    <div>
                        <span><img src="" alt="">等级</span>
                        <span>Lv 7</span>
                    </div>
                </div>                         
            </div>
            <div class="info-card">
                <div style="width:100%;height:30px;border-bottom: 1px solid #777;"> 
                    <span style="font-size: 17px;font-weight: 600; float: left;">个人信息</span>
                </div>
                <div>
                    <span>注册:</span>
                    <span>2022年08月</span>
                </div>
                <div>
                    <span>性别:</span>
                    <span>男</span>
                </div>
                <div>
                    <span>电话:</span>
                    <span>13356167360</span>
                </div>
                <div>
                    <span>地区:</span>
                    <span>浙江 温州</span>
                </div>
            </div>
            <MySongSheet></MySongSheet>
            <div class="bottom-background" style="height:1px;background-color: #ececec;"></div>
            <!-- <div class="bottom-null" style=""></div> -->
     </div>     
</template>
<script>
    import { getCurrentInstance, reactive,ref,onBeforeMount, computed } from 'vue'
    import { useStore } from 'vuex'

    import MySongSheet from '../songSheetView/mySongSheet/MySongSheet'
export default {
    components:{
        MySongSheet
    },
   setup() {
    const store=useStore()
    //使用全局axios
    const { proxy } = getCurrentInstance()

    const avatarUrl=computed(()=>store.state.forMyView.info.avatarUrl)
    const username=computed(()=>store.state.forMyView.info.username)

    onBeforeMount(()=>{
        // console.log(username.value,avatarUrl.value);
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
    
    })
   
    
    const avatar=ref(null)
    const avatarContainer=ref(null)

    let clickCount=0
    const avatarMove=()=>{
        clickCount++
        let containerWidth=window.screen.width
        let containerHeight=window.screen.height*0.2     
        let randomNumberX=null
        let randomNumberY=null
   
        if(clickCount===5){
            randomNumberX=0
            randomNumberY=0
            clickCount=0
        }else{
            randomNumberX=Math.floor(Math.random()*containerWidth-containerWidth/2)
            randomNumberY=Math.floor(Math.random()*containerHeight-containerHeight/2)
            
            //提高用户体验 ，防止超出屏幕
            if((randomNumberX>0&&randomNumberX<20)||randomNumberX<(-containerWidth/2+30)){
                randomNumberX+=25
            }else if((randomNumberX<0&&randomNumberX>-20)||randomNumberX>(containerWidth/2-30) ){
                randomNumberX-=25
            }
            if((randomNumberY>0&&randomNumberY<20)||randomNumberY<(-containerHeight/2+30)){
                randomNumberY+=25
            }else if((randomNumberY<0&&randomNumberY>-20)||randomNumberY>(containerHeight/2-30)){
                randomNumberY-=25
            }
        }
       

        avatar.value.style=`transform: translate(${randomNumberX}px,${randomNumberY}px);`
    }
      return {
        avatarUrl,
        avatar,avatarMove,avatarContainer,
        username
      }
   },
}
</script>
<style scoped lang='less'>
    .avatar-container{
        display: flex;
        width: 100vw;
        height: 20vh;
        background: linear-gradient(to left,#c6c1b0,#4116ef)!important;
        .avatar-box{
            height: 100%;
            display: flex;
            margin:0 auto;
            .avatar{
                width: 50px;
                height: 50px;
                border-radius: 50px;
                border: 1px solid #4117aa;
                box-shadow: -5px -5px 10px #d5cdbc , 5px 5px 10px #4116ef;
                transition: all 0.5s;
                margin:auto 0;
            }
        }     
    }
    .main-cantainer{
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 0 15px;
        width:100vw;
        height:100%;
        background-color: #ececec;
        box-sizing: border-box;
        margin-bottom:90px;
        &>:nth-child(n+2){
            margin-top:15px;
        }
        .count-card{
            display: flex;
            flex-direction: column;
            align-items: center;
            position: absolute;
            top:-1%;
            left:0%;
            box-sizing: border-box;
            width:92%;
            margin:0 15px;
            height: 200px;
            border-radius: 10px;
            background-color: white;
            // box-sizing: border-box;
            .username{
                height:60px;
                line-height: 60px;
            }
            .count{
                
                display: flex;
                width: 100%;
                height: 80px;
                align-items: center;
                // justify-content: space-around;
                &>div{                 
                    display: flex;
                    flex:1;
                    flex-direction: column;
                }
                
                
            }
        }
        .info-card{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: space-around;
            margin-top:200px;
            padding: 10px 15px 10px;
            box-sizing: border-box;
     
            width: 100%;
            height: 220px;
            border-radius: 10px;
            background-color: white;
            &>div:nth-child(n+2)>span{
                    color:#777;
                    font-size: 15px;
            }
            &>div:nth-child(n+2)>span:nth-child(2){
                    margin-left:12px;
            }
        }
    }
</style>
