<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="设置" @clickLeft="back"></uni-nav-bar>
		</view>
		<view class="lists">
			<uni-list class="listItem" style="margin-top: 10upx;">
				<uni-list-item title="个人资料" link @click="edit"></uni-list-item>
			    <uni-list-item title="收货地址" link @click="address"></uni-list-item>
				<uni-list-item title="实名认证" link @click="shiming"></uni-list-item>
			</uni-list>
			<uni-list class="listItem">
				<uni-list-item title="消息推送" :show-switch="true"  @switchChange="switchChange" ></uni-list-item>
			</uni-list>
			<uni-list class="listItem" style="margin-bottom: 60upx;">
				<uni-list-item title="清除缓存" link @click="qingchu"></uni-list-item>
			    <uni-list-item title="关于商城" link @click="about"></uni-list-item>
				<uni-list-item title="检查更新" :rightText="version" link @click="update"></uni-list-item>
			</uni-list>
			<wyb-button class="btn" width="100%" type="filled" height="80upx" :radius="['0px']" :border-size="0" @click="exit">退出登录</wyb-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				version:""
			};
		},
		onLoad(){
			(async ()=>{
				let res=await this.$http({
					url:"/api/upgrade",
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					this.version=res.data.data[0].version;
				}
			})();
		},
		methods:{
			back(){
				uni.switchTab({
					url:"/pages/tabbar/me/me"
				})
			},
			switchChange(e){
				if(e.value==true){
					uni.showToast({
						title:"推送已开启",
						icon:"none"
					});
				}else{
					uni.showToast({
						title:"推送已关闭",
						icon:"none"
					});
				}
			},
			exit(){
				try {
				    uni.removeStorageSync('token');
				} catch (e) {
				    // error
				};
				uni.navigateTo({
					url:'/pages/tabbar/me/login/login'
				})
			},
			update(){
				(async ()=>{
					let res=await this.$http({
						url:"/api/upgrade",
						method:"POST"
					});
					console.log(res)
					if(res.data.code==1){
						if(this.version==res.data.data[0].version){
							uni.showToast({
								title:"当前已是最新版本",
								icon:"none"
							});
						}
					}
				})();
			},
			about(){
				uni.navigateTo({
					url:'/pages/tabbar/about/about'
				})
			},
			edit(){
				uni.navigateTo({
					url:'/pages/tabbar/me/edit/edit'
				})
			},
			address(){
				uni.navigateTo({
					url:'/pages/tabbar/me/address/address'
				})
			},
			// 实名认证
			shiming(){
				uni.showToast({
					title:"暂不支持实名认证",
					icon:"none"
				});
			},
			// 清除缓存
			qingchu(){
				uni.showToast({
					title:"清除缓存成功",
					icon:"none"
				});
			}

		}
	}
</script>

<style lang='scss' scoped>
	.content{
		background: #F1F1F1;
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		.listItem{
			margin-bottom: 10upx;
		}
	}
</style>
