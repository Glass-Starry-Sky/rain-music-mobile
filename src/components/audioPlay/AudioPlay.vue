<template>
     <!-- 播放组件 -->
     <div class='container'>
        <div class="audio_control" @click="openPlayInterface">           
            <audio ref='audio' :src="musicUrl"  :autoplay="autoPlay"  class="myaudio" @play="playState"
                @pause="pauseState" @ended="musicEndState">                  
            </audio>
            <div class="left">
                <div class="album">
                    <div >
                        <img src="@/assets/images/singlecover.png" alt="" class="album-ring">
                        <img v-show="cover!=''" :src="cover" alt="" class="album-icon" ref="albumIcon">
                    </div>
                </div>
                
                <div class="song-name"> {{audioSongName}}</div>
                <div class="artists-name" ref="artistsName"></div>
            </div>           
            <div class="right">
                <div class="play-button" @click.stop="playControl">
                    <svg height="30" width="30" >
                        <!-- 底色圆  cx和cy用于定位-->
                        <!-- stroke-dasharray第二参数是表示一个点和下一个点的距离，设置足够大，只看到一个点就好-->
                        <circle cx="15" cy="15" r="15" fill="none" stroke-width="1" stroke="#ccc"></circle>
                        <circle class="process" ref="process"                   
                            cx="15" cy="15" r="15" fill="none" 
                            stroke-width="1" stroke="#222"
                            stroke-linecap="round"
                            stroke-dasharray="1,10000"
                            >                        
                        </circle>                  
                    </svg>
                    <div class="play-and-stop-icon iconfont"  font-size="20" fill="#555"
                    :class="isPlaying?'icon-stop':'icon-playfill'"></div>
                    
                </div>  
                <div class="iconfont collection icon-changyong_shoucang "  font-size="25" 
                 @click.stop="collectToSongSheet"   ></div>
                <CollectPopUp :show="show"></CollectPopUp>

            </div>

        </div>   
    </div>  

</template>
<script>
import { computed ,onMounted,onUpdated,ref,watch} from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import CollectPopUp from './collectPopUp/CollectPopUp'

import '@/assets/fonts//header/iconfont.css'


