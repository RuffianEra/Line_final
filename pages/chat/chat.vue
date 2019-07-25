<template>
	<view>
		<view class="cu-chat">

			<!-- 发送消息（自己） -->
			<view class="cu-item" v-for="(item,index) in ChatRecord" :key="index" :class="item.from==1?'':'self'">
				<!-- 判断是否from是否为1（1是用户，2是自己）来隐藏显示 -->
				<view v-if="item.from==1" class="cu-avatar round" :style="{background:'url('+img+')'}"></view>
				<view class="main">
					<view class="content  shadow" :class="item.from==2?'bg-green':''">
						<!-- 聊天内容正文 -->
						<img v-if="item.type == 'image' || item.type == 'sticker'" :src="item.text" 
							@tap="openImg(item.text)" :style="{'width': item.wid +'px', 'height': item.hei + 'px'}"></img>
						<img v-else-if="item.type == 'audio'" :src="item.text" @tap="openAudio(item.inner)" :style="{'width': item.wid +'px', 'height': item.hei + 'px'}"></img>
						<video v-else-if="item.type == 'video'" :src="item.text"></video>
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
		<!-- <view id="faceBar" v-if="face" class="outer">
			<view class="uls">
				<view :id="'faceBar' + index" class="lis" v-for="(item, index) in icon" v-bind:key="index" @click="iconSend(index)">{{item}}</view>
			</view>
		</view> -->

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
	
	const record = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		components: {
			uniDrawer,
			xflSelect
		},
		// 接收页面传过来的参数,e代表的是数组用户的下标
		onLoad(e) {
			//接收用户id下标
			this.User_id=e.userId;
			this.img=e.avatar;
<<<<<<< HEAD
			
			let that = this;
			uni.getStorage({
				key: this.$store.state.account_key,
				success(res) {
					let all=JSON.parse(res.data);
					that.user=all.info;
					that.member_id=all.memberlist[that.User_id].id;
					that.member_id_token=all.memberlist[that.User_id].member_id;
					let chatId=JSON.parse(all.memberlist[that.User_id].reply_msg);
					for(let item in chatId){
						if(chatId[item].type == 'image' || chatId[item].type == 'sticker'){
							console.log(JSON.stringify(chatId[item]) + "----------------" + item);
							that.addImageData(chatId[item]);
						}
						else {
							that.ChatRecord.push(chatId[item]);
						}
					};
				}
			});
			setInterval((sef) => {
				/* 2S定时任务，获取与当前用户聊天信息 */
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
						console.log(res);
						if(res.data.status == 1) {
							console.log("获取到数据");
							for(let arry in res.data.message){
								console.log(res.data.message[arry].type);
								if(res.data.message[arry].type == "text"){
									console.log("获取到TEXT数据" + JSON.stringify(res.data.message[arry]));
									console.log(sef.ChatRecord);
									sef.ChatRecord.push(res.data.message[arry]);
									console.log(sef.ChatRecord);
								}
								else if(res.data.message[arry].type == "image"){
									sef.addImageData(res.data.message[arry]);
								}
							}
						}
					}
				});
				console.log("10S定时任务,异步实时获取用户聊天记录");
			}, 10000, this);
			record.onStop(function(res){
				/* 结束录音事件，当前显示为图片，录音显示有待更新 */
				/* innerAudioContext.src = "../../static/audio/tst.mp3"; */
				innerAudioContext.src = res.tempFilePath;
				that.ChatRecord.push({"from": 2, "text": "../../static/img/audioImg.gif", "wid": 145, hei: 61, "type": "audio", "inner": innerAudioContext});
			});
=======
>>>>>>> a7e80373d3950ba0b1993ec50225066d6c2a9fdc
		},
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
				IsVisible: false,
				InputBottom: 0,
				ChatRecord: [],
				arrays: [],
				test: self,
				img: '',
				remark: '',
				toggle: true,
				face:false,
				dataSend: ''
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
			/* C_ChatRecord: function(){
				let that = this;
				uni.getStorage({
					key: this.$store.state.account_key,
					success(res) {
						let all=JSON.parse(res.data);
						let chatId=JSON.parse(all.memberlist[that.User_id].reply_msg);
						for(let item in chatId){
							if(chatId[item].type == 'image' || chatId[item].type == 'sticker'){
								console.log(chatId[item].type + "----" + item);
								that.addImageData(chatId[item]);
							}
							else {
								that.ChatRecord.push(chatId[item]);
							}
						};
					}
				});
				return this.ChatRecord
			}, */
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
			uploadData(){
				console.log(this.user);
				let sef = this;
				/* console.log("user_id-----" + sef.$store.state.account_key);
				console.log("yzpass-----" + sef.$store.state.account_psw);
				console.log("content-----" + this.dataSend);
				console.log("channel_access_token-----" + this.user.channel_access_token);
				console.log("channelSecret-----" + this.user.channel_secret);
				console.log("member_id_token-----" + this.member_id_token);
				console.log("member_id-----" + this.member_id); */
				uni.request({
					url: "http://www.aot9a.cn/index/user/apisendmessage",
					method: "POST",
					header: {
						'content-type': 'application/x-www-form-urlencoded', 
					},
					data: {
						user_id: sef.$store.state.account_key,
						yzpass: sef.$store.state.account_psw,
						content: sef.dataSend,
						channel_access_token: sef.user.channel_access_token,
						channel_secret: sef.user.channel_secret,
						member_id_token: sef.member_id_token,
						member_id: sef.member_id
					},
					success: (res) => {
						console.log("返回数据----" + JSON.stringify(res));
					}
				});
				console.log("发送请求");
			},
			addImageData(item) {
				console.log("根据地址获取图片宽高");
				console.log(item);
				uni.getImageInfo({
					src: item.text,
					success: (img) => {
						let maxW = uni.upx2px(350);//350是定义消息图片最大宽度
						let maxH = uni.upx2px(350);//350是定义消息图片最大高度
						if(img.width>maxW||img.height>maxH){
							let scale = img.width/img.height;
							console.log("图片最终宽高-----------" + maxW + "--------" + maxH + "--------------" + scale);
							item.wid = scale>1?maxW:maxH*scale;
							item.hei = scale>1?maxW/scale:maxH;
							console.log("图片最终宽高-----------" + item.wid + "--------" + item.hei);
						}
						else {
							item.wid = img.width;
							item.hei = img.height;
						}
					}
				});
				this.ChatRecord.push(item);
			},
			openAudio(inner){
				inner.play();
				console.log("播放音频文件");
			},
			openImg(imgURL){
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
				if(event){
					/* 根据单击事件发地点选择性关闭表情栏 */
					if(event.target.id.indexOf("face") != -1){
					}
					else {
						this.face = false;
					}
				}
			},
			iconSend(index) {
				this.dataSend += this.icon[index];
			},
			openIcon() {
				this.face = !this.face;
				if(this.face){
					for(let item in appData) {
						this.icon.push(appData[item].char);
					}
				}
				else {
					this.icon = [];
				}
			},
			imgSend(){
				let sef = this;
				uni.chooseImage({
					success(temp) {
						sef.addImageData({"from":2, "text":temp.tempFilePaths[0].substring(":"), "type":"image", "time":new Date().getTime()});
						console.log("发送图片");
					}
				})
			},
			send() {
				this.ChatRecord.push({"from":2, "text":this.dataSend, "type":"text", "time":new Date().getTime()});
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
