//vue3的vuex使用方法   
//分割成一个个模块
import { createStore } from 'vuex'


import forRecommend from './forRecommend/forRecommend'
import forAudioPlay from './forAudioPlay/forAudioPlay.js'
import forSearchResult from './forSearchResult/forSearchResult.js'
import forSongSheet from './forSongSheet/forSongSheet'
import forMyView from './forMyView/forMyView'
import forHomeSwipe from './forHomeSwipe/forHomeSwipe'

let store = createStore({
  modules: {
    forSearchResult,
    forAudioPlay,
    forRecommend,
    forSongSheet,
    forMyView,
    forHomeSwipe
  }


});

//初始化,注：千万不要加onload，否则会拖慢加载的时间，导致vuex初始化比组件onMounted慢
// window.onload = function () {
store.commit('audioPlayInitial')
store.commit('songSheetInitial')

// }

export default store;