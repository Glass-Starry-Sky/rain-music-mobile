/**-------------------------------------------------------------
 * SongSheetView 组件
 -------------------------------------------------------------*/

import axios from "axios"
import { Dialog, Notify, Toast } from 'vant';
import 'vant/es/notify/style';

const forSongSheet = {
    // 存储数据的地方
    state: {
        //我的歌单 里的所有歌单及其歌曲
        mySongSheetList: [
            //若本地url ---- picUrl:require('../../assets/images/songSheetDefaultPic.jpg')
            //数据格式 -> {label:'xxx',picUrl:'',count:9,singleSongList: [
            //   {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        ],
        //注：此list只存储一个歌单，每次点击一个推荐歌单，则覆盖掉原来的
        recommendSongSheetList: {
            //数据格式 -> {label:'xxx',picUrl:'',singleSongList: [
            // {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        },
        //当前选择的歌单
        currentSingleSongList: [
            //数据格式 -> {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}  
        ],
        //珍藏歌曲
        heartSingleSonglist: [
            //数据格式 -> {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}  
        ],
        //收藏的歌单
        collectSongSheetList: [
            //数据格式 -> {label:'xxx',picUrl:'',count:9,singleSongList: [
            // {id:'',musicUrl:'xxx',audioArtistsName:'Lefty Hand Cream',audioSongName:'恋音と雨空',cover:'.jpg'}]    
        ],
        showCreate: false,
        showRename: false,
        moreShow: false,
    },
    // 修改state的唯一手段
    mutations: {

        saveCreateShow(state, showCreate) {
            state.showCreate = showCreate
        },
        saveRenameShow(state, showRename) {
            state.showRename = showRename
        },
        saveMoreShow(state, moreShow) {
            state.moreShow = moreShow
        },
        /**-------------------------------------------------------------
        *   添加收藏歌单 
        --------------------------------------------------------------*/
        addCollectSongSheetList(state, obj) {
            state.collectSongSheetList.push(obj)
            console.log(state.collectSongSheetList);
            //saveTOLocal
            localStorage.setItem('collectSongSheetList', JSON.stringify(state.collectSongSheetList))
        },
        /**-------------------------------------------------------------
        *   添加珍藏歌曲  , 要判断id是否重复
        --------------------------------------------------------------*/
        addHeartSingleSongItem(state, obj) {
            let isExist = false
            //大于一个才去判断
            if (state.heartSingleSonglist.length > 0) {
                state.heartSingleSonglist.map((item) => {

                    if (item.id == obj.id) {
                        isExist = true
                        Notify({ type: 'danger', message: '该歌曲已收藏' });
                    }
                })
            }
            if (!isExist) {
                state.heartSingleSonglist.push(obj)
                //saveTOLocal
                localStorage.setItem('heartSingleSonglist', JSON.stringify(state.heartSingleSonglist))
                // console.log(state.heartSingleSonglist)
            }


        },
        /**-------------------------------------------------------------
        *  添加歌单  , 要判断名字是否重复
        --------------------------------------------------------------*/
        addMySongSheetList(state, label) {
            let isExist = false
            state.mySongSheetList.map((item) => {
                if (item.label == label) {
                    isExist = true
                    Notify({ type: 'danger', message: '歌单名重复' });
                }
            })
            if (!isExist) {
                let obj = { label, picUrl: require('../../assets/images/songSheetDefaultPic.jpg'), count: 0, singleSongList: [] }
                state.mySongSheetList.unshift(obj)
                console.log('state.mySongSheetList', state.mySongSheetList)
            }

        },
        /**-------------------------------------------------------------
        *  删除我的歌单
        --------------------------------------------------------------*/
        deleteMySongSheetList(state, label) {
            for (let index in state.mySongSheetList) {
                if (state.mySongSheetList[index].label == label) {
                    console.log(`准备删除:${label}`);
                    state.mySongSheetList.splice(index, 1)
                    this.commit('saveMySongSheetListToLocal')
                }
            }
        },
        /**-------------------------------------------------------------
        *   删除收藏歌单
        --------------------------------------------------------------*/
        deleteCollectSheetList(state, label) {
            for (let index in state.collectSongSheetList) {
                if (state.collectSongSheetList[index].label == label) {
                    console.log(`准备删除:${label}`);
                    state.collectSongSheetList.splice(index, 1)
                    //toLocal
                    localStorage.setItem('collectSongSheetList', JSON.stringify(state.collectSongSheetList))
                }
            }
        },
        /**-------------------------------------------------------------
        *   删除珍藏单曲
        --------------------------------------------------------------*/
        deleteHeartSingleSonglist(state, id) {

            for (let index in state.heartSingleSonglist) {
                if (state.heartSingleSonglist[index].id == id) {
                    console.log(`准备删除`);
                    state.heartSingleSonglist.splice(index, 1)
                    console.log(state.heartSingleSonglist)
                    //toLocal
                    localStorage.setItem('heartSingleSonglist', JSON.stringify(state.heartSingleSonglist))
                }
            }
        },
        multipleDeleteOneOfSongSheetList(state, { labelList, choose }) {
            let theSongSheetList = []
            switch (choose) {
                case "myedit":
                    theSongSheetList = state.mySongSheetList
                    break;
                case "collectedit":
                    theSongSheetList = state.collectSongSheetList
                    break;
            }
            console.log('theSongSheetList', theSongSheetList, choose)
            for (let label of labelList) {
                for (let index in theSongSheetList) {
                    if (theSongSheetList[index].label == label) {
                        console.log(`准备删除:${label}`);
                        // theSongSheetList.splice(index, 1)
                        if (choose === 'myedit') {
                            state.mySongSheetList.splice(index, 1)
                            this.commit('saveMySongSheetListToLocal')
                        }
                        else if (choose === 'collectedit') {
                            state.collectSongSheetList.splice(index, 1)
                            localStorage.setItem('collectSongSheetList', JSON.stringify(state.collectSongSheetList))
                        }


                    }
                }
            }

        },
        /**-------------------------------------------------------------
        *  重命名歌单
        --------------------------------------------------------------*/
        renameMySongSheetList(state, { label, newSheetName }) {
            let isExist = false
            state.mySongSheetList.map((item) => {
                if (item.label == label) {
                    isExist = true
                    Notify({ type: 'danger', message: '歌单名重复' });
                }
            })

            if (!isExist) {
                for (let index in state.mySongSheetList) {
                    if (state.mySongSheetList[index].label == label) {
                        console.log(`重命名:${label}->新名字为:${newSheetName}`);
                        state.mySongSheetList[index].label = newSheetName
                        this.commit('saveMySongSheetListToLocal')
                    }
                }
            }

        },
        /**-------------------------------------------------------------
        *   交换歌单顺序
        --------------------------------------------------------------*/
        exchangeSongSheetList(state, { whichSongSheet, index, index2 }) {
            let temp = {}
            console.log(whichSongSheet, index, index2);
            let newList = null
            switch (whichSongSheet) {
                case 'myedit':
                    newList = state.mySongSheetList

                    temp = newList[index]
                    newList[index] = newList[index2]
                    newList[index2] = temp

                    state.mySongSheetList = []
                    newList.map((item) => {
                        state.mySongSheetList.push(item)
                    })
                    // console.log('newList', newList);
                    // console.log('state.mySongSheetList', state.mySongSheetList);
                    break;
                case 'collectedit':
                    newList = state.collectSongSheetList

                    temp = newList[index]
                    newList[index] = newList[index2]
                    newList[index2] = temp

                    state.collectSongSheetList = []
                    newList.map((item) => {
                        state.collectSongSheetList.push(item)
                    })
                    break;
            }
        },

        saveMySongSheetListToLocal(state) {
            localStorage.setItem('mySongSheetList', JSON.stringify(state.mySongSheetList))
        },
        saveRecommendSongSheetList(state, recommendSongSheetList) {
            state.recommendSongSheetList = recommendSongSheetList
        },
        //更新mySongSheetList    (歌曲数和封面)
        updateMySongSheetList(state, { i, cover }) {
            state.mySongSheetList[i].count = state.mySongSheetList[i].singleSongList.length
            state.mySongSheetList[i].picUrl = cover
        },

        //得到当前选择的歌单里的歌曲     
        changeCurSheetSingleSongList(state, label) {
            //去recommendSongSheetList里寻找（点击推荐歌单时触发）

            if (state.recommendSongSheetList.label == label) {
                console.log('changeCurSheetSingleSongList->从recommendSongSheetList找到了对应歌单的名字', state.recommendSongSheetList.singleSongList);
                state.currentSingleSongList = state.recommendSongSheetList.singleSongList
            }
            //搜索歌单时点击某歌单时触发，数据来自forSearchResult
            else if (this.state.forSearchResult.searchSongSheetOneMusicList.label == label) {
                console.log(this.state.forSearchResult.searchSongSheetOneMusicList.label);
                state.currentSingleSongList = this.state.forSearchResult.searchSongSheetOneMusicList.singleSongList
            }
            //从收藏的歌单中寻找
            else if (
                state.collectSongSheetList.map((item) => {
                    if (item.label === label) {
                        console.log('changeCurSheetSingleSongList->从收藏的歌单中找到了对应的名字');
                        state.currentSingleSongList = item.singleSongList
                    }
                })

            ) { }


            if (1) {
                //如果找不到，从mySongSheetList寻找
                state.mySongSheetList.map((item) => {

                    if (item.label === label) {
                        console.log('changeCurSheetSingleSongList->从mySongSheetList找到了对应歌单的名字', item.singleSongList);
                        state.currentSingleSongList = item.singleSongList
                    }
                })
            }
            //保存currentSingleSongList，以便第一次登陆时获取
            localStorage.setItem('currentSingleSongList', JSON.stringify(state.currentSingleSongList))


        },
        /**-------------------------------------------------------------
        *   初始化
        --------------------------------------------------------------*/

        songSheetInitial(state) {
            //存在
            if (localStorage.getItem('mySongSheetList')) {
                state.mySongSheetList = JSON.parse(localStorage.getItem('mySongSheetList'))
            }
            if (localStorage.getItem('heartSingleSonglist')) {
                state.heartSingleSonglist = JSON.parse(localStorage.getItem('heartSingleSonglist'))
            }
            if (localStorage.getItem('collectSongSheetList')) {
                state.collectSongSheetList = JSON.parse(localStorage.getItem('collectSongSheetList'))
            }
            if (localStorage.getItem('currentSingleSongList')) {
                state.currentSingleSongList = JSON.parse(localStorage.getItem('currentSingleSongList'))
            }
        },

    },
    // 处理的方法
    actions: {
        //在我的歌单中选中歌单添加一首单曲
        addMySheetSingleSongListAction({ commit, state }, { label, singleSong }) {

            for (let i = 0; i < state.mySongSheetList.length; i++) {
                let isExist = false;
                if (state.mySongSheetList[i].label === label) {
                    //优先判断将要存入的歌曲是否已经存在 ,遍历内部的singleSongList
                    for (let item of state.mySongSheetList[i].singleSongList) {
                        if (singleSong.musicUrl === item.musicUrl) {
                            console.log('歌曲已经存在！');
                            isExist = true;
                        }
                    }

                    if (!isExist) {
                        //一定要转成普通对象，如果是proxy式的会导致数据被覆盖！
                        let obj = { ...singleSong }
                        state.mySongSheetList[i].singleSongList.unshift(obj)
                        commit('updateMySongSheetList', { i, cover: singleSong.cover })
                        commit('saveMySongSheetListToLocal') //保存
                    }
                    else {
                        //显示信息
                        // Dialog.confirm({
                        //     // title: '标题',
                        //     message: '歌曲已存在',
                        //     asyncClose: true,
                        //     showCancelButton: false
                        // }).then(() => {
                        //     // for (let i = 0; i < 1000 * 10000; i++)
                        //     // setTimeout(() => {
                        //     Dialog.close();
                        //     // }, 1000);
                        // })
                        //     .catch(() => {
                        //         Dialog.close();
                        //     });

                        Notify({ type: 'danger', message: '歌曲已经存在' });
                    }
                }

            }

        },



    },
    //相当于计算属性
    getters: {

    },
}
export default forSongSheet;