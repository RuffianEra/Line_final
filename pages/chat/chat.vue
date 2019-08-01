<template>
	<view @tap="holdup">
		<view class="cu-chat">
			<!-- 发送消息（自己） -->
			<view class="cu-item" v-for="(item,index) in ChatRecord" :key="index" :class="item.from==1?'':'self'">
				<!-- 判断是否from是否为1（1是用户，2是自己）来隐藏显示 -->
				<view v-if="item.from==1" class="cu-avatar round" :style="{background:'url('+img+')'}"></view>
				<view class="main">
					<view class="content  shadow" :class="item.from==2?'bg-green':''">
						<!-- 图片 -->
						<image v-if="item.type == 'image'" :src="item.text" @tap="openImg(item.text)" :style="{'width': item.wid +'px', 'height': item.hei + 'px'}"></image>
						<!-- 表情 -->
						<image v-else-if="item.type == 'sticker'" :src="item.text" :style="{'width': item.wid +'px', 'height': item.hei + 'px'}"></image>
						<!-- 语言消息 -->
						<view v-else-if="item.type == 'audio'" class="bubble voice" @tap="openAudio(index, item.inner)" :class="index==iconId?'play':''" style="display: flex;">
							<view v-if="item.from==1" class="icon other-voice"></view>
							<view class="length">{{item.time}}s</view>
							<view v-if="item.from==2" class="icon my-voice"></view>
						</view>
						<!-- <image v-else-if="item.type == 'audio'" src="../../static/img/audioImg.gif" @tap="openAudio(item.inner)" :style="{'width': item.wid +'px', 'height': item.hei + 'px'}"></image> -->
						<!-- 视频 -->
						<video v-else-if="item.type == 'video'" :src="item.text"></video>
						<!-- 文本 -->
						<text v-else>{{item.text}}</text>
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
				<text @tap="openVoice()" class="cuIcon-sound text-grey"></text>
			</view>
			<input v-if="toggle" class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
			 @focus="InputFocus" @blur="InputBlur" v-model="dataSend"></input>
			<button v-if="!toggle" class="solid-bottom" @longpress="startRecord()" @touchend="endRecord()">按住开始录音</button>
			<view class="action">
				<text id="face" class="cuIcon-emojifill text-grey" @tap="openIcon()"></text>
				<text class="cuIcon-pic text-grey" @tap="imgSend()"></text>
			</view>
			<button class="cu-btn bg-green shadow" @tap="send()">发送</button>
		</view>

		<!-- 表情栏 -->
		<view id="faceBar" v-if="iconOpen" class="outer">
			<view class="uls">
				<image :id="'faceBar' + index" v-for="(item, index) in icon" v-bind:key="index" class="lis" @click="iconSend(index)"
				 :src="item.src"></image>
			</view>
		</view>

		<!-- 右边弹窗栏页面 -->
		<uniDrawer :visible="IsVisible" style="margin-top: 60px;" :mode="'right'" @close="closeDrawer">
			<view style="margin-top:15px">
				<span class="text-black text-bold" style="margin-left: 23px;">移动用户至：</span>
				<!-- 分组下拉框 -->
				<view style="width: 80%; margin: auto;margin-bottom: 20px;">
					<xfl-select :list="C_GroupList" :clearable="false" :showItemNum="10" :listShow="false" :isCanInput="false"
					 :style_Container="listBoxStyle" :placeholder="'placeholder'" :initValue="'我的粉丝'" @change="getValue()">
					</xfl-select>
					<button class="bg-gradual-green padding radius text-center shadow-blur" style="padding: 0upx;margin-top: 10upx;"
					 @tap="modifyGroup">确定</button>
				</view>
				<!-- 修改备注栏目 -->
				<span class="text-black text-bold" style="margin-left: 23px;">修改备注：</span>
				<input class="cu-form-group round" style="background-color: #e5e5e5;margin-right: 24px;margin-left: 14px;" type="text"
				 :placeholder="C_name" v-model="V_remark" />
				<button type="primary" class="padding radius text-center shadow-blur" style="padding: 0upx;margin-top: 10upx;margin-right: 20px;margin-left: 15px;"
				 @tap="modifyRemark">确定</button>
				 
				 
				 <!-- 转给接待人员栏目 -->
				 <span class="text-black text-bold" style="margin-left: 23px;">转给接待人员：</span>
				 <view style="width: 80%; margin: auto;margin-bottom: 20px;">
				 	<xfl-select :list="C_WaitList" :clearable="false" :showItemNum="10" :listShow="false" :isCanInput="false"
				 	 :style_Container="listBoxStyle" :placeholder="'placeholder'" :initValue="'请选择接待人员'" @change="getWaitListValue()">
				 	</xfl-select>
				 	<button @tap="sendWaitList"   class="bg-gradual-green padding radius text-center shadow-blur" style="padding: 0upx;margin-top: 10upx;"
				 	 >确定</button>
				 </view>
				 
			</view>
		</uniDrawer>
	</view>
