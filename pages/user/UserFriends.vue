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

<!-- 默认列出我的粉丝 -->
<uniCollapse>
	<uniCollapseItem :show-animation="true" title="我的粉丝">
		<navigator :url="'/pages/chat/chat?userId='+u_index+'&avatar='+u_item.img" style="padding: 30upx;" 
		v-for="(u_item,u_index) in UserList"
		 :key="u_index">
			<view class="cu-avatar round" :style="{background:'url('+u_item.img+')'}" style="margin-right: 15px;margin-left: 10px;">
			</view>
			{{u_item.remark}}({{u_item.username}})
		</navigator>
	</uniCollapseItem>
</uniCollapse>

<!-- 循环列出用户自己的分组 -->
<uniCollapse v-for="(item,index) in GroupList" :key="index">
	<uniCollapseItem :show-animation="true" :title="item.groupname">
		<!-- 如果用户id和分组id相等就显示 -->
		<navigator :url="'/pages/chat/chat?userId='+u_index" style="padding: 30upx;" 
		v-for="(u_item,u_index) in UserList"
		 :key="u_index" v-show="u_item.groupid==item.id">
			<view class="cu-avatar round" :style="{background:'url('+u_item.img+')'}" style="margin-right: 15px;margin-left: 10px;">
			</view>
			{{u_item.remark}}({{u_item.username}})
		</navigator>
		
	</uniCollapseItem>
</uniCollapse>


<!-- 右边弹窗栏 -->
<uni-drawer :visible="IsVisible" :mode="'right'" style="margin-top:91px" @close="closeDrawer">
	<scroll-view scroll-y="true" class="qwdasd">
	<view class="qwdasd2" v-for="(item,index) in GroupList" :key="index">
		<view  class="bg-gradual-blue padding ">
			{{item.groupname}}
			<button class="cuIcon-close cu-btn bg-red sm shadow round"  style="float: right;" @tap="DeleteGroup(item.id)">
			</button>
			<button class="cuIcon-edit cu-btn bg-green sm shadow round" style="float: right;" @tap="showModal2(item.id)">
			</button>
		</view>
		
	</view>
	</scroll-view>
</uni-drawer> 

<!-- 加号弹窗 -->
<uni-fab ref="fab" :pattern="pattern" horizontal="right" vertical="bottom" direction="horizontal" @u_trigger="showModal">
</uni-fab>


 <!-- 添加好友窗口 -->
<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
	<view class="cu-dialog">
		<view class="cu-bar bg-white justify-end">
			<view class="content" style="height: 34px;">新建分组</view>
			<view class="action" @tap="hideModal">
				<text class="cuIcon-close text-red"></text>
			</view>
		</view>
		<view class="padding-xl" style="padding: 8px;">

			<view class="cu-form-group  round" style="background-color: #e5e5e5">
				<view class="title">分组名:</view>
				<input name="input" v-model="v_groupname"></input>
			</view>
		</view>
		<view class="cu-bar bg-white justify-end">
			<view class="action">
				<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
				<button class="cu-btn bg-green margin-left" @tap="AddGroup">添加</button>
			</view>
		</view>
	</view>
</view>



<!-- 修改分组窗口 -->
<view class="cu-modal" :class="modalName=='DialogModal2'?'show':''">
	<view class="cu-dialog">
		<view class="cu-bar bg-white justify-end">
			<view class="content" style="height: 34px;">修改分组</view>
			<view class="action" @tap="hideModal">
				<text class="cuIcon-close text-red"></text>
			</view>
		</view>
		<view class="padding-xl" style="padding: 8px;">

			<view class="cu-form-group  round" style="background-color: #e5e5e5">
				<view class="title">分组名:</view>
				<input name="input" v-model="groupname_edit"></input>
			</view>
		</view>
		<view class="cu-bar bg-white justify-end">
			<view class="action">
				<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
				<button class="cu-btn bg-green margin-left" @tap="EditGroup">添加</button>
			</view>
		</view>
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
			uniFab
		},
		onNavigationBarButtonTap() {
			// 设置弹窗栏的属性为真
			this.IsVisible = !this.IsVisible
		},
		// 监听页面返回
		onBackPress() {
			this.IsVisible = !this.IsVisible
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
				v_groupname: '',
				groupname_edit: '',
				modalName: null,
				mainCur: 0,
				de_index: 50,
				CustomBar: this.CustomBar,
				verticalNavTop: 0,
				load: true,
				GroupId: ''
			};
		},
		// 页面加载时候初始化数据
		onLoad() {
			uni.showLoading({
				title: '加载中...',
				mask: true
			});
			// 获取分组信息
			var _self = this;
			uni.getStorage({
				key: this.$store.state.account_key,
				success(res) {
					let all=JSON.parse(res.data);
					// 读取聊天信息(分组列表)
					_self.GroupList = all.grouplist;
					// 读取用户好友列表
					_self.UserList = all.memberlist
				}
			});
		// 页面渲染完成后隐藏初始化页面
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			closeDrawer() {
				this.IsVisible = false
			},
			showModal(e) {
				this.modalName = 'DialogModal1'
			},
			showModal2(e){
				this.modalName='DialogModal2'
				this.GroupId=e
			},
			hideModal(e) {
				this.modalName = null
			},
			AddGroup(){
				let that=this
				// 发送用户添加分组请求接口
				uni.request({
				url: 'http://www.aot9a.cn/index/user/apiaddgroup', //请求地址
					data: {
						user_id: this.$store.state.account_key,
						groupname: this.v_groupname,
						yzpass: this.$store.state.account_psw
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded', 
					},
					dataType:'json',
					method:'POST',
					success(res) {
						// 将服务器返回的分组赋值给原来分组
						that.GroupList=res.data.grouplist
						// 隐藏当前窗口
						that.modalName=null;
						uni.showToast({
							title: '添加成功!'
						})
					}
				});
			},
			DeleteGroup(res){
				let that=this;
				uni.showModal({
					content:'您确定删除该分组吗？',
					title:'删除分组',
					success(e) {
						if(e.confirm)
						{
							uni.request({
								url: 'http://www.aot9a.cn/index/user/apideletegroup', //删除分组接口
									data: {
										user_id: that.$store.state.account_key,
										groupid: res,
										yzpass: that.$store.state.account_psw
									},
									header: {
										'content-type': 'application/x-www-form-urlencoded', 
									},
									dataType:'json',
									method:'POST',
									success(res) {
										// 更新分组信息
										that.GroupList=res.data.grouplist
										// 显示服务器返回过来的数据
										uni.showToast({
											title: res.data.msg
										})
									}
							});
						}
					}
				})
			},
			EditGroup(res){
				let that=this;
				console.log(this.groupname_edit);
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apieditgroup  ', //修改分组接口
						data: {
							groupname: that.groupname_edit,
							user_id: that.$store.state.account_key,
							groupid: that.GroupId,
							yzpass: that.$store.state.account_psw
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded', 
						},
						dataType:'json',
						method:'POST',
						success(res) {
							// 隐藏当前窗口
							that.modalName=null;
							that.GroupList=res.data.grouplist
							uni.showToast({
								title: res.data.msg
							})
						}
				});
				
			}
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
		.qwdasd .qwdasd2:nth-child(1){
		margin-top:90upx
	}
</style>
