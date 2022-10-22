<!-- -------------------------------------------------------------
*   sheetSingleMusicList    （点击歌曲事件）
-------------------------------------------------------------- -->
<template>
    <div v-for="item,index in singleSongList" :key="item.musicUrl"
    @click="listClick" 
    :class="clickIndex===index?'clickEffect':''" :data-index="index">
        <SheetSingleMusicItem :audioArtistsName="item.audioArtistsName"
        :audioSongName="item.audioSongName" :musicUrl="item.musicUrl" :index="Number(index)"
        
        
        ></SheetSingleMusicItem>
    </div>
  
 
   
</template>
<script>
    import { useStore } from 'vuex'
    import {computed, ref,onBeforeMount, reactive} from 'vue'
   
    import SheetSingleMusicItem from './sheetSingleMusicItem/SheetSingleMusicItem'
export default {
    components:{
        SheetSingleMusicItem
    },
    props:{
        label:String
    },
   setup(props) {
    const store = useStore()


    //点击某个曲目
    const clickIndex=ref(-1)
      const listClick=(e)=>{
        let {index}=e.currentTarget.dataset   
        clickIndex.value=Number(index)
        //消除点击效果
        setTimeout(()=>{
            clickIndex.value=-1
        },300)
        //得到对应歌曲
        let singleSongItem=singleSongList.value[index]
        // console.log('singleSongItem',singleSongList.value[index]);
        store.dispatch('saveAllAudioPlayInfoAction',singleSongItem)
        //播放
       
        store.commit('allowToAutoPlay')
        console.log('allow',store.state.forAudioPlay.autoPlay);
      }


    //进入歌单时，根据传来的label，获取当前点击的歌单
    let singleSongList=computed(()=>store.state.forSongSheet.currentSingleSongList)
    let label=ref(props.label)
    onBeforeMount(()=>{
       
        store.commit('changeCurSheetSingleSongList',label.value)
        // console.log('sheetSingleMusicList --> singleSongList',singleSongList.value)
    })


      return {
        singleSongList,label,
        clickIndex,listClick
      }
   },
}
</script>
<style scoped lang='less'>
 
    .single-music-list{
        margin-bottom: 100px;
    }
    .clickEffect{
      animation: ClickEffect 0.3s linear;
   
    }
    @keyframes ClickEffect{
        0%{
            background-color: rgb(255, 251, 251);
        }
        60%{
            background-color: rgb(205, 200, 200);
        }
        100%{
            background-color: rgb(255, 251, 251);
        }
    }
</style>
