<template>
      <div class="cardContainer">
        <slot class="title" name="title"></slot>
        <div class="card-item" v-for="item,index in cardList" :key="index"
        :class="hasBorder?'item-border':''">
            <div class="left">
                <span class="item-icon iconfont icon-box"></span>
                <span>{{item.label}}</span>
            </div>
            <div class="right">
                <span class="iconfont icon-youjiantou"> </span>
            </div>
            

        </div>
      </div>    
</template>
<script>
    import '@/assets/fonts/header/iconfont.css'
    import {reactive} from 'vue'
export default {
    props:{
        hasBorder:Boolean,
        cardList:Array
    },
   setup(props) {

        const hasBorder=props.hasBorder
        const cardList=reactive(props.cardList)
      return {
        hasBorder,cardList
      }
   },
}
</script>
<style scoped lang='less'>
    .cardContainer{
        width: 100%;
        background-color: rgb(255, 255, 255);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 15px;
        padding: 0 15px;
        box-sizing: border-box;
    }
    
    .card-item{
        display:flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        
        .item-icon{
            margin-right:10px;
        }
    }
    .item-border{
        border-bottom: 0.1px solid #ddd;
    }
</style>
