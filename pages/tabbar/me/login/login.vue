<template>
	<view class="content">
		<view class="main">
			<view class="title">
				欢迎来登录
			</view>
			<view class="form">
				<view class="phone">
					<text>手机号:</text>
					<input type="number" maxlength="11" v-model="mobile" placeholder="请输入手机号" placeholder-style="color:#fff"/>
				</view>
				<view class="pwd">
					<text>密码:</text>
					<input type="password" maxlength="16" v-model="pwd" placeholder="请输入密码" placeholder-style="color:#fff"/>
				</view>
				<view class="submit">
					<wyb-button class="btn" width="190rpx" type="filled" ripple ripple-bg-color="red" :radius="['50px']" :width="'100%'" height="80upx" @click="login">登录</wyb-button>
				</view>
				<view class="bottom">
					<view class="reg" @click="reg">
						没有账号，点击注册
					</view>
					<view class="forget" @click="forget">
						忘记密码
					</view>
				</view>
				<view class="type" @click="smsLogin">
					验证码登录
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 手机号
				mobile:"",
				// 密码
				pwd:""
			}
		},
		onLoad() {
	
		},
		methods: {
			reg(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/reg'
				})
			},
			forget(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/forget'
				})
			},
			smsLogin(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/smsLogin'
				})
			},
			async login(){
				var rex = /^(13[0-9]|14[01456789]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
				if(!this.mobile){
					// 手机弹出框
					uni.showToast({
						title:"手机号不能为空",
						icon:"none"
					});
				}else if(!rex.test(this.mobile)){
					uni.showToast({
						title:"请输入合法手机号",
						icon:"none"
					});
				}else if(!this.pwd){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else if(this.pwd.length<6){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else{
					let res=await this.$http({
						url:"/user/login",
						data:{
							username:this.mobile,
							password:this.pwd				
						},
						method:"POST"
					});
					if(res.data.code==0){
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
						try {
						    uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('uid', res.data.uid);
						} catch (e) {
						    // error
						};
						setTimeout(()=>{
							uni.switchTab({
								url:'/pages/tabbar/index/index'
							})
						},1000)
					}uni.showToast({
						title:res.data.msg,
						icon:"none"
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: url("@/static/img/login/login.jpeg") no-repeat fixed;
		background-size: 100% 100%;
		height: calc(100vh - var(--status-bar-height));
		margin-top: var(--status-bar-height);
		.main{
			width: 100%;
			margin: 0 auto;
			// 垂直居中
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			
			.title{
				font-size: 60upx;
				font-weight: bold;
				color: #fff;
			}
			.form{
				width: 80%;
				margin: 0px auto;
				.phone{
					margin: 30upx 0px;
					border: 1px solid #fff;
					border-radius: 50px;
					overflow: hidden;
					text{
						float: left;
						height: 80upx;
						width: 20%;
						line-height: 80upx;
						font-size: 30upx;
						padding: 0px 20upx;
						color: #fff;
					}
					input{
						float: left;
						height: 80upx;
						width: 65%;
						line-height: 80upx;
						font-size: 30upx;
						color: #fff;
					}
				}
				.pwd{
					margin: 30upx 0px;
					border: 1px solid #fff;
					border-radius: 50px;
					overflow: hidden;
					text{
						float: left;
						height: 80upx;
						width: 20%;
						line-height: 80upx;
						font-size: 30upx;
						padding: 0px 20upx;
						color: #fff;
					}
					input{
						float: left;
						height: 80upx;
						width: 65%;
						line-height: 80upx;
						font-size: 30upx;
						color: #fff;
					}
				}
				.submit{
					margin: 30upx 0px;
					color: #fff;
				}
				.bottom{
					overflow: hidden;
					.reg{
						float: left;
						font-size: 26upx;
						color: #fff;
					}
					.forget{
						float: right;
						font-size: 26upx;
						color: #fff;
					}
				}
				.type{
					width: 100%;
					text-align: center;
					font-size: 30upx;
					color: blue;
					margin-top: 150upx;
					border-top: 1px solid #C0C0C0;
					padding-top: 20upx;
				}
			}
		}
	}
</style>