</template>

<script>
	// 导入下拉框组件
	import xflSelect from '../../components/xfl-select/xfl-select.vue'
	//导入标题栏弹窗框组件
	import uniDrawer from '@/components/uni-drawer.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	const record = uni.getRecorderManager();
	export default {
		data() {
			return {
				listBoxStyle: `,
					color: blue;  font-size: 16px;
				`,
				user: '',
				member_id: 0,
				member_id_token: '',
				User_id: 0,
				list: [],
				waitList: [],
				IsVisible: false,
				InputBottom: 0,
				ChatRecord: [],
				arrays: [],
				test: self,
				img: '',
				V_remark: '',
				remark: '',
				toggle: true,
				face: false,
				dataSend: '',
				GroupId: 1,
				icon: [],
				iconOpen: false,
				iconId: 0,
				intervalID: 0,
				waitListID: 0,
				page: 1,
				nodes: {}
			};
		},
		components: {
			uniDrawer,
			xflSelect
		},
		// 接收页面传过来的参数,e代表的是数组用户的下标
		onLoad(e) {
			this.$store.state.G_UserList[e.userId].lean = false;
			uni.setNavigationBarTitle({
					title: this.$store.state.G_UserList[e.userId].remark == "设置备注" ? this.$store.state.G_UserList[e.userId].username : this.$store.state.G_UserList[e.userId].remark
				}),
				this.icon = require("../../static/emojis.json");
			//接收用户id下标
			this.User_id = e.userId;
			this.img = e.avatar;
			this.member_id = e.member_id;
			this.member_id_token = e.member_id_token;
			let that = this;
			that.gainAllData();
			that.intervalID = setInterval((sef) => {
				uni.request({
					url: "http://www.aot9a.cn/index/user/apigetmessage",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						user_id: sef.$store.state.account_key,
						yzpass: sef.$store.state.account_psw,
						member_id: sef.member_id
					},
					success: (res) => {
						if (res.data.status == 1) {
							for (let arry in res.data.message) {
								sef.ChatRecord.unshift(res.data.message[arry]);
								if (res.data.message[arry].type == 'image' || res.data.message[arry].type == 'sticker') {
									sef.addImageData(chatId[item], true);
								} else if (res.data.message[arry].type == 'audio') {
									let innerAudioContext = uni.createInnerAudioContext();
									innerAudioContext.src = "http://www.aot9a.cn/" + res.data.message[arry].text;
									innerAudioContext.onEnded(function(res) {
										sef.iconId = 0;
									});
									innerAudioContext.onCanplay(function() {
										res.data.message[arry].time = innerAudioContext.duration > 1 ? Math.ceil(innerAudioContext.duration) :
											1;
									});
									res.data.message[arry].inner = innerAudioContext;
								}
							}
						}
					}
				});
				//console.log("10S定时任务,异步实时获取用户聊天记录");
			}, 5000, this);
			record.onStop(function(res) {
				let innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.onEnded(function(res) {
					that.iconId = 0;
				});
				innerAudioContext.src = res.tempFilePath;
				let chatId = {
					"from": 2,
					"type": "audio",
					"inner": innerAudioContext
				};
				innerAudioContext.onCanplay(function(res) {
					chatId.time = innerAudioContext.duration > 1 ? Math.ceil(innerAudioContext.duration) : 1;
				});
				that.ChatRecord.push(chatId);
				that.uploadFile("http://www.aot9a.cn/index/user/apiupload_Audio", res.tempFilePath, "audio", {
					"user_id": that.$store.state.account_key,
					"yzpass": that.$store.state.account_psw,
					"member_id": that.member_id
				});
			});
		},
		onUnload() {
			clearInterval(this.intervalID);
		},
		computed: {
			C_name: function() {
				let that = this;
				uni.getStorage({
					key: this.$store.state.account_key,
					success(res) {
						let all = JSON.parse(res.data);
						that.remark = all.memberlist[that.User_id].remark;
					}
				});
				return this.remark
			},
			// 计算分组信息
			C_GroupList: function() {
				let that = this;
				let _list = this.$store.state.G_GroupList;
				for (var i = 0; i < _list.length; i++) {
					that.list[i] = _list[i].groupname;
				}
				return that.list;
			},
			C_UserList: function(){
					return this.$store.state.G_UserList;
			},
			C_WaitList: function(){
				let that=this;
				let _list=[];
				for (let i = 0; i < that.waitList.length; i++) {
					_list[i] = that.waitList[i].username;
				}
				return _list;
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
		onShow() {
			var that=this
			// 请求接待人员
			uni.request({
				url: 'http://www.aot9a.cn/index/user/apiedithuser',
				data: {
					user_id: that.$store.state.account_key,
					yzpass: that.$store.state.account_psw,
					member_id: that.member_id
				},
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				dataType: 'json',
				method: 'POST',
				success(res) {
					that.waitList=res.data.userlist;
				}
			});
			/* setTimeout(()=>{
				uni.pageScrollTo({
					scrollTop: 99999,
					duration: 0
				});
			}, 500); */
		},
		onPageScroll(scrollTop){
			console.log("当前已经滚动----" + scrollTop.scrollTop)
		},
		onPullDownRefresh(){
			this.page += 1;
			this.pullData();
		},
		methods: {
			...mapMutations(['setG_UserList']),
			modifyRemark() {
				let that = this
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apiremark', //修改分组接口
					data: {
						user_id: that.$store.state.account_key,
						remark: that.V_remark,
						yzpass: that.$store.state.account_psw,
						member_id: that.member_id
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					dataType: 'json',
					method: 'POST',
					success(res) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						})
						that.IsVisible = !that.IsVisible
					}
				});

			},
			/* 进入页面调用一次，获取与该客户所有聊天数据 */
			gainAllData() {
				this.pullData(1);
				console.log("获取与当前用户的所有聊天数据");
			},
			pullData(){
				let sef = this;
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apimemberfind',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						user_id: sef.$store.state.account_key,
						member_id: sef.member_id,
						yzpass: sef.$store.state.account_psw,
						page: sef.page
					},
					success: (res) => {
						console.log("----------获取数据------------")
						let chatId = res.data.message;
						for (let item in chatId) {
							sef.ChatRecord.unshift(chatId[item]);
							if (chatId[item].type == 'image' || chatId[item].type == 'sticker') {
								sef.addImageData(chatId[item], true);
							} else if (chatId[item].type == 'audio') {
								let innerAudioContext = uni.createInnerAudioContext();
								innerAudioContext.src = "http://www.aot9a.cn/" + chatId[item].text;
								innerAudioContext.onEnded(function(res) {
									sef.iconId = 0;
								});
								innerAudioContext.onCanplay(function(res) {
									chatId[item].time = innerAudioContext.duration > 1 ? Math.ceil(innerAudioContext.duration) : 1;
								});
								chatId[item].inner = innerAudioContext;
							}
						};
						uni.stopPullDownRefresh();
						sef.chatFrame();
					}
				});
			},
			chatFrame() {
				let sef = this;
				setTimeout(() => {
					this.nodes = uni.createSelectorQuery().in(this).selectAll(".cu-item").boundingClientRect(function(e){
						let lss = e[29].bottom;
						/* for(let index in e){
							less += e[indext]
						} */
						uni.pageScrollTo({
							scrollTop: lss,
							duration: 0
						});
						sef.nodes = e[0];
						console.log("--------nodes-----" + sef.nodes.top)
					}).exec();
				}, 0)
			},
			/* 发送数据请求 */
			uploadData() {
				uni.request({
					url: "http://www.aot9a.cn/index/user/apisendmessage",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						user_id: this.$store.state.account_key,
						yzpass: this.$store.state.account_psw,
						content: this.dataSend,
						channel_access_token: this.$store.state.account_token,
						channel_secret: this.$store.state.account_secret,
						member_id_token: this.member_id_token,
						member_id: this.member_id
					},
					success: (res) => {
						console.log("返回数据----" + JSON.stringify(res));
					}
				});
				console.log("发送请求");
			},
			/* 上传文件 */
			uploadFile(url, filePath, name, formData) {
				uni.uploadFile({
					url: url,
					filePath: filePath,
					name: name,
					formData: formData,
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					success: (res) => {
						console.log("上传文件时返回数据---" + res.data);
					}
				})
			},
			addImageData(item, lean) { //http://www.aot9a.cn/
				if (lean) item.text = item.text.indexOf("http") != -1 ? item.text : "http://www.aot9a.cn/" + item.text;
				console.log("根据地址获取图片宽高");
				uni.getImageInfo({
					src: item.text,
					success: (img) => {
						let maxW = uni.upx2px(300); //350是定义消息图片最大宽度
						let maxH = uni.upx2px(300); //350是定义消息图片最大高度
						if (img.width > maxW || img.height > maxH) {
							let scale = img.width / img.height;
							item.wid = scale > 1 ? maxW : maxH * scale;
							item.hei = scale > 1 ? maxW / scale : maxH;
							console.log("图片最终宽高-----------" + item.wid + "--------" + item.hei);
						} else {
							item.wid = img.width;
							item.hei = img.height;
						}
					}
				});
			},
			openAudio(index, inner) {
				this.iconId = index;
				console.log(inner.src);
				inner.play();
				console.log("播放音频文件");
			},
			openImg(imgURL) {
				let img = [];
				img.push(imgURL);
				uni.previewImage({
					urls: img
				})
				console.log("预览图片");
			},
			openVoice() {
				this.toggle = !this.toggle;
				console.log("显示录音表单");
			},
			startRecord(options) {
				record.start({
					format: "mp3"
				})
				console.log("开始录音");
			},
			endRecord() {
				record.stop();
				console.log("关闭录音");
			},
			holdup(event) {
				if (event) {
					/* 根据单击事件发地点选择性关闭表情栏 */
					if (event.target.id.indexOf("face") != -1) {} else {
						this.iconOpen = false;
					}
				}
			},
			iconSend(index) {
				let arr = {
					"from": 2,
					"text": this.icon[index].src,
					"type": "sticker",
					"time": new Date().getTime()
				};
				this.ChatRecord.push(arr);
				this.addImageData(arr, false);
				this.iconOpen = false;
				uni.request({
					url: "http://www.aot9a.cn/index/user/apisticker",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						user_id: this.$store.state.account_key,
						yzpass: this.$store.state.account_psw,
						channel_access_token: this.$store.state.account_token,
						channel_secret: this.$store.state.account_secret,
						member_id: this.member_id,
						packageid: this.icon[index].site.split(",")[0],
						stickerid: this.icon[index].site.split(",")[1]
					},
					success: (res) => {
						console.log("返回数据----" + JSON.stringify(res));
					}
				});
			},
			openIcon() {
				this.iconOpen = !this.iconOpen;
			},
			imgSend() {
				let sef = this;
				uni.chooseImage({
					success(temp) {
						console.log("图片路径: " + temp.tempFilePaths[0]);
						let arr = {
							"from": 2,
							"text": temp.tempFilePaths[0],
							"type": "image",
							"time": new Date().getTime()
						};
						sef.ChatRecord.push(arr);
						sef.addImageData(arr, false);
						console.log(temp.tempFilePaths);
						sef.uploadFile("http://www.aot9a.cn/index/user/apiupload_photo", temp.tempFilePaths[0].substring(":"), "img", {
							"user_id": sef.$store.state.account_key,
							"yzpass": sef.$store.state.account_psw,
							"member_id": sef.member_id,
							"file": 'CSSimage'
						});
						console.log("发送图片");
					}
				})
			},
			send() {
				this.ChatRecord.push({
					"from": 2,
					"text": this.dataSend,
					"type": "text",
					"time": new Date().getTime()
				});
				this.uploadData();
				this.dataSend = "";
			},
			closeDrawer() {
				this.IsVisible = false
			},
			InputFocus(e) {
				this.InputBottom = e.detail.height
			},
			InputBlur(e) {
				this.InputBottom = 0
			},
			getValue(e) {
				// 将用户选中的消息给变量
				this.GroupId = this.$store.state.G_GroupList[e.index].id;
			},
			getWaitListValue(e)
			{
				this.waitListID=this.waitList[e.index].id
			},
			sendWaitList(){
				let that = this;
				// 修改用户所属分组
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apiedithuser', 
					data: {
						user_id: that.$store.state.account_key,
						edituser_id: that.waitListID,
						yzpass: that.$store.state.account_psw,
						member_id: that.member_id
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					dataType: 'json',
					method: 'POST',
					success(res) {
						uni.showToast({
							title:res.data.msg
						})
						that.IsVisible = !that.IsVisible
					}
				});
				
			},
			modifyGroup() {
				let that = this;
				// 修改用户所属分组
				uni.request({
					url: 'http://www.aot9a.cn/index/user/apieditmembergroup', //修改分组接口
					data: {
						user_id: that.$store.state.account_key,
						groupid: that.GroupId,
						yzpass: that.$store.state.account_psw,
						member_id: that.member_id
					},
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					dataType: 'json',
					method: 'POST',
					success(res) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						that.$set(that.$store.state.G_UserList[that.User_id],'groupid',that.GroupId);
						that.IsVisible = !that.IsVisible
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
			}
		}
	}
</script>

<style>
	page {
		padding-bottom: 100upx;
	}

	.outer {
		z-index: 999;
		width: 100%;
		height: 200px;
		background: #e6e6e6;
		position: fixed;
		bottom: 50px;
		overflow: scroll;
	}

	.uls {
		display: flex;
		flex-wrap: wrap;
		padding: 10px;
		border: #007AFF 2rpx;
	}

	.lis {
		width: 18vw;
		height: 13vh;
		font-size: 26px;
		list-style: none;
		text-align: center;
	}
</style>

<style lang="scss">
	@import "@/static/CSS/style.scss";
</style>
