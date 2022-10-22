<!-- -------------------------------------------------------------
*   先调用commonList ，内部插槽放入singleMusicItem
-------------------------------------------------------------- -->

<template>
    <CommonList :songs="songs" class="single-music-list">
        <!-- slotProps拿取传过来的props -->
        <template v-slot:default="slotProps">
            <SingleMusicItem :songItem="slotProps.songItem" :query="slotProps.query"></SingleMusicItem>
  	    </template>
    </CommonList>
   
</template>
<script>

    import CommonList from '@/components/commonList/CommonList'
    import SingleMusicItem from './singleMusicItem/SingleMusicItem'

    import {computed, ref} from 'vue'
    import { useStore } from 'vuex'
export default {


    components:{
        CommonList,
        SingleMusicItem
    },

   setup() {
    const store = useStore()
 
    const songs=computed(()=>store.state.forSearchResult.songs)

      return {
        songs
      }
   },
}
</script>
<style scoped lang='less'>
    .single-music-list{
        margin-bottom: 100px;
    }
</style>
