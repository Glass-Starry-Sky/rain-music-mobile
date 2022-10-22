<template>
         <van-action-sheet  :title="'当前播放'+'(' + songCount + '首)'" 
          @click-overlay.stop="close" 
         :closeable="false" class="curPlayListPopUpContainer">
            <div class="content">
               <div v-for="item,index in currentSingleSongList" :key="item.id" 
               @click.stop="collectToSongSheet" @click="listClick" :data-index="index"
               class="item-hover item-box" :class="index==clickIndex?'item-hover-effect':''">
                  <div class="iconfont icon-music" v-if="item.id==curPlayMusicId"></div>
                  <div class="song-name" ref="songName">{{item.audioSongName}}</div>
                  <div class="artists-name" ref="artistsName"> - {{item.audioArtistsName}}</div>
               </div>
               
            </div>

             
         </van-action-sheet>
</template>
<script>
import '@/assets/fonts/header/iconfont.css'
import CardItem from '@/views/songSheetView/cardItem/CardItem';

import { computed,onMounted,reactive,ref, watch} from 'vue';
import { useStore } from 'vuex'
export default {
   components:{
      CardItem
   },

   setup() {

      const store=useStore()
      const close=()=>{
         store.commit('saveCurPlayListShow',false)       
      }

      let currentSingleSongList=computed(()=>store.state.forSongSheet.currentSingleSongList)
      let songCount=computed(()=>currentSingleSongList.value.length)
      let singleSong=computed(()=> store.state.forAudioPlay.audioPlayInfo)
      let curPlayMusicId=computed(()=> store.state.forAudioPlay.audioPlayInfo.id)
      
      let songName=ref(null)
      let artistsName=ref(null)


      /**-------------------------------------------------------------
      *  点击某个曲目
      --------------------------------------------------------------*/
      const clickIndex=ref(-1)
         const listClick=(e)=>{
            
         let {index}=e.currentTarget.dataset   
         clickIndex.value=Number(index)
         //消除点击效果
         setTimeout(()=>{
               clickIndex.value=-1
         },300)
         //1.得到对应歌曲
         let singleSongItem=currentSingleSongList.value[index]  
         //2.播放      
         store.dispatch('changeAudioPlayCurMusicAction',singleSongItem)
      
         console.log('allowToAutoPlay',store.state.forAudioPlay.autoPlay);
      }
      //修改了AudioPlayInfo的ID后在改变颜色,需要持续监听
      watch(curPlayMusicId,(newVal,oldVal)=>{
         changeColor()
      })

      /**-------------------------------------------------------------
      *  修改当前播放歌曲的字体颜色
      --------------------------------------------------------------*/
      const changeColor=()=>{
         // var(--theme-color)
         currentSingleSongList.value.forEach((item,index)=>{
           
            if(item.id==curPlayMusicId.value){
               //非空判定
               if(songName.value!=null&&artistsName.value!=null){
               songName.value[index].style.color='var(--theme-color)'
               artistsName.value[index].style.color='var(--theme-color)'
               }
            }else{
               if(songName.value!=null&&artistsName.value!=null){
                  songName.value[index].style.color=''
                  artistsName.value[index].style.color=''
               }
            
            }
            
         })
      }
      /**-------------------------------------------------------------
      *  初始化
      --------------------------------------------------------------*/
      onMounted(()=>{
         changeColor()
      })


      /**-------------------------------------------------------------
      *   播放该歌曲
      --------------------------------------------------------------*/
      let playThisMusic=(e)=>{

         console.log('playThisMusic',e);
         // let {label}=e.currentTarget.dataset
         // console.log('collectToSongSheet',singleSong.value)
         // store.dispatch('addMySheetSingleSongListAction',{label,singleSong:singleSong.value})  //在歌单中新增单曲
         // store.commit('saveCollectShow',false)    //close
      }
      return {
         close,
         currentSingleSongList,
         singleSong,
         playThisMusic,
         songCount,
         curPlayMusicId,
         songName,artistsName,
         listClick,clickIndex
      }
   },
}
</script>
<style scoped lang='less'>
   .curPlayListPopUpContainer{
      z-index: 200;
   }
   .content{
      // height: 100px;
      width: 100%;
      .item-box{
         display: flex;
         padding: 0 15px;
         height: 50px;
         align-items: center;
         box-sizing: border-box;
         .icon-music{
            margin-right:10px;
            font-size: 15px;
            color: var(--theme-color);
            border-radius: 10px;
            border:2px solid var(--theme-color);
         }
         .song-name{
            margin-right: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
         }  
         .artists-name{
            color: #888;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
         }
      }
     
   }

   .item-hover-effect{
      background-color: #ccc;
      background-color: var(--theme-text);
   }

   
</style>
