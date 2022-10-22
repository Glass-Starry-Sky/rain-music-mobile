<!-- -------------------------------------------------------------
*     推荐歌单
-------------------------------------------------------------- -->
<template>
    <div class="sheet-recommend-container">
        <div class="header">
            <div class="title">推荐歌单</div> 
            <div @click="refresh" class="iconfont icon-shuaxin"></div>
        </div>
         
        
        <div class="swipe-track" >
            <div v-for="item,index in songSheetRecommendList" :key="index" 
            :class="[index===songSheetRecommendList.length-1?'last-px':'',index===0?'first-px':'']">
                <CommonPic class="swipe-item" :title="item.name" :coverImgUrl="item.coverImgUrl" 
                @click="clickRecommendSongSheet" 
                :data-id="item.id" :data-name="item.name" :data-coverimgurl="item.coverImgUrl"></CommonPic>
            </div>
            
        </div>
        
 
    </div>
       
</template>
<script>

import { ref,getCurrentInstance,reactive , onBeforeMount} from 'vue'; 
import CommonPic from '@/components/commonPic/CommonPic';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
     
     components:{
        CommonPic
     },
   setup() {
        const store=useStore()
        const $router=useRouter()
        //随机获取
        //使用全局axios
        const { proxy } = getCurrentInstance()
        

        /**-------------------------------------------------------------
        *  点击刷新
        --------------------------------------------------------------*/ 
        const refresh=()=>{
        console.log('SongSheetRecommend-> refresh')
        // requestNewRecommendSongs()

        // if(localStorage.getItem('songSheetRecommendList')===null){
                let randomNum=Math.floor(Math.random()*total)
                // console.log('randomNum',randomNum)
                proxy.$http("/top/playlist?limit=6&order=hot&offset="+randomNum).then(res=>{
                    console.log('recommend->获取推荐歌单' ,res.data)
                    //直接赋值等方式都会导致其变为非响应式！！！
                    //先清空
                    songSheetRecommendList.splice(0)
                    res.data.playlists.map((item)=>{
                        songSheetRecommendList.push(item)
                    })
                    store.commit('saveSongSheetRecommendListToLocal',songSheetRecommendList)
                })
            // }
        }


        /**-------------------------------------------------------------
        *  点击某个歌单
        --------------------------------------------------------------*/ 
        let recommendSongSheetList={label:'',picUrl:'',singleSongList:[]}    
        //数据格式 -> {label:'xxx',picUrl:'',singleSongList: [
        // {id=' ',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        const clickRecommendSongSheet=(e)=>{
            console.log(e.currentTarget.dataset);
            let data=e.currentTarget.dataset
            //获取点击歌单的名字和id
            let name=data.name
            let id=data.id
            let coverImgUrl=data.coverimgurl
            
            recommendSongSheetList.label=name
            recommendSongSheetList.picUrl=coverImgUrl
            
            //发送歌单id  /playlist/detail?id=24381616获取详情
            // proxy.$http(`/playlist/detail?id=${id}`).then(res=>{
            //     console.log(res.data);
            // })

            //&limit=40
            proxy.$http(`/playlist/track/all?id=${id}&limit=400&offset=0`).then(res=>{
                // console.log(res.data);

                let audioSongName=''
                let cover=''
                let singleSongList=[]
                //处理 id:'', musicUrl:'xxx',,audioSongName:'',audioArtistsName:'aa/bb',cover:'.jpg'
                for(let item of res.data.songs){
                    audioSongName=item.name
                    cover=item.al.picUrl                 
                    id=item.id    //因为无法直接获取musicUrl，因此将id保存起来，在歌单中点击单曲时，会利用此id获取对应的musicUrl
                    
                    let audioArtistsName=''
                    //获取处理后的歌手名字
                    for(let index in item.ar){                        
                        if(index==item.ar.length-1){
                            //最后一个时，直接把原来的歌声名字加入即可
                            audioArtistsName+=item.ar[index].name                                                 
                        }else{                  
                            //有斜杠的时候
                            audioArtistsName+=item.ar[index].name
                            audioArtistsName+='/'
                        }                 
                    }

                    let obj={id,musicUrl:'',audioSongName,audioArtistsName,cover}
                    singleSongList.push(obj)
                }
                // console.log('singleSongList',singleSongList);
                
                recommendSongSheetList.singleSongList=singleSongList
                // console.log('recommendSongSheetList',recommendSongSheetList);
                //保存
                store.commit('saveRecommendSongSheetList',recommendSongSheetList)
                let label=recommendSongSheetList.label
                let picUrl=recommendSongSheetList.picUrl
                $router.push({
                    name:`onesongsheet`,
                    query:{label,picUrl}
                })
            })          
        }


        /**-------------------------------------------------------------
        *  获取推荐的歌单
        --------------------------------------------------------------*/     
        let songSheetRecommendList=reactive([])

        let total=637-6  //为了防止随机到最后几个
        onBeforeMount(()=>{
            //没有存值，或者其他条件时，主动请求
            if(localStorage.getItem('songSheetRecommendList')===null){
                
                let randomNum=Math.floor(Math.random()*total)
                // console.log('randomNum',randomNum)
                proxy.$http("top/playlist?limit=6&order=hot&offset="+randomNum).then(res=>{
                    console.log('recommend->获取推荐歌单' ,res.data)
                    //直接赋值等方式都会导致其变为非响应式！！！
                    res.data.playlists.map((item)=>{
                        songSheetRecommendList.push(item)
                    })
                    store.commit('saveSongSheetRecommendListToLocal',songSheetRecommendList)
                })
            }
            else{
                let list=JSON.parse(localStorage.getItem('songSheetRecommendList')) 
                list.map((item)=>{
                        songSheetRecommendList.push(item)
                    })
                // console.log('得到了存储的推荐歌单',songSheetRecommendList)
            }


           
        })
      

      return {
        store,
        songSheetRecommendList,
        clickRecommendSongSheet,
        refresh

      }
   },
}
</script>
<style scoped lang='less'>
    .sheet-recommend-container{
        width: 100%;
        background-color: #ffffff;
        border-radius: 10px;
        // padding-left:5px;
        // padding-right:15px;

        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
            width: 100%;
            height:40px;
            padding:0 15px;
            
            .title{
                height:100%;
                line-height:40px;
                font-size: 17px;
                font-weight: 600;
                float: left;
            }
            .icon-shuaxin{
                font-size: 22px;
            }
        }
        
        ::-webkit-scrollbar{display: none;}
        .swipe-track{
            display: flex;
            width: 100%;
            height: 100%;
            overflow-x: scroll;
            padding-bottom:10px;
            margin-bottom:10px;
            
            
        }
        
        .swipe-item{
            
            width: 108px!important;
            margin-left:10px;
           
        }
        .first-px{
            margin-left:5px;
        }
        .last-px{
            margin-right:15px;
        }

    }
</style>
