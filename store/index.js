import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
    	// 当前登录用户的id
    	account_key: '',
		// 当前登陆用户加密后的密码
		account_psw: '',
		// 用户分组列表
		G_GroupList: [],
		// 用户好友列表
		G_UserList: [],
		account_token: '',
		account_secret: ''
    },
    mutations: {
    	setKey(state,newKey){
    		state.account_key=newKey;
    	},
		setPsw(state,newPsw){
			state.account_psw=newPsw;
		},
		setG_G_GroupList(state,newGL)
		{
			state.G_GroupList=newGL;
		},
		setG_UserList(state,newUL)
		{
			state.G_UserList=newUL;
		},
		setToken(state,newTK)
		{
			state.account_token=newTK;
		},
		setSC(state,newSC){
			state.account_secret=newSC;
		}
    }
})

export default store
