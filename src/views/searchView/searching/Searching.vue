<template>
    <TopSearch class="topSearch"></TopSearch>  

    <div class="history bak-color">
        <h4>历史</h4>
        <van-icon name="delete-o" class="delete-history" @click="deleteHistory"/>
    </div>
    <div class="search-history-item-box bak-color">
        <span class="search-history-item" v-for="(item,index) in queryHistoryList" :key="index"
        @click="clickHistoryItem">
            {{item}}
        </span>
    </div>

    <div class="cart-card-title">音乐专区</div>
    <div class="cart-card-box" > 
        <CartCard  v-for="item,index in cartCardList" :key="index" :cartCardItem="item"
         ref="cart">
            <template v-slot:default="" v-if="item.descript!=''">
                 <div class="descript">{{item.descript}}</div>   
            </template>
        </CartCard>
    </div>
   
    <!-- <common v-if="是否输入中(否)"></common>
    <searchList v-if="是否输入中(是)"></searchList> -->
</template>
<script>
    import TopSearch from '../topSearch/TopSearch.vue';
    import CartCard from './sub/CartCard.vue';

    import { useRouter  } from 'vue-router'
    import { useStore } from 'vuex'
    import { Dialog } from 'vant';
import { computed, ref } from '@vue/runtime-core';
export default {
    components:{
        TopSearch,CartCard
    },
   setup() {
    let cart=ref(null)
    // console.log(cart)
    let cartCardList=[
         {title:'歌手分类', cardLeftColor:'#b1223b',cardRightColor:'#f6778f',icon:'',descript:''},
         {title:'典藏馆',   cardLeftColor:'#b233b4',cardRightColor:'#f788f8',icon:'',descript:'收录众多优质乐谱'},
         {title:'经典曲谱', cardLeftColor:'#b34b55',cardRightColor:'#f89f99',icon:'',descript:'经典'},
         {title:'爵士专区', cardLeftColor:'#b4b566',cardRightColor:'#d9dabb',icon:'',descript:''},
         {title:'影视原声', cardLeftColor:'#bb6677',cardRightColor:'#ffbbcc',icon:'',descript:'听歌追剧好时光'},
         {title:'翻唱专区', cardLeftColor:'#b6b21b',cardRightColor:'#f8f76f',icon:'',descript:''},
         {title:'说唱专区', cardLeftColor:'#7b3b8b',cardRightColor:'#cf8fdf',icon:'',descript:''},
         {title:'电音专区', cardLeftColor:'#55b43b',cardRightColor:'#aaf96f',icon:'',descript:''},
     
      ]

    const $router=useRouter()
    const store = useStore()

    const queryHistoryList=computed(()=>store.state.forSearchResult.queryHistoryList)
    

    /**-------------------------------------------------------------
    *   删除历史记录
    --------------------------------------------------------------*/
    const deleteHistory=()=>{
        // console.log('delete');
        Dialog.confirm({
                    title: '删除历史记录',
                    message:
                        `确认要删除吗`
                    })
                    .then(() => {
                        store.commit('deleteQueryHistoryList')                 
                    })
                    .catch(() => {
                        // on cancel
                    });
        
    }

    //点击搜索历史的小标签，进行搜索
    const clickHistoryItem=(e)=>{
        // console.log(e.target.innerText)
        let query=e.target.innerText
 
        saveQuery(query)
        store.dispatch('searchAction')
        $router.push({ path: 'searchResult' })   
    }

    const saveQuery=(query)=>store.commit('saveQuery',query)
      return {
        queryHistoryList,
        clickHistoryItem,
        cartCardList,cart,
        deleteHistory

      }
   },
}
</script>
<style scoped lang='less'>
    .topSearch{
        padding-top: 20px;
        box-sizing: border-box;
    }
    .bak-color{
        background-color: rgb(255, 255, 255);
    }
    .history{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 20px;
       
        .delete-history{
            font-weight: 500;
            color: #aaa;
            font-size: 22px;

        }
    }
    .search-history-item-box{
        height: 80px;
        width: 100%;
        padding-left:10px;
        box-sizing: border-box;
        overflow: hidden;
        .search-history-item{
            float:left;
            height:20px;
            background-color: #abc;
            margin: 5px;
            padding: 5px 12px;
            border-radius: 15px;
        }
    }
    .cart-card-title{
        text-align: left;
        margin:15px;
        color:#888;
        font-size: 16px;
        border-bottom: 1px solid #42b983;
        box-shadow:4px 10px 30px #84c9aa;;

    }
    .cart-card-box{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 15px;
    }
    .descript{
        width: 100%;
        height: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: -5px;
        color: rgb(211, 228, 232);
        background-color: rgba(rgb(234, 226, 226), 0.1);
        font-size: 12px;
        
   }

</style>
