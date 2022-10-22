<template>
    <div class="cardContainer">
      <slot class="title" name="title" ></slot>

   
      <div class="card-item" v-for="item,index in cardList" :key="index" 
      :data-id="item.id" :data-picurl="item.picUrl" :data-artistsname="artistsNameListFinal[index]"
      :data-label="item.label"
      @click="clickRecommendSingleSongItem">
          <div class="left">
              <span class="item-icon"><img :src="item.picUrl" alt=""></span>             
          </div>
          <div class="right" :class="hasBorder?'item-border':''">
                <span class="right-label" >{{item.label}}&nbsp;</span>
                <span class="right-artist-name" 
                v-for="subItem,index in item.artistsNameList" :key="index">
                     <span>{{subItem.name}} </span> 
                </span>
                <span class="right-icon iconfont icon-play-square"></span>
          </div>
          

      </div>
    </div>    
</template>
<script>
import '@/assets/fonts/header/iconfont.css'
import {onMounted, reactive,onUpdated, computed} from 'vue'
export default {
  props:{
      hasBorder:Boolean,
      cardList:Array
  },
  emits: ['clickRecommendSingleSong'],
  setup(props, { emit }) {

      const hasBorder=props.hasBorder    
      // const cardList=reactive(props.cardList)   //从父组件的cardList.cardLimit[index]中得到
      // const cardList=computed(()=>props.cardList)  

      const cardList=computed(()=>props.cardList)
      // onUpdated(()=>{
      //   console.log('card2更新了',props);
        
      // })


      //触发父组件  SingleSongRecommend上的方法
      const clickRecommendSingleSongItem=(e)=>{
        console.log('props',props)

        let data=e.currentTarget.dataset
          let id=data.id
          let picUrl=data.picurl
          let songName=data.label
          let artistsName=data.artistsname
          artistsName=artistsName.substring(2)  //截取掉  '- ' 两个字符
          // console.log('name',artistsName)
       
          emit('clickRecommendSingleSong',{id,picUrl,songName,artistsName})
      }


      
      //修改歌手名字的格式
      let artistsNameListFinal=[]
      const editRightArtistsName=()=>{

        let i=0
        for(let item of cardList.value){
          // console.log(item)
              
              for(let index in item.artistsNameList){
                //注:index是字符串
                if(index==='0'){
                  item.artistsNameList[index].name='-'+' '+item.artistsNameList[index].name
         
                  //大于一项
                  if(item.artistsNameList.length>1){
                    item.artistsNameList[index].name+='/'
                  }
                }
                //最后一项，什么都不做
                else if(index==item.artistsNameList.length-1){
                  // console.log(index,'最后')    
                }else{
                    //有斜杠的时候
                    // console.log(index,'加了斜杆')
                    item.artistsNameList[index].name+='/'

                }
                //将单个Item中的歌手名字提取出来
                if(artistsNameListFinal[i]===undefined){
                  // console.log(artistsNameListFinal[i]);
                  artistsNameListFinal[i]=item.artistsNameList[index].name
                }else{
                  artistsNameListFinal[i]+=item.artistsNameList[index].name
                }
              
            }
            i++;
        }
        //最后处理出来的名字
        // console.log(artistsNameListFinal)
      }


    onMounted(()=>{
        //修改歌手名字的格式
        if(cardList.value!=null){
          editRightArtistsName()
        }
        
      })
    return {
      hasBorder,cardList,
      clickRecommendSingleSongItem,
      artistsNameListFinal
      
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
        width: 100%;
        height: 100%;
        line-height: 60px;
        overflow: hidden;
        // overflow: hidden;
        // white-space: nowrap;
        .right-label{
            float:left;
            margin-left:10px;
            text-align: left;
            max-width:60%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .right-artist-name{
          float:left;
          font-size: 12px;
          color: #bbb;
          // max-width:20%;
          // overflow: hidden;
          // white-space: nowrap;
          // text-overflow: ellipsis;
        }
        .right-icon{
            float:right;
           
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
