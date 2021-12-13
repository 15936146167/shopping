<template>
	<uni-popup ref='pwdPopUp' :maskClick='false'>
		<view class="content" @tap="hiddenKeyboard">
			<view class="title">请输入支付密码</view>
			<view class="flex-jc-ac">
				<view class="input-row" @tap.stop="showKeyboard">
					<view :class="['item', { 'item-active': valueLength == index }]" v-for="(k, index) in 6" :key="index">{{ value.charAt(index)? "●":""  }}</view>
				</view>
			</view>
			<slot></slot>
			<view class="btn flex">
					<view class="btn-close" @click="hide">
						取消
					</view>
					<view class="btn-ok" @click="handleSendData">
						确定
					</view>
			</view>
		</view>
	<DigitalKeyboard @change="contToggle" @closeKeyboard="closeKeyboard" :keyBoardSwitch="keyBoardSwitch" ></DigitalKeyboard>
	</uni-popup>
		
</template>

<script>
	import DigitalKeyboard from '@/components/digital-keyboard/digital-keyboard.vue';
	export default{
		components:{DigitalKeyboard},
		data(){
			return{
				keyBoardSwitch: false,
				length: 6,
				value:'',
				valueLength:null
			}
			
		},
		methods:{
			show(){ 
				this.value = ''
				this.valueLength = null
				this.$refs.pwdPopUp.open()
			},
			hide(){
				this.$refs.pwdPopUp.close()
			},
			showKeyboard() {
				this.valueLength = this.value.length == 6 ? 5 : this.value.length;
				this.keyBoardSwitch = true;
			},
			hiddenKeyboard(bool,key) {
				this.keyBoardSwitch = false;
				this.valueLength = null
			},
			// 发送数据
			handleSendData(){
				this.$emit('sendData',this.value)
			},
			// 更新
			contToggle(k) {
				let len = this.value.length;
				if (k === '') {
					this.value = this.value.substring(0, len - 1);
					this.valueLength = this.value.length;
					return;
				}
				if(this.length >= len+1) {
					this.value += k.toString();
					this.valueLength = len + 1;
					if(this.valueLength >= this.length){
						this.keyBoardSwitch = false;
					}
				}else{
					this.keyBoardSwitch = false;
				}
			},
			// 结束
			closeKeyboard(value) {
				this.$emit('pwdData',value)
			},
		}
	}
</script>

<style scoped lang="scss">
	.flex-jc-ac{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.flex{
		display: flex;
	}
	.content{
		width: 700rpx;
		min-height: 354rpx;
		background-color: #fff;
		border-radius: 16rpx;
		box-shadow: 1px 1px 10px 0 #666;
		box-sizing: border-box;
		padding: 30rpx;
		color: #000;
		.title{
			font-size: 36rpx;
			margin-bottom: 30rpx;
			text-align: center;
			border-bottom: 1px solid #f2f2f2;
			padding: 10rpx 0 20rpx;
		}
		.btn{
			justify-content: flex-end;
			    margin: 40rpx 0 0;
		}
		.btn-close{
			    border: 1px solid #4689f2;    
				height: 60rpx;
				line-height: 60rpx;
				box-sizing: border-box;
				margin-right:  20rpx;
				color: #4689f2;
				border-radius: 10rpx;
				padding: 0 14rpx;
				text-align: center;
				min-width: 100rpx;
		}
		.btn-ok{
			min-width: 100rpx;
			color: #fff;
				line-height: 60rpx;
				box-sizing: border-box;
			text-align: center;
			border-radius: 10rpx;
			padding: 0 14rpx;
			height: 60rpx;
			margin-right:  20rpx;
			background-color: #4689f2;
		}
	}
	.input-row {
		height: 80rpx;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		font-size: 20rpx;
		text-align: center;
		.item {
			float: left;
			width: 40upx;
			height: 60upx;
			line-height: 60upx;
			margin: 0 10upx;
			border-bottom: 1px solid #c8c8c8;
			background: #fff;
			
			box-sizing: border-box;
		}
		.item-active {
			position: relative;
			transform: scale(1.2);
		}
	}
</style>
