<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top">
			<!-- 头像昵称 -->
			<!-- 未登录时 -->
			<view class="left" v-if="username=='未登录'" @click="login">
				<view class="face" style="background: #DCDFE6;overflow: hidden;">
					<image src="" mode="" class="avatar"></image>
				</view>
				<view class="user">
					<view class="username">
						{{username}}
					</view>
				</view>
			</view>
			<!-- 登陆时 -->
			<view class="left" v-else @click="edit">
				<view class="face" style="background: #DCDFE6;overflow: hidden;">
					<image :src="avatar" mode="" class="avatar"></image>
				</view>
				<view class="user">
					<view class="username">
						{{username}}
					</view>
					<view class="sex">
						<image src="../../../static/img/me/boy.png" v-show="sex=='男'" mode=""></image>
						<image src="../../../static/img/me/girl.png" v-show="sex=='女'" mode=""></image>
					</view>
				</view>
			</view>
			
			<!-- 设置角标 -->
			<view class="right" @click="set">
				<image src="../../../static/img/me/setting.png" mode=""></image>
			</view>
		</view>
		<!-- 内容中间部分 -->
		<view class="center">
			<!-- 全部订单 -->
				<view class="nav">
					<uni-grid :column="5" :showBorder="false" style="text-align: center;">
						<uni-grid-item>
							<view class="nav-item-icon" @click="order">
								<image src="../../../static/img/me/orderAll.png"></image>
								<br/>
								<text class="text">
									全部订单
								</text>
							</view>			
						</uni-grid-item>
						<uni-grid-item>
							<view class="nav-item-icon" @click="daifukuan">
								<image src="../../../static/img/me/daifukuan.png"></image>
								<br/>
								<text class="text">
									待付款
								</text>
							</view>			
						</uni-grid-item>
					  <uni-grid-item>
					  	<view class="nav-item-icon" @click="daifahuo">
					  		<image src="../../../static/img/me/daifahuo.png"></image>
					  		<br/>
					  		<text class="text">
					  			待发货
					  		</text>
					  	</view>			
					  </uni-grid-item>
					   <uni-grid-item>
					   	<view class="nav-item-icon" @click="daishouhuo">
					   		<image src="../../../static/img/me/daishouhuo.png"></image>
					   		<br/>
					   		<text class="text">
					   			待收货
					   		</text>
					   	</view>			
					   </uni-grid-item>
					   <uni-grid-item>
					   	<view class="nav-item-icon" @click="yiwancheng">
					   		<image src="../../../static/img/me/yiwancheng.png"></image>
					   		<br/>
					   		<text class="text">
					   			已完成
					   		</text>
					   	</view>			
					   </uni-grid-item>
					</uni-grid>
				</view>
			<!-- 我的收藏部分 -->
			<view class="more">
				<uni-list>
				    <uni-list-item title="我的收藏" :show-extra-icon="true" :extra-icon="{color:'grey',type:'star-filled'}" link @click="toFav"></uni-list-item>
				    <uni-list-item title="地址管理" :show-extra-icon="true" :extra-icon="{color:'grey',type:'location-filled'}" link @click="address"></uni-list-item>
					<uni-list-item title="关于我们" :show-extra-icon="true" :extra-icon="{color:'grey',type:'heart-filled'}" link @click="toAbout"></uni-list-item>
					<uni-list-item title="修改密码" :show-extra-icon="true" :extra-icon="{color:'grey',type:'compose'}" link @click="updatePwd"></uni-list-item>
					<uni-list-item title="联系我们" :show-extra-icon="true" :extra-icon="{color:'grey',type:'phone-filled'}" link @click="connect"></uni-list-item>
					<uni-list-item title="设置" :show-extra-icon="true" :extra-icon="{color:'grey',type:'gear-filled'}" link @click="set"></uni-list-item>
				</uni-list>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:"未登录",
				sex:"",
				type:"setting",
				token:"",
				// 头像
				avatar:""
			}
		},
		onShow(){
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
				if(res.data.code==0){
					this.avatar=res.data.userInfo.avatar;
					this.username=res.data.userInfo.username;
					this.sex=res.data.userInfo.sex
					if(res.data.userInfo.nickname){
						this.username=res.data.userInfo.nickname;
					}
				}
			})();
		},
		onLoad() {
				// code=30203登录过期
			
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
				if(res.data.code==0){
					this.avatar=res.data.userInfo.avatar;
					this.username=res.data.userInfo.username;
					this.sex=res.data.userInfo.sex
					if(res.data.userInfo.nickname){
						this.username=res.data.userInfo.nickname;
					}
				}
			})();
		},
		onBackPress() {
			uni.showModal({
				title: '提示',
				content: '是否退出应用？',
				success: function(res) {
					if (res.confirm) {
						// 退出当前应用，改方法只在App中生效  
						plus.runtime.quit();
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
			return true //return true的意思是禁止返回到上一个界面
		},
		methods: {
			login(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/login'
				})
			},
			order(){
				uni.navigateTo({
					url:'/pages/tabbar/me/orderAll/orderAll?id=0'
				})
			},
			daifukuan(){
				uni.navigateTo({
					url:'/pages/tabbar/me/orderAll/orderAll?id=1'
				})
			},
			daifahuo(){
				uni.navigateTo({
					url:'/pages/tabbar/me/orderAll/orderAll?id=2'
				})
			},
			daishouhuo(){
				uni.navigateTo({
					url:'/pages/tabbar/me/orderAll/orderAll?id=3'
				})
			},
			yiwancheng(){
				uni.navigateTo({
					url:'/pages/tabbar/me/orderAll/orderAll?id=4'
				})
			},
			edit(){
				uni.navigateTo({
					url:'/pages/tabbar/me/edit/edit'
				})
			},
			set(){
				uni.navigateTo({
					url:'/pages/tabbar/me/set/set'
				})
			},
			address(){
				uni.navigateTo({
					url:'/pages/tabbar/me/address/address'
				})
			},
			updatePwd(){
				uni.navigateTo({
					url:'/pages/tabbar/me/login/updatePwd'
				})
			},
			toFav(){	
				uni.navigateTo({
					url:'pages/tabbar/me/fav/fav'
				})
			},
			toAbout(){
				uni.navigateTo({
					url:'pages/tabbar/about/about'
				})
			},
			// 联系我们
			connect(){
				uni.navigateTo({
					url:'pages/tabbar/me/connect/connect'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{	
		background: #F1F1F1;
		.content{
			background: #F1F1F1;
			height: calc(100vh - var(--window-bottom) - var(--status-bar-height));		
			margin-top: var(--status-bar-height);
			position: relative;
		}
		//头部
		.top{
			background: url(../../../static/img/me/background.png) no-repeat;
			background-size: 100% 100%;
			overflow: hidden;
			padding: 20upx;
			height: 350upx;
			.left{
				float: left;
				overflow: hidden;
				margin-top: 70upx;
				.face{
					width: 140upx;
					height: 140upx;
					border-radius: 50%;
					float: left;
					.avatar{
						width: 140upx;
						height: 140upx;
						border-radius: 50%;
					}
				}
				.user{
					display: inline-block;
					height: 140upx;
					padding: 0px 10upx;
					line-height: 140upx;
					color: #fff;
					float: left;
					overflow: hidden;
					.username{		
						display: inline-block;
						float: left;
						max-width: 220upx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;					
					}
					.sex{
						float: left;
						image{
							display: inline-block;
							width: 30upx;
							height: 30upx;
							margin: auto 20upx;
						}
					}
				}
			}
			.right{
				float: right;
				margin: 20upx 20upx 0px 0px;
				image{
					width: 40upx;
					height: 40upx;
				}
			}
		}
		//中间
		.center{
			position: absolute;
			width: 100%;
			top:300upx;
			.nav{
				background: #fff;
				margin: 10px;
				border-radius: 10px;
				overflow: hidden;
				//分类导航样式
				.uni-grid-item{
					//宫格高度
					height: 140upx !important;
					font-size: 12px;
					//图片标志
					.nav-item-icon image{
						margin-top: 10px;
						margin-bottom: 5px;
						width: 25px;
						height: 25px;
					}
				}
			}
			//中间下面部分
			.more{	
				margin: 10upx 20upx;
				border-radius: 10px;
				overflow: hidden;
			}
		}
	}
</style>
