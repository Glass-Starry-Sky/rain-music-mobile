/**-------------------------------------------------------------
 * AudioPlay 组件
 -------------------------------------------------------------*/
import axios from "axios"
import 'vant/es/toast/style';
import { Toast } from 'vant';

const forAudioPlay = {
    state: {
        audioPlayInfo: {
            id: '',
            musicUrl: '',
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            audioSongName: '暂无歌曲',
            audioArtistsName: '',
            cover: '',
        },
        controlPlay: false,
        autoPlay: false,
        collectShow: false,
        playInterfaceShow: false,
        curPlayListShow: false,
        //维护一个播放模式
        playMode: 1,
        progressDragEvent: 1    //用于监听  变化了则触发
    },
    mutations: {
        saveUrl(state, url) {
            state.audioPlayInfo.musicUrl = url
            // console.log('saveUrl->', state.audioPlayInfo);

            //允许autoPlay
            this.commit('allowToAutoPlay')

        },
        allowToAutoPlay(state) {
            state.autoPlay = true
            console.log('allowToAutoPlay');
        },
        notAllowToAutoPlay(state) {
            state.autoPlay = false
        },
        /**-------------------------------------------------------------
        *   播放 控制
        --------------------------------------------------------------*/
        controlPlayTrue(state) {
            state.controlPlay = true

        },
        controlPlayFalse(state) {
            state.controlPlay = false

        },

        /**-------------------------------------------------------------
        *   修改播放模式
        --------------------------------------------------------------*/
        changePlayMode(state) {
            // 模式一共三种 :循环  单曲  顺序    (1-3)
            state.playMode++
            if (state.playMode == 4) {
                state.playMode = 1
            }
            switch (state.playMode) {
                case 1:
                    Toast({
                        message: '随机播放',
                        position: 'bottom',
                    });
                    break;
                case 2:
                    Toast({
                        message: '单曲循环',
                        position: 'bottom',
                    });
                    break;
                case 3:
                    Toast({
                        message: '顺序播放',
                        position: 'bottom',
                    });
                    break;
            }
            localStorage.setItem('playMode', JSON.stringify(state.playMode))

        },
        saveCover(state, cover) {
            state.audioPlayInfo.cover = cover
        },
        //不能多于两个参数，因此直接用对象的形式传进来，
        saveMusicInfo(state, { id, songName, artistsName }) {
            state.audioPlayInfo.id = id
            state.audioPlayInfo.audioSongName = songName
            state.audioPlayInfo.audioArtistsName = artistsName
        },
        saveIsPlaying(state, isPlaying) {
            state.audioPlayInfo.isPlaying = isPlaying
        },
        saveCurrentTime(state, currentTime) {
            state.audioPlayInfo.currentTime = currentTime
        },
        saveDuration(state, duration) {
            state.audioPlayInfo.duration = duration
        },
        saveAlltoLocalStorage(state) {
            localStorage.setItem('audioPlayInfo', JSON.stringify(state.audioPlayInfo))
        },

        saveCollectShow(state, show) {
            state.collectShow = show
        },
        saveCurPlayListShow(state, show) {
            state.curPlayListShow = show
        },

        playInterfaceToShow(state) {
            state.playInterfaceShow = true
        },
        playInterfaceNotShow(state) {
            state.playInterfaceShow = false
        },
        triggerProgressDragEvent(state) {
            state.progressDragEvent = 1 - state.progressDragEvent
        },
        audioPlayInitial(state) {

            if (localStorage.getItem("audioPlayInfo") !== null) {
                state.audioPlayInfo = JSON.parse(localStorage.getItem("audioPlayInfo"))
                state.audioPlayInfo.isPlaying = false

                console.log('audioPlay初始化', state)

            }

            if (localStorage.getItem("playMode") !== null) {
                state.playMode = JSON.parse(localStorage.getItem("playMode"))

            }

        },


    },
    actions: {
        async saveAllAudioPlayInfoAction({ commit, dispatch, state }, singleSongItem) {
            try {
                //如果没有保存musicUrl,需要主动获取一次
                if (singleSongItem.musicUrl == '') {
                    await dispatch('getUrl', singleSongItem.id)
                    singleSongItem.musicUrl = state.audioPlayInfo.musicUrl
                }

                state.audioPlayInfo = { ...state.audioPlayInfo, ...singleSongItem }
                commit('saveAlltoLocalStorage')
            }
            catch (error) {
                console.log('出错啦')
            }

        },
        saveDurationAndCurrentTimeToLocalAction({ commit, state }, { duration, currentTime }) {
            let obj = { duration, currentTime }
            state.audioPlayInfo = { ...state.audioPlayInfo, ...obj }
            commit('saveAlltoLocalStorage')
        },

        getUrl({ commit }, clickId) {
            // 获取音乐播放路径
            return new Promise(resolve => {
                axios.get("/song/url?id=" + clickId).then(res => {
                    //---------------------------------------------------------------------
                    commit('saveUrl', res.data.data[0].url)
                    console.log('getUrl获取了歌曲路径!', res.data.data)
                    resolve('')
                })
            })

        },


        //获取到Url,并且获取forSearchResult下的singleMusicList，用于更改歌曲名字和歌手名字
        async getUrlAction({ commit, dispatch, rootState }, clickId) {
            try {

                await dispatch('getUrl', clickId)

                //更改audioPlay的信息    (id,歌曲名字和歌手名字)
                for (let item of rootState.forSearchResult.singleMusicList) {
                    // console.log(item.id, clickId);
                    if (item.id == clickId) {
                        let { songName, artistsName } = item
                        commit('saveMusicInfo', { id, songName, artistsName })
                        console.log(item)
                    }
                }
                //保存到内存中
                commit('saveAlltoLocalStorage')
            }
            catch (error) {
                console.log('出错啦')
            }




        },
        //按照歌手id ， 获取封面图片
        getCoverAction({ commit }, { songs, query }) {
            // console.log('songs, query', songs, query)
            let artistId = null
            for (let item of songs[0].artists) {
                if (item.name.includes(query)) {
                    // console.log('查找到了对应歌手')

                    artistId = item.id
                }
            }
            //保存封面图
            axios.get(`/artist/detail?id=${artistId}`).then(res => {
                let { cover } = res.data.data.artist
                // console.log('store->获取到了对应封面', cover)
                commit('saveCover', cover)
                commit('saveAlltoLocalStorage')
            }, (err) => {
                console.log('获取歌手头像失败');
            })
        },

        /**-------------------------------------------------------------
        *   播放另一首歌   (先保存当前歌曲信息，再允许播放)    
        --------------------------------------------------------------*/
        changeAudioPlayCurMusicAction({ commit, dispatch }, singleSongItem) {
            dispatch('saveAllAudioPlayInfoAction', singleSongItem)
            commit('allowToAutoPlay')
            commit('controlPlayTrue')
        }
    },
    //相当于计算属性
    getters: {

    },
}

export default forAudioPlay;