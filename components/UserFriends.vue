<template>
	<view>
		
	<!-- 搜索框 -->
	<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]" style="position: relative;height:44px">
		<view class="search-form round">
			<text class="cuIcon-search"></text>
			<input type="text" placeholder="输入搜索的关键词" confirm-type="search"></input>
		</view>
		<view class="action">
			<button class="cu-btn bg-gradual-green shadow-blur round">搜索</button>
		</view>
	</view>
	
	
	
		
	
	</view>
</template>

<script>
	// 导入加号悬浮窗
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	// 导入折叠面板
	import uniCollapse from '@/components/uni-collapse/uni-collapse.vue'
	import uniCollapseItem from '@/components/uni-collapse/uni-collapse-item.vue'
	//导入标题栏弹窗框组件
	import uniDrawer from '@/components/uni-drawer.vue'
	export default {
		components: {
			uniCollapse,
			uniCollapseItem,
			uniDrawer,
			uniFab},
		onNavigationBarButtonTap(){
			// 设置弹窗栏的属性为真
			this.IsVisible=!this.IsVisible
		},
		// 监听页面返回
		onBackPress() {
			this.IsVisible=!this.IsVisible
		},
		data() {
			return {
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				IsVisible: false,
				GroupList: [],
				UserList: [],
				list: [],
				tabCur: 50,
				modalName: null,
				mainCur: 0,
				de_index: 50,
				CustomBar: this.CustomBar,
				verticalNavTop: 0,
				load: true
			};
		},
		// 页面加载时候初始化数据
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			// 获取分组信息
			var _self=this;
			uni.getStorage({
				key: 44,
				success(res) {
					// 读取聊天信息(分组列表)
					_self.GroupList=res.data.grouplist;
					console.log(_self.GroupList)
					// 读取用户好友列表
					_self.UserList=res.data.memberlist
					console.log(_self.UserList)
				}
			});

		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			closeDrawer(){
				this.IsVisible=false
			},
			showModal(e) {
				this.modalName = 'DialogModal1'
			},
			hideModal(e) {
				this.modalName = null
			},
			TabSelect(e) {
				// 点击后将当前的值赋予data值
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				console.log('tabCur:'+this.tabCur+'----'+'mainCur:'+this.mainCur)
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
		
		},
	}
</script>

<style>
	.uni-padding-wrap {
		padding: 0 15px;
		line-height: 1.8;
	}
	.fixed {
		position: fixed;
		z-index: 99;
	}
</style>
