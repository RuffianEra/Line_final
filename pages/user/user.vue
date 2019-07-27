<template>
    <view class="content">
		
		<!-- 单选框栏目 -->
		<radio-group class="block" @change="RadioChange">
			
		<view class="cu-form-group margin-top">
			<view class="title">我的粉丝</view>
			<radio :class="radio=='1'?'checked':''" :checked="radio=='1'?true:false" value="1"></radio>
		</view>
		<!-- 遍历用户自定义分组 -->
		<view class="cu-form-group" v-for="(item,index) in C_GroupList" :key="index">
			<view class="title">{{item.groupname}}</view>
			<radio :class="radio==item.id?'checked':''" :checked="radio==item.id?true:false" :value="item.id+''"></radio>
		</view> 
		</radio-group>
		
		
		<view class="cu-form-group margin-top">
			<textarea maxlength="-1"  @input="textareaInput" placeholder="请输入你需要群发的信息"></textarea>
		</view>
		<view class="btn-row">
		<button  type="primary" class="primary" @tap="GroupSends">群发</button>
		</view>
	
		
		<view class="btn-row">
			<button  type="warn"  @tap="LoginOut">退出登录</button>
		</view>
	</view>
	</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
    export default {
		data(){
			return {
				radio: '1',
				msg : false,
				textareaValue: ''
			};
		},
		// 加载聊天记录
		onLoad() {
		},
        computed: {
			C_GroupList: function(){
				console.log(this.$store.state.G_GroupList)
				return this.$store.state.G_GroupList;
			}
        },
        methods: {
			GroupSends(){
				// 如果内容不为空则发送
				if(this.textareaValue!='')
				{
					// 群发信息请求代码
					uni.request({
						url: 'http://www.aot9a.cn/index/user/apiallsend', //请求地址
						data: {
							channel_access_token: this.$store.state.account_token,
							channelSecret: this.$store.state.account_secret,
							groupid: this.radio,
							content: this.textareaValue,
							user_id: this.$store.state.account_key,
							yzpass: this.$store.state.account_psw
						},
						header: {
							'content-type': 'application/x-www-form-urlencoded',
						},
						dataType: 'json',
						method: 'POST',
						success(res) {					
							uni.showToast({
								title:res.data.msg,
								icon:'none'
							})
						}
					});
				}else{
					uni.showToast({
						title: '群发的消息不能为空',
						icon: 'none'
					})
				}
				
				
			},
			textareaInput(e) {
				this.textareaValue = e.detail.value
			},
			RadioChange(e) {
				this.radio = e.detail.value
			},
			show(){
				this.msg=true;
			},
			LoginOut(){
				// 清除用户缓存
				uni.removeStorage({
					key: this.$store.state.account_key,
					success: function (res) {
						console.log('success');
					}
				});
				//导航登录页面
				uni.reLaunch({
					url:'../login/login'
				})
			}
        }
    }
</script>

<style>

</style>
