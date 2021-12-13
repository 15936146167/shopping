<template>
	<view class="container">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="修改资料" @clickLeft="back"></uni-nav-bar>
		</view>	
		<view class="ui-all">
			<view class="avatar" style="position: relative;clear: both;height: 160upx;">
				<!-- <image :src="base64Img" mode="" style="position: absolute; width: 140upx;height: 140upx;border-radius: 50%;background: #DCDFE6;"></image> -->
				<avatar
				       selWidth="70px" selHeight="140upx" @upload="myUpload" :avatarSrc="url"
				       avatarStyle="width: 140upx; height: 140upx; border-radius: 100%;"
						inner style="width: 140upx;height: 140upx;border-radius: 50%;background: #DCDFE6;">
				   </avatar>
			</view>
			<view class="ui-list">
				<text>昵称</text>
				<input type="text" :placeholder="value" :value="nickName" @input="bindnickName"
					placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>手机号</text>
				<input v-if="mobile" type="tel" :placeholder="value" :value="mobile" @input="bindmobile"
					placeholder-class="place" />
				<button v-if="!mobile" open-type="getPhoneNumber" @click="getphonenumber"
					class="getInfo bun">授权手机号</button>
			</view>
			<view class="ui-list right">
				<text>性别</text>
				<picker @change="bindPickerChange" mode='selector' range-key="name" :value="index" :range="sex">
					<view class="picker">
						{{sex[index].name}}
					</view>
				</picker>
			</view>
			<view class="ui-list right">
				<text>住址</text>
				<AddressPicker @change="change" :level="3">{{planLocate}} </AddressPicker>
			</view>
			<view class="ui-list right">
				<text>生日</text>
				<picker mode="date" :value="date" @change="bindDateChange">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
			<wyb-button class="btn" width="100%" type="filled" height="80upx" :radius="['0px']" :border-size="0"
				@tap="savaInfo">保存修改</wyb-button>
		</view>
<!-- <image :src="base64Img" mode=""></image> -->
	</view>
</template>

