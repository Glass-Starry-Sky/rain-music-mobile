<!-- -------------------------------------------------------------
*   用于EditSongSheet组件
-------------------------------------------------------------- -->
<template>
    <div class="null-box">
       
        <div class="card-item" >
          <div class="left">
              <van-checkbox v-model="newChecked" @click="saveCheckedList"
                class="checkbox"></van-checkbox>
              <div >
                <img class="item-icon" :src="songSheetItem.picUrl" alt="">           
              </div>             
          </div>
          <div class="middle">
                <span class="middle-label" >{{songSheetItem.label}}</span>
                <slot class="middle-count" ></slot>
          </div>
          <div class="right" >  
                <span class="right-icon iconfont icon-drag" 
                @touchstart.stop="itemDrag"></span>          
          </div>
          

      </div> 
    </div>
          
</template>
<script>

import {computed, onMounted, onUpdated, ref, watch } from 'vue'
export default {
   props:{
    songSheetItem:Object,
    checked:Boolean,
    index:Number
   },
   emits:['itemDrag','saveCheckedList'],
   setup(props, { emit }) {
        let songSheetItem=ref(props.songSheetItem)
        let checked = computed(()=>props.checked);
        let newChecked=ref(false)

        let index=computed(()=>props.index)
        // const checked = ref(true);

        watch(checked,(newValue,oldValue)=>{
            newChecked.value=checked.value

        })
    /**-------------------------------------------------------------
    *   触发父组件saveCheckedList事件
    --------------------------------------------------------------*/
    const saveCheckedList=()=>{

        // console.log('saveCheckedList',checked.value,index.value,songSheetItem.value.label);
        emit('saveCheckedList',index.value,newChecked.value)
    }

    /**-------------------------------------------------------------
    *   触发父组件itemDrag事件
    --------------------------------------------------------------*/
    const itemDrag=(e)=>{

        emit('itemDrag',e)
    }
     

    onMounted(()=>{
        
        // console.log(newChecked,checked.value);
    })
      return {
        songSheetItem,
        itemDrag,
        checked,newChecked,saveCheckedList

      }
   },
}
</script>
<style scoped lang='less'>
    .null-box{
        
        width: 100vw;
        height: 80px;

        box-sizing: border-box;
    }
    .card-item{
      
        display: flex;
        width: 100%;
        height: 80px;
        // line-height: 70px;
        padding:0 15px;
        box-sizing: border-box;
        align-items: center;
        margin-bottom: 10px;
        .left{
            display: flex;
            flex-direction: row;
            align-items: center;
            width:90px;
            height:80px;
            .checkbox{
                margin-right:10px;
            }
            .item-icon{
                width:50px;
                height:50px; 
                border-radius: 10px;
                overflow: hidden;
            }
        }
        .middle{
        display:flex;
        margin-left:10px;
        flex:1;
        flex-direction: column;
        white-space: nowrap;
        text-align: start;
        overflow: hidden;
            .middle-label{

                overflow: hidden;
                white-space:nowrap;
                text-overflow: ellipsis;
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
    

    .icon-drag{
        font-size: 20px;
        color: var(--theme-color);

    }
</style>
