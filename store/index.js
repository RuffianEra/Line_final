import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
    	// 当前登录用户的id
    	account_key: '',
        userName: ""
    },
    mutations: {
    	setKey(state,newKey){
    		state.account_key=newKey;
    	},
    }
})

export default store
