<!-- -------------------------------------------------------------
*   点击某个歌单时 进入该歌单 ,使用该组件的方法是通过路由传入label和
*   picUrl ,其会根据label去寻找对应的歌单，将currentSingleSongList修改
-------------------------------------------------------------- -->
<template>
      <div class="header-box">
        <div class="header-top">
          <div class="iconfont icon-zuojiantou goback" @click="goback">返回</div>
        </div>
        <div ><img class="head-icon" :src="headerInfo.picUrl" alt=""></div> 
        <div>{{headerInfo.label}}</div> 
        <svg   class="ellipse-svg">
          <!-- #6ee6d2 -->
	          <ellipse cx="50%" cy="8" rx="50%" ry="13" style="fill:var(--theme-color);" />
        </svg>
        <!-- 未收藏 -->
        <div class="collect" @click="collectSongSheet"
        :class="isClickCollect?'click-collect':''" v-if="!hasCollect">
          <div class="iconfont icon-changyong_shoucang"></div>
          <div >收藏</div>
        </div>
        <!-- 已收藏 -->
        <div class="collect"  v-else style="color:#aaa">
          <div class="iconfont icon-changyong_shoucang"></div>
          <div >已收藏</div>
        </div>

      </div>
     
      <div class="main-box">
        <SheetSingleMusicList :label="headerInfo.label"></SheetSingleMusicList>
      </div>
      <div class="bottom-null">到底了哦~</div>  
</template>
<script>
import { computed, onMounted, reactive, ref, watch } from '@vue/runtime-core'
import { useRoute,useRouter} from 'vue-router'
import SheetSingleMusicList from './sheetSingleMusicList/SheetSingleMusicList'

import '@/assets/fonts//header/iconfont.css'
import { useStore } from 'vuex'
export default {
    components:{
      SheetSingleMusicList
    },
   setup() {
    const $route=useRoute()
    const $router=useRouter()
    const store=useStore()
    const headerInfo=reactive($route.query)
    
    const goback=()=>{
        $router.back()
    }

    let hasCollect=ref(false)
    const collectSongSheetList=computed(()=>store.state.forSongSheet.collectSongSheetList)
    /**-------------------------------------------------------------
    *   点击收藏歌单
    --------------------------------------------------------------*/
    let isClickCollect=ref(false)
    const collectSongSheet=()=>{
      //动画效果
      isClickCollect.value=true
      setTimeout(()=>{
        isClickCollect.value=false
      },300)
      //收藏，得到label，picUrl
      let label=headerInfo.label
      let picUrl=headerInfo.picUrl    
      //得到musicList和count
      let singleSongList=store.state.forSongSheet.currentSingleSongList   
      let count=singleSongList.length
      //存储此歌单
      let obj={}
      obj.label=label
      obj.picUrl=picUrl
      obj.singleSongList=singleSongList
      obj.count=count
      store.commit('addCollectSongSheetList',obj)
    }

    function judgeHasCollect(){
      collectSongSheetList.value.forEach((item)=>{
          if(item.label==headerInfo.label){
            console.log('已经收藏了')
            hasCollect.value=true
          }         
        })
    }
    //变化了就要判断
    watch(collectSongSheetList.value,(newValue,oldValue)=>{
      console.log('监听成功',newValue);
      judgeHasCollect()
    })
    onMounted(()=>{
        console.log('headerInfo-->',headerInfo)
        //判断是否已经收藏
        judgeHasCollect()
     
    })
      return {
        headerInfo,
        collectSongSheet,isClickCollect,hasCollect,
        goback
      }
   },
}
</script>
<style scoped lang='less'>
    .header-box{
        position: relative;
        height:180px;
        width: 100%;
        padding-top:20px;

        // background-color: #6ee6d2;
        background-color:var(--theme-color);
        margin-bottom: 40px;
        // border-radius: 0 0 8px 8px;
        .header-top{
            height:40px;
            .goback{
              float: left;
              font-size: 19px;
              margin-left: 15px;
              line-height: 40px;
              color: var(--theme-text);
            }
        }
        .head-icon{
            width: 100px;
            height: 100px;
            border-radius: 10px;
            border: 3px solid #cfa;
            // border: 3px solid var(--theme-color);
        }
        .collect{
          display: flex;
          box-sizing: border-box;
          position: absolute;
          top:100%;
          left:50%;
          transform: translateX(-50%);
          width: 70%;
          height:30px;
          line-height: 30px;
          
          text-align: center;              
          border-radius: 10px;
          background-color: #ffffff;
          box-shadow: 5px 5px 2px rgba(#777,0.5);
          &>div:nth-child(1){
            margin-left:35%;
            margin-right:15px;
            font-size: 18px;
          }
         
        }
    }
    .ellipse-svg{
      // background-color: #6ee6d2;
      width: 100vw;
      height:50px;
      
      
    }
    .main-box{
      width: 100%;
      // height:400px;
      
      // background-color: #fac;
    }
    .bottom-null{
      height: 60px;
      line-height: 60px;
      margin-bottom: 100px;
    }


    .click-collect{
      animation: CollectAnimation 0.2s linear;
      
    }
    @keyframes CollectAnimation{
      0%{
        top:100%;
        left:50%;
        
      }
      100%{
        top:101%;
        left:51%;
        background-color:#aaa;
      }
    }
</style>
