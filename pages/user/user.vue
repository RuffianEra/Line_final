<template>
    <view class="content">
		<!-- 单选框栏目 -->
		<radio-group class="block" @change="RadioChange">
			
		<view class="cu-form-group margin-top">
			<view class="title">我的粉丝</view>
			<radio :class="radio=='A'?'checked':''" :checked="radio=='A'?true:false" value="A"></radio>
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
		<button  type="primary" class="primary">群发</button>
		</view>
		
		<view class="btn-row">
		    <button  type="primary" class="primary" @tap="bindLogin">返回登录</button>
		</view>
		
		<view class="btn-row">
			<button  type="primary" class="primary" @tap="LoginOut">退出登录</button>
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
				radio: 'A',
				msg : false,
				textareaValue: ''
			};
		},
		// 加载聊天记录
		onLoad() {
			var _self=this;
			// 获取本机缓存
			uni.getStorage({
				key: this.$store.state.account_key,
				success(res) {
					let all=JSON.parse(res.data);
					// 读取聊天信息
					_self.group_list=all.grouplist;
					console.log(_self.group_list)
				}
			});
		},
        computed: {
            ...mapState(['hasLogin', 'forcedLogin']),
			C_GroupList: function(){
				return this.$store.state.G_GroupList;
			}
        },
        methods: {
            ...mapMutations(['logout']),
            bindLogin() {
                uni.navigateTo({
                    url: '../login/login',
                });
            },
			textareaInput(e) {
				this.textareaValue = e.detail.value
			},
			RadioChange(e) {
				this.radio = e.detail.value
				console.log(e.detail.value)
			},
			show(){
				this.msg=true,
				console.log(this.msg)
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