<script>
	import AddressPicker from "@/components/lingdang-AddressPicker/AddressPicker.vue"
	import avatar from "@/components/yq-avatar/yq-avatar.vue";
	export default {
		data() {
			return {
				url:"",
				base64Img:"",
				value: '请填写',
				// 性别
				sex: [{
					id: 1,
					name: '男'
				}, {
					id: 2,
					name: '女'
				}],
				// 性别选项下表
				index: 0,
				// 生日
				date: '请填写',
				// 头像链接
				avatar: "",
				url: '',
				// 昵称
				nickName: '',
				// 手机号
				mobile: '',
				headimg: '',
				// 地址
				planLocate: '请选择地址',
				// 地址编号
				addr_code:[]
			}

		},
		components: {
			AddressPicker,
			avatar
		},
		methods: {
			 myUpload(rsp) {
			                this.url = rsp.path; //更新头像方式一
			                //rsp.avatar.imgSrc = rsp.path; //更新头像方式二
							console.log(rsp);
							this.base64Img=rsp.base64;
							console.log(this.base64Img)
			            },
			back() {
				uni.switchTab({
					url: "/pages/tabbar/me/me"
				})
			},
			bindPickerChange(e) {
				this.index = e.detail.value;

			},
			bindRegionChange(e) {
				this.planLocate = e.detail.value;

			},
			bindDateChange(e) {
				this.date = e.detail.value;

			},
			bindnickName(e) {
				this.nickName = e.detail.value;

			},
			bindmobile(e) {
				this.mobile = e.detail.value;

			},
			avatarChoose() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success(res) {
						// tempFilePath可以作为img标签的src属性显示图片
						that.imgUpload(res.tempFilePaths);
						const tempFilePaths = res.tempFilePaths;
					}
				});
			},
			getUserInfo() {
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						console.log(res);
						uni.showToast({
							title: '已授权',
							icon: 'none',
							duration: 2000
						})
					}
				})
			},
			async getphonenumber(e) {
				/* if (e.detail.iv) {
					console.log(e.detail.iv) //传后台解密换取手机号
					uni.showToast({
						title: '已授权',
						icon: 'none',
						duration: 2000
					})
				} */
				let token="";
				try {
				    const value = uni.getStorageSync('token');
				    if (value) {
						token=value;
				    }
				} catch (e) {
				    // error
				}
				let res=await this.$http({
					url:"/user/getuserInfo",
					data:{
						token:token
					},
					method:"POST"
				});
				if(res.data.code==0){
					this.mobile=res.data.userInfo.username;
					uni.showToast({
						title: '授权成功',
						icon: 'none'
					});
				}else{
					uni.showToast({
						title: '授权失败',
						icon: 'none',
						duration: 2000
					});
				}	
			},
			savaInfo() {
				let that = this;
				let nickname = that.nickName;
				let avatar = that.base64Img;
				/* let gender = that.index + 1; */
				let mobile = that.mobile;
				let addr=that.planLocate;
				let birthday = that.date;
				let sex=that.sex[that.index].name;
				let addr_code = that.addr_code;
				let uid="";
				try {
				    const value = uni.getStorageSync('uid');
				    if (value) {
						uid=value;
				    }
				} catch (e) {
				    // error
				}
				let updata = {};
				if (!nickname) {
					uni.showToast({
						title: '请填写昵称',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				updata.avatar = avatar;
				updata.nickname = nickname;
				updata.sex=sex;
				/* if (!headimg) {
					headimg = that.avater;
				} */
				
				/* updata.gender = gender; */
				if (that.isPoneAvailable(mobile)) {
					updata.mobile = mobile;
				} else {
					uni.showToast({
						title: '手机号码有误，请重填',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				if (addr=="请选择地址") {
					uni.showToast({
						title: '请选择常住地',
						icon: 'none',
						duration: 2000
					});
					return;
				} else {
					/* updata.province = planLocate[0];
					updata.city = planLocate[1];
					updata.area = planLocate[2]; */
				}
				if (birthday == "0000-00-00") {
					uni.showToast({
						title: '请选择生日',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				updata.birthday = birthday;
				updata.addr=addr;
				updata.addr_code=addr_code;
				updata.uid=uid;
				that.updata(updata);
			},
			isPoneAvailable(poneInput) {
				var myreg = /^(13[0-9]|14[01456789]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				if (!myreg.test(poneInput)) {
					return false;
				} else {
					return true;
				}
			},
			async updata(datas) {
				//传后台
				console.log(datas);
				console.log(datas.avater)
				let res=await this.$http({
					url:"/user/editUserInfo",
					data:datas,
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					});
					setTimeout(()=>{
						uni.switchTab({
							url: "/pages/tabbar/me/me"
						})
					},1000)
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					});
				}
			},
			imgUpload(file) {
				let that = this;
				that.avater = file;
				console.log(file)
				/* uni.uploadFile({
					header: {
						Authorization: uni.getStorageSync('token')
					},
					url:'/api/upload/image', //需传后台图片上传接口
					filePath: file[0],
					name: 'file',
					formData: {
						type: 'user_headimg'
					},
					success: function(res) {
						var data = JSON.parse(res.data);
						data = data.data;
						that.avater = that.url + data.img;

						that.headimg = that.url + data.img;

						
					},
					fail: function(error) {
						console.log(error);
					}
				}); */
			},


			change(result) {
				let data=JSON.stringify(result.data);
				console.log(data);
				console.log(result);
				for(var i=0;i<result.data.length;i++){
					this.addr_code.push(result.data[i].id)
				};
				console.log(this.addr_code)
				this.planLocate = '';
				result.data.forEach((item, index) => {
					if (index === 0) {
						this.planLocate += item.name
					} else {
						this.planLocate += '-' + item.name
					}
				});
				let arr = this.planLocate.split('-');
				console.log(arr)
			},

		},
		onLoad() {
			let token="";
			try {
			    const value = uni.getStorageSync('token');
			    if (value) {
					token=value;
			    }
			} catch (e) {
			    // error
			}
			(async ()=>{
				let res=await this.$http({
					url:"/user/getuserInfo",
					data:{
						token:token
					},
					method:"POST"
				});
				console.log(res)
				if(res.data.code==0){
					if(res.data.userInfo.avatar){
						this.url=res.data.userInfo.avatar;
					}
					if(res.data.userInfo.nickname){
						this.nickname=res.data.userInfo.nickname;
					}
					if(res.data.userInfo.sex){
						if(res.data.userInfo.sex=="男"){
							this.index=0;
						}else if(res.data.userInfo.sex=="女"){
							this.index=1;
						}
					}				
					if(res.data.userInfo.addr){
						this.planLocate=res.data.userInfo.addr;
					}
					if(res.data.userInfo.birthday){
						this.date=res.data.userInfo.birthday;
					}
					if(res.data.userInfo.nickname){
						this.nickName=res.data.userInfo.nickname;
					}else{
						this.nickName=res.data.userInfo.username;
					}
				}
			})();
			
		}

	}
</script>

<style lang="scss">
	.container {
		display: block;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		position: relative;
		margin-top: var(--status-bar-height);
	}

	.ui-all {
		padding: 20upx 40upx;

		.avatar {
			width: 100%;
			text-align: left;
			padding: 20upx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			.imgAvatar {
				width: 140upx;
				height: 140upx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;

				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
				}
			}

			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28upx;
				margin-left: 40upx;
			}

			&:after {
				content: ' ';
				width: 20upx;
				height: 20upx;
				border-top: solid 1px #030303;
				border-right: solid 1px #030303;
				transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				/* IE 9 */
				-moz-transform: rotate(45deg);
				/* Firefox */
				-webkit-transform: rotate(45deg);
				/* Safari 和 Chrome */
				-o-transform: rotate(45deg);
				position: absolute;
				top: 85upx;
				right: 0;
			}
		}

		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20upx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 28upx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150upx;
			}

			input {
				color: #030303;
				font-size: 30upx;
				display: inline-block;
				vertical-align: middle;
			}

			button {
				color: #030303;
				font-size: 30upx;
				display: inline-block;
				vertical-align: middle;
				height: 42upx;
				line-height: 42upx;
				background: none;
				margin: 0;
				padding: 0;

				&::after {
					display: none;
				}
			}

			picker {
				width: 90%;
				color: #030303;
				font-size: 30upx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30upx;
				left: 150upx;
			}

			textarea {
				color: #030303;
				font-size: 30upx;
				vertical-align: middle;
				height: 150upx;
				width: 100%;
				margin-top: 50upx;
			}

			.place {
				color: #999999;
				font-size: 28upx;
			}
		}

		.right:after {
			content: ' ';
			width: 20upx;
			height: 20upx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40upx;
			right: 0;
		}
		
		.btn{
			margin-top: 50upx;
		}

	}
</style>
