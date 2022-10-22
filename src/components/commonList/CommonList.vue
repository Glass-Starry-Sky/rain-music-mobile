<!-- -------------------------------------------------------------
*   searchResult中的SingleMusicList组件调用
-------------------------------------------------------------- -->

<template>
    <div class="about">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <van-cell v-for="item in songs" :key="item" @click="listClick" 
         :class="clickId===item.id?'clickEffect':''" 
         :data-id="item.id">
            <!-- 插入想要的 List -->
            <slot :songItem="item" :query="query">默认</slot>
          </van-cell>
        </van-list>
      </van-pull-refresh>
  
    </div>
  </template>
  
  <script>
  
  import { reactive, ref ,computed,getCurrentInstance} from 'vue';
  import {useStore} from 'vuex'

  import { Toast } from 'vant';
  import 'vant/lib/index.css';
  export default {
    components:{

    },
    props:{
      songs:Array
    },
   
    //从forSearchResult下的SingleMusicList组件获取props
    setup(props) {
      const store=useStore()
      //使用全局axios
      const { proxy } = getCurrentInstance()

      let songs = computed(()=>props.songs);
      

      let limit=computed(()=>store.state.forSearchResult.limit)
      let page = computed(()=>store.state.forSearchResult.page);
      let hasMore=computed(()=>store.state.forSearchResult.hasMore)
      let query=computed(()=>store.state.forSearchResult.query)
      // let songCount=computed(()=>store.state.forSearchResult.songCount)

      const loading = ref(false);
      const finished = ref(false);
      const refreshing = ref(false);

      //加载  当组件滚动到底部时，会触发 load 事件
      const onLoad = () => {    
              setTimeout(() => {
                if (refreshing.value) {
                  refreshing.value = false;
                }
                //发起异步请求,请求新的数据
                if(hasMore.value){
                  proxy.$http(`/search?limit=${limit.value}&offset=${(page.value-1)*limit.value}&keywords=${query.value}` ).then(res=>{
                    
                    console.log('单曲刷新加载新数据 ',res.data)//请求数据测试                                     
                    loading.value = false;   
                    //请求成功时执行 
                    if(res.data.code==200){
                      //空值处理
                      if(!res.data.result.hasOwnProperty('songs')){
                      finished.value = true;
                      }
                      else{
                        saveSongCount(res.data.result.songCount)
                        saveHasMore(res.data.result.hasMore)
                        loadNewSongs(res.data.result.songs)
                        changePage()
                      }
                    }else{
                      store.commit('saveQuery','默认搜索')
                    }
                   
                  
                  },(err)=>{
                    console.log(err)
                  })
                }          
                            
                if (!hasMore.value) {
                  finished.value = true;
                }
            }, 2000);
        
        
      };
  
      const onRefresh = () => {     
        //因为onLoad()是异步触发的，可能存在onLoad在触发时，onRefresh再度触发，导致onLoad再度执行
        //因此在onLoad函数的loading状态结束之前，都不允许在执行onLoad
        if(loading.value){
          console.log('已经在加载了,取消新的加载请求')
          return;
        }
        else{
          // 清空列表数据
        finished.value = false;
  
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        loading.value = true;
        onLoad();
        }

       
      };
      
      //点击某个曲目
      const clickId=ref(0)
      const listClick=(e)=>{
        let {id}=e.currentTarget.dataset   
        clickId.value=Number(id)
       //测试是否有版权
        proxy.$http("/check/music?id=" + clickId.value).then(res=>{
            if(res.data.success){
               getUrl()
                //因为songs上没有存储picUrl,因此调用其他接口，获取歌手的cover作为picUrl
                // console.log(songs.value,query);
           
               store.dispatch('getCoverAction',{ songs:songs.value, query:query.value })  
          }else{
            Toast({
              message: res.data.message,
              position: 'bottom',
            });
          }
        })
       

      }
      const getUrl=()=>store.dispatch('getUrlAction',clickId.value)
      const saveHasMore=(hasMore)=>store.commit('saveHasMore',hasMore)
      const loadNewSongs=(songs)=>store.commit('loadNewSongs',songs)
      const changePage=()=>store.commit('changePage')
      const saveSongCount=(songCount)=>store.commit('saveSongCount',songCount)
      
      return {
        songs,onLoad,loading,finished,onRefresh,refreshing,
        clickId,listClick,
        store,
        query
      };
    },
  };
  </script>
  <style scoped lang='less'>

    // .van-cell{
    //   padding: 0px 20px;
    // }
    .clickEffect{
      background-color: #aaa;
    }
  </style>
  