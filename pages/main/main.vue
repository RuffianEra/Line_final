<template>
	<view @tap="openLean">

		<!-- 聊天滚动视图 -->
		<scroll-view scroll-y="true" class="page" enable-back-to-top="true">

			<view class="cu-list menu-avatar">
				
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
					<view class="move" v-if="item.is_zhiding==2">
						<view class="bg-grey" @tap.stop="topUser(item.id,1,index)">置顶</view>
					</view>
					<view class="move" v-else>
						<view class="bg-grey" style="background-color: #FF0000;" @tap.stop="topUser(item.id,2,index)">取消</view>
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
				TopNum: this.$store.state.G_UserList[0].is_zhiding+1,
				TopNums: 0,
				LastMessage: ''
			}
		},
		computed: {
			C_UserList: function() {
				let that=this
				// 计算置顶用户数TopNums
				that.TopNums=0
				for (var i = 0; i < that.$store.state.G_UserList.length; i++) {
					if(that.$store.state.G_UserList[i].is_zhiding!=2)
					{
						that.TopNums++;
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
							if (res.data.status != 2) {
								let music=uni.createInnerAudioContext()
								music.src="../../static/news.mp3"
								// 第一次收到消息
								if(that.LastMessage=='')
								{
								that.LastMessage=res.data.data[0].reply_msg
								// 播放新消息音乐
								music.play()
								}else if(that.LastMessage!=res.data.data[0].reply_msg)
								{
									that.LastMessage=res.data.data[0].reply_msg
									// 播放新消息音乐
									music.play()
								}
									// 在最新聊天数组里去重复
									for (var i = 0; i < that.$store.state.G_UserList.length; i++) {
										if (that.$store.state.G_UserList[i].id == res.data.data[0].id) {
											// 判断是否为置顶列表
											if(that.$store.state.G_UserList[i].is_zhiding!=2)
											{
												// 在原位置更新
												music.play()
												that.$set(that.$store.state.G_UserList,i,res.data.data[0])
											}else if(that.$store.state.G_UserList[i].is_zhiding==2){
												// 将消息覆盖
												// 将数组下标清空
												that.$store.state.G_UserList.splice(i,1);
												// 将消息置顶
												that.$store.state.G_UserList.splice(that.TopNums,0,res.data.data[0]);
											}
											// 跳出循环
											break;
										}
									}
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
			let dayTime = 24 * 60 * 60 * 1000 
			var Y = TargetDate.getFullYear() + '/'
			var M = (TargetDate.getMonth() + 1 < 10 ? '0' + (TargetDate.getMonth() + 1) : TargetDate.getMonth() + 1) + '/'
			var D = TargetDate.getDate() + ' '
			var h = TargetDate.getHours() + ':'
			var m = TargetDate.getMinutes()
			// 得到相差的时间
			let delta = Now - date
			if (delta > 0) {
				// 小于一天的时间(当天)
				if (delta <= dayTime) {
					return h + m
				}else{
				return Y+M +D
			}
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
		topUser(member_id,model,index) {
			let that=this
			if(model===1)
			{
				uni.request({
					url:'http://www.aot9a.cn/index/user/apizhiding',
					data: {
						user_id: that.$store.state.account_key,
						yzpass: that.$store.state.account_psw,
						member_id: member_id,
						is_zhiding: that.TopNum
					},
					method:'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success(res) {
						that.$set(that.$store.state.G_UserList[index],'is_zhiding',that.TopNum)
						uni.showToast({
							title:res.data.msg
						})
					}
				})
			}else if(model===2)
			{
				uni.request({
					url:'http://www.aot9a.cn/index/user/apizhiding',
					data: {
						user_id: that.$store.state.account_key,
						yzpass: that.$store.state.account_psw,
						member_id: member_id,
						is_zhiding: 2
					},
					method:'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success(res) {
						that.$set(that.$store.state.G_UserList[index],'is_zhiding',2)
						that.TopNums--;
						uni.showToast({
							title:res.data.msg
						})
					}
				})
			}
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
