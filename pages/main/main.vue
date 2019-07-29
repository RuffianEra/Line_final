<template>
	<view>

		<!-- 聊天滚动视图 -->
		<scroll-view scroll-y="true" class="page" enable-back-to-top="true">

			<view class="cu-list menu-avatar">


				<!-- 显示最新的聊天记录 -->
				<navigator class="cu-item" :url="'/pages/chat/chat?userId='+index+'&avatar='+n_item.img+'&member_id='+n_item.id+'&member_id_token='+n_item.member_id"
				 v-for="(n_item,index) in C_ChatRecond" :key="index">
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
						<view class="text-grey text-xs">{{timestampToTime(n_item.u_time)}}</view>
						<view class="cu-tag round bg-grey sm" v-if="n_item.current_msg!=''">{{n_item.current_msg}}</view>
					</view>
				</navigator>
				
				
				
				
				<navigator class="cu-item" :url="'/pages/chat/chat?userId='+index+'&avatar='+item.img+'&member_id='+item.id+'&member_id_token='+item.member_id"
				 v-for="(item,index) in C_UserList" :key="index">
					<view class="cu-avatar round lg" :style="{background:'url('+item.img+')'}"></view>
					<view class="content">
						<view class="text-grey">{{item.remark}}({{item.username}})</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{item.current_msg}}
							</view>
						</view>
					</view>
					<view class="action" style="width: 75px;">
						<view class="text-grey text-xs">{{timestampToTime(item.u_time)}}</view>
						<view class="cu-tag round bg-grey sm" v-if="item.current_msg!=''">未读消息</view>
					</view>
				</navigator>

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
				intervalID: 0
			}
		},
		computed:  {
			C_UserList: function() {
				return this.$store.state.G_UserList;
			},
			C_ChatRecond:function()  {
				return this.newList;
			}
		},
		// 加载聊天记录
		onLoad() {

		},
		onHide() {
			clearInterval(this.intervalID);
		},
		onShow() {
			this.intervalID = setInterval((sef) => {
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
						if (res.data.status != 2) {
							console.log('更新前数组:');
							for (var i = 0; i < that.newList.length; i++) {
								if (res.data.data[0].id == that.newList[i].id) {
									that.$set(that.newList,i,res.data.data[0]);
									// that.newList[i] = res.data.data[0];
								}
								return;
							}
							that.newList.unshift(res.data.data[0]);
						}
						console.log(that.newList);
					}
				});

			}, 3000, this);
		},
		methods: {
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
