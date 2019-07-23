<template>
	<view>
		<view class="cu-chat">
			<!-- 发送消息（自己） -->
			<view class="cu-item" v-for="(item,index) in C_ChatRecord" :key="index" :class="item.from==1?'':'self'">
				<!-- 判断是否from是否为1（1是用户，2是自己）来隐藏显示 -->
				<view v-if="item.from==1" class="cu-avatar round" :style="{background:'url('+img+')'}"></view>
				<view class="main">
					<view class="content  shadow" :class="item.from==2?'bg-green':''">
						<!-- 聊天内容正文 -->
						<text>{{item.text}}</text>
					</view>
				</view>
				<!-- 判断是否from是否为2（1是用户，2是自己）来隐藏显示 -->
				<view v-if="item.from==2" class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
				<view class="date">{{timestampToTime(item.time)}}</view>
			</view>
		</view>
		
		<!-- 底部导航栏 -->
		<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
			<view class="action">
				<text class="cuIcon-sound text-grey"></text>
			</view>
			<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10" @focus="InputFocus"
			 @blur="InputBlur"></input>
			<view class="action">
				<text class="cuIcon-emojifill text-grey"></text>
			</view>
			<button class="cu-btn bg-green shadow">发送</button>
		</view>

		<!-- 右边弹窗栏页面 -->
		<uniDrawer :visible="IsVisible" style="margin-top: 60px;" :mode="'right'" @close="closeDrawer">
			<view style="margin-top:15px">
				
				<span class="text-black text-bold" style="margin-left: 23px;">移动用户至：</span>
				<!-- 分组下拉框 -->
				<view style="width: 80%; margin: auto;margin-bottom: 20px;">
					<xfl-select :list="C_GroupList" :clearable="false" :showItemNum="10" :listShow="false" :isCanInput="false"
					 :style_Container="listBoxStyle" :placeholder="'placeholder'" :initValue="'我的粉丝'">
					</xfl-select>
					<button class="bg-gradual-green padding radius text-center shadow-blur" style="padding: 0upx;margin-top: 10upx;">确定</button>
				</view>

				<span class="text-black text-bold" style="margin-left: 23px;">修改备注：</span>
				<input class="cu-form-group round" 
				style="background-color: #e5e5e5;margin-right: 24px;margin-left: 14px;" type="text" :placeholder="C_name"/>
				<button type="primary" class="padding radius text-center shadow-blur" style="padding: 0upx;margin-top: 10upx;margin-right: 20px;margin-left: 15px;">确定</button>

			</view>
		</uniDrawer>
	</view>
</template>

<script>
	// 导入下拉框组件
	import xflSelect from '../../components/xfl-select/xfl-select.vue';
	//导入标题栏弹窗框组件
	import uniDrawer from "@/components/uni-drawer.vue"
	export default {
		components: {
			uniDrawer,
			xflSelect
		},
		// 接收页面传过来的参数,e代表的是数组用户的下标
		onLoad(e) {
			var _self=this
			//接收用户id下标
			this.User_id=e.userId;
			this.img=e.avatar;	
		},
		data() {
			return {
				listBoxStyle: `,
					color: blue;  font-size: 16px;
				`,
				User_id: 0,
				list: [],
				IsVisible: false,
				InputBottom: 0,
				ChatRecord: [],
				test: self,
				img: '',
				remark: ''
			};
		},
		
		computed: {
			C_name: function(){
				let that=this
				uni.getStorage({
					key: this.$store.state.account_key,
					success(res) {
						let all=JSON.parse(res.data);
						that.remark=all.memberlist[that.User_id].remark;
					}
				});
				return this.remark
			},
			// 计算聊天记录
			C_ChatRecord: function(){
				let that = this;
				uni.getStorage({
					key: this.$store.state.account_key,
					success(res) {
						let all=JSON.parse(res.data);
						that.ChatRecord=JSON.parse(all.memberlist[that.User_id].reply_msg);
					}
				});
				return this.ChatRecord
			},
			// 计算分组信息
			C_GroupList: function(){
				let that = this;
				uni.getStorage({
					key: this.$store.state.account_key,
					success(res) {
						let all=JSON.parse(res.data);
						let _list=all.grouplist;
						for (var i = 0; i < _list.length; i++) {
							that.list[i]=_list[i].groupname;
						}
					}
				});
				return this.list
			}
		},
		onNavigationBarButtonTap() {
			// 设置弹窗栏的属性为真
			this.IsVisible = !this.IsVisible
		},
		// 监听页面返回
		onBackPress() {
			this.IsVisible = !this.IsVisible
		},
		methods: {
			closeDrawer() {
				this.IsVisible = false
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
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
			}
		}
	}
</script>

<style>
	page {
		padding-bottom: 100upx;
	}
</style>
