<template>
    <TopSearch class="topSearch"></TopSearch> 
    <van-tabs v-model:active="active"    line-height="5px" 
    line-width="30px" color="var(--theme-color)" @change="clickTabList">
        <van-tab v-for="item in tabList" :key="item.id" :title="item.title"  
         :data-title="item.title">
            <!-- 内容 -->
            <SingleMusicList v-if="item.id===1"></SingleMusicList>     
            <SingleSheetList v-else-if="item.id===2"></SingleSheetList>     
        </van-tab>
    </van-tabs>

 

</template>
<script>
import { computed } from '@vue/runtime-core';
import { useStore } from 'vuex';

import TopSearch from '../topSearch/TopSearch';
import SingleMusicList from './singleMusicList/SingleMusicList';
import SingleSheetList from './singleSheetList/SingleSheetList';


export default {
    
    components:{
        TopSearch,
        SingleMusicList,
        SingleSheetList
    },
   setup() {
    const store=useStore()
    const tabList=[
        {id:1,title:'单曲'},
        {id:2,title:'歌单'},
        {id:3,title:'歌手'},
        {id:4,title:'视频'},
        {id:5,title:'专辑'},
        {id:6,title:'用户'},
        {id:7,title:'声音'},
        {id:8,title:'播客'},
    ]

    const query=computed(()=>store.state.forSearchResult.query)
    let oldQuery=''
    const clickTabList=(number,title)=>{
        
            //注：需要减少请求次数   2022/9/18
            // switch(title){
            //     case '歌单':
            //         console.log('触发了歌单');
            //         //如果相等,则不发送请求
            //         if(oldQuery==query.value){}
            //         else{  
            //             oldQuery=query.value                
            //             store.dispatch('searchSongSheetAction')
            //         }
            //         break;
            
            //  }
        
    }
      return {
        tabList,clickTabList
      }
   },
}
</script>
<style scoped lang='less'>
    .topSearch{
        padding-top: 20px;
        box-sizing: border-box;
    }
    :deep(.van-tabs__line){
        bottom:28px!important;
        opacity: 0.7;
        
    }
</style>
