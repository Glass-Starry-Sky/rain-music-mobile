/**-------------------------------------------------------------
 * AudioPlay 组件
 -------------------------------------------------------------*/
import axios from "axios"

const forHomeSwipe = {
    state: {
        swipeList: {
            swipePicList: []
        }


    },
    mutations: {
        saveSwipeList(state, swipeList) {
            state.swipeList = { ...state.swipeList, ...swipeList }
        },

    },
    actions: {

    },
    //相当于计算属性
    getters: {

    },
}

export default forHomeSwipe;