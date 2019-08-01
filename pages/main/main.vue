<template>
	<view @tap="openLean">

		<!-- 聊天滚动视图 -->
		<scroll-view scroll-y="true" class="page" enable-back-to-top="true">

			<view class="cu-list menu-avatar">

				<!-- <view class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''" 
				@touchstart="ListTouchStart" @touchmove="ListTouchMove"
				 @touchend="ListTouchEnd" :data-target="'move-box-' + index" v-for="(n_item,index) in C_ChatRecond" :key="index"
				 @tap="inChat(index,n_item.img,n_item.id,n_item.member_id)">
					<view class="cu-avatar round lg" :style="{background:'url('+n_item.img+')'}"></view>
					<view class="content">
						<view class="text-grey">{{n_item.username}}({{n_item.remark}})</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{n_item.reply_msg}}
							</view>
						</view>
					</view>
					<view class="action" style="width: 75px;">
						<view class="text-grey text-xs">{{n_item.u_time}}</view>
						<view class="cu-tag round bg-grey sm" v-if="n_item.current_msg!=''">{{n_item.current_msg}}</view>
					</view>
					<view class="move">
						<view class="bg-grey" @tap.stop="topUser">置顶</view>
					</view>
				</view> -->

				<view  class="cu-item" :class="modalName=='move-box-'+ index?'move-cur':''"
				 @touchstart="ListTouchStart" @touchmove="ListTouchMove"
				 @touchend="ListTouchEnd" :data-target="'move-box-' + index" v-for="(item,index) in C_UserList" :key="index" @tap="inChat(index,item.img,item.id,item.member_id)">
					<view class="cu-avatar round lg" :style="{background:'url('+item.img+')'}"></view>
					<view class="content">
						<view class="text-grey">{{item.username}}({{item.remark}})</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{item.reply_msg}}
							</view>
						</view>
					</view>
					<view class="action" style="width: 75px;">
						<view class="text-grey text-xs">{{timestampToTime(item.u_time)}}</view>
						<view class="cu-tag round bg-grey sm" v-if="item.current_msg!=''">{{item.current_msg}}</view>
					</view>
					<view class="move">
						<view class="bg-grey" @tap.stop="topUser">置顶</view>
					</view>
				</view>

			</view>
		</scroll-view>

	</view>

</template>


<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				newList: [],
				intervalID: 0,
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				TopNum: 3,
				TomNums: 0
			}
		},
		computed: {
			C_UserList: function() {
				let that=this
				for (var i = 0; i < that.$store.state.G_UserList.length; i++) {
					if(that.$store.state.G_UserList[i].is_zhiding!=2)
					{
						that.TomNums++;
					}
				}
				return this.$store.state.G_UserList;
			}
		},
		// 加载聊天记录
		onLoad() {

		},
		onHide() {
			clearInterval(this.intervalID);
		},
		onShow() {
			this.erval();
			this.intervalID = setInterval((sef) => {
				sef.erval();
			}, 3000, this);
		},
		methods: {
			erval() {
				let that = this;
				uni.request({
						url: 'http://www.aot9a.cn/index/user/apigetlist', //请求地址
						data: {
							user_id: this.$store.state.account_key,
							yzpass: this.$store.state.account_psw
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						dataType: 'json',
						method: 'POST',
						success(res) {
							console.log("---------未读数据---------")
							console.log(res.data)
							if (res.data.status != 2) {
								// 数组不为空时判断是否重复
									var flag=true
									// 在最新聊天数组里去重复
									for (var i = 0; i < that.$store.state.G_UserList.length; i++) {
										if (that.$store.state.G_UserList[i].id == res.data.data[0].id) {
											// 将消息覆盖
											// 将数组下标清空
											that.$store.state.G_UserList.splice(i,1);
											// 将消息置顶
											that.$store.state.G_UserList.unshift(res.data.data[0]);
											flag=false;
											// 跳出循环
											break;
										}
									}
									if(flag)
									{
										that.newList.unshift(res.data.data[0]);
									}
									console.log('flag')
									console.log(flag)
								console.log('更新后列表')
								console.log(that.$store.state.G_UserList)
							}
						}
				});
		},
		// 判断用户时间的方法
		timestampToTime(cjsj) {
			// 获取当前时间戳
			let Now = Date.parse(new Date())
			// 获取时间戳
			var date = cjsj * 1000 //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var TargetDate = new Date(cjsj * 1000)
			//一天的时间戳
			let dayTime = 24 * 60 * 60 * 1000 * 1000
			var Y = TargetDate.getFullYear() + '/'
			var M = (TargetDate.getMonth() + 1 < 10 ? '0' + (TargetDate.getMonth() + 1) : TargetDate.getMonth() + 1) + '/'
			var D = TargetDate.getDate() + ' '
			var h = TargetDate.getHours() + ':'
			var m = TargetDate.getMinutes()
			// 得到相差的时间
			let delta = Now - date
			if (delta > 0) {
				if (delta <= dayTime) {
					return Y + M + D
				}
			} else if (-delta < dayTime) {
				return h + m
			}
		},
		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX
		},
		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
		},
		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target
			} else {
				this.modalName = null
			}
			this.listTouchDirection = null
		},
		topUser() {
			console.log('点击了置顶用户！！')
		},
		inChat(index, img, id, member_id) {
			uni.navigateTo({
				url: '/pages/chat/chat?userId=' + index + '&avatar=' + img + '&member_id=' + id + '&member_id_token=' + member_id,

			})
		}
	}
	}
</script>

<style>
	.page {
		height: 100Vh;
		width: 100vw;
	}

	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul {
		font-size: 30upx;
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul>view {
		line-height: 50upx;
	}
</style>
