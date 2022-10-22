<template>
    <CommonHeader >
       <template v-slot:right>
            <div>
                <!-- <span class="iconfont icon-pifu pifu"></span> -->
                <span class="iconfont icon-tinggeshiqu recogniseMusic"></span>
            </div>     
        </template>
    </CommonHeader>     
</template>
<script>

import '@/assets/fonts/header/iconfont.css'

import CommonHeader from '@/components/header/commonHeader/CommonHeader'

export default {
    components:{
        CommonHeader
    },
  setup() {

     return {

     }
  },
}
</script>
<style scoped lang='less'>
        span{
               margin-left: 20px;
        }  
        .pifu{
           font-weight: 700;
       }
       .recogniseMusic{
    
           font-size: 20px;
       }
</style>