export default {
    components:{
        CollectPopUp
    },
   setup() {
        const store=useStore()
        const $router=useRouter()
        // let isPlaying=computed(()=>store.state.forAudioPlay.isPlaying)
        const isPlaying=computed(()=>store.state.forAudioPlay.audioPlayInfo.isPlaying)
        let autoPlay=computed(()=>store.state.forAudioPlay.autoPlay)
        let musicUrl=computed(()=>store.state.forAudioPlay.audioPlayInfo.musicUrl)
        let audioSongName=computed(()=>store.state.forAudioPlay.audioPlayInfo.audioSongName)
        let audioArtistsName=computed(()=>store.state.forAudioPlay.audioPlayInfo.audioArtistsName)
        let cover=computed(()=>store.state.forAudioPlay.audioPlayInfo.cover)
        const controlPlay=computed(()=>store.state.forAudioPlay.controlPlay)
        
        watch(controlPlay,(newValue,oldValue)=>{
            // console.log('监听成功',newValue);
            if(newValue===true){
                audio.value.play()
            }else{
                audio.value.pause()
            }
        })

        const audioPlayInfo=computed(()=>store.state.forAudioPlay.audioPlayInfo)
        const playMode=computed(()=>store.state.forAudioPlay.playMode)
        const currentSingleSongList=computed(()=>store.state.forSongSheet.currentSingleSongList)
        /**-------------------------------------------------------------
        *   play和pause状态
        --------------------------------------------------------------*/
        //获取album对象
        let albumIcon=ref(null)
        //播放时，只会执行一次
        const playState=function () {
            // isPlaying.value = true;
            store.commit('saveIsPlaying',true)
            processControl()
 
            albumIcon.value.setAttribute('src',cover.value)
        
        }
        const pauseState=function () {
            store.commit('saveIsPlaying',false)
        }
       

        const musicEndState=function () {
            let len=currentSingleSongList.value.length
            // console.log('len',len)
            let singleSongItem=null
            switch(playMode.value){
                //随机
                case 1:
                
                    let randomNum=Math.floor(Math.random()*len)
                    // console.log('randomNum',randomNum)
                    singleSongItem=currentSingleSongList.value[randomNum]
                    //还是自身，则直接播放
                    if(len==1){
                        setTimeout(()=>{
                            audio.value.currentTime=0
                            audio.value.play()
                        },1000)
                    }else{
                        store.dispatch('changeAudioPlayCurMusicAction',singleSongItem)
                    }
                    
                    break;
                //单曲
                case 2:
                    //重新播放
                    setTimeout(()=>{
                        audio.value.currentTime=0
                        audio.value.play()
                    },1000)

                    break;
                   
                //顺序
                case 3:
                     //只有一首歌
                        if(len==1){
                            setTimeout(()=>{
                                audio.value.currentTime=0
                                audio.value.play()
                            },1000)
                        }
                        else{
                            currentSingleSongList.value.forEach((item,index)=>{                                                           
                                if(item.id==audioPlayInfo.value.id){                               
                                        //如果最后一首                                       
                                        if(index==len-1){
                                            singleSongItem =currentSingleSongList.value[0]
                                        }else{
                                            singleSongItem =currentSingleSongList.value[index+1]
                                        }
                                        
                                }
                                })
                                store.dispatch('changeAudioPlayCurMusicAction',singleSongItem)
                        }
                     
                    break;



            }

        }
        
              

  
        const audio=ref(null)     //获得audio对象
        const process=ref(null)   //获得进度条对象

        let processNum=null
        let currentTime=0
        var timer=null
        let once=null 
        
        //监听时间变化，来自playInterface跳转事件
        let progressDragEvent=computed(()=>store.state.forAudioPlay.progressDragEvent)
        let curTime=computed(()=>store.state.forAudioPlay.audioPlayInfo.currentTime)
        watch(progressDragEvent,(NewVal,oldVal)=>{
            console.log('时间变化了')
            audio.value.currentTime=curTime.value
        })
        /**-------------------------------------------------------------
        *   初始化
        --------------------------------------------------------------*/
        onMounted(()=>{
          
            let initialCurrentTime=store.state.forAudioPlay.audioPlayInfo.currentTime
            if(initialCurrentTime){           
                audio.value.currentTime=initialCurrentTime
                console.log('第一次获取到的当前时间-audioPlay',initialCurrentTime);

                let duration=store.state.forAudioPlay.audioPlayInfo.duration
                if(duration){
                    // console.log('存在',duration,initialCurrentTime);
                    store.commit('saveDuration',duration)
                    store.commit('saveCurrentTime',initialCurrentTime)       
                    store.dispatch('saveDurationAndCurrentTimeToLocalAction',{duration,currentTime:initialCurrentTime})            
                
                     //百分比
                    once=(duration/100).toFixed(2)
                    processNum=initialCurrentTime/once
                    // console.log('processNum',processNum)
                    rotateCircle(processNum)
                }
            
         
            }
            

            
       
        })
    
        /**-------------------------------------------------------------
        *  控制进度条的变化
        --------------------------------------------------------------*/
        const processControl=()=>{
           
            clearInterval(timer)

            once=(audio.value.duration/100).toFixed(2)
            timer=setInterval(()=>{
            //总时长的百分之一,按秒计数
               
            currentTime=audio.value.currentTime

            //保存当前时间
            store.commit('saveCurrentTime',currentTime)
            store.dispatch('saveDurationAndCurrentTimeToLocalAction',{duration:audio.value.duration,currentTime})
            //百分比
            processNum=currentTime/once
            // console.log('进度条在工作中')
            rotateCircle(processNum)

            // if(!isPlaying.value) {
            //     // store.commit('saveIsPlaying',false)
            //     audio.value.pause()              
            // }
            
            },500)
        }
       


        /**-------------------------------------------------------------
        *   圆形进度条的运动
        --------------------------------------------------------------*/

        function rotateCircle(num){
            //获得周长
            var circleLength=Math.floor(2*Math.PI *parseFloat(process.value.getAttribute('r')))
            var value=num *circleLength/100    
            // console.log(num)

            process.value.setAttribute('stroke-dasharray',value+',10000')

        }


        /**-------------------------------------------------------------
        *   点击播放或暂停
        --------------------------------------------------------------*/
        const playControl=()=>{
           
            
            if(isPlaying.value) {
                store.commit('saveIsPlaying',false)
                audio.value.pause()
                
            }
            else{
                store.commit('saveIsPlaying',true)
                audio.value.play()

            } 
            console.log('playControl',isPlaying.value)
        }

        /**-------------------------------------------------------------
        *   收藏到歌单
        --------------------------------------------------------------*/
        const show = computed(()=>store.state.forAudioPlay.collectShow)
        const collectToSongSheet=()=>{
            console.log('收藏！')          
            store.commit('saveCollectShow',true)
        }

        /**-------------------------------------------------------------
        *   打开完整的播放界面
        --------------------------------------------------------------*/
        const openPlayInterface=()=>{

            store.commit('playInterfaceToShow')

            //播放中，则继续播放,否则清除
            
            if(isPlaying.value){store.commit('allowToAutoPlay')}
            else{store.commit('notAllowToAutoPlay');clearInterval(timer)}
            //退出前再保存一次时间，防止出现时间差
            // let currentTime=audio.value.currentTime
            // store.commit('saveCurrentTime',currentTime)
            // store.dispatch('saveDurationAndCurrentTimeToLocalAction',{duration:audio.value.duration,currentTime})
            console.log('最后一次获取到的当前时间-audioPlay',currentTime);
           
            
            $router.push(
                { path:'/playInterface' }
            )

        }

        /**-------------------------------------------------------------
        *   渲染歌手名字
        --------------------------------------------------------------*/   
        const artistsName=ref(null)
        onUpdated(()=>{
        
            if(audioArtistsName!=null||audioArtistsName!=''){
                artistsName.value.innerText='-'+' '+audioArtistsName.value
            }
            
        })
        
      return {
        store,isPlaying,musicUrl,audioSongName,audioArtistsName,cover,autoPlay,
        playState,pauseState,playControl,musicEndState,
        audio,process,albumIcon,
        artistsName,
        show,collectToSongSheet,
        openPlayInterface,
        currentSingleSongList
      }
   },
}
</script>




