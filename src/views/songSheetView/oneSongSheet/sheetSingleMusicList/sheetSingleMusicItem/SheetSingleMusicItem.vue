<!-- -------------------------------------------------------------
*   sheetSingleMusicItem
-------------------------------------------------------------- -->

<template>
    <div class="container">
        <div class="left">
            {{index+1}}
        </div>
        <div class="middle">
            <span class="songname">{{audioSongName}}</span>
            <div class="tabs">
                <span class="tab">SQ</span>
                <div class="artists">{{audioArtistsName}}</div>
                <!-- <div v-for="item,index in artistsName" :key="index" class="artists"
                    :class="query==item?'mark-artist-name':''" ref="artists">
                    {{item}}
                </div> -->
            </div>
            
            <!-- <span>小标签</span> -->
        </div>
        <div class="right">
            <span class="iconfont icon-play-square"> </span>
            <van-icon  name="ellipsis" class="more" />
        </div>
    
    </div>      
</template>
<script>
      import {useStore} from 'vuex'
    import {onMounted, reactive, ref} from 'vue'
export default {
    props:{
        audioArtistsName:String,
        audioSongName:String,
        musicUrl:String,
        index:Number

    },
   setup(props) {
    const store=useStore()

    let audioArtistsName=ref(props.audioArtistsName)
    let audioSongName=ref(props.audioSongName)
    let musicUrl=ref(props.musicUrl)
    let index=ref(props.index)
 
   

    onMounted(()=>{
        
    })
    


      return {
        store,
        audioArtistsName,audioSongName,musicUrl,index
      }
   },
}
</script>
<style scoped lang='less'>
    .container{
        // height: 70px;
        width: 100vw;
        // background-color: aqua;
        display: flex;  
        justify-content: space-between;
        padding:0 15px;
        box-sizing: border-box;
        .left{
            width: 40px;
            height:40px;
            margin:15px 0;
            
            text-align: center;
            line-height: 40px;
            border: 1px solid #fac;
            border-radius: 10px;
        }
        .middle{
            display: flex;  
            margin-left:15px;       
            width: 65%;   
            flex-direction: column;
            white-space: nowrap;
            padding:15px 0;
            box-sizing: border-box;
            justify-content: space-around;
            .songname{
                text-align: start;
                font-size: 16px;
                font-weight: 500;
                color:black;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .tabs{
                display: flex;           
                flex-direction: row;

                .tab{
                    font-size: 12px;
                    transform: scale(0.8);
                    padding: 1.5px 3px;
                    box-sizing: border-box;
                    margin-left:-2px;
                    border: 1px solid rgba(red, 0.7);
                    border-radius: 5px;
                    color: red;
                }
                .artists{
                    font-size: 10px;
                    margin-left:2px;
                    color: #777;
                    &:last-child{
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
             }            
        }
        .right{
            display: flex;          
            // height: 100%;
            width: 80px;
            // padding-right: 20px;
        }
        
        .icon-play-square{
            margin: auto auto;
            color: #bbb;
            font-size: 20px;
            font-weight: 500;
        }
        .more{

            margin: auto auto;
            transform: rotate(90deg);
            color: #bbb;
            font-size: 16px;
            font-weight: 700;
        }
        .mark-artist-name{
            color: rgb(#6089de)!important;
            font-size: 13px!important;
        }
    }
    
</style>
