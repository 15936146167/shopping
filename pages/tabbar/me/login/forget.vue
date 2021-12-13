<template>
	<view class="content">
		<view class="main">
			<view class="title">
				忘记密码界面
			</view>
			<view class="form">
				<view class="phone">
					<text>手机号:</text>
					<input type="number" v-model="mobile" maxlength="11" placeholder="请输入手机号" placeholder-style="color:#fff"/>
				</view>
				<view class="pwd">
					<text>新密码:</text>
					<input type="password" v-model="pwd" maxlength="16" placeholder="请输入密码" placeholder-style="color:#fff"/>
				</view>
				<view class="yzm">
					<view class="sms">
						<text>验证码:</text>
						<input type="number" v-model="sms" maxlength="6" placeholder="请输入验证码" placeholder-style="color:#fff"/>
					</view>
					<view class="send">
						<wyb-button class="btn" type="filled" color="#18B566" :radius="['50px']" :width="'100%'" height="80upx" :font-size="12" @click="send">{{sendText}}</wyb-button>
					</view>
				</view>
				<view class="submit">
					<wyb-button class="btn" width="190rpx" type="filled" ripple ripple-bg-color="red" :radius="['50px']" :width="'100%'" height="80upx" @click="edit">确认修改</wyb-button>
				</view>
				<view class="bottom">
					<view class="login" @click="login">
						已有账号，点击登录
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile:"",
				pwd:"",
				sms:"",
				sendText:"点击发送"
			}
		},
		onLoad() {
	
		},
		methods: {
			send(){
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
				}else{
					// 成功
					(async ()=>{
						let res=await this.$http({
							url:"/user/sendSms",
							data:{
								mobile:this.mobile,
								type:"login"
							},
							method:"POST"
						});
						if(res.data.code==0){
							var times=60;
							this.kaiguan=true;
							var interval=setInterval(()=>{
								times--;
								this.sendText=times+"s后再次发送";
								if(times==0){
									this.kaiguan=false;
									clearInterval(interval);
									this.sendText="点击发送";
								}
							},1000);
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							});
						}
					})();
				}
			},
			async edit(){
				if(!this.pwd){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else if(this.pwd.length<6){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else if(!this.sms){
					uni.showToast({
						title:"验证码不能为空",
						icon:"none"
					});
				}else{
					let res=await this.$http({
						url:"/user/forget",
						data:{
							username:this.mobile,
							password:this.pwd,
							vercode:this.sms
						},
						method:"POST"
					});
					if(res.data.code==0){
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
						setTimeout(()=>{
							uni.navigateTo({
								url:"/pages/tabbar/me/login/login"
							})
						},1000);
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
					}
				}
			},
			login(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/login'
				})
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
				.yzm{
					overflow: hidden;
					margin: 30upx 0px;
					.sms{
						width: 60%;				
						border: 1px solid #fff;
						border-radius: 50px;
						overflow: hidden;
						float: left;
						text{
							float: left;
							height: 80upx;
							line-height: 80upx;
							font-size: 30upx;
							padding: 0px 20upx;
							color: #fff;
						}
						input{
							float: left;
							height: 80upx;
							line-height: 80upx;
							font-size: 30upx;
							color: #fff;
							width: 55%;
						}
					}
					.send{
						width: 32%;
						float: left;
						line-height: 80upx;
						margin: 0px 10upx;
					}
				}
				.submit{
					margin: 30upx 0px;
					color: #fff;
				}
				.bottom{
					overflow: hidden;
					.login{
						float: right;
						font-size: 12upx;
						color: #fff;
					}
				}
			}
		}
	}
</style>
