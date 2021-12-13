<template>
	<view>
		<view class="modal-body" :class="{'modal-active' : animation}">
			<view class="ss-modal">
				<view class="digital-text-modal">
					<view class="dk-title">请输入支付密码</view>
					<view class="pwd-box clearfix">
						<view class="pwd-text" v-for="(item,index) in 6" :key="index" :data-index="index" :class="{active:(activeInput == index)}">{{payPassWord[index]}}</view>
					</view>
				</view>
				
				<view class="keyboard-modal">
					<view class="keyboard keyboard-show">
						<view class="key-box clearfix">
							<view class="num" v-for="item in digitalList" :key="item" :class="{'no-num':(item === '' || item === '-1')}"
							 @click="getKeyNumber(item)">{{item}}</view>
						</view>
					</view>
				</view>
			</view>
			<view v-if="mask" class="uni-mask" @touchmove.stop.prevent="false" catchtouchmove="true" @click.stop="hide()"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				animation: false,
				mask: true,
				activeInput: 0,
				digitalList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '-1'],//键盘
				paymentPwd: '',
			};
		},
		computed: {
			payPassWord () {
				var payPassWord = this.paymentPwd.split('') || [];
				payPassWord.fill('*');
				return payPassWord;
			}
		},
		methods: {
			show () {
				this.animation = true;
				return true;
			},
			hide () {
				this.animation = false;
				return false;
			},
			toggle () {
				return !this.animation ? this.show() : this.hide()
			},
			cancel () {
				this.$emit('cancel');
			},
			submit (clickFlag){
				this.$emit('submit', {
					value: this.paymentPwd
				});
				
				this.paymentPwd = '';
				this.activeInput = 0;
				this.hide();
			},
			getKeyNumber (val) {
				let paymentPwdArr = this.paymentPwd.split('');
				if (val === '' || (val != -1 && paymentPwdArr.length === 6)) {
					if(paymentPwdArr.length === 6){
						this.submit();
						return ;
					}
					return false;
				} else if (val != -1) { //数字输入
					paymentPwdArr.splice(this.activeInput, 0, val);
					this.activeInput++;
					this.paymentPwd = paymentPwdArr.join('');
					if(paymentPwdArr.length === 6){
						this.submit();
						return ;
					}
				} else { //删除
					if (this.activeInput >= 0) {
						this.activeInput !== 0 && this.activeInput--;
						paymentPwdArr.splice(this.activeInput - 1, 1);
						this.paymentPwd = paymentPwdArr.join('');
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.digital-text-modal{
		position:fixed;
		z-index:2;
		transition:inherit;
		width: calc(100% - 100rpx);
		height: 300rpx;
		top: 30%;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		padding-padding: 0;
		padding-padding: constant(safe-area-inset-top);
		padding-padding: env(safe-area-inset-top);
		
		.dk-title {
			font-size: 36rpx;
			font-weight: 800;
			color: #000;
			line-height: 90rpx;
			text-align: center;
		}
		
		.pwd-box {
			padding-left:10rpx;
			position: relative;
			text-align: center;
		}

		.pwd-text {
			position: relative;
			line-height:110rpx;
			vertical-align: middle;
			text-align: center;
			font-size:50rpx;
			font-weight: bold;
			width:92rpx;
			height:92rpx;
			margin-right:10rpx;
			border-radius:10rpx;
			display: inline-block;
			box-shadow: 0 0 0 2rpx #ccc;
			overflow: hidden;
		}

		.pwd-text.active:after {
			-webkit-animation: twinkle 1s infinite;
			animation: twinkle 1s infinite;
			height: 70%;
			width: 4rpx;
			content: '';
			position: absolute;
			top: 15%;
			left: 50%;
			margin-left: -2rpx;
			background-color: #4fa5e1;
		}
		
		@keyframes twinkle {
			from {
				background-color: #4fa5e1;
			}

			to {
				background-color: transparent;
			}
		}
	}
	
	.keyboard-modal{
		position:fixed;
		z-index:2;
		transition:inherit;
		width: calc(100% + 3px);
		height: 420rpx;
		bottom: 0;
		left: 0;
		transform: translate(0, 0);
		background-color: #fff;
		padding-padding: 0;
		padding-padding: constant(safe-area-inset-top);
		padding-padding: env(safe-area-inset-top);
		
		.keyboard{
			box-shadow: 0 -1rpx 0 3rpx #eee;
			width: 100%;
			transition: all .2s linear;
			transform: translateY(100%);
		}
		
		/* 键盘 */
		.key-box {
			box-shadow: 0 0 0 2rpx #eee;
			position: relative;
			overflow: hidden;
			width: 100%;
			margin-top: 20rpx;
		}
		
		.keyboard-show{
			transform: translateY(0);
		}
	
		.num {
			transition: all .2s linear;
			float: left;
			background-color:#fff;
			box-shadow:0 0 0 2rpx #eee;
			width: 33.33333333%;
			cursor:pointer;
			height: 100rpx;
			text-align: center;
			color: #333;
			line-height: 100rpx;
			font-size:50rpx;
			font-weight:500;
			position: relative;
			overflow: hidden;
			&:after {
				content: "";
				display: block;
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				pointer-events: none;
				//设置径向渐变
				background-image: radial-gradient(circle, rgba(0, 0, 0, .65) 20%, transparent 20%);
				background-repeat: no-repeat;
				background-position: 50%;
				transform: scale(5);
				opacity: 0;
				transition: transform .2s ease-in-out, opacity .3s ease-in-out;
			}
			&:active:after {
			    //transform: scale(0);
			    opacity: .2;
			    //设置初始状态
			    transition: 0s;
			}
		}
	
		.num:nth-of-type(3n+1) {
			border-bottom: 0;
			border-left: 0;
		}
	
		.num:nth-of-type(3n+2) {
			border-bottom: 0;
			border-left: 0;
			border-right: 0;
		}
	
		.num.no-num {
			background-color: #f2f2f2;
			font-size: 0;
		}
		
		.num:last-child {
			background: #f2f2f2 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAilBMVEUAAADLy8vLy8vLy8vMzMzMzMzY2NjMzMzMzMzQ0NDOzs7MzMzMzMzNzc3Pz8/T09PMzMzNzc3Nzc3Nzc3Ly8vMzMzMzMzMzMzOzs7MzMzNzc3MzMzOzs7Ozs7Q0NDMzMzMzMzMzMzOzs7Ozs7Ly8vMzMzMzMzMzMzMzMzOzs7MzMzMzMzMzMzMzMzKmFAsAAAALXRSTlMAQICZ9vAD+uoMG+eyRCsHwV5RJfvhjEw2yGdWMiEX7NWjOhL83JKGeinNu3IVbGIkAAADJklEQVR42u2Z2XLiQAxFBY3xBhgw+2IWkxAg+v/fm6lJKgGBkbrHKl76PFJQOm7crWsZPB6Px+PxeDwej0dGsm/UzB7kZJMIFYiOCYhYz1GJcCCqP0Y9hsCSp6jIJgaGXoSqLLn6G9TlCE9ZbVAZA8+YBcigK7BvIYOuQIOpry3QDZFBV2DK1NcWmI6QQVdgyNTXFlgekEFXYCD8cTeG4Rafcl7GUDQjO4EFSggG399+tlsn7a+OVqlp3OuffvbrqLo+fBPP5QKfKKJxdcdgBR9XmS6UCnygiIhfs8NNq+0IBSYoFGDv2tEUrtnJBCYoZUYMuLR1Fgm8o5gOs3NJ3pyiRMCgBQ1ydoY3eZdcfy+QCOzQhqBHumcLf2gRu3WEvEB7h3ZEOclvwY/bDG4oxsgLtDtoS0rW4JQ+/jx5Q0aA1BcTrEilf1c6Tu68GAH7+pVrvUXcFnf/DC+QXdCNVhduiPv9WJAsqUDWR1dGZL9lmV2yNF/a6M7h98RxSZbmt1U6s4BKlshhnOvTruuYbIzN+cvkDqdkYaCoI/++wwOOKBJYYB3s4A6DMoEd1mPQBqfObuCCtdBpu402DPTrWgBKHskEOlgDxnm8ZuBdYxP8tmFeoIuodhCVc8na8ZruzSC7CAQaITLwDZkiz3mG6ZjWkaTs2T1pmf+cRqUnEoneaEyDZcgKuM/j0vz+vm/NgOZ1RsDdYLymO//hXbEPWAGYuRikyePBejglBqeIEXCbyganqsH6iBr0AkbAZS5N/+vVpjqqQvfACDhM5pfP4v9hKExHxvndRIfGf+Z87PMCkNsYJOThnAvLe0bA9v3QnAx22R6Vixr5WmzQvznsRnxYHjAC1u/o8qvrF+SEMmUErA3m5c3jF2dgxFkqkRpEs6+G28QnXArmGcFUBimeVjOG9p4JPZtjDpBNrNJk8Ya1so1s42yxRU14ASgZA2UB3kBfAMozMigLQMwYKAswgxt9AWZ0pS/ADO8UBF5mYMDNQF9APMLVGbCRIb4iC3itQZjAaw2OAC81OGcgMZigEiYGGeWwqcDnCjwej8fj8Xg8Ho/nL38AXRgT/6dxCesAAAAASUVORK5CYII=) center center / auto 50rpx no-repeat;
		}
	}
	
	.modal-body{
		box-sizing: border-box;
		opacity: 0;
		position: fixed;
		top:0px;
		bottom:0px;
		left: 0;
		width: 100%;
		pointer-events: none;
		transform: translateX(0);
		transition: all .2s linear;
		z-index: 98;
		&.modal-active{
			pointer-events: auto;
			opacity: 1;
		}
	}
		
	.modal-body .uni-mask{
		z-index: 1;
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0,0,0,.6);
	}
	.modal-body{
		opacity: 0;
		pointer-events: none;
	}
	.modal-active{
		opacity: 1;
		pointer-events: auto;
	}
</style>