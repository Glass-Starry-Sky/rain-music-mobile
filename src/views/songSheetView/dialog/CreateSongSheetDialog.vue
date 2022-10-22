<template>
      <Dialog title="创建新歌单"  @confirm="confirm" @cancel="cancel" >
        <van-field  class="input-box" v-model="text" placeholder="请输入歌单名称" />
      </Dialog>
  
  

</template>
<script>

import { computed, ref } from 'vue';
import Dialog from './commonDialog/CommonDialog.vue'
import { useStore } from 'vuex'

export default {
  components:{
    Dialog
  }, 

    setup() {
      const store=useStore()
      let text=ref('')
      let songSheetName=ref('')
      const confirm=()=>{
        console.log('触发了父dialog的confirm方法')
        songSheetName.value=text.value
        store.commit('addMySongSheetList',songSheetName.value)  //新增歌单
        store.commit('saveCreateShow',false)        //取消dialog
        store.commit('saveMySongSheetListToLocal')  //保存到local
      }

      let showCreate=computed(()=>store.state.forSongSheet.showCreate)
      const cancel=()=>{
        console.log('触发了父dialog的cancel方法')
        store.commit('saveCreateShow',false)
      
      }

  
      return { 
        store,showCreate,
        text,
        confirm,songSheetName,
        cancel,showCreate
       };
    },
  };   
</script>
<style scoped lang='less'>
  .input-box{
    height:70px;
    padding-top:0;
  }
  :deep(.van-field__body){
    line-height: 70px;

  }
</style>
