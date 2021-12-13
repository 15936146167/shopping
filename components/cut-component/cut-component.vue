<template>
	<view v-if="isShow" class="cut-component" @tap.stop="" @touchstart="touchStart" @touchend="touchend" @touchmove="touchmove">
		<image class="image-target" :src="originSrc" mode="widthFix" :style="'transform: translate(' + (showLeft + move.left - zoomLeft) + 'px, ' + (showTop + move.top - zoomTop) + 'px); width: ' + showWidth * originZoom + 'rpx; height: ' + showHeight * originZoom + 'rpx; '"></image>
		
		<view class="tool-box">
			<view class="mask-left" :style="'width: ' + boxLeft + 'rpx;'"></view>
			<view class="mask-center" :style="'width: ' + boxWidth + 'rpx;'">
				<view class="mask-center-top" :style="'height: ' + boxTop + 'rpx;'"></view>
				<view class="mask-center-center" :style="'height: ' + boxHeight + 'rpx;'"></view>
				<view class="mask-center-bottom" :style="'height: calc(100% - ' + boxTop + 'rpx - ' + boxHeight + 'rpx);'"></view>
			</view>
			<view class="mask-right" :style="'width: ' + (750 - boxLeft - boxWidth) + 'rpx;'"></view>
		</view>
		
		<view class="btn-list-box" @tap.stop="" @touchend.stop="" @touchmove.stop="">
			<view class="btn-list">
				<view>小</view>
				<view style="width: 500rpx;">
					<slider bindchange="slider2change" :step="zoomStep" :min="zoomMin" :max="zoomMax" :value="originZoom" @changing="sliderChanging" @change="sliderChanging"/>
				</view>
				<view>大</view>
			</view>
			<view class="btn-list">
				<view class="btn cancel" @tap="hide">{{cutBtnCancelText}}</view>
				<view class="btn" @tap="cut">{{cutBtnConfirmText}}</view>
			</view>
		</view>
		
		<canvas canvas-id="cutCanvas" style="width: 750px; height: 1000px; position:relative; bottom:-100%"></canvas>
	</view>
</template>

