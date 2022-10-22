<template>
    <van-swipe class="my-swipe" :autoplay="10000" indicator-color="#42b983" lazy-render
    v-if="swipePicList.length>0">
        <van-swipe-item><img :src="swipePicList[0]" alt="图片加载中..."></van-swipe-item>
        <van-swipe-item><img :src="swipePicList[1]" alt="图片加载中..."></van-swipe-item>
        <van-swipe-item><img :src="swipePicList[2]" alt="图片加载中..."></van-swipe-item>
        <van-swipe-item><img :src="swipePicList[3]" alt="图片加载中..."></van-swipe-item>     
    </van-swipe>    

    <van-swipe class="my-swipe" :show-indicators="false"
    v-if="swipePicList.length===0" >

        <van-swipe-item><van-loading type="spinner" style="display: inline-block;" size="20" />图片加载中...</van-swipe-item>
        <van-swipe-item><van-loading type="spinner" style="display: inline-block;" size="20" />图片加载中...</van-swipe-item>
        <van-swipe-item><van-loading type="spinner" style="display: inline-block;" size="20" />图片加载中...</van-swipe-item>
        <van-swipe-item><van-loading type="spinner" style="display: inline-block;" size="20" />图片加载中...</van-swipe-item>     
    </van-swipe>   
</template>
<script>

import { getCurrentInstance, reactive,ref,onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'

export default {
   setup() {
    const store=useStore()
    //使用全局axios
    const { proxy } = getCurrentInstance()


    let swipePicList=computed(()=>store.state.forHomeSwipe.swipeList.swipePicList)
    onBeforeMount(() => {



      if(swipePicList.value.length===0){
          //发布时，/api/  需要删去
          proxy.$http("banner?type=1").then(res=>{
            console.log(res)
            for(let i=0;i<4;i++){
              swipePicList.value.push(res.data.banners[i].pic)
            }

            // console.log('banner',res.data,swipePicList)
            //目前没有别的数据要存，因此直接赋值
            let swipeList=swipePicList.value
            store.commit('saveSwipeList',swipeList)
          })
      }
          
    })
      return {
        swipePicList
      }
   },
}
</script>
<style scoped lang='less'>
  .my-swipe .van-swipe-item {
      margin-top: 10px;
      margin-bottom: 10px;
      color: #fff;
      font-size: 20px;
      // line-height: 150px;
      text-align: center;
      background-color: #e6eaec;
      // background-color: #ffffff;
      border-radius: 15px;
  
  }
  .van-swipe-item{
    flex:1;
    // width: 100%!important;#ba7c12,#fa12ba
    background: linear-gradient(to right,#9fc1c1,#664e5f)!important;
    margin:0 15px;

    img{
      width: 100%;
      height: 100%;
    }
  }
  :deep(.van-swipe__indicators){
      top:80%;
      // left:52%;
  }
  .van-loading{
    background-color:transparent;
  }
</style>
