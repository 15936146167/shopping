<template>
	<view class="content">
		<!-- 搜索栏 -->
		<view class="search" :class="scrollActive?'act':''">
			<uni-search-bar :radius="100" @focus="focus" placeholder="在此输入搜索内容"></uni-search-bar>
		</view>
		<!-- scroll-y="true"纵向滚动
		 upper-threshold距顶部/左边多远时（单位px），触发 scrolltoupper 事件
		 -->
		<scroll-view scroll-y="true" :upper-threshold="50" @scrolltoupper="top" @scroll="changeScroll">			
			<!-- banner -->
			<view class="uni-padding-wrap">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :indicator-active-color="active">
							<swiper-item v-for="(items,index) in banner">
								<image :src="items.img" mode=""></image>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
			
			<!-- 分类导航 -->
			<view class="nav">
				<uni-grid :column="4" :showBorder="false" style="text-align: center;">
					<uni-grid-item v-for="(cateImg,index) in cate">
						<view class="nav-item-icon" @click="toFenlei">
							<image :src="cateImg.img"></image>
							<br/>
							<text class="text">
								{{cateImg.name}}
							</text>
						</view>			
					</uni-grid-item>
				</uni-grid>
			</view>
			
			<!-- 推荐榜单 -->
			<view class="tuijian">
				<text class="tuijian-title">
					推荐榜单
				</text>
				<uni-row class="demo-uni-row" :gutter="20">
				    <uni-col :span="8" v-for="(competitives,index) in competitive">
				        <view class="demo-uni-col" @click="toDetail(competitives._id)">
							<image :src="competitives.img" mode=""></image>
							<view style="text-align: center;">
								<image src="@/static/img/index/shopicon.png" style="display: inline-block; width: 38upx;height: 38upx;" mode=""></image>
								<text style="display: inline-block;width: 80%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">						
									{{competitives.name}}
								</text>
							</view>
						</view>		
				    </uni-col>
				</uni-row>
			</view>
			
			<!-- 猜你喜欢 -->
			<view class="like">
				<text class="like-title">
					猜你喜欢
				</text>
				<uni-row class="demo-uni-row" :gutter="20">
				    <uni-col :span="12" v-for="likes in like">
				        <view class="demo-uni-col" @click="toDetail(likes._id)">
							<image :src="likes.img" mode=""></image>
							<br/>
							<text class="details">
								{{likes.name}}
							</text>
							<view class="price">
								<text>￥{{likes.price}}</text>
								<text>已售{{likes.sales}}件</text>
							</view>
						</view>	
				    </uni-col>
				</uni-row>
			</view>		
			
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 选中时的颜色
			active:"#2f54eb",
			//是否显示轮播点
			indicatorDots: true,
			//自动播放
			autoplay: true,
			//停留时长
			interval: 3000,
			//切换速度
			duration: 1000,
			//滚动的触发条件
			scrollActive:false,
			// 后台获取banner图
			banner:[],
			// 分类
			cate:[],
			// 推荐榜单
			competitive:[],
			// 猜你喜欢
			like:[]
		};
	},
	onLoad() {
		// banner图
		(async ()=>{
			let res=await this.$http({
				url:"/api/get_banner"
			});
			this.banner=res.data.data;
		})();
		// 分类
		(async ()=>{
			let res=await this.$http({
				url:"/api/get_cate",
				data:{
					position:"index"
				},
				method:"POST"
			});
			this.cate=res.data.data;
		})();
		// 推荐榜单
		(async ()=>{
			let res=await this.$http({
				url:"/api/get_competitive",
				data:{
					skip:'0',
					limit:'3'
				}
			});
			this.competitive=res.data.data;
		})();
		// 猜你喜欢
		(async ()=>{
			let res=await this.$http({
				url:"/api/get_like"
			});
			this.like=res.data.data;		
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
		top(e) {
			//滚动到顶部时触发
			/* console.log(e);
			console.log(111) */
		},
		changeIndicatorDots(e) {
			this.indicatorDots = !this.indicatorDots
		},
		changeAutoplay(e) {
			this.autoplay = !this.autoplay
		},
		intervalChange(e) {
			this.interval = e.target.value
		},
		durationChange(e) {
			this.duration = e.target.value
		},
		//搜索栏聚焦事件
		focus(){
			uni.navigateTo({
				url:'/pages/tabbar/index/search'
			});
		},
		//滚动触发搜索栏背景颜色改变事件
		changeScroll(e){
			this.scrollActive=e.target.scrollTop>40;
		},
		//调转到详情页
		toDetail(goods_id){
			// uniapp专属跳转方式，url为路由path
			uni.navigateTo({
				url:'/pages/tabbar/details/detail?goods_id='+goods_id
			});
		},
		//调转到分类页
		toFenlei(){
			// uniapp专属跳转方式，url为路由path
			uni.switchTab({
				url:'/pages/tabbar/fenlei/fenlei'
			})
		},
	}
};
</script>

<style lang="scss" scoped>
	//整体页面
	.content{
		background: #F1F1F1;
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--status-bar-height));
	}
	//整体搜索栏
	.search{
		background: rgba($color: #F8F8F8, $alpha: 0);
		position: fixed;
		top: var(--status-bar-height);
		width: 100%;
		z-index: 1000;
		margin-bottom: 50upx;
		&.act{
			background: rgba($color: rgb(88,255,232), $alpha: .5);
		}
	}
	//整体背景颜色
	scroll-view{
		position: relative;
		height: calc(100% - var(--window-top) - var(--window-bottom) - 104upx);	
		top: 104upx;
		//整体轮播图
		.uni-padding-wrap{
			width: 750upx;
			height: 510upx;
			//轮播图
			swiper{
				width: 750upx;
				height: 510upx;
				image{
					width: 750upx;
					height: 510upx;
				}			
			}
		}
		//整体分类导航
		.nav{
			background: #fff;
			margin: 10px;
			border-radius: 10upx;
			overflow: hidden;
			//分类导航样式
			.uni-grid-item{
				//宫格高度
				height: 140upx !important;
				font-size: 12px;
				//图片标志
				.nav-item-icon image{
					margin-top: 10px;
					width: 36px;
					height: 36px;
				}
			}
		}
		//整体推荐榜单
		.tuijian{
			margin: 10px;
			.tuijian-title{
				display: block;
				padding: 10px 0px;
				font-weight: bold;
			}
			//推荐榜单
			.demo-uni-col{
				margin-bottom: 10px;
				image{
					width: 200upx;
					height: 200upx;
					border-radius: 10upx;
					overflow: hidden;
				}
			} 
			//文字部分
			.demo-uni-row{
				text{
					display: inline-block;
				}
			} 
		}
		//猜你喜欢
		.like{
			margin: 0px 10px;
			.like-title{
				display: block;
				font-weight: bold;
				padding: 10px 0px;
			}
			.demo-uni-col{
				background: #fff;
				border-radius: 10upx;
				overflow: hidden;
				margin-bottom: 10upx;
			}
			image{
				width: 350upx;
				height: 350upx;
			}
			.details{
				display: block;
				margin: 10px 0px;
				padding: 0px 10upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.price{
				padding: 0px 10upx;
				overflow: hidden;
				margin-bottom: 5px;
				text:first-child{
					float: left;
					color: red;
				}
				text:last-child{
					float: right;
					color: #C0C0C0;
				}
			}
		}
	}	
</style>
