<template>
	<view :class='["keyBoard",showBoard ? "active":""]' @click.stop="closeBorad">
		<view  :class='["innerBox",showBoard?"visible":""]'>
			<view class="title">
				<text v-if="showTitle">{{titleText}}</text>
				<image @click.stop="closeBorad" src="/static/guanbi.png"></image>
			</view>
			<view class="priceBox" v-if="showPrice">
				{{priceText}}<text>元</text>
			</view>
			<view class="pswBox">
				<block v-if="showDot">
					<view v-for="(item,index) in 6" :key="item" class="content_item">{{password[index] ? '•' : ''}}</view>
				</block>
				<block v-else>
					<view v-for="(item,index) in 6" :key="item" class="content_item">{{password[index] ? password[index] : ''}}</view>
				</block>
			</view>
			<view class="numBox">
				<view v-for="item in 9" :key="item" @click.stop="press(item)">{{item}}</view>
				<view class="longNum" >0</view>
				<view class="del" @click.stop="handleDel" >X</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			showTitle: {
				type: Boolean,
				default: true
			},
			titleText: {
				type: String,
				default: '请输入支付密码',
			},
			showDot:{
				type: Boolean,
				default: true
			},
			showPrice: {
				type: Boolean,
				default: true
			},
			priceText: {
				type: [String,Number],
				default:1,
				validator: function(value) {
					return Number(value) > 0;
				}
			},
			showBoard:false
		},
		data() {
			return {
				password: ""
			}
		},
		onLoad() {},
		methods: {
			press(val) {
				if(this.password.length<6){
					this.password += val;
				}
				
				if(this.password.length>=6){
					// console.log(this.password)
					this.pay();
				}

			},
			pay(){
				uni.showLoading({
					title:'支付中'
				})
				setTimeout(()=>{
					uni.hideLoading();
					this.$emit('complete',this.password)
					this.password = ""
					uni.showToast({
						icon:'success',
						title:'支付成功'
					})
				},2000);
			},
			handleDel() {
				if (this.password) {
					this.password = this.password.substring(0, this.password.length - 1);
				}
			},
			closeBorad(){
				this.password="";
				this.$emit('closeBorad')
			}
		}
	}
</script>

<style lang="less" >
	view{
		box-sizing: border-box!important;
	}
	
	.keyBoard {
		position: fixed;
		width: 100%;
		height: 100vh;
		top: 0;
		left: 0;
		transition: all 0.5s ease;
		background: rgba(0, 0, 0, 0);
		z-index: -1;
		.innerBox {
			background-color: #fff;
			position: absolute;
			left: 0;
			bottom: -500px;
			width: 100%;
			color: #333;
            transition: all 0.5s ease;
			.title {
				position: relative;
				font-size: 30upx;
				text-align: center;
				height: 45px;
				line-height: 45px;
				border-bottom: 1px solid #eee;

				image {
					width: 20px;
					height: 20px;
					position: absolute;
					right: 6px;
					top: 10px;
				}
			}

			.priceBox {
				font-size: 40px;
				color: #ff9900;
				text-align: center;
				margin-top: 50upx;
				text {
					font-size: 10px;
					padding-left: 5px;
				}
			}


			.pswBox {
				width: 80%;
				height: 80upx;
				margin: 50upx auto;
				display: flex;
				justify-content: space-between;

				&>view {
					width: 40px;
					height: 40px;
					line-height: 40px;
					text-align: center;
					border: 1px solid #ccc;
					border-radius: 3px;
				}
			}

			.numBox {
				display: flex;
				flex-wrap: wrap;

				&>view {
					width: 33.3333333333%;
					height: 50px;
					line-height: 50px;
					text-align: center;
					border-left: 1px solid #eee;
					border-bottom: 1px solid #eee;
					font-size: 25px;
				}
				&>.longNum{
					width:66.667%
				}
				&>.del{
					background-color:#e7e6eb;
				}
			}
		}
		&>.visible{
			bottom: 0;
		}
	}
	.active{
		background: rgba(0, 0, 0, 0.6);
		z-index: 9999;
	}
	
</style>
