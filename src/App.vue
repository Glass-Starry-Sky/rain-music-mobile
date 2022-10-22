<template>
  <div class="box-background">
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav> -->
    <router-view class="router-view"/>
    <div >
      <!-- 注，千万不要将v-show修改为v-if，否则绑定时机会出现问题 -->
      <AudioPlay v-show="!playInterfaceShow&&route.path!='/login'" class="audioplay"></AudioPlay>
      <tabbar v-if="!playInterfaceShow&&route.path!='/login'" class="tabbar"></tabbar>
    </div>
   
  </div>
  

</template>

<script>
  import tabbar from '@/components/tabbar/Tabbar.vue'
  import AudioPlay from './components/audioPlay/AudioPlay';

  import {useStore} from 'vuex'
import { computed } from '@vue/runtime-core';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import getTheme from './assets/js/getTheme';
  export default {
    components:{
      tabbar,AudioPlay
    },
    setup() {
      const store=useStore()
      const route=useRoute()
      const router=useRouter()
      const playInterfaceShow=computed(()=>store.state.forAudioPlay.playInterfaceShow)
      // store.commit('audioPlayInitial')

      if(localStorage.getItem('Authorization')=='null'||localStorage.getItem('Authorization')==''){
        router.replace({path:'/login'})
      }
      
      //主题初始化操作
      getTheme()
      
      return {
        playInterfaceShow,route
      }
    }
  }
</script>

<style lang="less">
  //全局设置  加载效果的背景色
  .van-loading{
    background-color: var(--theme-text);
  }
  .van-popup--top{
    height:70px;
  }
  .van-search__content{
    background-color: rgb(255, 255, 255)!important;
    height:40px;
    .van-field__control{
      height: 30px;;
    }
  }
:root{

  --van-popover-action-width:120px!important;
  --theme-color:#3a9ada;
  --theme-color-green:#1cb771;
  // --theme-color-green:#6ee6d2;
  --theme-color-pink:#ce5f93;
  --theme-color-blue:#3a9ada;

  --theme-text:#c0f9f5;
  --theme-text-green:#c5f6e0;
  --theme-text-pink:#f2b1f3;
  --theme-text-blue:#c0f9f5;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      // color: #42b983;
       color: var(--theme-color);
    }
  }
}
.box-background{

  // background-color: #cfc;
  
  background-color: #ffffff;
 
}


.audioplay{
  z-index:99;
}
.tabbar{
  z-index: 1;
}


// color:#42b983;
</style>
