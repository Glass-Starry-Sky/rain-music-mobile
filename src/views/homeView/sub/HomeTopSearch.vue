<template>

      <van-search

        shape="round"
        background="#ddd"
        placeholder="请输入搜索关键词"
        @click="goToSearch"
        />    
</template>
<script>
import { useRouter , useRoute } from 'vue-router'
export default {
   setup() {
    const $router=useRouter()
    const $route=useRoute()
    const goToSearch=()=>{
        return $router.push({ path: 'searching' })    
    }
      return {
        goToSearch
      }
   },
}
</script>
<style scoped lang='less'>
  :deep(.van-field){
    margin-top:5px;
  }
</style>
