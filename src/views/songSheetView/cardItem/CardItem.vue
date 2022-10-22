<!-- -------------------------------------------------------------
*   卡片内部单个Item,用于MySongSheet组件
-------------------------------------------------------------- -->
<template>
     <div class="card-item" >
          <div class="left">
              <div >
                <img class="item-icon" :src="songSheetItem.picUrl" alt="">
                <!-- <img class="item-icon" src="../../../assets/images/songSheetDefaultPic.jpg" alt=""> -->
              </div>             
          </div>
          <div class="middle">
                <span class="middle-label" >{{songSheetItem.label}}</span>
                <slot class="middle-count" ></slot>
          </div>
          <div class="right">   
                <span class="right-icon"  @click.stop="clickMore" :data-label="songSheetItem.label"
                ><van-icon name="ellipsis" class="more"/></span>
          </div>
          

      </div>      
</template>
<script>

import {ref } from 'vue'
export default {
   props:{
    songSheetItem:Object
   },

   emits:['clickMore'],

   setup(props, { emit }) {
        let songSheetItem=ref(props.songSheetItem)


        const clickMore=(e)=>{
            //触发父组件的clickMore
            console.log(e.currentTarget.dataset);

            emit('clickMore',e.currentTarget.dataset.label)
        }
      return {
        songSheetItem,
        clickMore
      }
   },
}
</script>
<style scoped lang='less'>
    .card-item{
        display: flex;
        width: 100%;
        height: 50px;
        padding:0 15px;
        box-sizing: border-box;
        align-items: center;
        margin-bottom: 10px;
        .left{
            width:50px;
            height:50px;
         
            .item-icon{
                width:50px;
                height:50px; 
                border-radius: 10px;
                overflow: hidden;
            }
        }
        .middle{
        display:flex;
        // margin-left:10px;
        padding: 0 5px 0 10px;
        width: 100%;
        box-sizing: border-box;
        flex-direction: column;
        white-space: nowrap;
        text-align: start;
        overflow: hidden;
       
            .middle-label{
                height: 100%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                
            }
        }
        .right{
            width:10%;
            .right-icon{
                float:right;

                .more{

                margin: auto auto;
                transform: rotate(90deg);
                color: #aaa;
                font-size: 16px;
                font-weight: 700;
                }
            }
        }
    }
    
</style>
