<template>
    <van-action-sheet  :title="title+':'+' '+ sheetName" @click-overlay.stop="close" 
    :closeable="false" class="morePopUpContainer">
       <div class="content">
         <div v-for="item,index in moreList" :key="index" class="content-item item-hover"
         @click="clickMoreItem" :data-label="item.label">
            <div class="iconfont" :class="item.icon"></div>
            <div>{{item.label}}</div>
         </div>   
       </div>

        
    </van-action-sheet>
</template>
<script>
import '@/assets/fonts/header/iconfont.css'


import { computed,reactive,ref} from 'vue';
import { useStore } from 'vuex'
export default {

props:{
   title:String,
   sheetName:String,
   moreList:Array
},
emits:['clickMoreItem'],
setup(props,{emit}) {

 const store=useStore()


let title=computed(()=>props.title)
let sheetName=computed(()=>props.sheetName)
let moreList=computed(()=>props.moreList)
/**-------------------------------------------------------------
*  点击遮罩层关闭
--------------------------------------------------------------*/
 const close=()=>{
    store.commit('saveMoreShow',false)       
 }

/**-------------------------------------------------------------
*  向调用此组件的父组件 通知点击事件，并将触发的item的label名称传入
--------------------------------------------------------------*/
const clickMoreItem=(e)=>{
   let {label}=e.currentTarget.dataset
   emit('clickMoreItem',{label,sheetName:sheetName.value})
}

 return {
    close,
    title,sheetName,moreList,
    clickMoreItem
    
 }
},
}
</script>
<style scoped lang='less'>
.morePopUpContainer{
   z-index: 200;
}
.content{
   width: 100%;
   .content-item{
      display: flex;
      padding:0 15px;
      box-sizing: border-box;
      height:40px;
      align-items: center;
      &>div:nth-child(1){
         margin-right:15px;
      }
   }
}
//手机端的hover等于click
.item-hover:hover{
 background-color: #ccc;
}

</style>
