<template>
	<view class="main">

		<view class="topNav">
			<uni-nav-bar fixed title="购物车" color="#2F54EB"></uni-nav-bar>
		</view>
		<scroll-view scroll-y="true">
			<view class="car-count">
				<view class="cart-box" v-if='carts.length>0'>
					<view class="touch-item" v-for='(item,index) in carts' @click="todetail(item.goods_id)"
						:class="item.isTouchMove == true?'touch-move-active':''" @touchstart="touchstart"
						@touchmove="touchmove" :data-index='index'>
						<view class="cartList clearfix">
							<view @click.stop="selectList(index)" class="selBtn centerboth">
								<text class="iconfont" :class="item.checked==true?'car-sel':'car-unsel'"></text>
							</view>
							<view class="gmes">
								<view class='cartImg centerboth'>
									<image :src="item.img" mode="aspectFit"></image>
								</view>
								<view class="boxCount clearfix">
									<text class="gname line1">{{item.name}}</text>
									<br />
									<view class="gtitle attr">
										<text>
											{{item.attr}}
										</text>
									</view>
									<view class="gprice"><text>￥</text>{{item.price}}</view>
								</view>
							</view>
							<view class="countBox centerboth">
								<view class="carSub" @click.stop="changeNum(index,item._id,0)">
									<view
										style="width: 30px;height: 25px;background: #DCDFE6;text-align: center;line-height: 25px;margin-left: 4upx;">
										-</view>
								</view>
								<view class="cartNum"
									style="width: 40px;height: 25px;background: #D6D6D6;text-align: center;line-height: 25px;margin-left: 4upx;">
									{{item.num}}
								</view>
								<view class="carAdd" @click.stop="changeNum(index,item._id,1)">
									<view
										style="width: 30px;height: 25px;background: #DCDFE6;text-align: center;line-height: 25px;margin-left: 4upx;">
										+</view>
								</view>
							</view>
							<text class="dleBtn" @click.stop="deleteList(index,item._id)">删除</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="empty" v-show='carts.length==0'>
			购物车是空的
		</view>

		<!-- 支付 -->
		<pay-board :showBoard="showBoard" :priceText="totalPrice" @closeBorad="handleModel" @complete="complete">
		</pay-board>

		<view class="botomBtn">
			<view @click="allSelBtn" class="selBtn centerboth">
				<text class="iconfont" :class="selectAll?'car-sel':'car-unsel'"></text>
				<text>全选</text>
			</view>
			<view class="price">合计：<text class="fh">￥</text><text class="num">{{totalPrice}}</text></view>
			<view @click="jiesuan" class="yyBtn">结算({{totalNum}})</view>
		</view>
	</view>
