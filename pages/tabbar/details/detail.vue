<template>
	<view class="content" style="position: relative;">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="商品详情" @clickLeft="back"></uni-nav-bar>
		</view>
		<view>
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text"
				activeColor="#2F54EB" style="position: fixed;z-index: 1000;width: 100%;background: #fff;">
			</uni-segmented-control>
		</view>
		<scroll-view class="maxMain" scroll-y="true" @scroll="page" :scroll-into-view="toHeight" scroll-with-animation="true">
			<view class="first" id="first">
				<!-- banner -->
				<view class="banners" style="position: relative;">
					<view class="uni-padding-wrap">
						<view class="page-section swiper">
							<view class="page-section-spacing">
								<swiper class="swiper" @change="change">
									<swiper-item v-for="(img,i) in ImgList">
										<image :src="img" mode="" @click="previewImg(img)"></image>
									</swiper-item>
								</swiper>
							</view>
						</view>
					</view>
					<text
						style="position: absolute;bottom: 10px;right: 10px;z-index: 100;color: #fff;background: rgba(23,23,23,.2);padding: 2px 10px;border-radius: 50px;">
						{{index+1}}/{{ImgList.length}}
					</text>
				</view>
				<cus-previewImg ref="cusPreviewImg" :list="ImgList" />
				<view class="miaoshu">
					<view class="price">
						<view class="newPrice">
							￥{{goods.price}}
						</view>
						<view class="oldPrice">
							￥{{goods.old_price}}
						</view>
					</view>
					<view class="name">
						{{goods.name}}
					</view>
					<view class="type">
						<view class="typeName">
							运输方式：包邮
						</view>
						<view class="xiaoliang">
							销量：已售{{goods.sales}}
						</view>
					</view>
				</view>
			</view>
			<view class="two" id="two">
				<view class="pinglun">
					<view class="top">
						<view class="left">
							评论（23）
						</view>
						<view class="right" @click="tocomment">
							查看更多
						</view>
					</view>
					<view class="bottom">
						<view class="top">
							<view class="face">
								<image src="../../../static/img/banner/banner01.png" mode=""></image>
							</view>
							<view class="userName">
								用户名
							</view>
						</view>
						<view class="bottom">
							<view class="wenzi">
								我就只是路过
							</view>
							<view class="tupian">
								<uni-row class="demo-uni-row" :gutter="2">
									<uni-col :span="8">
										<image src="../../../static/img/banner/banner01.png" mode=""></image>
									</uni-col>
									<uni-col :span="8">
										<image src="../../../static/img/banner/banner01.png" mode=""></image>
									</uni-col>
									<uni-col :span="8">
										<image src="../../../static/img/banner/banner01.png" mode=""></image>
									</uni-col>
								</uni-row>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有评论时显示 -->
				<view class="pinglun" v-show="false">
					<view class="top">
						<view class="left">
							评论（0）
						</view>
						<view class="right" @click="tocomment">
							暂无评论
						</view>
						<view class="none" style="display: block;text-align: center;margin-top: 50upx;color: grey;" @click="tocomment">
							暂无评论,点击评论
						</view>
					</view>
				</view>
				
			</view>
			<view class="three" id="three">
				<text style="display: block;width: 100%;text-align: center;">
					<text style="color: grey;padding: 0px 10upx;">
						——
					</text>
					详情
					<text style="color: grey;padding: 0px 10upx;">
						——
					</text>
				</text>
				<view class="detail" v-html="desc">

				</view>
			</view>
		</scroll-view>

		<view class="shopcar">
			<view class="left">
				<uni-row class="demo-uni-row">
					<uni-col :span="8">
						<view class="demo-uni-col">
							<image src="../../../static/img/shopcar/dianpu.png" mode=""></image>
							<text style="display: block;">
								店铺
							</text>
						</view>
					</uni-col>
					<uni-col :span="8">
						<view class="demo-uni-col" style="text-align: center;">
							<image src="../../../static/img/shopcar/kefu.png" mode=""></image>
							<text style="display: block;">
								客服
							</text>
						</view>
					</uni-col>
					<uni-col :span="8">
						<view class="demo-uni-col" @click="fav(is_fav)">
							<image src="../../../static/img/shopcar/shoucang.png" v-show="!is_fav" mode=""></image>
							<image src="../../../static/img/shopcar/yishoucang.png" v-show="is_fav" mode=""></image>
							<text style="display: block;">
								收藏
							</text>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<view class="right">
				<wyb-button class="btn car" width="190upx" height="70upx" color="orange" type="filled"
					:radius="['50px','0px','0px','50px']" @click="shopCar">加入购物车</wyb-button>
				<wyb-button class="btn buy" width="190upx" height="70upx" color="red" type="filled"
					:radius="['0px','50px','50px','0px']" @click="buy">
					立即购买
					<text style="display: block;">
						￥{{goods.price}}
					</text>
				</wyb-button>
			</view>
		</view>

		<!-- 加入购物车时选择件数和属性 -->
		<view class="addShop">
			<e-modal :visible.sync="visible" width="100%" @cancel="handleCancel">
				<scroll-view scroll-y="true" class="carMain">
					<view class="top">
						<image :src="goods.img" mode=""></image>
						<view class="shopPrice">
							￥
							<text style="font-weight: bold;font-size: 40upx;">
								{{price}}
							</text>
						</view>
						<view class="close" @click="close">
							X
						</view>
					</view>
					<view class="center">
						<view class="attr" v-for="(attr,i) in goods.attr">
							<view class="attrKey">
								{{attr.text}}
							</view>
							<view class="attrValue">
								<view class="property" v-for="(attrValue,ii) in attr.values"
									:class="attrIndex[i]==attrValue.text?'active':''" @click="addAttr(attrValue,i)">
									{{attrValue.text}}
								</view>
							</view>
						</view>
					</view>
					<view class="bottom">
						<view class="numKey">
							购买数量
							<text style="color: grey;padding: 0px 20upx;font-size: 20upx;">
								库存{{stock}}件
							</text>
						</view>
						<view class="numValue">
							<button type="default" class="plus" @click="reduce">-</button>
							<view class="num">
								{{num}}
							</view>
							<button type="default" class="and" @click="add">+</button>
						</view>
					</view>
					<wyb-button class="btn sure" width="190rpx" type="filled" color="rgb(255,111,56)" :radius="['50px']"
						:width="'100%'" height="80upx" @click="addShopCar(type)">确认</wyb-button>
				</scroll-view>
			</e-modal>
		</view>

	</view>
