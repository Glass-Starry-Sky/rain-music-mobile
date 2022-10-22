<template>
     <div class="common-pic-container">
        <div class="pic"><img :src="coverImgUrl"   alt=""></div>
        <div class="title">{{title}}</div>
     </div>     
</template>
<script>
import { computed,onUpdated } from '@vue/runtime-core'
export default {
    props:{
        title:String,
        coverImgUrl:String
    },  
   setup(props) {
        let title=computed(()=>props.title)
        const coverImgUrl=computed(()=>props.coverImgUrl)
       
        // onUpdated(() => {
        //     console.log('coverImgUrl',coverImgUrl)
        // })
      return {
        title,coverImgUrl
      }
   },
}
</script>
<style scoped lang='less'>
    .common-pic-container{
        .pic{
            // width: 108px;
            // height: 108px;
            // overflow: hidden;
            // background-color: #ececec;
            img{
                border-radius: 15px;
                width: 100%;
                height: 100%;
            }
        }
        .title{           
            width: 100%;
            font-size: 13px;
            
            //超过两行显示省略号
            display :-webkit-box ;
            overflow: hidden;
            -webkit-line-clamp :2 ; 
            -webkit-box-orient :   vertical ; 
            text-overflow: ellipsis;
        }
    }
</style>
