<!-- -------------------------------------------------------------
 * 顶部搜索栏组件，将搜索的数据传递出去
 *------------------------------------------------------------ -->

<template>
   <div style="background-color:white">
      <van-search v-model="query" placeholder="林俊杰" @search="onSearch" />   
   </div>
       
</template>
<script>
 
 import { ref,getCurrentInstance, computed } from 'vue'; 
 import { useRouter , useRoute } from 'vue-router'
 import { useStore } from 'vuex'
import { Notify } from 'vant';
import 'vant/es/notify/style';

export default {

   setup() {
      const store = useStore()
      //使用全局axios
      const { proxy } = getCurrentInstance()

      const $router=useRouter()
      const $route=useRoute()

      //注：此处不要用计算属性，否则即使修改query的值，也会被store里的query重新赋值
      const query=ref(store.state.forSearchResult.query)
     
     
     
     /**-------------------------------------------------------------
     *   点击enter后触发搜索回调
     --------------------------------------------------------------*/

      const onSearch = (val) => {
            console.log(val,query.value);
            if(val==''){
               Notify({ type: 'danger', message: '搜索值不能为空',position: 'bottom', });
            }
            else{
   
               query.value=val
               //保存搜索的值
               saveQuery(query.value)
               store.dispatch('searchAction')

               $router.push({ path: 'searchResult' })    
            }
           
        };


        // 使用 mutation，触发mutation不需要指定模块名
        const saveSongs= (songs) => store.commit('saveSongs',songs)
        const saveQuery=(query)=>store.commit('saveQuery',query)
        return { 
            onSearch,query,
            store,saveSongs
    
         };
   },
}
</script>
<style scoped lang='less'>
   :deep(.van-field__body){
      border-bottom: 1px solid #42b983;
   }
</style>
