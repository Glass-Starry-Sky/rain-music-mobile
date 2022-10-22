<!-- -------------------------------------------------------------
*     推荐单曲
-------------------------------------------------------------- -->
<template>
            <div class="header">
                <div class="title">{{cardList.title}} </div>
                <div @click="refresh" class="iconfont icon-shuaxin"></div>
            </div>

        <!-- 在懒加载模式下，只会渲染当前页和下一页。 -->
         <van-swipe class="my-swipe" :loop="false" indicator-color="white" ref="swipe"
         :class="isRefresh?'refresh-animation':''"   lazy-render>
            <van-swipe-item v-for="index in 3" :key="index">
                <!-- 每次渲染四条数据（每个cardLimit存放四条数据) -->
                <CommonCard2 :cardList="cardList.cardLimit[index-1]" :hasBorder="cardList.hasBorder"
                  @clickRecommendSingleSong="clickRecommendSingleSong" 
                 >               
                </CommonCard2>
                <!-- <div class="no-login-handle">权限不足，没有正常登录</div>    -->
            </van-swipe-item>
     
         </van-swipe>    
      
</template>
<script>
import CommonCard2 from '@/components/commonCard/CommonCard2';
import { getCurrentInstance, reactive,ref,onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex';

import { Notify } from 'vant';
import 'vant/es/notify/style';

import groupItemUseForNoLogin from '@/assets/js/singleSongRecommond/groupItem'

export default {
    components:{
        CommonCard2
    },

   setup() {
    const store=useStore()
    
    let group=ref(0)
    let oneGroupLimit=4
    /*  数据样例
    let cardList=reactive({
            title:'今日推荐',
            hasBorder:true,
            cardLimit:{
                {id:'',label:'我的消息',picUrl:'',artistsNameList:[]}, 
                {id:'',label:'我的消息',picUrl:'',artistsNameList:[]}, 
                {id:'',label:'我的消息',picUrl:'',artistsNameList:[]}, 
                {id:'',label:'我的消息',picUrl:'',artistsNameList:[]}, 
            }       
    })
    */
    let cardList=computed(()=>store.state.forRecommend.cardList)

    //使用全局axios
    const { proxy } = getCurrentInstance()




    /**-------------------------------------------------------------
    *  点击单曲, 监听子组件的自定义事件
    --------------------------------------------------------------*/    
    const clickRecommendSingleSong=({id,picUrl,songName,artistsName})=>{
        // console.log('触发了父组件方法');
        // console.log(id,picUrl,songName,artistsName)
        const cover=picUrl
        //获取音乐播放路径
        store.dispatch('getUrl',id)               
        store.commit('saveCover', cover)
        store.commit('saveMusicInfo', { id, songName, artistsName })
        //保存到内存中
        store.commit('saveAlltoLocalStorage')
    }

    let clickRefreshCount=ref(0)
    const swipe=ref(null)
    let isRefresh=ref(false)
   
    const refresh=()=>{
        clickRefreshCount.value++
        isRefresh.value=true
        swipe.value.swipeTo(0)
        setTimeout(()=>{
            
            isRefresh.value=false    
        
            console.log('SingleSongRecommend-> refresh')
            if(clickRefreshCount.value==4){
                requestNewRecommendSongs()
                clickRefreshCount.value=0
                Notify({background: '#42b983', color: '#ffe1e1', message: '获取新的推荐,每日仅一次有效' });
            }else{
                store.commit('cardListRefresh')
            }
        },1000)
        
        
        
    }
    /**-------------------------------------------------------------
    *   获取推荐单曲
    --------------------------------------------------------------*/
    const requestNewRecommendSongs=()=>{

        /**-------------------------------------------------------------
        *   获取的是新曲子，但是图片太大，需要很长时间加载，尽量不采用
        --------------------------------------------------------------*/
        /*~
        proxy.$http("personalized/newsong?limit=32").then(res=>{
            console.log('recommend---->获取推荐单曲' ,res.data)
                     //  dailySongs为cardList.cardLimit服务
                let {result}=res.data

                let aitem=[]
                let groupItem=[]
                
                //直接赋值等方式都会导致其变为非响应式！！！
                result.map((item,index)=>{
                    let id=item.song.id      
                    // let picUrl=item.song.album.picUrl
                    let picUrl=item.picUrl
                    let label=item.song.name
                    let artistsNameList=item.song.artists

                    let obj={id,label,picUrl,artistsNameList}
                
                    //每次到达limit则推入数据一次，最后一条时也要推入一次
                    
                    if(index!=0&&index%oneGroupLimit===0&&aitem!=null){
                        group.value=Math.floor(index/oneGroupLimit)
                              
                        //获取一个组，并清空暂存的aitem
                        groupItem.push(aitem)
                            
                        aitem=[]                       
                    }
                    aitem.push(obj)
                    //最后一个
                    if(index==result.length-1){
                        group.value=Math.floor(index/oneGroupLimit)
                        groupItem.push(aitem)
                        aitem=[]
           
                    }

                })

                // console.log(groupItem);

                //传入新的cardList
                let list=reactive({title:'今日推荐',hasBorder:true,cardLimit:{}})
                list.cardLimit=groupItem
                // console.log('list.cardLimit',list.cardLimit);           
                store.commit('saveCardList',list)
                store.commit('saveSingleSongRecommendToLocal',cardList.value.cardLimit)

                // console.log('获得所有推荐单曲cardList.cardLimit', cardList.cardLimit)
        })
        *~/

        /**-------------------------------------------------------------
        *   原本的每日推荐写法
        --------------------------------------------------------------*/
        try {
            proxy.$http("/recommend/songs").then(res=>{
                console.log('recommend---->获取推荐单曲' ,res.data)
                //  dailySongs为cardList.cardLimit服务
                let {dailySongs}=res.data.data

                let aitem=[]
                let groupItem=[]
                
                //直接赋值等方式都会导致其变为非响应式！！！
                dailySongs.map((item,index)=>{
                    let id=item.id      
                    let picUrl=item.al.picUrl
                    let label=item.name
                    let artistsNameList=item.ar

                    let obj={id,label,picUrl,artistsNameList}
                
                    //每次到达limit则推入数据一次，最后一条时也要推入一次
                    
                    if(index!=0&&index%oneGroupLimit===0&&aitem!=null){
                        group.value=Math.floor(index/oneGroupLimit)
                              
                        //获取一个组，并清空暂存的aitem
                        groupItem.push(aitem)
                            
                        aitem=[]                       
                    }
                    aitem.push(obj)
                    if(index==dailySongs.length-1){
                        group.value=Math.floor(index/oneGroupLimit)
                        groupItem.push(aitem)
                        aitem=[]
           
                    }

                })

                // console.log(groupItem);

                //传入新的cardList
                let list=reactive({title:'今日推荐',hasBorder:true,cardLimit:{}})
                list.cardLimit=groupItem
                // console.log('list.cardLimit',list.cardLimit);           
                store.commit('saveCardList',list)
                store.commit('saveSingleSongRecommendToLocal',cardList.value.cardLimit)

                // console.log('获得所有推荐单曲cardList.cardLimit', cardList.cardLimit)
                
            },(err)=>{
                //没有登录或者其他问题 导致出错     
                let list=reactive({title:'今日推荐',hasBorder:true,cardLimit:{}})    
                list.cardLimit=groupItemUseForNoLogin
                store.commit('saveCardList',list)
                store.commit('saveSingleSongRecommendToLocal',cardList.value.cardLimit)
            })
        } catch (error) {
            //没有登录或者其他问题 导致出错
            let list=reactive({title:'今日推荐',hasBorder:true,cardLimit:{}})    
                list.cardLimit=groupItemUseForNoLogin
            store.commit('saveCardList',list)
            store.commit('saveSingleSongRecommendToLocal',cardList.value.cardLimit)
        }
      
    }


    /**-------------------------------------------------------------
    *   初始化，没有数据就去请求，有则获取
    --------------------------------------------------------------*/
    onBeforeMount(()=>{
        if(localStorage.getItem('cardLimit')===null){
            requestNewRecommendSongs()
        }
        else{
                store.commit('singleSongRecommendInitial')
                // cardList.cardLimit=JSON.parse(localStorage.getItem('cardLimit'))    

                group.value=cardList.value.cardLimit.length
                console.log('得到了存储的推荐单曲',cardList)
        }
    })
 
      return {
        store,
        cardList,group,
        clickRecommendSingleSong,
        refresh,swipe,isRefresh
      }
   },
}
</script>
<style scoped lang='less'>
    .header{
        display: flex;     
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 40px;
        background-color: white;
        border-radius: 10px 10px 0 0;
        padding:0 15px;
        box-sizing: border-box;
        
    }
     .title{
       // border-bottom: 0.5px solid #ddd;
       font-size: 17px;
        font-weight: 600;
       
    }

    .icon-shuaxin{
        font-size: 22px;
    }
    .refresh-animation{
        animation: Refresh 0.8s linear;

    }

    .no-login-handle{
        width: 100%;
        background-color: rgb(255, 255, 255);
        border-radius: 0 0 10px 10px;   
        overflow: hidden;
        padding: 10px 15px;
        box-sizing: border-box;

    }
    @keyframes Refresh{
        0%{
            opacity: 0.5;
        }
        50%{
            opacity: 0;
        }
        100%{
            opacity: 1;
        }
    }
</style>
