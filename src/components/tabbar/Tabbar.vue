<template>
                                        <!-- @change="onChange" -->
   <van-tabbar route v-model="active" active-color="#ee0a24" inactive-color="#000" class="tabbar">
        <van-tabbar-item replace to="/" >
          <div class="iconfont icon-Music"></div>
          <div class="label"> 首页</div>
        </van-tabbar-item>
        <van-tabbar-item replace to="/songsheet" >
          <div class="iconfont icon-gedan"></div>
          <div class="label">歌单</div>
        </van-tabbar-item>
        <van-tabbar-item replace to="/chat">
          <div class="iconfont icon-Chat"></div>
          <div class="label">聊天室</div>
        </van-tabbar-item>
        <van-tabbar-item replace to="/my">
          <div class="iconfont icon-music1"></div>
          <div class="label">我的</div>
        </van-tabbar-item>
  <!-- <van-tabbar-item badge="3">
    <span>自定义</span>
    <template #icon="props">
      <img :src="props.active ? icon.active : icon.inactive" />
    </template>
  </van-tabbar-item> -->
</van-tabbar>       
</template>
<script>
  
import {ref} from 'vue'  

import { Toast } from 'vant';
import 'vant/lib/index.css';
export default {
   setup() {
    const active = ref(0);
    // const onChange = (index) =>Toast({
    //             message: `标签 ${index}`,
    //             position: 'bottom',
    //             });

      return {
        active
      }
   },
}
</script>
<style scoped lang='less'>
  .tabbar{
    z-index:10;
  }
  // .icon-Music .icon-gedan .icon-Chat .icon-music1{
  //   font-size:22px;
  // }
  .iconfont{
    font-size:22px;
  }
  .label{
    font-size:13px;
  }
</style>
