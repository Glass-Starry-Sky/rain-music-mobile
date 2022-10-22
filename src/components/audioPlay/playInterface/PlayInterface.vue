<template>
     <div class="whole-interface">
        <img class="whole-interface-background" :src="audioPlayInfo.cover" alt="">
        <!-- <audio ref='audio' :src="audioPlayInfo.musicUrl"  :autoplay="autoPlay" loop class="myaudio" @play="playState"
                @pause="pauseState">                  
        </audio> -->
        <div class="set-blur">

            <!-- 头部 -->
            <div class="header">
            <span class="close iconfont icon-xiajiantou" @click="close" ></span>
            <div class="middle">
                <span class="songName">{{audioPlayInfo.audioSongName}}</span>
                <span class="artistsName">{{audioPlayInfo.audioArtistsName}}</span>
            </div>
            <!-- 进入歌单界面 -->
            <span class="right iconfont icon-musiclist" @click="gotoSongSheetView"></span>
            </div>

            <!-- album的主要内容 -->
            <div class="main">
                
                <div class="album">
                    <img ref="playbar" class="playbar" src="@/assets/images/playerbar.png" alt="">
                    <div class="album-circle-box">
                        <img class="album-circle" src="@/assets/images/singlecover.png" alt="">
                        <div ref="albumContentBox" class="album-content-box">
                            <img v-if="audioPlayInfo.cover" class="album-content keep_rotate_animation" :src="audioPlayInfo.cover" alt=""
                            :class="isPlaying?'allow_play_animation':''">
                        </div>
                    </div>         
                       
                            
                </div>
            </div>

            <!-- 底部按钮和进度条 -->
            <div class="bottom-button">
                <div class="set-button">
                    <!-- 喜欢  评论  收藏 -->
                    <span v-if="hasHeart" class="iconfont icon-aixin_shixin"></span>
                    <span v-else class="iconfont icon-like" @click="heart"></span>
                    
                    <span class="iconfont icon-comment"></span>
                    <span class="iconfont icon-changyong_shoucang" 
                        @click.stop="collectToSongSheet"></span>
                </div>
                
                <div class="progress-box">
                    <span class="progress-cur-time">{{currentTimeFormat}}</span>
                    <!-- 进度条 -->
                    <span class="progress">
                        <van-progress pivot-text=" " :show-pivot="true" color="#ffffff" 
                        :percentage="processNum" stroke-width="2px"
                        track-color="#cfa"/>
                    </span>
                    
                    <span class="progress-whole-time">{{wholeTimeFormat}}</span>
                </div>
                <div class="play-button">
                    <!-- 播放模式  上一首  播放or暂停  下一首  集合  -->
                    <span @click="changePlayMode" class="play-mode">
                        <span class="iconfont icon-ziyuan" v-if="playMode==1"></span>
                        <span class="iconfont icon-24gl-repeatOnce2" v-else-if="playMode==2"></span>
                        <span class="iconfont icon-suijibofang" v-else-if="playMode==3"></span>
                    </span>
                    

                    <span class="iconfont icon-shangyishoushangyige"
                        @click.stop="prev"></span>
                    <span>
                        <div class="circle">
                            <span @click="playControl" class="play-and-stop-icon iconfont"
                            :class="isPlaying?'icon-stop':'icon-playfill'"></span>
                        </div>                       
                    </span>                  
                    <span  class="iconfont icon-xiayigexiayishou"
                        @click.stop="next"></span>
                    <span  class="iconfont icon-list" @click="getCurPlayList"></span>
                </div>
            </div>
        </div>
        <CollectPopUp :show="collectShow"></CollectPopUp>
        <!-- v-if 直到跳出时才让其 onMounted -->
        <CurPlayListPopUp :show="curPlayListShow" v-if="curPlayListShow"> </CurPlayListPopUp>
        <!-- <PlayModeToast v-if="changePlayModeFlag==true"></PlayModeToast> -->
     </div>     
</template>
<script>
import { computed,onMounted,ref, watch,onBeforeUnmount } from '@vue/runtime-core'
  import {useStore} from 'vuex'
import { useRouter } from 'vue-router'
import CollectPopUp from '.././collectPopUp/CollectPopUp'
import CurPlayListPopUp from '../curPlayListPopUp/CurPlayListPopUp'

import {changeWholeTimeFormat,changeCurrentTimeToMinute} from '@/assets/js/playInterface/timeFormat.js'


