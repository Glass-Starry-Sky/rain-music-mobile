<!-- -------------------------------------------------------------
*   sheetSingleMusicList    （点击歌曲事件）
-------------------------------------------------------------- -->
<template>
    <div v-if="heartSingleSonglist.length>0">
        <div v-for="item,index in heartSingleSonglist" :key="item.id"
        @click="listClick" 
        :class="clickIndex===index?'clickEffect':''" :data-index="index">
            <HeartMusicItem :audioArtistsName="item.audioArtistsName"
            :audioSongName="item.audioSongName" :musicUrl="item.musicUrl" :index="Number(index)"
            :id="item.id" @clickMore="clickMore"
            
            ></HeartMusicItem>
        
        
        </div>
    </div>
    <div v-else>
        <van-empty
            image-size="80">
            <template v-slot:image>
                <img src="@/assets/images/custom-empty-image.png" alt="">
            </template>
            <template v-slot:description>
                <div style="color:aliceblue">暂无珍藏单曲,点击播放页面的爱心即可添加 </div>
            </template>
        </van-empty>
    </div>
    
    <MorePopUp :show="show" :title="'珍藏单曲'" :sheetName="sheetName" @clickMoreItem="clickMoreItem"
            :moreList="[
                // {icon:'',label:'重命名'},
                {icon:'icon-delete',label:'删除'}
                ]"></MorePopUp>
   
</template>
<script>
    import { useStore } from 'vuex'
    import {computed, ref,onBeforeMount, reactive} from 'vue'
import HeartMusicItem from './heartMusicItem/HeartMusicItem'
 
import { Dialog } from 'vant';
import MorePopUp from '../../mySongSheet/morePopUp/MorePopUp'

export default {
    components:{
        HeartMusicItem,
        MorePopUp
    },

   setup() {
    const store = useStore()

    let heartSingleSonglist=computed(()=>store.state.forSongSheet.heartSingleSonglist)
    // let heartSingleSonglist=[
    //     {id:'2312321',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'http://p2.music.126.net/Kwnvp8r3eGsw0m7340KbGg==/109951166682462438.jpg'},  
    // ]



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
        let singleSongItem=heartSingleSonglist.value[index]
        store.dispatch('saveAllAudioPlayInfoAction',singleSongItem)

        //播放      
        store.commit('allowToAutoPlay')
        console.log('allow',store.state.forAudioPlay.autoPlay);
      }



      /**-------------------------------------------------------------
    *   触发HeartMusicItem上的点击事件时响应，弹出上拉框
    --------------------------------------------------------------*/
    const show = computed(()=>store.state.forSongSheet.moreShow)
    let getId=ref('')
    let sheetName=ref('')
    const clickMore=(id,songname)=>{
        getId.value=id
        //使用sheetName是因为MorePopUp中需要传入sheetName，为了方便不修改其他名字了
        sheetName.value=songname
        console.log(getId.value,sheetName.value);
        
        store.commit('saveMoreShow',true)
    }

    /**-------------------------------------------------------------
    *  响应上拉框MorePopUp组件的点击事件   
    --------------------------------------------------------------*/

    const clickMoreItem=({label,sheetName})=>{
        
        switch(label){
            // case '重命名':
            //     console.log('重命名')
            //     //显示改名对话框
            //     store.commit('saveRenameShow',true)
                // break;  
            case '删除':
                console.log('删除')
                Dialog.confirm({
                    title: '删除歌单',
                    message:
                        `确认要删除歌单："${sheetName}"吗`
                    })
                    .then(() => {
                        store.commit('deleteHeartSingleSonglist',getId.value)
                    })
                    .catch(() => {
                        // on cancel
                    });
                break;
            
        }
        //关闭上拉框
        store.commit('saveMoreShow',false)
    }

    //进入歌单时，根据传来的label，获取当前点击的单曲列表
    // let singleSongList=computed(()=>store.state.forSongSheet.currentSingleSongList)
    // let label=ref(props.label)
    onBeforeMount(()=>{
       
        // store.commit('changeCurSheetSingleSongList',label.value)
        // console.log('sheetSingleMusicList --> singleSongList',singleSongList.value)
    })


      return {
        heartSingleSonglist,
        clickIndex,listClick,
        show,clickMore,clickMoreItem,sheetName
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