</template>
<script>
	import PayBoard from '@/components/xiaojia-keyBoard/xiaojia-keyBoard.vue'
	export default {
		data() {
			return {
				totalPrice: 0, // 总价，初始为0
				selectAll: true, // 全选状态，默认全选
				startX: 0, //开始坐标
				startY: 0,
				totalNum: 0,
				/* carts: [
				    {
				        id: 236,
				        gid: 47,
				        name: "毛巾（厚）",
				        img: "https://xthotel.palmbly.com/uploads/images/20201020/fb54b8d699c646908fde0af12def5a5b.png",
				        gsId: 72,
				        spec_key_name: "尺寸:M 颜色:黑色",
				        spec: [{name: "尺寸", value: "M"}, {name: "颜色", value: "黑色"}],
				        price: 19,
				        number: 1,
				        stock: 193,
				        isTouchMove:false,
				        selected:true,
				    },
				    {
				
				        id: 237,
				        gid: 45,
				        name: "盆栽",
				        img: "https://xthotel.palmbly.com/uploads/images/20201020/741ff4736f32e9bde91b30f04aff86e5.png",
				        gsId: 65,
				        spec_key_name: "件装:1件居家必备:枕头",
				        spec: [{name: "件装", value: "1件"}, {name: "居家必备", value: "枕头"}],
				        price: 6001,
				        number: 1,
				        stock: 77,
				        selected:true,
				        isTouchMove:false,
				        selected:true,
				    }
				], */
				carts: [],
				// 模态框
				visible: false,
				// 支付模态框
				showBoard: false,
				// 支付密码
				paymentPwd: "",
				// 订单编号组
				order: [],
				// 所选择购物车的id
				cart: [],
				// 订单id
				order_id: ""
			}
		},
		components: {
			PayBoard
		},
		created() {

		},
		computed: {

		},
		mounted() {

		},
		onShow() {
			let uid = "";
			try {
				const value = uni.getStorageSync('uid');
				if (value) {
					uid = value;
				}
			} catch (e) {
				// error
			}
			(async () => {
				let res = await this.$http({
					url: "/api/get_cart_list",
					data: {
						uid: uid
					},
					method: "POST"
				});
				console.log(res)
				if (res.data.code == 1) {
					this.carts = res.data.data;
					this.isSelectAll();
					this.getTotalPrice();
				}
			})();
		},
		onLoad() {

			let uid = "";
			try {
				const value = uni.getStorageSync('uid');
				if (value) {
					uid = value;
				}
			} catch (e) {
				// error
			}
			(async () => {
				let res = await this.$http({
					url: "/api/get_cart_list",
					data: {
						uid: uid
					},
					method: "POST"
				});
				console.log(res)
				if (res.data.code == 1) {
					this.carts = res.data.data;
					this.isSelectAll();
					this.getTotalPrice();
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
			// 关闭支付模态框
			handleModel() {
				this.showBoard = false;
				this.$forceUpdate();
				this.order_id = "";
			},
			// 支付成功
			async complete(pass) {
				console.log(pass);
				uni.showToast({
					title: "支付成功",
					icon: "none"
				})
				this.showBoard = false;
				let uid = "";
				let token = "";
				try {
					const uidValue = uni.getStorageSync('uid');
					const tokenValue = uni.getStorageSync('token');
					if (uidValue) {
						uid = uidValue;
					}
					if (tokenValue) {
						token = tokenValue;
					}
				} catch (e) {
					// error
				}
				this.cart = "";
				for (var i = 0; i < this.carts.length; i++) {
					if (this.carts[i].checked == true) {
						this.cart += this.carts[i]._id + ",";
					}
				}
				this.cart = this.cart.substring(0, this.cart.length - 1);
				let reres = await this.$http({
					url: "/order/submitOrder",
					data: {
						uid: uid,
						cart_id: this.cart,
						desc: this.desc,
						address: this.address,
						token: token
					},
					method: "POST"
				});
				console.log(reres);
				if (reres.data.code == 1) {
					let reress = await this.$http({
						url: "/order/getOrderList",
						data: {
							uid: uid,
							status: "0",
							skip: "0",
							limit: "100"
						},
						method: "POST"
					});
					console.log(reress)
					if (reress.data.code == 1) {
						for (var i = 0; i < reress.data.data.length; i++) {
							if (reress.data.data[i]._id == reres.data.data) {
								this.order_id = reress.data.data[i].order_sn.toString();
							}
						}

					}
				}


				let aares = await this.$http({
					url: "/order/payOrder",
					data: {
						token: token,
						platform: "h5",
						pay_type: this.checkedindex == 0 ? "alipay" : "wxpay",
						orderId: this.order_id
					},
					method: "POST"
				});
				console.log(aares)
				let cc = await this.$http({
					url: "/api/get_cart_list",
					data: {
						uid: uid
					},
					method: "POST"
				});
				console.log(cc)
				if (cc.data.code == 1) {
					this.carts = cc.data.data;
					this.isSelectAll();
					this.getTotalPrice();
				}



			},
			// 模态框取消事件
			handleCancel() {
				console.log('cancel');
				this.$forceUpdate();
			},
			close() {
				this.visible = false;
			},
			isSelectAll() {
				let isShow = 0;
				for (var i = 0; i < this.carts.length; i++) {
					if (this.carts[i].checked == true) {
						this.selectAll = true;
					} else {
						if (this.carts[i].checked == false) {
							this.selectAll = false;
							isShow = 1;
						}
					}
				}
				if (isShow == 1) {
					this.selectAll = false;
				}
			},
			todetail(goods_id) {
				uni.navigateTo({
					url: "/pages/tabbar/details/detail?goods_id=" + goods_id
				})
			},
			async jiesuan() {
				if (this.carts.length == 0) {
					uni.showToast({
						title: "请先去购物",
						icon: "none"
					})
				} else {
					if (this.totalPrice == 0) {
						uni.showToast({
							title: "请先选中商品",
							icon: "none"
						})
					} else {
						this.showBoard = true;
					}
				}
			},
			/**
			 * 修改商品数量
			 */
			changeNum: function(index, id, type) {
				var that = this;
				var carts = that.carts;
				var number = parseInt(carts[index].num);
				if (type == 0) {
					number = number - 1;
					if (number <= 1) {
						number = 1;
					}
				} else {
					number = number + 1;
				}
				// 改变数量
				(async () => {
					let res = await this.$http({
						url: "/api/change_cart_num",
						data: {
							_id: id,
							num: number
						},
						method: "POST"
					});
					console.log(res)
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
					}
				})();
				carts[index].num = number;
				this.$emit('changeNum', carts);
				this.getTotalPrice();
			},
			/**
			 * 删除购物车当前商品
			 */
			deleteList(index, ids) {
				var that = this;
				let carts = that.carts;
				/* this.$emit('delBtn',carts,ids,index); */
				(async () => {
					let res = await this.$http({
						url: "/api/remove_cart",
						data: {
							_id: ids
						},
						method: "POST"
					});
					console.log(res);

					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
						let uid = "";
						try {
							const value = uni.getStorageSync('uid');
							if (value) {
								uid = value;
							}
						} catch (e) {
							// error
						}
						(async () => {
							let res = await this.$http({
								url: "/api/get_cart_list",
								data: {
									uid: uid
								},
								method: "POST"
							});
							console.log(res)
							if (res.data.code == 1) {
								this.carts = res.data.data;
								this.isSelectAll();
								this.getTotalPrice();
							}
						})();
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
					}
				})();
				this.getTotalPrice();
			},
			/**
			 * 当前商品选中事件
			 */
			selectList: function(index) {
				var leng = 0;
				var that = this;
				var carts = that.carts;
				var selected = carts[index].checked;
				carts[index].checked = !selected;

				// 选中
				if (carts[index].checked == true) {
					(async () => {
						let res = await this.$http({
							url: "/api/toggle_check_cart",
							data: {
								_id: carts[index]._id,
								checked: false
							},
							method: "POST"
						});
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
						}
					})();
				} else {
					// 取消选中
					(async () => {
						let res = await this.$http({
							url: "/api/toggle_check_cart",
							data: {
								_id: carts[index]._id,
								checked: true
							},
							method: "POST"
						});
						console.log(res)
						if (res.data.code == 1) {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
						} else {
							uni.showToast({
								title: res.data.msg,
								icon: "none"
							});
						}
					})();
				}


				for (var i = 0; i < carts.length; i++) {
					if (carts[i].checked == false) {
						that.selectAll = false;
					}
					if (carts[i].checked == true) {
						leng = leng + 1;
					}
				}
				if (leng == carts.length) {
					that.selectAll = true;
				}
				this.$emit('selThis', carts);
				this.getTotalPrice();
			},
			// 全选事件
			allSelBtn: function(e) {
				var that = this;
				var selectAll = that.selectAll;
				var carts = that.carts;
				if (selectAll == false) {
					for (var j = 0; j < carts.length; j++) {
						(async () => {
							let res = await this.$http({
								url: "/api/toggle_check_cart",
								data: {
									_id: carts[j]._id,
									checked: false
								},
								method: "POST"
							});
						})();
					}
					for (var i = 0; i < carts.length; i++) {
						carts[i].checked = true;
					}
					that.selectAll = true;
					console.log(111)
				} else {
					for (var j = 0; j < carts.length; j++) {
						(async () => {
							let res = await this.$http({
								url: "/api/toggle_check_cart",
								data: {
									_id: carts[j]._id,
									checked: true
								},
								method: "POST"
							});
						})();
					}
					for (var i = 0; i < carts.length; i++) {
						carts[i].checked = false;
					}
					that.selectAll = false;
				}





				this.$emit('selAllBtn', carts);
				this.getTotalPrice();
			},
			/**
			 * 计算总价
			 */
			getTotalPrice: function() {
				var that = this;
				var carts = that.carts; // 获取购物车列表
				var total = 0;
				var totalnum = 0;
				for (var i = 0; i < carts.length; i++) { // 循环列表得到每个数据
					if (carts[i].checked) { // 判断选中才会计算价格
						total += carts[i].num * carts[i].price; // 所有价格加起来
						totalnum = totalnum + parseInt(carts[i].num);
					}
				}
				that.totalNum = totalnum;
				that.totalPrice = total.toFixed(2);
			},
			touchstart: function(e) {
				var that = this;
				var carts = that.carts;
				//开始触摸时 重置所有删除
				carts.forEach(function(v, i) {
					if (v.isTouchMove) //只操作为true的
						v.isTouchMove = false;
				});
				that.startX = e.changedTouches[0].clientX;
				that.startY = e.changedTouches[0].clientY;
				this.$emit('touchEv', carts);
			},
			//滑动事件处理
			touchmove: function(e) {

				var that = this;
				var carts = that.carts;
				var index = e.currentTarget.dataset.index, //当前索引
					startX = that.startX, //开始X坐标
					startY = that.startY, //开始Y坐标
					touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
					touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
					//获取滑动角度
					angle = that.angle({
						X: startX,
						Y: startY
					}, {
						X: touchMoveX,
						Y: touchMoveY
					});
				carts.forEach(function(v, i) {
					v.isTouchMove = false;
					//滑动超过30度角 return
					if (Math.abs(angle) > 30) return;
					if (i == index) {
						if (touchMoveX > startX) { //右滑
							v.isTouchMove = false;
						} else { //左滑
							v.isTouchMove = true;
						}
					}
				})
				this.$forceUpdate();
			},
			angle: function(start, end) {
				var _X = end.X - start.X,
					_Y = end.Y - start.Y
				//返回角度 /Math.atan()返回数字的反正切值
				return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
			}
		}
	}
