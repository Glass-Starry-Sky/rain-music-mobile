<template>
         <van-action-sheet  title="收藏到歌单" @click-overlay.stop="close" 
         :closeable="false" class="collectPopUpContainer">
            <div class="content">
               <div v-for="item in mySongSheetList" :key="item.label" 
               :data-label="item.label" @click.stop="collectToSongSheet"
               class="item-hover">
                  <CardItem :songSheetItem="item"></CardItem>
               </div>
               
            </div>

             
         </van-action-sheet>
</template>
<script>
import '@/assets/fonts/header/iconfont.css'
import CardItem from '@/views/songSheetView/cardItem/CardItem';

import { computed,reactive} from 'vue';
import { useStore } from 'vuex'
export default {
   components:{
      CardItem
   },

   setup() {

      const store=useStore()
      const close=()=>{
         store.commit('saveCollectShow',false)       
      }

      let mySongSheetList=computed(()=>store.state.forSongSheet.mySongSheetList)
      let singleSong=computed(()=> store.state.forAudioPlay.audioPlayInfo)
    
      /**-------------------------------------------------------------
      *  收藏到歌单中
      --------------------------------------------------------------*/
      let collectToSongSheet=(e)=>{
         let {label}=e.currentTarget.dataset
         console.log('collectToSongSheet',singleSong.value)
         store.dispatch('addMySheetSingleSongListAction',{label,singleSong:singleSong.value})  //在歌单中新增单曲
         store.commit('saveCollectShow',false)    //close
      }
      return {
         close,
         mySongSheetList,
         collectToSongSheet,
         singleSong
         
      }
   },
}
</script>
<style scoped lang='less'>
   .collectPopUpContainer{
      z-index: 200;
   }
   .content{
      // height: 100px;
      width: 100%;

   }
   //手机端的hover等于click
   .item-hover:hover{
      background-color: #ccc;
   }

</style>
