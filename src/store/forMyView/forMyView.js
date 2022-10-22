/**-------------------------------------------------------------
 * MyView 组件
 -------------------------------------------------------------*/
import axios from "axios"

const forMyView = {
    state: {
        info: {
            avatarUrl: '',
            username: ''
        }
    },
    mutations: {
        saveInfo(state, info) {
            state.info = { ...state.info, ...info }
        },

    },
    actions: {

    },
    //相当于计算属性
    getters: {

    },
}

export default forMyView;