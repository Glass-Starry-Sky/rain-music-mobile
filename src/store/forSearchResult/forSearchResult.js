/**-------------------------------------------------------------
 * SearchResult 组件
 -------------------------------------------------------------*/

import axios from "axios"

const forSearchResult = {
    // 存储数据的地方
    state: {
        songs: [],
        page: 1,
        pageSongSheet: 1,
        limit: 20,
        hasMore: true,
        hasMoreSongSheet: true,
        query: '',
        queryHistoryList: localStorage.getItem("queryHistoryList") === null ? [] : JSON.parse(localStorage.getItem("queryHistoryList")),
        songCount: 0,
        //存储单次搜索的每一首歌曲信息  (由searchResult下的SingleMusicItem组件负责)
        singleMusicList: [],

        //searchSongSheetList:{sheetId:'',label:'xxx',picUrl:'',count:9,singleSongList: [
        //   {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        searchSongSheetList: [],
        //只存储一个歌单的值和其保存的歌曲
        //数据格式 -> {label:'xxx',picUrl:'',singleSongList: [
        // {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        searchSongSheetOneMusicList: []
    },
    // 修改state的唯一手段
    mutations: {
        /**-------------------------------------------------------------
        *   到达底部 新增搜索到的歌单
        --------------------------------------------------------------*/
        addSearchSongSheet(state, obj) {
            state.searchSongSheetList.push(obj)
        },

        getSongs(state) {
            return state.songs
        },

        saveSearchSongSheetOneMusicList(state, searchSongSheetOneMusicList) {
            state.searchSongSheetOneMusicList = searchSongSheetOneMusicList
            console.log('state.searchSongSheetOneMusicList', state.searchSongSheetOneMusicList);
        },
        saveSongs(state, songs) {
            // state.songs = null    //如果没有实时响应，尝试此方法
            state.songs = songs
            console.log('触发了saveSongs方法,获取20条曲目', state.songs)
        },
        saveQuery(state, query) {
            state.query = query
            console.log('触发了saveQuery方法', state.query)
            //保存搜索历史
            for (let index in state.queryHistoryList) {
                if (state.queryHistoryList[index] === query) {
                    //去重，删掉该项
                    state.queryHistoryList.splice(index, 1)
                }
            }
            state.queryHistoryList.unshift(query)
            //超过一定数量，则删除最后一项
            if (state.queryHistoryList.length > 10) {
                state.queryHistoryList.pop()
            }
            //保存到localStorage中
            localStorage.setItem('queryHistoryList', JSON.stringify(state.queryHistoryList))
        },
        /**-------------------------------------------------------------
        *   清除搜索历史
        --------------------------------------------------------------*/
        deleteQueryHistoryList(state) {
            state.queryHistoryList = []
        },
        saveHasMore(state, hasMore) {
            state.hasMore = hasMore
        },
        saveHasMoreSongSheet(state, boolean) {
            state.hasMoreSongSheet = boolean
        },
        loadNewSongs(state, newSongs) {
            newSongs.map(item => state.songs.push(item))

        },

        changePage(state) {
            state.page++
        },
        changePageSongSheet(state) {
            state.pageSongSheet++
        },
        //搜索新的关键词时，重置页码
        resetPage(state) {
            state.page = 1
            state.pageSongSheet = 1
        },
        resetHasMore(state) {
            state.hasMore = true
            state.hasMoreSongSheet = true
        },
        saveSongCount(state, songCount) {
            state.songCount = songCount
        },

        //保存singleMusicItem到singleMusicList
        saveSingleMusicList(state, singleMusicItem) {
            state.singleMusicList.push(singleMusicItem)
            // console.log(state.singleMusicList)
        },
        resetSingleMusicList(state) {
            state.singleMusicList = []
        }
    },
    // 处理的方法
    actions: {
        //从context对象中直接解构出commit
        getSongsAction({ commit }) {
            commit('getSongs')
        },

        //进行搜索操作时调用，不包括加载操作
        searchAction({ commit, dispatch, state, rootState }) {
            // { commit, state, rootState }
            // console.log(context)

            axios.get(`/search?limit=${state.limit}&keywords=${state.query}`).then(res => {
                console.log('searchAction', res.data.result)

                let { songs } = res.data.result

                // let query = state.query
                // dispatch('getCoverAction', { songs, query })
                commit('saveSongs', songs)
                commit('resetPage')
                commit('resetHasMore')
                commit('resetSingleMusicList')
            })
        },
        /**-------------------------------------------------------------
        *   搜索歌单
        --------------------------------------------------------------*/
        searchSongSheetAction({ commit, state }) {
            axios.get(`/search?type=1000&limit=${state.limit}&keywords=${state.query}`).then(res => {
                // console.log('playlists', res.data.result.playlists)
                let playlists = res.data.result.playlists

                //先清空
                state.searchSongSheetList = []
                playlists.map((item) => {
                    let obj = {}
                    obj.label = item.name
                    obj.sheetId = item.id
                    obj.picUrl = item.coverImgUrl
                    obj.count = item.trackCount
                    obj.playCount = item.playCount
                    obj.creator = item.creator.nickname
                    state.searchSongSheetList.push(obj)
                })

                console.log('state.searchSongSheetList', state.searchSongSheetList);
            })
        },


    },
    //相当于计算属性
    getters: {

    },
}
export default forSearchResult;