<template>
	<view class="content">
		<view class="main">
			<view class="title">
				修改密码界面
			</view>
			<view class="form">
				<view class="phone">
					<text>旧密码:</text>
					<input type="password" v-model="oldPwd" maxlength="16" placeholder="请输入旧密码" placeholder-style="color:#fff"/>
				</view>
				<view class="pwd">
					<text>新密码:</text>
					<input type="password" v-model="newPwd" maxlength="16" placeholder="请输入新密码" placeholder-style="color:#fff"/>
				</view>
				<view class="pwd">
					<text>确认密码:</text>
					<input type="password" v-model="renewPwd" maxlength="16" placeholder="请确认新密码" placeholder-style="color:#fff"/>
				</view>
				<view class="submit">
					<wyb-button class="btn" width="190rpx" type="filled" ripple ripple-bg-color="red" :radius="['50px']" :width="'100%'" height="80upx" @click="update">确认修改</wyb-button>
				</view>
				<view class="bottom">
					<wyb-button class="btn" width="190rpx" type="filled" color="#C0C0C0" :radius="['50px']" :width="'100%'" height="80upx" @click="cancel">取消</wyb-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 旧密码
				oldPwd:"",
				//新密码
				newPwd:"",
				// 确认密码
				renewPwd:"",
				// 本地储存的uid参数
				uid:""
			}
		},
		onLoad() {
			try {
			    const value = uni.getStorageSync('uid');
			    if (value) {
					this.uid=value;
			    }
			} catch (e) {
			    // error
			}
		},
		methods: {
			async update(){
				if(!this.oldPwd||!this.newPwd){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else if(this.oldPwd.length<6||this.newPwd.length<6){
					uni.showToast({
						title:"密码需要在6-16位之间",
						icon:"none"
					});
				}else if(this.oldPwd==this.newPwd){
					uni.showToast({
						title:"新密码不能与旧密码一样",
						icon:"none"
					});
				}else if(this.newPwd!=this.renewPwd){
					uni.showToast({
						title:"请保持两次新密码一致",
						icon:"none"
					});
				}else{
					let res=await this.$http({
						url:"/user/updatePwd",
						data:{
							oldPassword:this.oldPwd,
							newPassword:this.newPwd,
							uid:this.uid
						},
						method:"POST"
					});
					if(res.data.code==0){
						try {
						    uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('uid', res.data.uid);
						} catch (e) {
						    // error
						};
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
						setTimeout(()=>{
							uni.switchTab({
								url:'/pages/tabbar/me/me'
							})
						},1000)
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
					}
				}
			},
			cancel(){
				uni.switchTab({
					url:'/pages/tabbar/me/me'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: url("@/static/img/login/login.jpeg") no-repeat;
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
						line-height: 80upx;
						float: left;
						margin: 0px 10upx;
					}
				}
				.submit{
					margin: 30upx 0px;
					color: #fff;
				}
			}
		}
	}
</style>
