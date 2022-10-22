

const forRecommend = {
    // 存储数据的地方
    state: {
        // songSheetRecommendList:[]
        cardList: {
            title: '今日推荐',
            hasBorder: true,
            cardLimit: {
                // {id:'',label:'我的消息',picUrl:'',artistsNameList:[]}, 
            }
        }
    },
    // 修改state的唯一手段
    mutations: {
        saveSongSheetRecommendListToLocal(state, list) {
            localStorage.setItem('songSheetRecommendList', JSON.stringify(list))
        },
        saveSingleSongRecommendToLocal(state, list) {
            localStorage.setItem('cardLimit', JSON.stringify(list))
        },
        saveCardList(state, cardList) {
            state.cardList = cardList
        },
        cardListRefresh(state) {
            //执行三次，将3组commandCard2替换到最后，(今日推荐只显示处于cardLimit的前三组数据，即12首歌)
            for (let i = 0; i < 3; i++) {
                let item = state.cardList.cardLimit.shift()
                state.cardList.cardLimit.push(item)
            }

            console.log('state.cardList.cardLimit', state.cardList.cardLimit);
        },
        singleSongRecommendInitial(state) {
            state.cardList.cardLimit = JSON.parse(localStorage.getItem('cardLimit'))
        }

    },
    actions: {
        //从context对象中直接解构出commit
        //   getSongsAction({ commit }) {
        //     commit('getSongs')
        //   },



    },
    //相当于计算属性
    getters: {

    },
}
export default forRecommend;