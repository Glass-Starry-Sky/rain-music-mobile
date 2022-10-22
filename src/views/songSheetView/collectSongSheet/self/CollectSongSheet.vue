<!-- -------------------------------------------------------------
*   '收藏歌单' 界面
-------------------------------------------------------------- -->
<template>
    <div class="mySongSheetContainer">
      
            <Card >
                <template v-slot:title>
                    <div class="title">
                        <div class="left">收藏歌单</div>
                        <div class="right">
                            <!-- <span>加</span> -->
                            <van-icon name="ellipsis" class="more"/>
                           
                        </div>
                        
                    </div>
                </template>
                <template v-slot:content>
                    <div v-if="collectSongSheetList.length>0">
                        <div v-for="item in collectSongSheetList" :key="item.label">
                            <CardItem :songSheetItem="item" @click="clickOneSongSheet"
                            @clickMore="clickMore"
                            :data-label="item.label" :data-picurl="item.picUrl">
                                <span class="count">{{item.count}}首</span>
                            </CardItem>
                        </div>
                    </div>
                   <div v-else>
                    <van-empty
                        image-size="80"
                        description="暂无收藏歌单">
                        <template v-slot:image>
                            <img src="@/assets/images/custom-empty-image.png" alt="">
                        </template>
                    </van-empty>
                   </div>
                </template>
                
            </Card>
       
            <MorePopUp :show="show" :title="'收藏歌单'" :sheetName="sheetName" @clickMoreItem="clickMoreItem"
            :moreList="[
                // {icon:'',label:'重命名'},
                {icon:'icon-delete',label:'删除'}
                ]"></MorePopUp>
            <RenameSongSheetDialog v-if="showRename" :oldSheetName="sheetName"></RenameSongSheetDialog>
    
            <div class="bottom-null"></div>
    </div>         
</template>
<script>

import Card from '../../card/Card';
import CardItem from '../../cardItem/CardItem';
import MorePopUp from '../.././mySongSheet/morePopUp/MorePopUp';
import RenameSongSheetDialog from '../../dialog/RenameSongSheetDialog';


import { computed ,ref} from '@vue/runtime-core';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router';
import { Dialog } from 'vant';



export default {
    components:{
        Card,
        CardItem,
        MorePopUp,
        RenameSongSheetDialog
    },  
   setup() {
    const store=useStore()
    const $router=useRouter()

    let collectSongSheetList=computed(()=>store.state.forSongSheet.collectSongSheetList)


    /**-------------------------------------------------------------
    *   触发cardItem上的点击事件时响应，弹出上拉框
    --------------------------------------------------------------*/
    const show = computed(()=>store.state.forSongSheet.moreShow)
    let sheetName=ref('')
    const clickMore=(label)=>{
        sheetName.value=label
        console.log(sheetName.value);
        
        store.commit('saveMoreShow',true)
    }

    /**-------------------------------------------------------------
    *  响应上拉框MorePopUp组件的点击事件   
    --------------------------------------------------------------*/
    const showRename = computed(()=>store.state.forSongSheet.showRename);
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
                        store.commit('deleteCollectSheetList',sheetName)
                    })
                    .catch(() => {
                        // on cancel
                    });
                break;
            
        }
        //关闭上拉框
        store.commit('saveMoreShow',false)
    }


    /**-------------------------------------------------------------
    *   点击单个歌单时
    --------------------------------------------------------------*/
    const clickOneSongSheet=(e)=>{
        let data=e.currentTarget.dataset
        let label=data.label
        let picUrl=data.picurl

        $router.push({
            name:`onesongsheet`,
            query:{label,picUrl}
        })
    }
      return {
        store,collectSongSheetList,
        clickOneSongSheet,
        show,clickMore,sheetName,
        clickMoreItem,showRename
      }
   },
}
</script>
<style scoped lang='less'>
    .mySongSheetContainer{
        // height: 100px;
        width: 100%;
        
        .title{
            display: flex;
            height:50px;
            align-items: center;
            justify-content: space-between;
            padding:0 15px;
            box-sizing: border-box;
            color:#888;
            font-size: 14px;
            .right{
                .more{

                margin: auto auto;
                transform: rotate(90deg);
                color: #aaa;
                font-size: 16px;
                font-weight: 700;
                }
            }
        }
        .count{
            text-align: start;
            font-size:12px;
            color: #888;
        }
    }
    
    :deep(.van-action-sheet__header){
        color:#777;
    }
    
    .bottom-null{
        height:30px;
        margin-bottom: 95px;
        background-color: #ececec;
    }
</style>