</template>

<script>
	import cusPreviewImg from '@/components/cus-previewImg/cus-previewImg.vue'
	export default {
		components: {
			cusPreviewImg,
		},
		data() {
			return {
				// 模态框
				visible: false,
				// 商品详情id
				goods_id: "",
				// 用户uid（登录之后的本地储存）
				uid: "",
				index: 0,
				//选项卡索引
				current: 0,
				// 选项卡导航
				items: ["商品", "评论", "详情"],
				//图片数组
				ImgList: [],
				// 详情页数据
				goods: [],
				// 距离顶部距离
				topHeight: 0,
				// first高度
				firstHeight: 0,
				// two高度
				twoHeight: 0,
				// three高度
				threeHeight: 0,
				// 跳转到指定id(消耗较大)
				toHeight: "",
				// 获取到的商品详情图
				desc: "",
				// 商品评论
				comment: "",
				//是否已被收藏
				is_fav: false,
				// 商品购买数量
				num: 1,
				// 是否选中规格(值的形式)
				attrIndex: [],
				// 商品属性值
				attr:"",				
				// 模态框中选中时的规格以及价格
				carAttr:[],
				// 价格
				price:0,
				// 库存
				stock:0,
				// 购买还是加入购物车
				type:""
			}
		},
		onLoad(options) {
			this.goods_id = options.goods_id;
			try {
				const value = uni.getStorageSync('uid');
				if (value) {
					this.uid = value;
				}
			} catch (e) {
				// error
			}
			// 获取商品详情
			(async () => {
				let res = await this.$http({
					url: "/api/get_goods_detail",
					data: {
						goods_id: this.goods_id,
						uid: this.uid
					},
					method: "POST"
				});
				console.log(res);
				if (res.data.is_fav == 0) {
					this.is_fav = false;
				} else {
					this.is_fav = true;
				}
				console.log(res)
				this.goods = res.data.data[0];
				this.ImgList = this.goods.banner;
				this.desc = this.goods.desc;
				this.carAttr=res.data.data[0].table;
				this.price=this.goods.price;
				this.stock=this.goods.stock;
			})();


			// 获取商品评论
			(async () => {
				let res = await this.$http({
					url: "/api/get_goods_comment",
					data: {
						goods_id: this.goods_id,
						skip: "0",
						limit: "10"
					},
					method: "POST"
				});
				console.log(res)
			})();
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this);
			// 获取first高度	
			query.select('#first').boundingClientRect(data => {
				this.firstHeight = Math.floor(data.height)
			}).exec();
			// 获取two的高度
			query.select('#two').boundingClientRect(data => {
				this.twoHeight = Math.floor(data.height)
			}).exec();
			// 获取three的高度
			query.select('#three').boundingClientRect(data => {
				this.threeHeight = Math.floor(data.height)
			}).exec();
		},
		methods: {
			// 模态框取消事件
			handleCancel() {
				this.attr="";
				this.attrIndex=[];
				this.attrs=[];
				console.log('cancel');
				this.$forceUpdate();
			},
			//获取当前选中下标
			onClickItem(e) {
				this.current = e.currentIndex;
				/* console.log(this.current); */
				this.toHeight = "";
				// console.log(window)
				//判断选中下标，然后跳转指定高度
				if (this.current == 0) {
					this.toHeight = "first";
				} else if (this.current == 1) {
					this.toHeight = "two";
				} else if (this.current == 2) {
					this.toHeight = "three";
				}
			},
			back() {
				uni.navigateBack({

				})
			},
			change(e) {
				this.index = e.detail.current;
			},
			previewImg(url) { // 点击预览图片
				this.$refs.cusPreviewImg.open(url) // 传入当前选中的图片地址
			},
			page(e) {
				this.topHeight = e.target.scrollTop;
				this.toHeight = "";
				if (this.topHeight >= (this.firstHeight + this.twoHeight + 10)) {
					this.current = 2;
				} else if (this.topHeight >= (this.firstHeight) && this.topHeight < (this.firstHeight + this.twoHeight)) {
					this.current = 1;
				} else if (this.topHeight >= 0 && this.topHeight < (this.firstHeight - 10)) {
					this.current = 0;
				}
			},
			fav() {
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
						url: "/api/toggle_fav",
						data: {
							uid: uid,
							goods_id: this.goods_id,
							is_fav: this.is_fav ? "1" : "0"
						},
						method: "POST"
					});
					console.log(res)
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
						if (res.data.is_fav == 0) {
							this.is_fav = false;
						} else {
							this.is_fav = true;
						}
					}
				})();
			},
			// 加入购物车
			shopCar() {
				this.type="";
				this.visible = true;
			},
			// 关闭模态框
			close() {
				this.attr="";
				this.attrIndex=[];
				for (var i = 0; i < this.goods.attr.length; i++) {
					this.attrIndex.push("");
				}
				this.visible = false;
			},
			reduce() {
				if (this.num > 1) {
					this.num--;
				}
			},
			add() {
				this.num++;
			},
			// 添加到购物车
			async addShopCar(type) {
				console.log(type)
				this.attr="";
				/* console.log(this.attrIndex) */
				for (var i = 0; i < this.attrIndex.length; i++) {
					this.attr+=this.attrIndex[i]+",";
				}
				// 删除最后一个逗号
				this.attr=this.attr.substring(0,this.attr.length- 1);
				if(this.attrIndex.length==this.goods.attr.length){
					let res = await this.$http({
						url: "/api/add_cart",
						data: {
							uid: this.uid,
							goods_id: this.goods_id,
							num: this.num,
							attr: this.attr,
							type: type
						},
						method: "POST"
					});
					console.log(res);
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
						this.visible = false;
						// 当type="buy"时
						if(type=="buy"){
							console.log(res.data.data.id)
							uni.navigateTo({
								url:'pages/tabbar/order/order?cart_id='+res.data.data.id
							});
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
					}
				}else{
					uni.showToast({
						title: "请先选择规格",
						icon: "none"
					});
				}
			},
			// 选中商品规格
			addAttr(attrValue, i) {
				this.attrIndex[i] = attrValue.text;
				this.attr="";
				for (var i = 0; i < this.attrIndex.length; i++) {
					this.attr+=this.attrIndex[i]+",";
				}
				// 删除最后一个逗号
				this.attr=this.attr.substring(0,this.attr.length- 1);
				console.log(this.carAttr)
				console.log(this.attrIndex)
				for (var i = 0; i < this.carAttr.length; i++) {
					if(JSON.stringify(this.carAttr[i].text)==JSON.stringify(this.attrIndex)){
						this.price=this.carAttr[i].price;
						this.stock=this.carAttr[i].stock;
					} 
				}
				this.$forceUpdate();
			},
			// 立即购买
			buy(){
				this.type="buy";
				this.visible = true;
			},
			// 跳转到评论页
			tocomment(){
				uni.navigateTo({
					url:"pages/tabbar/details/comment"
				})
			}
			
			
		}
	}
