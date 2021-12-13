<template>
	<view class="content">
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" title="确认订单" @clickLeft="back"></uni-nav-bar>
		</view>
		<scroll-view scroll-y="true">
			<view class="addr righticon" id="addr" v-for="add in addr">
				<view class="user">
					<view class="username">
						{{add.name}}
					</view>
					<view class="mobile">
						{{add.tel}}
					</view>
				</view>
				<view class="addrname">
					{{address}}
				</view>
			</view>
			<view class="center" v-for="good in cart.goods">
				<view class="shop">
					<view class="left">
						<image :src="good.img" mode=""></image>
					</view>
					<view class="right">
						<view class="shopname">
							{{good.name}}
						</view>
						<view class="shopattr">
							<text style="padding: 0px 10upx;">
								{{good.attr}}
							</text>
						</view>
					</view>
				</view>
				<view class="ui-list righticon">
					<text>配送方式</text>
					<picker @change="change" :value="peisongType" :range="peisong">
						<view class="picker">{{peisongType}}</view>
					</picker>
				</view>
				<view class="ui-list">
					<text>备注</text>
					<input type="text" v-model="desc" placeholder="选填,请先和商家协商一致" placeholder-style="font-size:28upx;"/>
				</view>
			</view>
			<view class="payType">
				<view class="pay" v-for="(pay,index) in paytype">
					<view class="left">
						<image :src="pay.img" mode=""></image>
						<view class="payname">
							{{pay.name}}
						</view>
					</view>
					<view class="right">
						<uni-icons class="mr-30" type="checkbox-filled" font-family="iconfont" color="#007AFF" size="20"
						v-show="pay.checked"></uni-icons>
						<uni-icons  class="mr-30" type="circle" font-family="iconfont" color="#007AFF" size="20"
						v-show="!pay.checked" @click="checked(index)"></uni-icons>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="bottom">
			<view class="left">
				<view class="totalnum">
					共{{num}}件
				</view>
				<view class="total">
					<view class="ttt">
						合计：
					</view>
					<view class="totalprice">
						￥{{total}}
					</view>
				</view>
			</view>
			<view class="right">
				<wyb-button class="btn" width="190rpx" type="filled" color="orange" :radius="['50px']" height="80upx" @click="tijiao">提交订单</wyb-button>
			</view>
		</view>
		
		
		<view class="addShop">
			<e-modal :visible.sync="visible" width="100%" @cancel="handleCancel">
				<view class="nr">
					<view class="type" v-for="ty in paytype" v-show="ty.checked">
						当前支付方式：{{ty.name}}
					</view>
					<view class="jiage">
						需要支付：
						<text>
							￥{{total}}
						</text>
					</view>
					<view class="close" @click="close">
						X
					</view>
					 
				</view>
				<wyb-button class="btn sure" width="190rpx" type="filled" color="rgb(255,111,56)" :radius="['50px']"
					:width="'100%'" height="80upx" @click="pay">立即支付</wyb-button>
			</e-modal>
		</view>
		<pay-board :showBoard="showBoard" :priceText="total" @closeBorad="handleModel" @complete="complete" ref="zf"></pay-board>
	</view>
</template>

