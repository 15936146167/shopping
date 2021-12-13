<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="商品列表" @clickLeft="back"></uni-nav-bar>
		</view>
		<!-- <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#2F54EB" style="position: fixed;z-index: 1000;width: 100%;background: #fff;"></uni-segmented-control> -->
		<ms-tabs :list="items" v-model="current" style="position: fixed;z-index: 1000;width: 100%;height: 94upx; background: #fff;">
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
		<scroll-view scroll-y="true">			
			<view class="like">
				<uni-row class="demo-uni-row" :gutter="10">
				    <uni-col :span="12" v-for="(goods,index) in goodList">
				        <view class="demo-uni-col" @click="toDetail(goods._id)">
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			// 列表id
			cate_id:"",
			//选项卡索引
			current:0,
			// 选项卡导航
			items:[{title:"综合排序"},{title:"销量"},{title:"价格"}],
			// 是否升序
			isShengxu:true,
			// 商品数据
			goodList:[]
		};
	},
	onLoad(options) {
		this.cate_id=options.cate_id.toString();
		// 获取商品列表
		(async ()=>{
			let res=await this.$http({
				url:"/api/get_goods_list",
				data:{
					cate_id:this.cate_id,
					skip:"0",
					limit:"10",
					sort_type:"1"
				},
				method:"POST"
			});
			this.goodList=res.data.data;
			console.log(res.data.data)
		})();
	},
	watch:{
		isShengxu:function(){
			if(this.current!=2){
				this.isShengxu=true;
			}else{
				if(this.isShengxu){
					(async ()=>{
						let res=await this.$http({
							url:"/api/get_goods_list",
							data:{
								cate_id:this.cate_id,
								skip:"0",
								limit:"10",
								sort_type:"3"
							},
							method:"POST"
						});
						this.goodList=res.data.data;
					})();
				}else{
					(async ()=>{
						let res=await this.$http({
							url:"/api/get_goods_list",
							data:{
								cate_id:this.cate_id,
								skip:"0",
								limit:"10",
								sort_type:"4"
							},
							method:"POST"
						});
						this.goodList=res.data.data;
						console.log(res.data.data)
					})();
				}
			}
		}
	},
	methods: {
		//调转到详情页
		toDetail(){
			// uniapp专属跳转方式，url为路由path
			uni.navigateTo({
				url:'/pages/tabbar/details/detail'
			})
		},
		back(){
			uni.navigateBack({
				
			})
		},
		// 选项卡导航事件
		onClickItem(e){
			// 判断是哪个tab标签
			if(e=="综合排序"){
				this.current=0;
				(async ()=>{
					let res=await this.$http({
						url:"/api/get_goods_list",
						data:{
							cate_id:this.cate_id,
							skip:"0",
							limit:"10",
							sort_type:"1"
						},
						method:"POST"
					});
					this.goodList=res.data.data;
					console.log(res.data.data)
				})();
			}else if(e=="销量"){
				this.current=1;
				(async ()=>{
					let res=await this.$http({
						url:"/api/get_goods_list",
						data:{
							cate_id:this.cate_id,
							skip:"0",
							limit:"10",
							sort_type:"2"
						},
						method:"POST"
					});
					this.goodList=res.data.data;
					console.log(res.data.data)
				})();
			}else if(e=="价格"){
				if(this.current!=2){
					(async ()=>{
						let res=await this.$http({
							url:"/api/get_goods_list",
							data:{
								cate_id:this.cate_id,
								skip:"0",
								limit:"10",
								sort_type:"3"
							},
							method:"POST"
						});
						this.goodList=res.data.data;
					})();
				}else if(this.isShengxu==true&&this.current==2){
					this.isShengxu=false;
				}else if(this.isShengxu==false&&this.current==2){
					this.isShengxu=true;
				}
			}
									
		},
		//调转到详情页
		toDetail(goods_id){
			// uniapp专属跳转方式，url为路由path
			uni.navigateTo({
				url:'/pages/tabbar/details/detail?goods_id='+goods_id
			});
		},
	}
};
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
		margin-top: 88upx;
		height: calc(100vh - 228upx);	
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