</script>

<style scoped lang="scss">
	@font-face {
		font-family: 'iconfont';
		/* project id 1143282 */
		src: url('https://at.alicdn.com/t/font_1143282_zy7677qexck.eot');
		src: url('https://at.alicdn.com/t/font_1143282_zy7677qexck.eot?#iefix') format('embedded-opentype'),
			url('https://at.alicdn.com/t/font_1143282_zy7677qexck.woff2') format('woff2'),
			url('https://at.alicdn.com/t/font_1143282_zy7677qexck.woff') format('woff'),
			url('https://at.alicdn.com/t/font_1143282_zy7677qexck.ttf') format('truetype'),
			url('https://at.alicdn.com/t/font_1143282_zy7677qexck.svg#iconfont') format('svg');
	}

	// 当购物车是空的时显示
	.empty {
		position: absolute;
		top: 40%;
		width: 100%;
		text-align: center;
		color: grey;
	}

	.main {
		height: calc(100vh - var(--status-bar-height) - var(--window-top) - var(--window-bottom));
		margin-top: var(--status-bar-height);
		background: #F1F1F1;

		.iconfont {
			font-family: "iconfont" !important;
			font-size: 16px;
			font-style: normal;
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
		}

		.car-add:before {
			content: "\e8a6";
		}

		.car-sub:before {
			content: "\e8a7";
		}

		.car-no:before {
			content: "\e64d";
		}

		.car-unsel:before {
			content: "\e63a";
		}

		.car-sel:before {
			content: "\e639";
		}

		.car-del:before {
			content: "\e622";
		}

		scroll-view {
			height: calc(100vh - var(--window-top) - var(--window-bottom) - var(--status-bar-height) - 212upx);
			margin-top: var(--window-top);
		}

		/*有商品时*/
		.car-count {
			width: 100%;
			padding: 0px 20upx;
		}

		.cart-box {
			width: 100%;
			overflow: hidden;
		}

		.cartList {
			width: 100%;
			position: relative;
			padding: 20rpx 20rpx 20rpx 50rpx;
			font-size: 26rpx;
			-webkit-transition: all 0.4s;
			transition: all 0.4s;
			-webkit-transform: translateX(60px);
			transform: translateX(60px);
			margin-left: -60px;
			background: #fff;
			margin-top: 30rpx;
			border-radius: 10upx;
		}

		.boxCount {
			float: left;
		}

		.boxCount .gname {
			font-size: 32rpx;
			color: #333333;
		}

		.boxCount .gtitle {
			margin: 5rpx 0 15rpx 0;
			font-size: 24rpx;
			color: #999999;
		}

		.gprice {
			color: #e60012;
			font-size: 34rpx;
		}

		.gprice text {
			font-size: 24rpx;
		}

		.cartList .selBtn {
			position: absolute;
			left: 0;
			width: 50rpx;
			height: 100%;
			top: 0;
		}

		.cartList .selBtn image {
			width: 32rpx;
			height: 32rpx;
		}

		.cartList .cartImg {
			float: left;
			width: 145rpx;
			height: 145rpx;
			background: #f5f5f5;
			border-radius: 5rpx;
			overflow: hidden;
			margin-right: 20rpx;
		}

		.countBox {
			position: absolute;
			right: 140rpx;
			bottom: 25rpx;
			right: 10rpx;
			bottom: 20rpx;
		}

		.countBox .iconfont {
			font-size: 46rpx;
		}

		.cartNum {
			width: 80rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			font-size: 32rpx;
			color: #1a256a;
		}

		.dleBtn {
			position: absolute;
			right: 0;
			top: 0;
			width: 120upx;
			height: 100%;
			text-align: center;
			background: #F13430;
			color: #ffffff;
			font-size: 30upx;
			line-height: 164upx;
			z-index: 9999;
			-webkit-transition: all 0.4s;
			transition: all 0.4s;
			-webkit-transform: translateX(70px);
			transform: translateX(70px);
		}

		.touch-move-active .cartList,
		.touch-move-active .dleBtn {
			-webkit-transform: translateX(0);
			transform: translateX(0);
		}

		.touch-move-active .dleBtn {
			right: -120upx;
		}

		.botomBtn {
			width: 100%;
			position: fixed;
			left: 0;
			bottom: var(--window-bottom);
			background: #FFFFFF;
			box-shadow: #f3f3f3 0rpx -5rpx 10rpx;
			height: 98rpx;
			padding: 0 300rpx 0 30rpx;
			z-index: 99;
		}

		.botomBtn .price {
			float: right;
			line-height: 98rpx;
			font-size: 28rpx;
			color: #333333;
		}

		.botomBtn .price text {
			font-size: 24rpx;
			color: #e60012;
		}

		.botomBtn .price .num {
			font-size: 30rpx;
			font-weight: bold;
		}

		.botomBtn .yyBtn {
			position: absolute;
			right: 30rpx;
			width: 240rpx;
			height: 89rpx;
			font-size: 32rpx;
			background: #DD514C;
			color: #FFFFFF;
			text-align: center;
			border-radius: 5rpx;
			line-height: 89rpx;
			top: 5rpx;
		}

		.botomBtn .selBtn {
			position: absolute;
			height: 100%;
			float: left;
		}

		.botomBtn .selBtn image {
			width: 32rpx;
			height: 32rpx;
			margin: 0 10rpx;
		}






		page {
			background: #F5F5F5;
		}

		view,
		textarea,
		input,
		text,
		button {
			padding: 0;
			margin: 0;
			box-sizing: border-box;
			font-size: 28rpx;
			font-family: "微软雅黑";
		}

		.uni-checkbox-input {
			border-radius: 50% !important;
		}

		.container {
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			background: #f5f5f5;
			overflow: hidden;
		}

		.line1 {
			width: 450upx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: inline-block;
			/*display: -webkit-box;
	    line-clamp: 1;
	    box-orient: vertical;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
	    word-break: break-all; */
			/* 英文换行问题 */
		}

		.attr {
			width: 450upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: inline-block;

			text {
				padding: 0px 10upx;
			}
		}

		.line2 {
			overflow: hidden;
			text-overflow: ellipsis;
			display: box;
			display: -webkit-box;
			line-clamp: 2;
			box-orient: vertical;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
			word-break: break-all;
			/* 英文换行问题 */
		}

		.centerboth {
			display: flex;
			display: -webkit-flex;
			align-items: center;
			-webkit-align-items: center;
			justify-content: center;
			-webkit-justify-content: center;
		}

		.clearfix:after {
			content: "";
			display: block;
			visibility: hidden;
			height: 0;
			clear: both;
		}

		.clearfix {
			zoom: 1;
		}

		image {
			padding: 0;
			margin: 0;
		}

		textarea {
			width: 300rpx;
			height: 75rpx;
			display: block;
			position: relative;
			font-size: 28rpx;
		}

		button::after {
			border: none;
		}

		input:-ms-input-placeholder {
			color: #808080;
		}

		.container {
			background: #F5F5F5;
		}

		.container {
			width: 100%;
			padding: 0 24rpx;
		}

		.sideslip-car {
			width: 100%;
		}

	}
</style>
