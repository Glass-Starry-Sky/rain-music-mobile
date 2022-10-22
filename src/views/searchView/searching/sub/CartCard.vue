<template>
     <div class="cart-card" 
     :style="{background:`linear-gradient(to right,${cartCardItem.cardLeftColor},${cartCardItem.cardRightColor})`}">
         <div class="main">
            <!-- {{cartCardItem.title}} -->
            <span class="title">{{cartCardItem.title}}</span>
            <span class="icon">{{cartCardItem.icon}}</span>
            <slot></slot>
         </div>
        
     </div>     
</template>
<script>
import { reactive } from 'vue'
export default {
   props:{
      cartCardItem:Object
    },
   setup(props) {
 
      const cartCardItem=reactive(props.cartCardItem)
      return {
         cartCardItem
      }
   },
}
</script>
<style scoped lang='less'>
   .cart-card{  
      width: 48%;
      height: 60px;
      border-radius: 10px;
      margin-bottom: 15px;
      overflow: hidden;
      .main{
         display: flex;
         height: 100%;
         width: 100%;
         align-items: center;
         flex-wrap: wrap;
         justify-content: space-between;

         .title{
            margin-left: 15px;
            color: rgb(238, 228, 228);
            font-weight: 600;
         }
         .icon{
            margin-right: 15px;
         }
      }
   }  

</style>
