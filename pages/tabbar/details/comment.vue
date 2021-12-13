<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="评论列表" @clickLeft="back"></uni-nav-bar>
		</view>
		<view class="comment">
			你已到达评论页，此功能暂未开发，我劝你还是撤吧！
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
