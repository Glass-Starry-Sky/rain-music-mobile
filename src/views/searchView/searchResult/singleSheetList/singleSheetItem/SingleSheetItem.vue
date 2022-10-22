<template>
    <div class="cardContainer">
      <slot class="title" name="title" ></slot>

   
      <div class="card-item"
      @click="clickRecommendSingleSongItem">
          <div class="left">
              <span class="item-icon">
                <img src="" class="item-img" alt=""
                v-lazy="searchSongSheetItem.picUrl">
              </span>             
          </div>
          <div class="right" >
                <span class="right-label" >{{searchSongSheetItem.label}}</span>
                <div class="right-middle-box" >
                    <span>{{searchSongSheetItem.count}}首&nbsp;</span>
                    <span>---from {{searchSongSheetItem.creator}}&nbsp;</span>
                    <span v-if="searchSongSheetItem.playCount>10000">---播放{{(searchSongSheetItem.playCount/10000).toFixed(1)}}万次</span>
                    <span v-else>---播放{{searchSongSheetItem.playCount}}次</span>
                    
                </div>
 
          </div>
          

      </div>
    </div>    
</template>
<script>
import '@/assets/fonts/header/iconfont.css'
import {onMounted, reactive,onUpdated, computed} from 'vue'
export default {
  
  props:{
    searchSongSheetItem:Object
  },
  emits: ['clickRecommendSingleSong'],
  setup(props, { emit }) {
      let searchSongSheetItem=computed(()=>props.searchSongSheetItem) 



    onMounted(()=>{
        
      })
    return {
      searchSongSheetItem
      // clickRecommendSingleSongItem,
      // artistsNameListFinal
      
    }
 },
}
</script>
<style scoped lang='less'>
  .cardContainer{
      width: 100%;
      background-color: rgb(255, 255, 255);
      border-radius: 0 0 10px 10px;
      
      overflow: hidden;
    //   margin-bottom: 15px;
      padding: 0 15px;
      box-sizing: border-box;
     
  }
  
  .card-item{
      display:flex;
      align-items: center;

      overflow: hidden;
          
    //   justify-content: space-between;
      width: 100%;
      height: 60px;
      .left{
        width:50px;
        height:50px;
       
        .item-icon{
          
          img{
            
            width: 50px;
            height: 50px;
            border-radius: 10px;
          }
        }
      }
      .right{
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: left;
        width: 100%;
        height: 100%;
        padding:10px 0 10px 10px;
        padding-right:30px;
        box-sizing: border-box;
        // margin-left:15px; 
        // margin:10px 0 10px 15px;
       

        .right-label{
          width: 100%;
          color:black;
        
            font-size: 15px;      
            // width:100%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .right-middle-box{
          padding-right:15px;
          color:#666;
          font-size:13px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
       
     
        
      }
      
  }
  .item-border{
      border-bottom: 0.1px solid #ddd;
  }
  .icon-play-square{
    font-size: 22px!important;
    color: #888;
  }
</style>
