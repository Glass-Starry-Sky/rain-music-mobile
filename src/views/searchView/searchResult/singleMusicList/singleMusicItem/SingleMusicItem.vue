<template>
    <div class="container">
        <div class="left">
            <span class="song-name">{{songName}}</span>
            <div class="tabs">
                <div class="tab">SQ</div>
                <div v-for="item,index in artistsName" :key="index" class="artists"
                    :class="query==item?'mark-artist-name':''" ref="artists">
                    {{item}}
                </div>
            </div>
            
            <!-- <span>小标签</span> -->
        </div>
        <div class="right">
            <span class="iconfont icon-play-square"> </span>
            <van-icon name="ellipsis" class="more"/>
        </div>
    
    </div>      
</template>
<script>
      import {useStore} from 'vuex'
    import {onMounted, reactive, ref} from 'vue'

export default {
    props:{
        songItem:Object,
        query:String
    },
   setup(props) {
    const store=useStore()

    let query=ref(props.query)
    // console.log(query.value)
    let songItem=reactive(props.songItem)
    let songName=songItem.name
    let songId=songItem.id
    let albumName=songItem.album.name
    let artistsName=[] 
    for(let item of songItem.artists){
        artistsName.push(item.name)
    }

    //渲染歌手名称和专辑
    let artists=ref(null)  

    //存储  如xxx/yyy/zzz形式的单条歌曲的所有歌手
    let artistsNameItem=ref('')
    let singleMusicItem=reactive({})

    onMounted(()=>{
       

        //处理歌手名字和专辑
        for(let index in artists.value){
 
            if(index==artists.value.length-1){
                //最后一个时，直接把原来的歌声名字加入即可
                artistsNameItem.value+=artists.value[index].innerText
                //如果没有专辑名，则直接跳过
                if(albumName===''){
                    //不可使用return,否则直接跳出
                    continue;
                }
                artists.value[index].innerText+=' - '+albumName
                           
            }else{
                artists.value[index].innerText+='/'
                //有斜杠的时候
                artistsNameItem.value+=artists.value[index].innerText
            }
        }

        singleMusicItem={id:songId,songName:songName,artistsName:artistsNameItem.value}
        saveSingleMusicList(singleMusicItem)
    })
    
    const saveSingleMusicList=(singleItem)=>store.commit('saveSingleMusicList',singleItem)

      return {
        store,
        query,songItem,songName,albumName,artistsName,
        artists,saveSingleMusicList
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
        .left{
            display: flex;         
            width: 75%;   
            flex-direction: column;
            white-space: nowrap;
            .song-name{
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .tabs{
                display: flex;           
                flex-direction: row;

                .tab{
                    height:22px;
                    font-size: 12px;
                    transform: scale(0.8);
                    padding: 0px 3px;
                    // box-sizing: border-box;
                    margin-left:-2px;
                    border: 1px solid rgba(red, 0.7);
                    box-sizing: border-box;
                    border-radius: 5px;
                    color: red;
                }
                .artists{
                    margin-left:4px;
                    font-size: 12px;
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
            width: 90px;
            padding-right: 20px;
            box-sizing: border-box;
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
