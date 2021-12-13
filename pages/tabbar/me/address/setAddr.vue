<template>
	<view class="container">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="更新地址" @clickLeft="back"></uni-nav-bar>
		</view>	
		<view class="ui-all">
			<view class="ui-list">
				<text>收货人</text>
				<input type="text" :placeholder="value" :value="nickName" @input="bindnickName"
					placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>手机号</text>
				<input type="tel" :placeholder="value" :value="mobile" @input="bindmobile"
					placeholder-class="place" />
			</view>
			<view class="ui-list right">
				<text>住址</text>
				<AddressPicker @change="change" :level="3">{{planLocate}} </AddressPicker>
			</view>
			<view class="ui-list">
				<text>详细地址</text>
				<input type="text" :placeholder="value" :value="detail" @input="bindDetail"
					placeholder-class="place" />
			</view>
			<view class="ui-list default">
				<text>设置为默认地址</text>
				<view class="kaiguan">
					<switch :checked="is_default" @change="switchChange" />
				</view>
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
				addr_code:[],
				// 详细地址
				detail:"",
				// 是否为默认地址
				is_default:false,
				// 有的话是修改，没有的话是新增，地址id
				arrd_id:"",
				// 是否为库中第一条地址
				is_first:false
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
				uni.navigateBack()
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
			bindDetail(e) {
				this.detail = e.detail.value;
			
			},
			bindmobile(e) {
				this.mobile = e.detail.value;

			},
			// 设为默认地址
			switchChange(){
				if(this.is_default==true){
					this.is_default=false;
				}else{
					this.is_default=true;
				}
				console.log(this.is_default)
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
			savaInfo() {
				let that = this;
				let nickname = that.nickName;
				/* let gender = that.index + 1; */	
				let tel=that.mobile;
				let addr=that.planLocate;
				let addr_code = that.addr_code;
				let detail=that.detail;
				let is_default=that.is_default;
				if(that.is_first){
					is_default=true;
				}
				let uid="";
				let addr_id=that.addr_id;
				let token="";
				try {
				    const uidValue = uni.getStorageSync('uid');
					const tokenValue = uni.getStorageSync('token');
				    if (uidValue) {
						uid=uidValue;
				    }
					if (tokenValue) {
						token=tokenValue;
					}
				} catch (e) {
				    // error
				}
				let updata = {};
				if (!nickname) {
					uni.showToast({
						title: '请填写收货人姓名',
						icon: 'none',
						duration: 2000
					});
					return;
				}
				updata.name = nickname;
				if (that.isPoneAvailable(tel)) {
					updata.tel = tel;
				} else {
					uni.showToast({
						title: '手机号码不合法，请重填',
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
				updata.addr_text=addr;
				updata.addr_code=addr_code;
				updata.detail=detail;
				updata.is_default=is_default;
				updata.uid=uid;
				updata.addr_id=addr_id;
				updata.token=token;
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
				let res=await this.$http({
					url:"/order/saveAddress",
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
						uni.navigateBack({
							
						});
					},1000);
				}else{
					uni.showToast({
						title:res.data.msg,
						icon:"none"
					});
				}
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
		onLoad(options) {
			let uid = "";
			let _id = options._id;
			console.log(_id)
			try {
				const uidValue = uni.getStorageSync('uid');
				if (uidValue) {
					uid = uidValue;
				}
			} catch (e) {
				// error
			}
			// 获取收货地址列表
			if(_id!=undefined){
				(async () => {
					let res = await this.$http({
						url: "/order/get_addr_detail",
						data: {
							uid: uid,
							_id: _id
						},
						method: "POST"
					});			
					if(res.data.code==1){
						if(res.data.data.length==1){
							this.nickName=res.data.data[0].name;
							this.mobile=res.data.data[0].tel;
							this.planLocate=res.data.data[0].addr_text;
							this.detail=res.data.data[0].detail;
							this.is_default=res.data.data[0].is_default;
						}else{
							if(res.data.data.length==0){
								this.is_first=true;
							}else{
								this.is_first=false;
							}
						}
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
					}
				})();
			}
			
		}

	}
</script>

<style lang="scss">
	.container {
		display: block;
		background: #f1f1f1;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		position: relative;
		margin-top: var(--status-bar-height);
	}

	.ui-all {
		padding: 20upx 0upx;

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
			padding: 20upx 20upx;
			border-bottom: 1px solid rgba($color: grey, $alpha: .3);
			position: relative;
			background: #fff;

			text {
				color: #3F536E;
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
			right: 60upx;
		}
		
		.default{
			margin-top: 50upx;
			overflow: hidden;
			.kaiguan{
				display: inline-block;
				vertical-align: middle;
				float: right;
				padding: 0px 30upx;
			}
		}
		
		.btn{
			margin-top: 50upx;
		}

	}
</style>