<script>
	import PayBoard from '@/components/xiaojia-keyBoard/xiaojia-keyBoard.vue'
	export default {
		data() {
			return {
				peisong: ["包邮"],
				peisongType: "包邮",
				paytype:[
					{
						img:"../../../static/img/pay/zhifubao.png",
						name:"支付宝支付",
						checked:true
					},
					{
						img:"../../../static/img/pay/weixin.png",
						name:"微信支付",
						checked:false
					}
				],
				// 所选择的支付方式下标
				checkedindex:0,
				// 商品订单
				cart:[],
				// 备注
				desc:"",
				// 商品id
				cart_id:"",
				// 默认地址数组
				addr:[],
				// 地址详细名称
				address:"",
				// 件数
				num:0,
				// 总价
				total:0,
				// 模态框
				visible: false,
				// 支付模态框
				showBoard:false,
				// 支付密码
				paymentPwd:"",
				// 订单编号
				order_id:""
			}
		},
		components:{
			PayBoard
		},
		mounted(){
			for(var i=0;i<this.paytype.length;i++){
				if(this.paytype[i].checked==true){
					this.checkedindex=i;
				}
			}
		},
		onLoad(options) {
			let cart_id = options.cart_id;
			this.cart_id=options.cart_id;
			let uid="";
			let token="";
			try {
			    const uidValue = uni.getStorageSync('uid');
				const tokenValue = uni.getStorageSync('token');
			    if (uidValue) {
					uid=uidValue;
			    }
				if (tokenValue) {
					token=tokenValue;
				}
			} catch (e) {
			    // error
			}
			(async ()=>{
				let res=await this.$http({
					url:"/order/checkOrder",
					data:{
						uid:uid,
						cart_id:this.cart_id,
						token:token,
						type:"buy"
					},
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					this.cart=res.data.data;
					this.total=this.cart.all_amount.toFixed(2);
					for(var i=0;i<this.cart.goods.length;i++){
						this.num+=this.cart.goods[i].num;
					}
				}
			})();
			
			// 默认地址
			(async ()=>{
				let res=await this.$http({
					url:"/order/get_default_addr",
					data:{
						uid:uid
					},
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					this.addr=res.data.data;
					let add=this.addr[0].addr_text.split("-");
					this.address=add[0]+add[1]+add[2]+this.addr[0].detail;
				}
			})();
		},
		methods: {
			// 关闭支付模态框
			handleModel(){
				this.showBoard=false;
				this.order_id="";
			},
			// 支付成功
			complete(pass){
				console.log(pass);
				let uid="";
				let token="";
				try {
				    const uidValue = uni.getStorageSync('uid');
					const tokenValue = uni.getStorageSync('token');
				    if (uidValue) {
						uid=uidValue;
				    }
					if (tokenValue) {
						token=tokenValue;
					}
				} catch (e) {
				    // error
				}
				(async ()=>{
					let res=await this.$http({
						url:"/order/payOrder",
						data:{
							token:token,
							platform:"h5",
							pay_type:this.checkedindex==0?"alipay":"wxpay",
							orderId:this.order_id
						},
						method:"POST"
					});
					console.log(res)
					uni.navigateBack({
						
					});
					this.showBoard=false;
				})();
			},
			back(){
				uni.navigateBack({
					
				})
			},
			// 模态框取消事件
			handleCancel() {
				console.log('cancel');
				this.$forceUpdate();
			},
			close() {
				this.visible = false;
			},
			change(e) {
				if (e.detail.value.toString() == "NaN") {
					this.peisongType = this.peisong[0];
				} else {
					this.peisongType = this.peisong[e.detail.value];
				}

			},
			checked(index){
				this.paytype[this.checkedindex].checked=false;
				this.paytype[index].checked=true;
				for(var i=0;i<this.paytype.length;i++){
					if(this.paytype[i].checked==true){
						this.checkedindex=i;
					}
				}
			},
			async tijiao(){
				let uid="";
				let token="";
				try {
				    const uidValue = uni.getStorageSync('uid');
					const tokenValue = uni.getStorageSync('token');
				    if (uidValue) {
						uid=uidValue;
				    }
					if (tokenValue) {
						token=tokenValue;
					}
				} catch (e) {
				    // error
				}
				
				
				
				let res=await this.$http({
					url:"/order/submitOrder",
					data:{
						uid:uid,
						cart_id:this.cart_id,
						desc:this.desc,
						address:this.address,
						token:token
					},
					method:"POST"
				});
				console.log(res);
				if(res.data.code==1){
						let reres=await this.$http({
							url:"/order/getOrderList",
							data:{
								uid:uid,
								status:"0",
								skip:"0",
								limit:"100"
							},
							method:"POST"
						});
						console.log(reres)
						if(reres.data.code==1){
							for(var i=0;i<reres.data.data.length;i++){
								if(reres.data.data[i]._id==res.data.data){
									this.order_id=reres.data.data[i].order_sn.toString();
								}
							}
						}
				}
				console.log(this.order_id)
				this.visible=true;
			},
			// 支付
			pay(){
				this.showBoard = true;
				this.visible=false;
			}
		}
	}
</script>

<style lang="scss" scoped>
	 @import url("../../../components/bian-keywords/iconfont/iconfont.css");
	.righticon:after {
		content: ' ';
		width: 15upx;
		height: 15upx;
		border-top: solid 1px grey;
		border-right: solid 1px grey;
		transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		/* IE 9 */
		-moz-transform: rotate(45deg);
		/* Firefox */
		-webkit-transform: rotate(45deg);
		/* Safari 和 Chrome */
		-o-transform: rotate(45deg);
		position: absolute;
		top: 40upx;
		right: 20upx;
	}

	.content {
		height: calc(100vh - var(--status-bar-height));
		margin-top: var(--status-bar-height);
		background: #F1F1F1;
		/* padding: 0 20upx; */
		
		scroll-view {
			height: calc(100% - var(--window-top) - var(--window-bottom) - 200upx);
			margin-top: var(--window-top);
			background: #f1f1f1;
			.addr{
				background: #fff;
				padding: 10upx;
				border-radius: 10upx;
				overflow: hidden;
				margin-top: 10upx;
				.user{
					overflow: hidden;
					.username{
						float: left;
					}
					.mobile{
						float: left;
						padding: 8upx 20upx;
						font-size: 26upx;
						color: grey;
					}
				}
				.addrname{
					font-size: 28upx;
				}
			}
			
			.center{
				padding: 10upx;
				border-radius: 10upx;
				overflow: hidden;
				background: #fff;
				margin-top: 20upx;
				.shop{
					overflow: hidden;
					.left{
						float: left;
						image{
							width: 150upx;
							height: 150upx;
						}
					}
					.right{
						float: left;
						padding: 0 20upx;
						.shopname{
							width: 520upx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
							font-size: 28upx;
						}
						.shopattr{
							font-size: 26upx;
							color: grey;
							max-height: 100upx;
							line-height: 30upx;
							overflow: hidden;
						}
					}
				}
			}
			
			.payType{
				padding: 10upx;
				border-radius: 10upx;
				overflow: hidden;
				background: #fff;
				margin-top: 20upx;
				.pay{
					overflow: hidden;
					margin-top: 20upx;
					.left{
						float: left;
						overflow: hidden;
						image{
							float: left;
							width: 50upx;
							height: 50upx;
							border-radius: 50%;
						}
						.payname{
							float: left;
							height: 50upx;
							line-height: 50upx;
							padding: 0 20upx;
						}
					}
					.right{
						float: right;
					}
				}
			}
			
			
			.ui-list {
				width: 100%;
				text-align: left;
				padding: 20upx 0;
				border-bottom: solid 1px #f2f2f2;
				position: relative;

				text {
					color: #4a4a4a;
					font-size: 28upx;
					display: inline-block;
					vertical-align: middle;
					min-width: 150upx;
				}

				input {
					color: #030303;
					font-size: 30upx;
					display: inline-block;
					vertical-align: middle;
				}

				button {
					color: #030303;
					font-size: 30upx;
					display: inline-block;
					vertical-align: middle;
					height: 42upx;
					line-height: 42upx;
					background: none;
					margin: 0;
					padding: 0;

					&::after {
						display: none;
					}
				}

				picker {
					width: 90%;
					color: #030303;
					font-size: 30upx;
					display: inline-block;
					vertical-align: middle;
					position: absolute;
					top: 30upx;
					right: 50upx;
					text-align: right;
				}

				textarea {
					color: #030303;
					font-size: 30upx;
					vertical-align: middle;
					height: 150upx;
					width: 100%;
					margin-top: 50upx;
				}

				.place {
					color: #999999;
					font-size: 28upx;
				} 
			}
		}
		
		.bottom{
			overflow: hidden;
			background: #fff;
			position: fixed;
			bottom: 0;
			width: 100%;
			padding: 10upx 0px;
			.left{
				float: left;
				overflow: hidden;
				text-align: right;
				height: 80upx;
				line-height: 80upx;
				.totalnum{
					display: inline-block;
					padding: 0px 20upx;
					font-size: 26upx;
					color: grey;
				}
				.total{
					display: inline-block;
					.ttt{
						display: inline-block;
						font-size: 28upx;
					}
					.totalprice{
						display: inline-block;
						font-size: 32upx;
						color: red;
					}
				}
			}
			.right{
				float: right;
			}
		}
		
		.addShop{
			.nr{
				margin-bottom: 100upx;
				position: relative;
				padding: 20upx;
				.type{
					margin-bottom: 20upx;
					color: orange;
				}
				.jiage{
					text-align: center;
					text{
						color: red;
					}
				}
				.close{
					position: absolute;
					top: 20upx;
					right: 20upx;
				}
			}
			.sure{
				position: fixed;
				bottom: 0;
			}
		}
		
	}
</style>
