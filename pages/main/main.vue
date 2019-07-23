<template>
	<view>
		
		<!-- 聊天滚动视图 -->
		<scroll-view  scroll-y="true" class="page" enable-back-to-top="true">
			
			<view class="cu-list menu-avatar">
				
				<navigator class="cu-item" 
				:url="'/pages/chat/chat?userId='+index+'&avatar='+item.img"
				v-for="(item,index) in list" :key="index">
					<view class="cu-avatar round lg" :style="{background:'url('+item.img+')'}"></view>
					<view class="content">
						<view class="text-grey">{{item.remark}}({{item.username}})</view>
						<view class="text-gray text-sm flex">
							<view class="text-cut">
								{{item.current_msg}}
							</view> </view>
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
        computed: mapState(['account_key']),
		data() {
		    return {
				list: []
		    }
		},
		// 加载聊天记录
        onLoad() {
			console.log(this.$store.state.account_psw)
			var _self=this;
			// 获取本机缓存
			uni.getStorage({
				key: this.$store.state.account_key,
				success:function(res){
					let all=JSON.parse(res.data);
					_self.list=all.memberlist;
				}
			});
        },
		methods:{
			// 判断用户时间的方法
			timestampToTime (cjsj) {
			// 获取当前时间戳
			let Now=Date.parse(new Date())
			// 获取时间戳
			var date = cjsj*1000 //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var TargetDate=new Date(cjsj*1000)
			//一天的时间戳
			let dayTime=24 * 60 * 60 * 1000 * 1000
			var Y = TargetDate.getFullYear() + '/'
			var M = (TargetDate.getMonth()+1 < 10 ? '0'+(TargetDate.getMonth()+1) : TargetDate.getMonth()+1) + '/'
			var D = TargetDate.getDate() + ' '
			var h = TargetDate.getHours() + ':'
			var m = TargetDate.getMinutes()
			// 得到相差的时间
			let delta=Now-date
			if (delta > 0) {
			if (delta <= dayTime) {
			  return Y+M+D
			}
			} else if (-delta < dayTime) {
				return h+m
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
