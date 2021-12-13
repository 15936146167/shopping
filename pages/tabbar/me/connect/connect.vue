<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="联系我们" @clickLeft="back"></uni-nav-bar>
		</view>
		<view class="comment">
			有事情请联系袁少
			<view>
				袁少WeChat:15936146167
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			back(){
				uni.navigateBack({
					
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		background: #F1F1F1;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));		
		margin-top: var(--status-bar-height);
		position: relative;
		.comment{
			position: absolute;
			top:600upx;
			width: 100%;
			text-align: center;
			color: grey;
		}
	}
</style>
