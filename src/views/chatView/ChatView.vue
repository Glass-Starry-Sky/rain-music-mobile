<template> 
    <div class="chat-header">
        <ChatHeader></ChatHeader>
    </div>
    <div class="main-container">
        <div style="color:var(--theme-color);margin-bottom:10px;font-weight:600;
        border-bottom:1px solid var(--theme-color);border-top:1px solid var(--theme-color); ">
            全部房间
        </div>
        <div class="room-box" >
            
             <div v-for="item,index in roomCardList" :key="index">

                    <div class="room-card"  ref="roomCard">
                    
                        <div class="room-card-top">
                            <span>{{item.roomName}}</span>
                            <span class="tab">{{item.tabs[0]}}</span>
                        </div>
                        <div>
                            <span>{{item.description}}</span>
                        </div>
                        <div>
                            <span>人数:{{item.human}}</span>
                        </div>
                    </div>
             
            
            </div>
        </div> 
        
    </div>
    <div class="bottom-null"></div>
    
</template>
<script>
import { ref } from '@vue/reactivity'
import ChatHeader from '@/components/header/chatHeader/ChatHeader'
import { onMounted } from '@vue/runtime-core'
export default {
    component:{
        ChatHeader
    },
   setup() {
        //随机颜色
        let randomList=['1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','f','f','f']      
        let colorListLeft=[]
        let colorListRight=[]
        let lc1='' ; let lc2='' ; let lc3='' ; let lc4='' ; let lc5='' ; let lc6=''
        let rc1='' ; let rc2='' ; let rc3='' ; let rc4='' ; let rc5='' ; let rc6=''
        let i1='' ; let i2='' ; let i3='' ; let i4='' ; let i5='' ; let i6=''
        // let f='f'
        for(let i=0;i<10;i++){
            //只随机到e, 但rc(right color 可以到f)
            i1=Math.floor(Math.random()*11)+3
            i2=Math.floor(Math.random()*14)
            i3=Math.floor(Math.random()*11)+3
            i4=Math.floor(Math.random()*14)
            i5=Math.floor(Math.random()*11)+3
            i6=Math.floor(Math.random()*14)

            lc1=randomList[i1]
            lc2=randomList[i2]
            lc3=randomList[i3]
            lc4=randomList[i4]
            lc5=randomList[i5]
            lc6=randomList[i6]

            
            rc1=randomList[i1+4]
            rc2=randomList[i2+2]
            rc3=randomList[i3+4]
            rc4=randomList[i4+2]
            rc5=randomList[i5+4]
            rc6=randomList[i6+2]
            colorListLeft[i]=`#${lc1}${lc2}${lc3}${lc4}${lc5}${lc6}`
            colorListRight[i]=`#${rc1}${rc2}${rc3}${rc4}${rc5}${rc6}`
            // console.log(colorListLeft[i]);
        }
        const roomCard=ref(null)
        onMounted(()=>{
            //`linearGradient(to right,${colorListLeft},${colorListRight})`
 
            for(let index in roomCardList){
                // console.log('linear-gradient(to right,'+ colorListLeft[index] +','+ colorListRight[index] +')');

                roomCard.value[index].style.background='linear-gradient(to right,'+ colorListLeft[index] +','+ colorListRight[index] +')'
            }
  
        })
       

        const roomCardList=[
            {roomName:'聊聊天',tabs:['快乐'],description:'神仙房',human:15},
            {roomName:'随便听听',tabs:['随缘','自动换歌'],description:'一起听歌',human:23},
            {roomName:'学习房',tabs:['自习'],description:'抓紧学习',human:10},
            {roomName:'主题辩论',tabs:['辩论'],description:'',human:15},
            {roomName:'古典曲风',tabs:['古典'],description:'',human:2},
            {roomName:'安静听歌',tabs:['自习'],description:'想听啥听啥',human:5},
            {roomName:'五音不全',tabs:['练习'],description:'',human:37},
            {roomName:'英语口语练习',tabs:['英语'],description:'',human:30},
            {roomName:'说唱',tabs:['听歌'],description:'唱的不好不要介意',human:25},
            {roomName:'空房间',tabs:[''],description:'无',human:0}
        ]
    

      return {
        roomCardList,colorListLeft,colorListRight,
        roomCard
      }
   },
}
</script>
<style scoped lang='less'>
    .chat-header{
        height:100%;
        width: 100%;
        // background-color:#42b983;
        background-color: var(--theme-color); 
        margin-bottom: 10px;
    }
    .main-container{
        height:100%;
        width: 100vw;
        // background-color: rgb(218, 122, 122);
        // overflow: scroll;
        padding: 0 15px;
        box-sizing: border-box;
        .room-box{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            width: 100%;
            
            
        }
        .room-card{
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            height: 100px;
            width: 160px;
            background-color: #cfa;
            
            border-radius: 10px;
            margin-bottom: 10px;
            .room-card-top{
                display: flex;
                justify-content: space-between;
                padding: 0 15px;
                align-items: center;
          
            }
            .tab{
                font-size: 12px;
                border-radius: 20px;
                border: 1px solid #ccc;
                padding:4px;
                // box-sizing: border-box;
                background-color: rgba(rgb(147, 142, 142), 0.3);
                
            }
        }
      
    }
    .bottom-null{
        height:100px;
    }
</style>
