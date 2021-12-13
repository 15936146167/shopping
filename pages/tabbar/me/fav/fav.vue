<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="收藏列表" @clickLeft="back"></uni-nav-bar>
		</view>
		<scroll-view scroll-y="true" v-show="goodList.length!=0">			
			<view class="like">
				<uni-row class="demo-uni-row" :gutter="10">
				    <uni-col :span="12" v-for="(goods,index) in goodList">
				        <view class="demo-uni-col"@click="toDetail(goods.goods_id)">
							<image :src="goods.img" mode=""></image>
							<br/>
							<text class="details">
								{{goods.name}}
							</text>
							<view class="price">
								<text>￥{{goods.price}}</text>
								<text>点击查看</text>
							</view>
						</view>	
				    </uni-col>
				</uni-row>
			</view>			
		</scroll-view>
		<view style="text-align: center;margin-top: 200upx;color: grey;" v-show="goodList.length==0">
			暂无收藏
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 商品数据
				goodList:[],
			}
		},
		onLoad(){
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
					url:"/api/get_fav_list",
					data:{
						uid:uid,
						skip:"0",
						limit:"10"
					},
					method:"POST"
				});
				console.log(res)
				if(res.data.code==1){
					this.goodList=res.data.data;
				}
			})();
		},
		mounted(){
			
		},
		methods: {
			back() {
				uni.switchTab({
					url: "/pages/tabbar/me/me"
				})
			},
			//调转到详情页
			toDetail(goods_id){
				// uniapp专属跳转方式，url为路由path
				uni.navigateTo({
					url:'/pages/tabbar/details/detail?goods_id='+goods_id
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.inlineBlock{
		display: inline-block;
	}
	.none{
		display: none;
	}
	//整体页面
	.content{
		background: #F1F1F1;
		margin-top: var(--status-bar-height);
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
	}
	//整体背景颜色
	scroll-view{
		position: relative;
		height: calc(100vh - 100upx);	
		//猜你喜欢
		.like{
			margin: 0px 10px;
			margin-top: 20upx;
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
				padding: 0upx 10upx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.price{
				overflow: hidden;
				margin-bottom: 5px;
				padding: 0upx 10upx;
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
