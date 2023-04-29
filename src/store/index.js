import { createStore } from "vuex";

const store = createStore({
    state: {
        userInfo: {
            nickname: "",
            avatar: "",
        }
    },
    mutations: {
        updateUserInfo(state, userInfo) {
            state.userInfo = userInfo
        }
    },
    actions: {},

})

export default store;