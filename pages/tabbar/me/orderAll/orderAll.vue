<template>
	<view class="container">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="订单列表" @clickLeft="back"></uni-nav-bar>
		</view>
		<!-- 分段导航 -->
		  <view>
		        <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#2F54EB" style="position: fixed;z-index: 1000;width: 100%;background: #fff;"></uni-segmented-control>
		        <scroll-view scroll-y="true" class="listView">
		        	<view class="content">
		        		<!-- 内容列表 -->
		        	    <view class="items">
		        	        <!-- 全部订单 -->
		        			<view class="orderAll" v-for="(value,index) in itemsData">
		        	        	<view class="top">
		        	        		<text class="topLeft">
		        						订单号:{{value.order_sn}}
		        					</text>
		        					<text class="topRight">
		        						{{value.status==1?"待付款":value.status==2?"待发货":value.status==3?"待收货":value.status==6?"已完成":value.status==7?"已完成":"已取消"}}
		        					</text>
		        	        	</view>
		        				<view class="center">
		        					<image :src="value.goods[0].img" mode=""></image>
		        					<text class="name">
		        						{{value.goods[0].name}}
		        					</text>
		        					<br/>
		        					<view class="price">
		        						<text class="priceTop" v-for="attr in value.goods[0].attr">
		        							{{attr}}
		        						</text>
		        						<br/>
		        						<view class="priceBottom">
		        							<text class="priceBottomLeft">
		        								￥{{value.goods[0].price}}
		        							</text>
		        							<view class="priceBottomRight">
		        								<uni-icons type="closeempty" size="12"></uni-icons>
												{{value.goods[0].num}}
		        							</view>
		        						</view>
		        					</view>
		        				</view>
		        				<view class="bottom">
		        					<view class="bottomTop">
		        						<text>
		        							{{value.goods[0].num}}件 实付：
		        						</text>
		        						<text style="font-size: 18px;color: gold;">
		        							￥{{value.goods[0].price*value.goods[0].num}}
		        						</text>
		        					</view>
		        					<view class="bottomBottom">
		        						<wyb-button class="btn" width="110upx" height="40upx" type="hollow" :radius="['50px']" v-if="value.status=='1'||value.status=='2'||value.status=='3'||value.status=='6'||value.status=='7'" @click="cancel(value._id)">取消订单</wyb-button>
										<wyb-button class="btn" width="110upx" height="40upx" type="hollow" :radius="['50px']" v-else @click="deldd(value._id)">删除订单</wyb-button>
		        						<wyb-button class="btn" width="110upx" height="40upx" type="plain" :radius="['50px']" @click="toDetail(value.goods[0].goods_id)">查看详情</wyb-button>
		        						<wyb-button class="btn" width="110upx" type="filled" height="40upx" :radius="['50px']" v-if="value.status=='1'" @click="tofukuan(index)">去付款</wyb-button>
										<wyb-button class="btn" width="110upx" type="filled" height="40upx" :radius="['50px']" v-if="value.status=='2'">已付款</wyb-button>
										<wyb-button class="btn" width="110upx" type="filled" height="40upx" :radius="['50px']" v-if="value.status=='3'" @click="qianshou">待签收</wyb-button>
										<wyb-button class="btn" width="110upx" type="filled" height="40upx" :radius="['50px']" v-if="value.status=='6'||value.status=='7'">已签收</wyb-button>
									</view>
		        				</view>
		        	        </view>
							<!-- 取消订单模态框-->
							<view class="addShop">
								<e-modal :visible.sync="visible" width="100%" @cancel="handleCancel">
									<view class="xiaoguo">
										<view class="jiage">
											<view class="yy">
												取消原因：
											</view>
											<button type="default" v-for="(ly,i) in thly" :class="thlyindex==i?'active':''" @click="selectLy(ly,i)">{{ly}}</button>
										</view>
										<view class="close" @click="close">
											X
										</view>
									</view>
									<wyb-button class="btn sure" width="190rpx" type="filled" color="rgb(255,111,56)" :radius="['50px']"
										:width="'100%'" height="80upx" @click="quxiao">确认退货</wyb-button>
								</e-modal>
							</view>
							<!-- 支付 -->
							<pay-board :showBoard="showBoard" :priceText="total" @closeBorad="handleModel" @complete="complete"></pay-board>
		        	    </view>
		        	</view>
		        </scroll-view>
		    </view>
	</view>
</template>

