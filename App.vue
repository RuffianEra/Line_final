<script>
	export default {
		onLaunch: function() {
			// 检测版本更新
			
			
			
			
			// #ifdef APP-PLUS  
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apiversion',
					data: {
						version: widgetInfo.version,
						appid: plus.runtime.appid
					},
					method:'GET',
					success: (result) => {
						console.log(result.data)
						var data = result.data;
						if(data.status===1)
						{
							uni.showModal({
								title:'有新版本更新！！！',
								content: data.note,
								showCancel: false,
								success(res) {
									if (res.confirm){
										uni.downloadFile({
											url: data.url,
											success: (downloadResult) => {
												if (downloadResult.statusCode === 200) {
													plus.runtime.install(downloadResult.tempFilePath, {
														force: false
													}, function() {
														console.log('安装成功,重启应用!!!');
														plus.runtime.restart();
													}, function(e) {
														console.error('安装失败!!!');
													});
												}
											}
										});
									}
								}
							})
						}
						
					}
				});
			});
			// #endif  
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";

	/*每个页面公共css */
	/* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
	body,
	page {
		min-height: 100%;

	}

	/* #ifdef MP-BAIDU */
	page {
		width: 100%;
		height: 100%;
		display: block;
	}

	swan-template {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* #endif */
	.content {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 20upx;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	custom-component {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 原生组件模式下需要注意组件外部样式 */
	m-input {
		width: 100%;
		min-height: 100%;
		display: flex;
	}

	/* 登录按钮样式 */
	.input-group {
		background-color: #ffffff;
		margin-top: 40upx;
		position: relative;
	}

	.input-group::before {
		position: absolute;
		right: 0;
		top: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-group::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.input-row {
		display: flex;
		flex-direction: row;
		position: relative;
	}

	.input-row .title {
		width: 20%;
		height: 50upx;
		min-height: 50upx;
		padding: 15upx 0;
		padding-left: 30upx;
		line-height: 50upx;
	}

	.input-row.border::after {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 15upx;
		height: 1upx;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.btn-row {
		margin-top: 50upx;
		padding: 20upx;
	}

	button.primary {
		background-color: #0faeff;
	}
</style>