// import PlayModeToast from './toast/PlayModeToast'
// import 'vant/es/toast/style';
// import { Toast } from 'vant';

export default {
    components:{
        CollectPopUp,
        CurPlayListPopUp,
        // PlayModeToast
    },
   setup() {
    const store=useStore()
    const $router=useRouter()
    const audioPlayInfo=computed(()=>store.state.forAudioPlay.audioPlayInfo)
    const autoPlay=computed(()=>store.state.forAudioPlay.autoPlay)
    const isPlaying=computed(()=>store.state.forAudioPlay.audioPlayInfo.isPlaying)
    const controlPlay=computed(()=>store.state.forAudioPlay.controlPlay)
    //---- 弹出框
    const collectShow = computed(()=>store.state.forAudioPlay.collectShow)
    const curPlayListShow = computed(()=>store.state.forAudioPlay.curPlayListShow)
    //---- 当前播放列表
    const currentSingleSongList=computed(()=>store.state.forSongSheet.currentSingleSongList)
    //----  播放模式
    const playMode=computed(()=>store.state.forAudioPlay.playMode)
    // let changePlayModeFlag=ref('')
    //---  总时长
 
    const duration= computed(()=>audioPlayInfo.value.duration)
    /**-------------------------------------------------------------
    *  按钮
    --------------------------------------------------------------*/

    //1.收藏
    const heart=()=>{
        console.log('heart');
         //数据格式 -> {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}  
        let obj={}
        obj.id= audioPlayInfo.value.id
        obj.musicUrl= audioPlayInfo.value.musicUrl
        obj.audioArtistsName= audioPlayInfo.value.audioArtistsName
        obj.audioSongName= audioPlayInfo.value.audioSongName
        obj.cover= audioPlayInfo.value.cover
        store.commit('addHeartSingleSongItem',obj)
        //改变爱心形状
        hasHeart.value=true   
    }
    /**-------------------------------------------------------------
    *   2.切换播放模式
    --------------------------------------------------------------*/
    const changePlayMode=()=>{

        //存储上一次的playMode
        // changePlayModeFlag.value=true
        store.commit('changePlayMode')
        

    }
    /**-------------------------------------------------------------
    *   3.上一首和下一首
    --------------------------------------------------------------*/
    function findMusicToPlay(callback){
        let singleSongItem=null
        currentSingleSongList.value.forEach((item,index)=>{
           if(item.id==audioPlayInfo.value.id){
                //找到当前播放的歌曲在currentSingleSongList的位置，则执行回调
                singleSongItem=callback(index,singleSongItem)              
           }
        })
        store.dispatch('changeAudioPlayCurMusicAction',singleSongItem)
    }
    const prev=()=>{
     
        findMusicToPlay((index,singleSongItem)=>{
            if(index==0){singleSongItem=currentSingleSongList.value[currentSingleSongList.value.length-1]}
            else { singleSongItem=currentSingleSongList.value[index-1] }  
            return singleSongItem
        })



    }
    const next=()=>{
        findMusicToPlay((index,singleSongItem)=>{
                //如果是最后一首，就播放第一首
                if(index==currentSingleSongList.value.length-1){singleSongItem=currentSingleSongList.value[0]}
                else { singleSongItem=currentSingleSongList.value[index+1] }  
                return singleSongItem
        })
 
    }



    /**-------------------------------------------------------------
    *   收藏到歌单
    --------------------------------------------------------------*/

    const collectToSongSheet=()=>{
        console.log('收藏！')          
        store.commit('saveCollectShow',true)
    }
    /**-------------------------------------------------------------
    *   打开当前播放
    --------------------------------------------------------------*/
    const getCurPlayList=()=>{
        console.log('当前播放！')          
        store.commit('saveCurPlayListShow',true)
    }



    /**-------------------------------------------------------------
    *   跳转到歌单界面
    --------------------------------------------------------------*/
    const gotoSongSheetView=()=>{
        store.commit('playInterfaceNotShow')
        $router.push({path:'songsheet'})
        
    }



    const close=()=>{
        // store.commit('playInterfaceNotShow')
        // //播放中，则继续播放
        // if(isPlaying.value){store.commit('allowToAutoPlay')}
        // else{store.commit('notAllowToAutoPlay')}
        // clearInterval(timer)

        //退出前再保存一次时间，防止出现时间差
        // store.commit('saveCurrentTime',audio.value.currentTime)
        // store.dispatch('saveDurationAndCurrentTimeToLocalAction',{duration:duration.value,currentTime:currentTime.value})
        // console.log('最后一次获取的时间点',currentTime.value);
     
        $router.back()
    }
    onBeforeUnmount(()=>{
        console.log('退出');
        store.commit('playInterfaceNotShow')
        //播放中，则继续播放
        if(isPlaying.value){store.commit('allowToAutoPlay')}
        else{store.commit('notAllowToAutoPlay')}
        clearInterval(timer)
    })

    let once=null
    let processNum=ref(0)
    const currentTime=computed(()=>store.state.forAudioPlay.audioPlayInfo.currentTime)
 
    

    /**-------------------------------------------------------------
    *   playbar位置设置
    --------------------------------------------------------------*/
    const playbarPositionSet=()=>{
        if(isPlaying.value){
            processControl()
            playbar.value.style='transform:rotate(0deg)'
        }else{
            playbar.value.style='transform:rotate(-30deg)'
        }
    }

    // watch(isPlaying,(newVal,oldVal)=>{
    //     playbarPositionSet()
    // })


    let hasHeart=ref(false)
    let heartSingleSonglist=computed(()=>store.state.forSongSheet.heartSingleSonglist)


    /**-------------------------------------------------------------
    *   主动拖动进度条
    --------------------------------------------------------------*/
    const dragProgress=(e)=>{

        let progressPivot=document.querySelector('.van-progress__pivot')
        let progress=document.querySelector('.van-progress')
        let progressPortion=document.querySelector('.van-progress__portion')
        //1.先暂停
        store.commit('controlPlayFalse')
        playbar.value.style='transform:rotate(-30deg)'
        clearInterval(timer)
        //2.获取距离     
            //进度条距离左侧的距离，(需要减去)
        let toLeftDistance=progress.offsetLeft
        let pivotRadius=4
        let wholeLength=progress.clientWidth
     
        //3.监听拖动事件
        let pageX=null
        let lastOffsetLeftForPivot=null
        let newCurrentTime=null
        let doing=false
        function jump(e){
            //当前点击的位置
            pageX=e.changedTouches[0].pageX

            lastOffsetLeftForPivot=pageX - toLeftDistance + pivotRadius
            //修改对应位置
            //到达最左侧了，不能再向左拖动
            if(lastOffsetLeftForPivot<=0){
                // console.log(1)
                progressPivot.style.left =  0+'px'
                progressPortion.style.width=0  +'px'
                currentTimeFormat.value='00:00'
                //最右侧
            }else if(lastOffsetLeftForPivot>=wholeLength){
                // console.log(2)
                progressPivot.style.left =  wholeLength +'px'
                progressPortion.style.width=wholeLength +'px'
                currentTimeFormat.value=changeCurrentTimeToMinute(duration.value)
            }else{
                // console.log(3)
                progressPivot.style.left =  lastOffsetLeftForPivot+'px'
                progressPortion.style.width=lastOffsetLeftForPivot  +'px'
                //实时计算时间
                let newProcessNum=lastOffsetLeftForPivot/wholeLength
                newCurrentTime=Math.floor(duration.value*newProcessNum)
 
                currentTimeFormat.value=changeCurrentTimeToMinute(newCurrentTime)
            }
           
            
        }
        function progressJump(e){
            //节流
            if(!doing){
                doing=true
                jump(e)
            }
            setTimeout(()=>{
                doing=false
            },50)              
        }
            progressPivot.addEventListener(('touchmove'),progressJump,false)  
            
            //结束拖动
            progressPivot.addEventListener(('touchend'),(e)=>{
                document.removeEventListener('touchmove',progressJump)
                //结束后跳转到对应的位置
                jump(e)
                store.commit('saveCurrentTime',newCurrentTime)   
                store.commit('triggerProgressDragEvent')   
            })
                        
    }
  



    /**-------------------------------------------------------------
    *   初始化
    --------------------------------------------------------------*/
    onMounted(()=>{
        //绑定拖动进度条事件  获取目标元素
        var progressPivot=document.querySelector('.van-progress__pivot')
        progressPivot.addEventListener('touchstart',dragProgress,false)



        //初始化时判断该歌曲是否已经收藏
        heartSingleSonglist.value.forEach((item)=>{
           if(item.hasOwnProperty('id')) {
                // console.log('item',item.id,audioPlayInfo.value.id);
                if(item.id==audioPlayInfo.value.id){
                    hasHeart.value=true
                    // console.log('item',hasHeart.value);
                }
           }            
        })


        //初始化时间
        if(currentTime.value){
            console.log('第一次获取到的当前时间-playInterface',currentTime.value);
          
            currentTimeFormat.value=changeCurrentTimeToMinute(currentTime.value)
            wholeTimeFormat.value=changeWholeTimeFormat(duration.value)
        }
        
        //初始化，防止audioPlay在刷新时显示
        store.commit('playInterfaceToShow')
        //初始化
        if(isPlaying.value){store.commit('controlPlayTrue');processControl()}
        else{store.commit('controlPlayFalse')}

        //初始化进度条
        // console.log('-->',currentTime.value,duration.value);
        once=(duration.value/100).toFixed(2)
        //百分比
        processNum.value=currentTime.value/once
        //如果在播放中,就打开进度条,并且控制playbar到打开的位置
        
        playbarPositionSet()

    })

    /**-------------------------------------------------------------
    *   播放控制
    --------------------------------------------------------------*/
    const playControl=()=>{
        //暂停
       
        
        if(controlPlay.value){

            store.commit('controlPlayFalse')
            
            playbarRotate()
            clearInterval(timer)
            // audio.value.pause()
        }else{

            store.commit('controlPlayTrue')
            playbarRotate()
            processControl()
            // audio.value.play()
        }
        
    }
    
    /**-------------------------------------------------------------
    *   控制进度条的变化
    --------------------------------------------------------------*/
     var timer=null
    const processControl=()=>{
            clearInterval(timer)
        
            timer=setInterval(()=>{
            //百分比
                processNum.value=currentTime.value/once
                currentTimeFormat.value=changeCurrentTimeToMinute(currentTime.value)
            },1000)
    }

    let playbar=ref(null)
    const playbarRotate=()=>{
        // console.log(playbar.value.style.transform);
        if(isPlaying.value)
            playbar.value.style='transform:rotate(-30deg)'
        else
            playbar.value.style='transform:rotate(0deg)'
    }

    


    /**-------------------------------------------------------------
    *   修改时间格式
    --------------------------------------------------------------*/
    let wholeTimeFormat=ref('00:00') 
    let currentTimeFormat=ref('00:00')
    watch(duration,()=>{
        wholeTimeFormat.value=changeWholeTimeFormat(duration.value)
    })




      return {
        store,audioPlayInfo,
        close,
        isPlaying,playControl,
        autoPlay,
        processNum,
        currentTimeFormat,wholeTimeFormat,
        playbar,
        heart,hasHeart,
        gotoSongSheetView,
        collectShow,collectToSongSheet,
        curPlayListShow,getCurPlayList,
        prev,next,
        playbarPositionSet,
        playMode,changePlayMode


      }
   },
}
</script>






