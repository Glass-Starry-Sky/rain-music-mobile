<template>
        <div class="cardContainer">
            <slot name="title"></slot>
            <slot name="content"></slot>
        </div>  
</template>
<script>
export default {
   setup() {
      return {
      }
   },
}
</script>
<style scoped lang='less'>

     .cardContainer{
        width: 100%;
        height:100%;
        background-color: rgb(255, 255, 255);
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 15px;
        padding: 0 15px;
        box-sizing: border-box;
    }
</style>
