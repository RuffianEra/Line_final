<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title">账号：</text>
                <m-input class="m-input" type="text" clearable focus v-model="account" placeholder="请输入账号"></m-input>
            </view>
            <view class="input-row">
                <text class="title">密码：</text>
                <m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
            </view>
        </view>
        <view class="btn-row">
            <button type="primary" class="primary" @tap="bindLogin">登录</button>
        </view>
		
		<view class="btn-row">
			<button type="primary" class="primary" @tap="getData">得到缓存</button>
		</view>
		
		<view class="btn-row">
		    <button type="primary" class="primary" @tap="cleatData">清除缓存</button>
		</view>
		
		<!-- 登录按钮后加载中弹窗 -->
		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="/static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">{{TipsText}}</view>
		</view>
		
 
    </view>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
	// 导入显示隐藏密码js
    import mInput from '../../components/m-input.vue'

    export default {
		computed: mapState(['account_key']),
        components: {
            mInput
        },
        data() {
            return {
				TipsText: '登录中...',
                providerList: [],
                account: '',
                password: '',
                positionTop: 0,
				loadModal: false
            }
        },
        methods: {
			...mapMutations(['setKey']),
            initPosition() {
                /**
                 * 使用 absolute 定位，并且设置 bottom 值进行定位。软键盘弹出时，底部会因为窗口变化而被顶上来。
                 * 反向使用 top 进行定位，可以避免此问题。
                 */
                this.positionTop = uni.getSystemInfoSync().windowHeight - 100;
            },
            bindLogin() {
                /**
                 * 客户端对账号信息进行一些必要的校验。
                 * 实际开发中，根据业务需要进行处理，这里仅做示例。
                 */
                if (this.account.length < 5) {
                    uni.showToast({
                        icon: 'none',
                        title: '账号最短为 5 个字符'
                    });
                    return;
                }
                if (this.password.length < 6) {
                    uni.showToast({
                        icon: 'none',
                        title: '密码最短为 6 个字符'
                    });
                    return;
                }
                
                const data = {
                    account: this.account,
                    password: this.password
                };
				this.loadModal = true;
				this.TipsText='登录中...'
				setTimeout(() => {
					this.loadModal = false;
				}, 2000);
				
				let rot = this;
				// 请求服务器数据
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apickecklogin', //请求地址
					data: {
						account: data.account,
						password: data.password 
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded', 
					},
					
					dataType:'json',
					method:'POST',
					success(res) {
							let _data=JSON.stringify(res.data)
							rot.TipsText='登录成功!'
							// 将数据缓存到本机
							uni.setStorage({
								key: res.data.info.id+'',
								data: _data,
								success: function () {
									// 将用户id存到全局变量
									rot.setKey(res.data.info.id+'')
								}
							});
							//登录成功跳转到聊天主页面
							uni.switchTab({
								url: '/pages/main/main'
							});
							
					}
				});
            },
			cleatData(){
				uni.removeStorage({
				key: this.$store.state.account_key,
				success: function (res) {
					console.log('success');
				}
			});	
			},
			getData(){
				uni.getStorage({
					key: this.$store.state.account_key,
					success: function (res) {
						console.log(res.data)
					}
				});	
			},
            toMain(userName) {
                this.login(userName);
                /**
                 * 强制登录时使用reLaunch方式跳转过来
                 * 返回首页也使用reLaunch方式
                 */
                if (this.forcedLogin) {
                    uni.reLaunch({
                        url: '../main/main',
                    });
                } else {
                    uni.navigateBack();
                }

            }
        },
    }
</script>

<style>
    .action-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .action-row navigator {
        color: #007aff;
        padding: 0 20upx;
    }

</style>
