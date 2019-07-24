import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
    	// 当前登录用户的id
    	account_key: '',
		account_psw: ''
    },
    mutations: {
    	setKey(state,newKey){
    		state.account_key=newKey;
    	},
		setPsw(state,newPsw){
			state.account_psw=newPsw;
		}
    }
})

export default store