<style scoped lang='less'>


    @tabbarHeight:50px;
    @audioPlayHeight:45px;
    .process{
        transform: rotateZ(-90deg);
        transform-origin: center center;
    }
    .container{
        position: fixed;
        //使用calc中间一定要有空格
        top:calc(100% - @tabbarHeight - @audioPlayHeight);
        left:0%;
        
    }
    .audio_control{
        display: flex;
        align-items: center;       
        border-top: 1px solid rgba(217, 214, 214, 0.5);            
        background-color: white;

        width: 100vw;
        height: 45px;
        // overflow: hidden;
        white-space: nowrap;
        vertical-align:  text-bottom;
        .left{
            display: flex;
            padding: 15px 5px 15px 15px;
            width: 70%;
            position: relative;
            align-items: center;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
            .album{
                position: absolute;
                top:-7%;                
                left:0%;
                width: 46px;
                height: 46px;
                margin-left:15px;   
                // overflow: hidden;           
                .album-ring{   
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    left:0%;
                    z-index: 200; 
                }
                .album-icon{  
                    // 图片比圆环小一点，否则会显露出来
                    margin-left:2px;
                    margin-top:2px;             
                    width: 42px;
                    height: 42px;                
                    z-index: 1;
                    border-radius: 50px; 
                }
            }
            .song-name{
                // width: 80%;
                text-align: left;
                overflow: hidden;
                margin-left:53px;
                font-size: 14px;
                font-weight: 600;
                color: black;
            }
            .artists-name{
                margin-left:5px;
                font-size: 11px;
                color: rgba(112, 107, 107, 0.993);
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }
        .right{
            display: flex;
            padding: 15px 15px 15px 5px;
            width: 25%;
            overflow: hidden;
            justify-content: space-between;
            .collection{
                margin:auto 0;          
                color: black;
                font-weight: 1000;
            }
            .content {
                padding: 16px 16px 160px;
            }

            .play-button{
                position: relative;
                // box-sizing: border-box;
                // background-color: transparent;
                // background-color:rgba(255, 255, 255, 0.3);
                // border: 12px solid #aaa;
                border-radius: 50px;
                height: 30px;
                svg{
                    border-radius: 50px;
                    opacity: 1!important;
                }
                .play-and-stop-icon{
                    position: absolute;
                    top:50%;
                    left:50%;
                    transform: translate(-50%,-50%);
                }
                .icon-stop{
                    font-size: 19px;
                    color: black;
                    font-weight: 1000;
            
                }
            }
           
        }
       

    }

    .icon-changyong_shoucang{
        font-size: 26px;
        // transform: scale(1.5);
        font-weight: 100!important;
        color:rgb(12, 11, 11)!important;
    }
</style>