<script>		
	export default {
		name: 'cut',
		props: {
		},
		data() {
			return {
				isShow: false, // 显示
				boxWidth: 300, // 选择框宽
				boxHeight: 300, // 选择框高
				boxLeft: 225, // 选择框X坐标
				boxTop: 200, // 选择框Y坐标
				originSrc: '', // 源图片地址
				originWidth: 0, // 源图片宽
				originHeight: 0, // 源图片高
				originZoom: 1, // 源图片缩放比例默认
				zoomTop: 0, // 源图片缩放高值
				zoomLeft: 0, // 源图片缩放宽值
				zoomMin: 0.01, // 源图片缩放最小值
				zoomMax: 10, // 源图片缩放最大值
				zoomStep: 0.01, // 源图片缩放步长，必须大于0，并且可被(max - min)整除
				showLeft: 0, // 预览图片左移间距
				showTop: 0, // 预览图片上移间距
				showWidth: 0, // 预览图片宽
				showHeight: 0, // 预览图片高
				cutBtnConfirmText: '剪切', // 确定按钮文案
				cutBtnCancelText: '取消', // 取消按钮文案
				callback: () => {}, // 确认剪切回调 有多种回调方式，参看125行
				move: {
					startY: 0,
					startX: 0,
					left: 0,
					top: 0,
					zoom: 0,
					startTimeStamp: 0,
				},
			}
		},
		watch: {},
		created() {
		},
		methods: {
			sliderChanging(res) {
				this.originZoom = res.detail.value; // 记录缩放值
				this.zoomLeft = (this.originZoom - 1) * this.showWidth / 2 / 2 // 计算缩放后左移间距 /2是因为预览单位是rpx
				this.zoomTop = (this.originZoom - 1) * this.showHeight / 2 / 2
			},
			touchmove(res) {
				let startX = this.move.startX;
				let startY = this.move.startY;
				let endX = res.changedTouches[0].pageX;
				let endY = res.changedTouches[0].pageY;
				
				this.move.left = endX - startX;
				this.move.top = endY - startY;
			},
			touchend(res) {
				let startX = this.move.startX;
				let startY = this.move.startY;
				let endX = res.changedTouches[0].pageX;
				let endY = res.changedTouches[0].pageY;

				this.move.left = 0;
				this.move.top = 0;
				this.showLeft += endX - startX;
				this.showTop += endY - startY;
			},
			touchStart(res) {				
				this.move.startX = res.changedTouches[0].pageX;
				this.move.startY = res.changedTouches[0].pageY;
				this.move.endX = 0;
				this.move.endY = 0;
				this.move.left = 0;
				this.move.top = 0;
			},
			cut() {
				let that = this;
				let ctx = uni.createCanvasContext('cutCanvas', this);

				ctx.drawImage(this.originSrc, 0, 0
					, this.originWidth, this.originHeight
					, this.showLeft * 2 - this.zoomLeft * 2 // 图片的X点显示在CANVAS的0点，*2是因为CANVAS的单位是px
					, this.showTop * 2 - this.zoomTop * 2
					, this.showWidth * this.originZoom
					, this.showHeight * this.originZoom);
				ctx.draw(true, () => {
					
					uni.canvasToTempFilePath({
						x: this.boxLeft,
						y: this.boxTop,
						width: this.boxWidth,
						height: this.boxHeight,
						destWidth: this.boxWidth,
						destHeight: this.boxHeight,
						canvasId: 'cutCanvas',
						success(res) {
							that.hide();
							// 多种回调方式
							if (this.$emit) this.$emit('callback', res.tempFilePath);
							if (typeof callback == 'function') callback(res.tempFilePath);
							if (typeof that.$parent.curCallBack == 'function') that.$parent.curCallBack(res.tempFilePath);
						},
					}, this)
				});			
			},
			show(options={}) {
				// 默认值
				this.zoomMin = options?.zoomMin || this.zoomMin;
				this.zoomMax = options?.zoomMax || this.zoomMax;
				this.zoomStep = options?.zoomStep || this.zoomStep;
				this.originZoom = options?.originZoom || this.originZoom;
				this.boxWidth = options?.boxWidth || this.boxWidth;
				this.boxHeight = options?.boxHeight || this.boxHeight;
				this.boxLeft = options?.boxLeft || this.boxLeft;
				this.boxTop = options?.boxTop || this.boxTop;
				this.originSrc = options?.originSrc || this.originSrc;
				this.cutBtnConfirmText = options?.cutBtnConfirmText || this.cutBtnConfirmText;
				this.cutBtnCancelText = options?.cutBtnCancelText || this.cutBtnCancelText;
				this.callback = options?.callback || this.callback;
				
				if (!this.originSrc) return;
				
				this.showLeft = 0;
				this.showTop = 0;
				this.zoomLeft = 0;
				this.zoomTop = 0;
				this.move.left = 0;
				this.move.top = 0;
				this.originZoom = 1;
				
				uni.getImageInfo({
					src: this.originSrc,
					success: (res) => {
						this.originWidth = res.width;
						this.originHeight = res.height;
						this.showWidth = res.width;
						this.showHeight = res.height;
						if (this.showWidth > 750) {
							this.showWidth = 750;
							this.showHeight = this.originHeight * 750 / this.originWidth;
						}
						
						this.isShow = true;
					},
					fail() {
						uni.showToast({
							title: '图片加载失败',
							icon: 'none',
						})
					}
				})

			},
			hide() {
				this.isShow = false;
			},
		}
	}
</script>

<style scoped lang='scss'>
	.cut-component {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #333;
		
		.btn-list-box {
			position: fixed;
			bottom: 100rpx;
			width: 750rpx;
			z-index: 999;
			
			.btn-list {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-top: 30rpx;
				color: #fff;
				
				.btn {
					padding: 0 50rpx;
					line-height: 80rpx;
					background-color: #ffe000;
					font-size: 24rpx;
					border-radius: 8rpx;
					margin: 0 20rpx;
					color: #333;
				}
				
				.cancel {
					background-color: #ccc;
				}
			}
		}
		
		.image-target {
			position: relative;
			left: 0;
			top: 0;
		}
		
		.tool-box {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			display: flex;
			
			.mask-left, .mask-right, .mask-center-top, .mask-center-bottom {
				background-color: rgba($color: #000000, $alpha: 0.5);
			}
			
			.mask-center-center {
				border: 2rpx dashed #f8f8f8;
			}
		}
	}
</style>
