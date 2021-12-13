<template>
	<view class="content">
		<view class="search">
			<uni-search-bar :radius="100" focus @confirm="search" @cancel="back" placeholder="在此输入搜索内容"></uni-search-bar>
		</view>
		<!-- <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#2F54EB" style="position: fixed;z-index: 1000;width: 100%;background: #fff;"></uni-segmented-control> -->
			
			<scroll-view scroll-y="true" v-show="goodList.length!=0">
				<ms-tabs v-show="goodList.length!=0" :list="items" v-model="current" style="position: fixed;top:calc(104upx + var(--status-bar-height));z-index: 1000;width: 100%;height: 94upx; background: #fff;">
				    <template v-slot:title="{title}">
				        <view class="tab-block" style="overflow: hidden;text-align: center;" @click="onClickItem(title)">            
				            <view>
								{{title}}
								<view style="display: inline-block;padding: 0px 10upx;" v-show="title=='价格'">
									<image src="../../../static/img/goodList/shengxu.png" style="width: 10upx;height: 20upx;" :class="isShengxu?'inlineBlock':'none'" mode=""></image>
									<image src="../../../static/img/goodList/jiangxu.png" style="width: 10upx;height: 20upx;" :class="isShengxu?'none':'inlineBlock'" mode=""></image>
								</view>
							</view>
				        </view>
				    </template>
				</ms-tabs>
				<view class="like">
					<uni-row class="demo-uni-row" :gutter="10">
					    <uni-col :span="12" v-for="(goods,index) in newGoods">
					        <view class="demo-uni-col"@click="toDetail(goods._id)">
								<image :src="goods.img" mode=""></image>
								<br/>
								<text class="details">
									{{goods.name}}
								</text>
								<view class="price">
									<text>￥{{goods.price}}</text>
									<text>已售{{goods.sales}}件</text>
								</view>
							</view>	
					    </uni-col>
					</uni-row>
				</view>			
			</scroll-view>
			<view style="text-align: center;padding-top: 200upx;color: gold;" v-show="goodList.length==0">
				请先搜索
			</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			//选项卡索引
			current:0,
			// 选项卡导航
			items:[{title:"综合排序"},{title:"销量"},{title:"价格"}],
			// 是否升序
			isShengxu:true,
			// 商品原数据
			goodList:[],
			// 商品操作后的数据
			newGoods:[]
		};
	},
	onLoad() {
		
	},
	methods: {
		search(e){
			// 获取商品列表
			(async ()=>{
				let res=await this.$http({
					url:"/api/get_search_list",
					data:{
						keyword:e.value.trim(),
						skip:"0",
						limit:"10"
					}
				});
				console.log(res);
				if(res.data.code==1){
					if(res.data.data.length==0){
						uni.showToast({
							title:"未找到该商品",
							icon:"none"
						});
					}else{
						this.goodList=res.data.data;
						this.newGoods=JSON.parse(JSON.stringify(this.goodList));
					}
				}
			})();
		},
		//调转到详情页
		toDetail(goods_id){
			// uniapp专属跳转方式，url为路由path
			uni.navigateTo({
				url:'/pages/tabbar/details/detail?goods_id='+goods_id
			});
		},
		back(){
			uni.switchTab({
				url:'/pages/tabbar/index/index'
			})
		},
		// 选项卡导航事件
		onClickItem(e){
			// 判断是哪个tab标签
			if(e=="综合排序"){
				this.current=0;
				this.newGoods=JSON.parse(JSON.stringify(this.goodList));
			}else if(e=="销量"){
				this.current=1;
				for(var i=0;i<this.newGoods.length;i++){
					for(var j=0;j<this.newGoods.length-1;j++){
						if(this.newGoods[j].sales<this.newGoods[j+1].sales){
							var temp=this.newGoods[j];
							this.newGoods[j]=this.newGoods[j+1];
							this.newGoods[j+1]=temp;
						}
					}
				}
			}else if(e=="价格"){
				/* this.newGoods=[];
				this.newGoods=JSON.parse(JSON.stringify(this.goodList)); */
				if(this.current!=2){
					// 升序
					for(var i=0;i<this.newGoods.length;i++){
						for(var j=0;j<this.newGoods.length-1;j++){
							if(this.newGoods[j].price>this.newGoods[j+1].price){
								var temp=this.newGoods[j];
								this.newGoods[j]=this.newGoods[j+1];
								this.newGoods[j+1]=temp;
							}
						}
					}
					this.$forceUpdate();
				}else if(this.isShengxu==true&&this.current==2){
					this.isShengxu=false;
					for(var i=0;i<this.newGoods.length;i++){
						for(var j=0;j<this.newGoods.length-1;j++){
							if(this.newGoods[j].price<this.newGoods[j+1].price){
								var temp=this.newGoods[j];
								this.newGoods[j]=this.newGoods[j+1];
								this.newGoods[j+1]=temp;
							}
						}
					}
					this.$forceUpdate();
					console.log(this.newGoods)
				}else if(this.isShengxu==false&&this.current==2){
					this.isShengxu=true;
					for(var i=0;i<this.newGoods.length;i++){
						for(var j=0;j<this.newGoods.length-1;j++){
							if(this.newGoods[j].price>this.newGoods[j+1].price){
								var temp=this.newGoods[j];
								this.newGoods[j]=this.newGoods[j+1];
								this.newGoods[j+1]=temp;
							}
						}
					}
					this.$forceUpdate();
					console.log(this.newGoods)
				}
			}
									
		}
	}
};
</script>

<style lang="scss" scoped>
	page{
		background: #F1F1F1;
	}
	.inlineBlock{
		display: inline-block;
	}
	.none{
		display: none;
	}
	//整体页面
	.content{
		background: #F1F1F1;
		height: calc(100vh - var(--status-bar-height));
		margin-top: var(--status-bar-height);	
		position: relative;
	}
	.search{
		background: rgba($color: #F8F8F8, $alpha: 0);
		position: fixed;
		width: 100%;
		z-index: 1000;
		top:var(--status-bar-height);
		&.act{
			background: rgba($color: rgb(88,255,232), $alpha: .5);
		}
	}
	//整体背景颜色
	scroll-view{
		height: calc(100vh - 198upx - var(--status-bar-height) - var(--window-top) - var(--window-bottom));	
		position: fixed;
		top: calc(198upx + var(--status-bar-height));
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
				padding: 0upx 10upx;
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
