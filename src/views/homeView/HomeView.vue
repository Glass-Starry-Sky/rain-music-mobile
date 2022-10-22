<template>
  <div class="home">
      <Header></Header>
      <HomeTopSearch/>
      <HomeSwipe />
      <SongSheetRecommend></SongSheetRecommend>
      <SingleSongRecommend></SingleSongRecommend>
      <div class="tip-last">没有更多了</div>
  </div>
</template>

<script>
import Header from '@/components/header/homeHeader/HomeHeader.vue';
import HomeTopSearch from './sub/HomeTopSearch'
import HomeSwipe from './sub/HomeSwipe';
import SongSheetRecommend from './sub/SongSheetRecommend';
import SingleSongRecommend from './sub/SingleSongRecommend';
export default {
  components:{
    Header,
    HomeTopSearch,
    HomeSwipe,
    SongSheetRecommend,
    SingleSongRecommend
  }
}
</script>

<style scoped lang='less'>
  .home{
    background-color: #ececec;
  
    margin-bottom:100px;  //减去两个底部组件的距离
  }
  .tip-last{
    margin-top:10px;
    height:30px;
  }
</style>