<script>
	import PayBoard from '@/components/xiaojia-keyBoard/xiaojia-keyBoard.vue'
	export default {
		data() {
			return {
				//选项卡索引
				current:0,
				// 选项卡导航
				items:["全部","待付款","待发货","待收货","已完成"],
				//商品列表状态
				itemStatus:"",
				itemsData:[],
				// 取消订单模态框
				visible: false,
				// 退货理由
				thly:["不想要了","买错了","价格不合理"],
				// 退货理由下标
				thlyindex:0,
				// 所选理由
				ly:"不想要了",
				// 退货订单号
				thdd:"",
				// 付款模态框
				showBoard:false,
				// 付款的商品下标
				fukuanid:0,
				total:0,
			}
		},
		components:{
			PayBoard
		},
		onLoad(options) {
			var id=Number(options.id);
			this.current=id; 
			this.itemStatus=this.items[id];
			var tishi=setTimeout(()=>{
				// 弹框
				uni.showToast({
					title: "提醒：暂未开发支付功能",
					icon: "none"
				});
			},2000);
			// 订单列表
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
					url:"/order/getOrderList",
					data:{
						uid:uid,
						status:this.current,
						skip:"0",
						limit:"10"
					},
					method:"POST"
				});
				console.log(res);
				this.itemsData=res.data.data;
				console.log(this.itemsData)
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
				this.showBoard=false;
			},
			back(){
				uni.switchTab({
					url:"/pages/tabbar/me/me"
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
			// 付款
			closefukuan() {
				this.fukuan = false;
			},
			// 选项卡导航事件
			onClickItem(e){
				this.current=e.currentIndex;
				this.itemStatus=this.items[e.currentIndex];
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
						url:"/order/getOrderList",
						data:{
							uid:uid,
							status:this.current,
							skip:"0",
							limit:"10"
						},
						method:"POST"
					});
					console.log(res);
					this.itemsData=res.data.data;
					console.log(this.itemsData)
				})();
			},
			// 取消订单
			cancel(thdd){
				this.visible=true;
				this.thdd=thdd.toString();
			},
			async quxiao(){
				let res=await this.$http({
					url:"/order/cancel_order",
					data:{
						cancel_text:this.ly,
						orderId:this.thdd
					},
					method:"POST"
				});
				console.log(res)
				if (res.data.code == 1) {
					let reres=await this.$http({
						url:"/order/del_order",
						data:{
							orderId:this.thdd
						},
						method:"POST"
					});
					if(reres.data.code == 1){
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
						let uid="";
						try {
						    const value = uni.getStorageSync('uid');
						    if (value) {
								uid=value;
						    }
						} catch (e) {
						    // error
						}
						let ress=await this.$http({
							url:"/order/getOrderList",
							data:{
								uid:uid,
								status:this.current,
								skip:"0",
								limit:"10"
							},
							method:"POST"
						});
						this.itemsData=ress.data.data;
						this.visible=false;
						this.$forceUpdate();
					}else{
						uni.showToast({
							title: res.data.msg,
							icon: "none"
						});
					}				
				}else{
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}
			},
			// 选中理由
			selectLy(ly,i){
				this.thlyindex=i;
				this.ly=ly;
			},
			// 确认收货
			async qianshou(){
				let res=await this.$http({
					url:"/order/shouhuo",
					data:{
						orderId:this.thdd
					},
					method:"POST"
				});
				console.log(res)
			},
			tofukuan(index){
				this.fukuanid=index;
				this.total=this.itemsData[this.fukuanid].base_money;
				this.showBoard=true;
			},
			async zhifu(){			
				let res=await this.$http({
					url:"/order/shouhuo",
					data:{
						orderId:this.thdd
					},
					method:"POST"
				});
				console.log(res)
			},
			// 查看详情
			toDetail(goods_id){
				// uniapp专属跳转方式，url为路由path
				uni.navigateTo({
					url:'/pages/tabbar/details/detail?goods_id='+goods_id
				});
			},
			// 删除订单
			async deldd(dd){
				let res=await this.$http({
					url:"/order/del_order",
					data:{
						orderId:dd
					},
					method:"POST"
				});
				if(res.data.code == 1){
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
					let ress=await this.$http({
						url:"/order/getOrderList",
						data:{
							uid:uid,
							status:this.current,
							skip:"0",
							limit:"10"
						},
						method:"POST"
					});
					this.itemsData=ress.data.data;
					this.$forceUpdate();
				}else{
					uni.showToast({
						title: res.data.msg,
						icon: "none"
					});
				}				
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background: #F1F1F1;
	}
	.active::after{
		border-color: red;
	}
	.addShop{
		
		/* overflow: hidden; */
		.xiaoguo{
			position: relative;
			.jiage{
				padding: 20upx;
				.yy{
					margin-bottom: 20upx;
				}
				button{
					display: inline-block;
					height: 50upx;
					line-height: 50upx;
					font-size: 28upx;
					margin-right: 15upx;
				}
			}
			.close{
				position: absolute;
				top: 20upx;
				right: 20upx;
			}
		}
		.sure{
			/* position: fixed;
			bottom: 0; */
		}
	}
	.container{
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		.content{
			background: #F1F1F1;
		}
		.listView{
			background: #F1F1F1;
			height: calc(100vh - 88upx);
		}
		// 商品内容
		.items{
			padding: 30upx;
			margin-top: 60upx;
			// 全部部分
			.orderAll{
				// 商品头部
				background: #fff;
				border-radius: 10upx;
				overflow: hidden;
				margin-bottom: 10px;
				padding: 8upx;
				.top{
					padding: 0upx 10upx;
					overflow: hidden;
					.topLeft{
						float: left;
					}
					.topRight{
						float: right;
						color: gold;
					}
				}
				// 商品中间
				.center{
					position: relative;
					padding: 30upx;
					overflow: hidden;
					image{
						width: 80px;
						height: 100px;
						float: left;
						padding: 20upx 50upx 0px 0px;
					}
					// 名字部分
					.name{
						display: inline-block;
						float: left;	
						font-size: 14px;
						font-weight: bold;
						width: 400upx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					// 底部价格部分
					.price{
						position: absolute;
						display: inline-block;
						bottom: 30upx;
						font-size: 14px;
						.priceTop{
							display: inline-block;
							padding-bottom: 10upx;
							color: grey;
						}
						.priceBottom{
							overflow: hidden;
							width: calc(100vw - 340upx);
							.priceBottomLeft{
								color: gold;
								float: left;
							}
							.priceBottomRight{
								float: right;
							}
						}
					}
				}
				// 商品底部
				.bottom{
					font-size: 14px;
					float: right;
					.bottomTop{
						margin-bottom: 10upx;
						text-align: right;
						padding-right: 8upx;
					}
					.bottomBottom{
						.btn{
							display: inline-block;
							margin: 0px 10upx;
						}
					}
				}
			}
		}
	}
</style>
