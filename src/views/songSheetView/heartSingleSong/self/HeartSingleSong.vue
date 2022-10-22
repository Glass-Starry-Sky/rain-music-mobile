<template>
    <div class="container">
        <div class="title">珍藏歌曲列表</div>
        <HeartMusicListVue></HeartMusicListVue>    
    </div>
      
</template>
<script>
import HeartMusicListVue from '../heartMusicList/HeartMusicList'
    
export default {
    components:{
        HeartMusicListVue
    },
   setup() {
      return {
      }
   },
}
</script>
<style scoped lang='less'>
    
    .container{
        background-color: rgb(169, 130, 130);
        background-color: var(--theme-color);
        // background-color: #42b983;
        border-radius: 10px;
        // height:300px;
        .title{          
            text-align: left;
            padding:0 15px;
            box-sizing: border-box;
            border-bottom: 1px solid #777;
            width: 100%;
            height:40px;
            line-height: 40px;
        }
    }
</style>