<style scoped lang='less'>
    
    .whole-interface{
        // z-index: 50001;
        height: 100vh;
        width: 100vw;
        // background-image: linear-gradient(to right top, #65dfc9, #6cdbeb);
        // background-image: url('@/assets/images/songSheetDefaultPic.jpg');
        .whole-interface-background{
            position: absolute;
            top:0%;
            left:0%;
            height: 100%;
            width: 100%;
            z-index:0;
            // background-image: url('http://p1.music.126.net/EcjwMTK78KUhbyJ__znRzA==/109951165748602840.jpg');
            // background-position: top left;
            // background-size: 100% 100%;
        }
        
        .set-blur{
            height: 100%;
            width: 100%;
            background-color: rgba(50, 50, 50, 0.2);
            backdrop-filter: blur(50px);
            }
        .header{
            display: flex;
            align-items:center;
            height: 8%;
            padding-top: 20px;
            box-sizing: border-box;
            .icon-xiajiantou{
                font-size: 18px;
                font-weight: 300;
                color: white;
            }
            .icon-musiclist{
                font-size: 30px;
                font-weight: 300;
                color: white;
            }
            .close{
                flex:1;
            }
            .middle{
                display: flex;
                flex-direction: column;
                flex:5;
                .songName{
                    font-size: 16px;
                    color: rgb(253, 249, 249);
                }
                .artistsName{
                    font-size: 13px;
                    color: rgb(210, 205, 205);
                }
            }
            .right{
                flex:1;
            }
        }
        .main{
            // display: flex;
            position:relative;
            // flex-direction: column;
            // align-items: center;
            height:68%;
            width: 100%;

            
            .album{
                width:100%;
                height: 100%;

                .playbar{
                    position: absolute;
                    width:30%;
                    // height:35%;
                    top:2%;
                    left:0%;
                    // box-shadow: 0 5px 15px rgba(20, 20, 20, 0.8);
                    // transform: translateX(50%-10px);
                    margin-left:47%;

                    transform-origin:12px 11px; 
                    z-index:11;
                    transition: all 0.5s;
                    // transform: rotate(-20deg); /* IE 9 */
                }
                
                .album-circle-box{
                    width:100%;
                    .album-circle{
                        position: absolute;
                        top:42%;
                        left:50%;
                        transform: translate(-50%,-50%);
                        width:70%;
                        z-index:10;
                    }
               
                }
                .album-content-box{
                    position: absolute;
                    top:42%;
                    left:50%;
                    transform: translate(-50%,-50%);            
                    width:70%;           
                    z-index:9;    
                    
                    .album-content{
                        height:100%;
                        width: 70%;
                        border-radius: 500px;
                        transition: all 0.5s;
                        
                    }
                }
            }
         
        }



        .bottom-button{
            display:flex;
            flex-direction: column;
            padding:20px 0;
            box-sizing: border-box;
            justify-content: space-around;
            height:24%;
            .set-button{
                display:flex;
                padding: 0 15px;
                margin-bottom: 12px;
                box-sizing: border-box;
                &>span:nth-child(n){
                   flex:1;
                   margin:0px 30px; 
                   color: white;
                   font-size: 20px;
                }
            }
            .progress-box{
                display:flex;
                box-sizing: border-box;
                align-items: center;
                padding:0 15px;
                height:20px;
                .progress-cur-time{
                    font-size: 12px;
                    color: rgb(230, 230, 230);
                }
                .progress-whole-time{
                    font-size: 12px;
                    color: rgb(230, 230, 230);
                }
                .progress{
                    display: flex;
                    flex:1;
                    padding:0 10px;

                    .van-progress{
                    width: 100%;
                    height:100%;

                    :deep(.van-progress__pivot){
                        min-width: 1px;
                        min-height: 1px;
                        // color:red;
                        width:8px;
                        height: 8px;
                        padding:2px;
                        box-sizing:content-box;
                        // background-color: transparent!important;
                        // border: 4px solid rgba(255, 245, 245,0.1);
                        // border-color: transparent!important;
                    }
                }
                }
                
               
            }
            // 播放按钮
            .play-button{
                display:flex;
                padding: 0 15px;
                box-sizing: border-box;
                align-items: center;
                .play-mode{
                    color: white;
                    //循环
                    .icon-ziyuan{   
                        font-size: 16px;
                    }
                    .icon-24gl-repeatOnce2{
                        font-size: 25px;
                    }
                    //顺序
                    .icon-suijibofang{
                        font-size: 25px;
                    }
                }
                &>span:nth-child(n){
                // 控制可点击的范围
                   margin:0 10px;
                   padding:5px 0;
                   flex:1; 
                }
                &>.iconfont{
                    color: white;

                }
                .icon-list{
                    font-size: 20px;
                    font-weight: 500;
                }
                
                .icon-xiayigexiayishou,.icon-shangyishoushangyige{   
                    font-size: 20px;
                }
                .circle{
                    display: inline-block;
                    position: relative;
                    width: 40px;
                    height: 40px;
                    border: 2px solid white;
                    border-radius: 50px;
                    .play-and-stop-icon{
                        position: absolute;
                        font-size: 22px;
                        font-weight: 800;
                        color: white;
                        top:50%;
                        left:50%;
                        transform: translate(-50%,-50%);
                    }
                    .icon-stop{
                        font-size: 30px;             
                    }
                }
            }
        }
    }


/* 播放时，调用 */
.keep_rotate_animation{
    animation: keepMoving 12s linear 0s infinite normal backwards;
    // animation-play-state: paused;
    animation-play-state: paused;
}
.allow_play_animation{
    animation-play-state: running;
}

@keyframes keepMoving{
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }

}
</style>
