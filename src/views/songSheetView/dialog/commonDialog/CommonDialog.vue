<template>
    <div class="container">
        <div class="overlay">
        <div class="main">
            <div class="title">{{title}}</div>
            <slot></slot>
            <div class="bottom">
                <div class="cancel" @click="clickCancel">取消</div>
                <div class="confirm" @click="clickConfirm">确认</div>
            </div>
           
        </div>
    </div>      
    </div>
    
</template>
<script>

import { ref } from 'vue'
export default {
    props:{
        title:String
    },
    emits: ['confirm','cancel'],
   setup(props,{emit}) {
    let title=ref(props.title)

    const clickConfirm=()=>{
        emit('confirm')
    }
    const clickCancel=()=>{
        emit('cancel')
    }
      return {
        title,clickConfirm,clickCancel
      }
   },
}
</script>
<style scoped lang='less'>
    .container{
        position:fixed;
        top:0%;
        left:0%;
    }
    .overlay{
        position:relative;
        top:0%;
        left:0%;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.6);
        z-index:5000;
        .main{
            position:absolute;
            z-index:5001;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            background-color: rgb(255, 255, 255);
            // height: 200px;
            width:90%;
            .title{
                margin-top:10px;
            }
            .bottom{
                display:flex;
                // margin-bottom: 5px;
                // justify-content: space-around;
                width: 100%;
                overflow: hidden;
                
                .cancel{
                    height:40px;
                    width:50%;
                    line-height: 40px;
                    border-radius: 0 0 0 15px;
                    &:hover{
                    background-color: #ccc;
                    }
                }
                .confirm{
                    height:40px;
                    width:50%;
                    line-height: 40px;
                    border-radius: 0 0 15px 0;
                    color:#42b983;
                    &:hover{
                    background-color: #ccc;
                    }
                }
                
            }
        }
    }
</style>