</script>

<style lang="scss" scoped>
	// 规格选中时的css
	.active {
		box-sizing: border-box;
		border: 1px solid red;
		background: rgba($color: pink, $alpha: .5);
	}

	.content {
		background: #F1F1F1;
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		position: relative;
	}

	.maxMain {
		margin-top: 75upx;
		margin-bottom: 180upx;
		height: calc(100vh - 255upx);
	}

	// 购物车模态框
	.carMain{
		height: 100%;
		max-height: 70vh;
	}
	
	//整体轮播图
	.uni-padding-wrap {
		width: 750upx;
		height: 753upx;
		// 该变量为安卓机的状态栏高度
		padding-top: calc(var(--status-bar-height) - 88upx);

		//轮播图
		swiper {
			width: 750upx;
			height: 753upx;

			image {
				width: 750upx;
				height: 753upx;
			}
		}
	}

	.first {
		width: 100%;
		background: #F1F1F1;

		.miaoshu {
			margin: 20upx;
			padding: 20upx;
			background: #fff;
			border-radius: 10upx;
			overflow: hidden;

			.price {
				clear: both;

				.newPrice {
					display: inline-block;
					color: red;
				}

				.oldPrice {
					display: inline-block;
					padding: 0px 20upx;
					color: grey;
					font-size: 12px;
					text-decoration: line-through;
				}
			}

			.name {
				padding: 20upx 0px;
			}

			.type {
				overflow: hidden;
				color: grey;

				.typeName {
					float: left;
					font-size: 12px;
				}

				.xiaoliang {
					float: right;
					font-size: 12px;
				}
			}
		}
	}

	.two {
		width: 100%;
		margin-top: 20upx;
		padding: 0px 20upx;
		background-color: #F1F1F1;

		.pinglun {
			width: 92%;
			border-radius: 10upx;
			background: #fff;
			padding: 10upx;

			.top {
				overflow: hidden;
				padding: 20upx 0px;

				.left {
					font-weight: bold;
					float: left;
				}

				.right {
					float: right;
					font-size: 12px;
					color: grey;
				}
			}

			.bottom {
				.top {
					overflow: hidden;

					.face image {
						width: 100upx;
						height: 100upx;
						border-radius: 50%;
						float: left;
					}

					.userName {
						float: left;
						line-height: 100upx;
						padding: 0px 20upx;
						color: blue;
					}
				}

				.bottom {
					.wenzi {
						margin: 10upx 0px;
					}

					.tupian {
						image {
							width: 230upx;
							height: 125upx;
						}
					}
				}
			}
		}
	}

	.three {
		width: 100%;
		background: #F1F1F1;

		// /deep/用于像v-html之中的更深入的css样式，
		// 方法：1，  .a>>>.b{}，该方法不适用于像SASS，
		//       2，  .a /deep/ .b{}
		.detail /deep/ img {
			width: 100%;
		}
	}

	.shopcar {
		padding: 10upx;
		width: 100%;
		overflow: hidden;
		position: fixed;
		bottom: 0;
		z-index: 900;
		background: #fff;

		.left {
			float: left;
			text-align: center;

			image {
				width: 40upx;
				height: 40upx;
			}

			.demo-uni-col {
				padding: 0px 20upx;
			}

			text {
				font-size: 12px;
			}
		}

		.right {
			float: right;
			overflow: hidden;
			padding: 0px 20upx;

			.btn {
				display: inline-block;
				float: left;
			}
		}
	}

	.addShop {
		.top {
			overflow: hidden;
			padding: 20upx;

			image {
				float: left;
				width: 100upx;
				height: 100upx;
				border-radius: 5px;
			}

			.shopPrice {
				float: left;
				padding: 10upx 20upx 0px 20upx;
				color: red;
			}

			.close {
				float: right;
			}
		}

		.center {
			padding: 20upx;

			.attr {
				.attrKey {
					padding: 20upx 0upx;
				}

				.attrValue {

					.property {
						/* float: left; */
						padding: 10upx;
						display: inline-block;
						text-align: center;
						border-radius: 5px;
						background: #f2f2f2;
						margin-right: 20upx;
						margin-bottom: 10upx;
					}
				}
			}
		}

		.bottom {
			overflow: hidden;
			padding: 20upx;
			height: 150upx;
			margin-bottom: 100upx;

			.numKey {
				float: left;
			}

			.numValue {
				float: right;
				overflow: hidden;

				.plus {
					float: left;
					height: 60upx;
					width: 70upx;
					margin-left: 4upx;
					line-height: 60upx;
					text-align: center;
					border-radius: 0px;
					border: none;
					color: grey;
				}

				.plus:after {
					border-radius: 0px;
					border: none;
				}

				.num {
					float: left;
					height: 60upx;
					width: 80upx;
					background: #f3f3f3;
					margin-left: 4upx;
					padding: 0upx 10upx;
					line-height: 60upx;
					text-align: center;
				}

				.and {
					float: left;
					height: 60upx;
					width: 70upx;
					margin-left: 4upx;
					line-height: 60upx;
					text-align: center;
					border-radius: 0px;
					border: none;
					color: grey;
				}

				.and:after {
					border-radius: 0px;
					border: none;
				}
			}
		}
		.sure{
			position: fixed !important;
			bottom: 0;
		}
	}
</style>
