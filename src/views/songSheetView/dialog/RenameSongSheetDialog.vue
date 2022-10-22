<template>
      <Dialog title="歌单重命名"  @confirm="confirm" @cancel="cancel" >
        <van-field  class="input-box" v-model="text" placeholder="请输入新的歌单名称" />
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
    props:{
      oldSheetName:String
    },
    setup(props) {
      const store=useStore()
      let text=ref('')     //input里的text值
      let oldSheetName=computed(()=>props.oldSheetName)
      let newSheetName=ref('')
      const confirm=()=>{
        console.log('触发了父dialog的confirm方法',oldSheetName.value)
        newSheetName.value=text.value
        store.commit('renameMySongSheetList',{label:oldSheetName.value,newSheetName:newSheetName.value})
        store.commit('saveRenameShow',false)        //取消dialog
      
      }

      const showRename = computed(()=>store.state.forSongSheet.showRename);
      const cancel=()=>{
        console.log('触发了父dialog的cancel方法')
        store.commit('saveRenameShow',false)        //取消dialog
      
      }

  
      return { 
        store,showRename,
        text,cancel,confirm,
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
