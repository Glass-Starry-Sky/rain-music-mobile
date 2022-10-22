<!-- -------------------------------------------------------------
*   最外层的歌单界面
-------------------------------------------------------------- -->
<template>
    <div class="song-sheet-view">
        <SongSheetHeader></SongSheetHeader>
      
        <div class="main">
            <van-tabs v-model:active="activeName"    line-height="5px" 
            line-width="50px" color="#88ccbb" class="tabs">
                <van-tab v-for="item in tabList" :key="item.id" :title="item.title"  >
                    <!-- 内容 -->
                    <div class="content-box">
                        <div v-if="item.id==0">
                            <div class="button-my">
                                <van-button  class="create" @click="create">创建歌单 </van-button>
                                <van-button  @click="edit">编辑歌单</van-button>
                            </div>
                            
                            <MySongSheet ></MySongSheet>
                        </div>
                        <!-- 收藏歌单 -->
                        <div v-if="item.id==1">                     
                            <div class="button-my">
                                <!-- <van-button  class="create" @click="create">创建歌单 </van-button> -->
                                <van-button class="collect-button-edit" @click="edit">编辑歌单</van-button>
                            </div>    
                            <CollectSongSheet></CollectSongSheet>
                        </div>
                        <!-- 珍藏单曲 -->
                        <div v-if="item.id==2">                     
                            <div>
                                <HeartSingleSong ></HeartSingleSong>
                            </div>                    
                        </div>
                    </div>
                                     
                   
                </van-tab>
        </van-tabs>    

   
        </div>
<!-- v-if="showCreate" -->
        <CreateSongSheetDialog v-if="showCreate"></CreateSongSheetDialog>
    </div>

</template>


<script>
import SongSheetHeader from '@/components/header/songSheet/SongSheetHeader'
import MySongSheet from './mySongSheet/MySongSheet'
import CreateSongSheetDialog from './dialog/CreateSongSheetDialog'
import HeartSingleSong from './heartSingleSong/self/HeartSingleSong'
import CollectSongSheet from './collectSongSheet/self/CollectSongSheet'


import {computed, ref} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    components:{
    SongSheetHeader,
    MySongSheet,
    CreateSongSheetDialog,
    HeartSingleSong,
    CollectSongSheet

},

   setup() {
    const store=useStore()
    const $router=useRouter()

    const activeName = ref('');

    const tabList=[
        {id:0,title:'我的歌单'},
        {id:1,title:'收藏歌单'},
        {id:2,title:'珍藏单曲'},
      
    ]

    const showCreate = computed(()=>store.state.forSongSheet.showCreate);
    // const showCreate =ref(false);

    const create=()=>{   
       store.commit('saveCreateShow',true)      
    }
    const edit=()=>{
        let mySongSheetList = store.state.forSongSheet.mySongSheetList;
        console.log('activeName',activeName.value);
        let choose=''
        switch(activeName.value){
            case 0:
                choose='myedit'
                break;
            case 1:
                choose='collectedit'
                break;
        }
        $router.push({
            name:`editsongsheet`,
            query:{choose}
        })
    }

      return {
        store,
        tabList,activeName,
        create,showCreate,
        edit
        
        
      }
   },
}
</script>
<style scoped lang='less'>

:deep(.van-tabs__line){
        // bottom:28px!important;
        opacity: 0.7;
        background-color:var(--theme-color)!important;
    }
    .song-sheet-view{
        background-color: #ececec;
        .main{
            width: 100%;
            height: 100%;
            padding:0 15px;
            box-sizing: border-box;
            .content-box{
                height: 80vh;
            }
        }
        :deep(.van-tabs__nav){
            background-color:#ececec;
        }
        .button-my{
            display: flex;
            justify-content: space-around;
            margin-bottom: 15px;
            &>button{
            // border: 1px solid rgb(9, 162, 45);
            width: 48%;
            // background-color:#42b983;
            background-color: var(--theme-color);

            // color:#53f6ad;
            color:var(--theme-text) ;
            }
            .collect-button-edit{
                flex:1;
            }
        }
        
    }
</style>
