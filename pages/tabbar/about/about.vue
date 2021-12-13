<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="关于商城" @clickLeft="back"></uni-nav-bar>
		</view>
		<view class="about" v-html="data" style="text-indent: 2em;">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:""
			}
		},
		onLoad(){
			let uid="";
			try {
			    const value = uni.getStorageSync('uid');
			    if (value) {
					uid=value;
			    }
			} catch (e) {
			    // error
			}
			(async ()=>{
				let res=await this.$http({
					url:"/api/get_about",
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					this.data=res.data.data[0].desc;
				}
			})();
		},
		mounted(){
			
		},
		methods: {
			back() {
				uni.navigateBack({
					
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.inlineBlock{
		display: inline-block;
	}
	.none{
		display: none;
	}
	//整体页面
	.content{
		background: #F1F1F1;
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
	}
	.about{
		line-height: 2em;
		padding: 0px 20upx;
	}
</style>
