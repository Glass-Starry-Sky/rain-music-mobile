<template>
    <!-- 准备v-for渲染，并传入值 -->

    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
        <div v-for="item in searchSongSheetList" :key="item.sheetId" @click="clickSongSheet"
            :data-sheetid="item.sheetId" :data-label="item.label" :data-picurl="item.picUrl"
            >
                <SingleSheetItem :searchSongSheetItem="item" ></SingleSheetItem> 
        </div>
        
    </van-list>

    <div class="bottom-null"> </div>
</template>
<script>
import axios from 'axios';
import { useStore } from 'vuex';
import SingleSheetItem from './singleSheetItem/SingleSheetItem';
import { computed, onMounted,ref, watch } from '@vue/runtime-core';
import { useRouter } from 'vue-router';


export default {
    components:{
        SingleSheetItem
    },

   
   setup() {
    const loading = ref(false);
      const finished = ref(false);

      let hasMore=computed(()=>store.state.forSearchResult.hasMoreSongSheet)
      let page = computed(()=>store.state.forSearchResult.pageSongSheet);
      let limit=computed(()=>store.state.forSearchResult.limit)
      let query=computed(()=>store.state.forSearchResult.query)

      const saveHasMoreSongSheet=(boolean)=>store.commit('saveHasMoreSongSheet',boolean)
      const addSearchSongSheet=(songs)=>store.commit('addSearchSongSheet',songs)
      const changePageSongSheet=()=>store.commit('changePageSongSheet')
      /**-------------------------------------------------------------
      *   加载  当组件滚动到底部时，会触发 load 事件
      --------------------------------------------------------------*/
      const onLoad = () => {    
              setTimeout(() => {

                //发起异步请求,请求新的数据
                if(hasMore.value){
                    axios.get(`/search?type=1000&limit=${limit.value}&offset=${(page.value-1)*limit.value}&keywords=${query.value}}`).then(res => {
                        console.log('歌单刷新加载新数据', res.data)

                        loading.value = false;   
                            //请求成功时执行 
                            if(res.data.code==200){
                              //空值处理
                              if(!res.data.result.hasOwnProperty('playlists')){
                                finished.value = true;
                              }
                              else{
                                let playlists = res.data.result.playlists
                                playlists.map((item) => {
                                    let obj = {}
                                    obj.label = item.name
                                    obj.sheetId = item.id
                                    obj.picUrl = item.coverImgUrl
                                    obj.count = item.trackCount
                                    obj.playCount = item.playCount
                                    obj.creator = item.creator.nickname
                                    addSearchSongSheet(obj)
                                                     
                                    
                                })
                                changePageSongSheet()   
                                saveHasMoreSongSheet(res.data.result.hasMore)
                                 
                              }
                            }else{
                            //   store.commit('saveQuery','默认搜索')
                            }
                                           
                    })
                }
                           

                if (!hasMore.value) {
                  finished.value = true;
                }
            }, 2000);                
      };
  




    let imgs=ref([])
    onMounted(()=>{
        imgs.value=document.getElementsByClassName('item-img')
        // lazyLoad()


    })
    // const lazyLoad=()=>{
    //     if(IntersectionObserver){
            
    //         let lazyLoadObser=new IntersectionObserver((entries,obser)=>{
    //             console.log('IntersectionObserver', IntersectionObserver)
    //             entries.forEach((entry,index)=>{
    //                 let lazyImage=entry.target
    //                 console.log('lazyImage',lazyImage)
    //                 if(entry.intersectionRatio>0){
    //                     lazyImage.src=lazyImage.getAttribute("data-src")
    //                     lazyLoadObser.unobserve(lazyImage)
    //                 }
    //             })
    //         })
    //         //要绑定的元素
    //         for(let i=0;i<imgs.length;i++){
    //             console.log('111')
    //             lazyLoadObser.observe(imgs[i])
    //         }
    //     }
    // }

    const store=useStore()
    const $router=useRouter()
    
    const searchSongSheetList=computed(()=>store.state.forSearchResult.searchSongSheetList)
    store.dispatch('searchSongSheetAction')


    /**-------------------------------------------------------------
    *   点击某一歌单
    --------------------------------------------------------------*/
    let searchSongSheetOneMusicList={label:'',picUrl:'',singleSongList:[]} 
    const clickSongSheet=(e)=>{
        let sheetId=e.currentTarget.dataset.sheetid
        let label=e.currentTarget.dataset.label
        let picUrl=e.currentTarget.dataset.picurl
        console.log('click',sheetId);

        //&limit=100
        axios.get(`/playlist/track/all?id=${sheetId}&limit=200&offset=0`).then(res=>{
            console.log('请求歌单...',res)
      
                let audioSongName=''
                let cover=''
                let singleSongList=[]
                let id=''
                //处理 id:'', musicUrl:'xxx',,audioSongName:'',audioArtistsName:'aa/bb',cover:'.jpg'
                
                let obj={}
                for(let item of res.data.songs){
                    //1.存储封面，歌单名和id
                    audioSongName=item.name
                    cover=item.al.picUrl                 
                    id=item.id    //因为无法直接获取musicUrl，因此将id保存起来，在歌单中点击单曲时，会利用此id获取对应的musicUrl
                                     
                    //2.获取处理后的歌手名字
                    let audioArtistsName=''
                    item.ar.forEach((each,index)=>{
                        if(index==item.ar.length-1){
                            audioArtistsName+=each.name   
                        }else{
                            audioArtistsName+=each.name
                            audioArtistsName+='/'
                        }
                    })
                    // for(let index in item.ar){                        
                    //     if(index==item.ar.length-1){
                    //         //最后一个时，直接把原来的歌声名字加入即可
                    //         audioArtistsName+=item.ar[index].name                                                 
                    //     }else{                  
                    //         //有斜杠的时候
                    //         audioArtistsName+=item.ar[index].name
                    //         audioArtistsName+='/'
                    //     }                 
                    // }

                    obj={id,musicUrl:'',audioSongName,audioArtistsName,cover}
                    singleSongList.push(obj)
                }

                //3.处理歌单内的歌曲
                searchSongSheetOneMusicList.singleSongList=singleSongList               
                searchSongSheetOneMusicList.label=label
                searchSongSheetOneMusicList.picUrl=picUrl
                //保存
                store.commit('saveSearchSongSheetOneMusicList',searchSongSheetOneMusicList)
    
                $router.push({
                    name:`onesongsheet`,
                    query:{label,picUrl}
                })
        })
        

    }
      return {
        searchSongSheetList,
        clickSongSheet,
        imgs,
        loading,finished,onLoad
      }
   },
}
</script>
<style scoped lang='less'>
    .bottom-null{
        margin-bottom:100px;
    }
</style>
