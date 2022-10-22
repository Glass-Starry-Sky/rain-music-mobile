<!-- -------------------------------------------------------------
*   未完成，不使用
-------------------------------------------------------------- -->
<template>
    <div class="main" ref="toast" v-if="isShow">
        <div class="title">随机播放</div>   
    </div>
    <div class="container-take-up">     
        <!-- <div class="overlay">      
        </div>       -->
    </div>
    
</template>
<script>

import { ref,onMounted } from 'vue'
export default {
    
   setup(props,{emit}) {
    let isShow=ref(true)

    // const toast=ref(null)
    //1.5秒后取消显示
    onMounted(() => {
        console.log('toast!!')
        setTimeout(()=>{
            isShow.value=false
        },1500)
    })
      return {
        isShow
      }
   },
}
</script>
<style scoped lang='less'>
    template{
        position:relative;
    }
    .main{
        display: flex;
        align-items: center;
            position:absolute;
            z-index:5001;
            top:70%;
            left:50%;

            transform: translate(-50%,-50%);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            background-color: rgb(255, 255, 255);
            // height: 200px;
            width:30%;
            height: 30px;
            .title{
                margin-top:10px;
            }
        }


  
</style>
