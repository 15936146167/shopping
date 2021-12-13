<template>
	<view class="content">
		<view class="top">
			<uni-nav-bar fixed color="#2F54EB">
			    <view>购物车 (共{{nums}}件)</view>
			</uni-nav-bar>
		</view>
		<scroll-view scroll-y="true" class="com-box">
			<view class="com-list" v-for="(item,index) in comarr" :key="index">
			    <view class="com-list-by">
					<view class="com-list-business f-w">
						<view class="com-list-business-select" ><radio color="#1aad19" :checked="item.checked"  name="select" @tap="ParentSelect(item,index)"></radio></view>
						<view class="com-list-business-icon" >
							<image class="icon" :src="item.icon"></image>
						</view>
						<view  class="com-list-business-text text-space">
							<text>{{item.business}}</text>
						</view>
					</view>
						<view class="com-list-body f-w" v-for="(items,i) in item.child" :key="i">
							<view class="com-list-body-select"><radio color="#1aad19" :checked="items.checked"  name="select" @tap="ChildSelect(items,index,i)"></radio></view>
							<view class="com-list-body-box f-w">
								<view class="com-list-body-img"><image class="icon" :src="items.goods_img"></image></view>
								<view class="com-list-body-box-cont">
									<view class="com-list-body-box-cont-title"><text>{{items.name}}</text></view>
									<view class="com-list-body-box-cont-op f-w">
										<view class="com-list-money">￥{{items.price}}</view>
										<view class="com-list-count f-w">
											<view @tap.stop="count(items,i,0)">-</view>
											<view>{{items.count}}</view>
											<view @tap.stop="count(items,i,1)">+</view>
										</view>
									</view>
								</view>
							</view>
						</view>
				</view>
			</view>
		</scroll-view>
		<view class="com-count f-w">
			<view class="com-count-box f-w"><radio color="#1aad19" :checked="AllState"  name="select" @tap="AllSelect" style="margin-right: 10rpx;margin-left: 15rpx;"></radio>合计:<text style="color: #F0250F;">￥{{total}}</text></view>
			<view class="com-count-box f-w">
				<button type="warn" @tap.stop="del" >删除</button>
				<button type="default" @tap.stop="submit" >结算</button>
			</view>
		</view>
	</view>
		
</template>

<script>
let _this=null;
 export default{
	 name:"ShoppingCart",
	 props:{
		 list:{
			 type:Array
		 },
		 
	 },
	 data(){
		 return {
			 ChildArray:[], //商品选择
			 total:0, //合计
			 AllState:false, //全选状态
			 SumMoney:[],
			 comarr:[],
			 // 商品总数量
			 nums:0
		 }
	 },
	 mounted() {
	 	_this=this;
		this.comarr=this.list;
		this.comarr.map((i,s)=>{
			this.nums+=i.child.length;
		})
	 },
	 methods:{
		async ParentSelect(msg,index){
			// console.log(this.SumMoney);
				 this.$set(this.comarr[index],'checked',msg.checked?false:true);
				 if(msg.checked){
					 for(var key of this.comarr[index].child){
						  this.$set(key,'checked',true); 
						  this.SumMoney.push(key);
					 };
				 }else{
					for(var key of this.comarr[index].child){
						this.$set(key,'checked',false);
					}; 
					this.SumMoney=[];
					this.comarr.forEach((data)=>{
						if(data.checked){
							for(let key of data.child){
								if(key.checked){
									this.SumMoney.push(key);
								}
							}
						}
					})
				 }
				 this.total=await this.getMoney();
		 },
		async ChildSelect(msg,Parent_index,Child_index){
			  this.SumMoney=[];
			  this.ChildArray=[];
			  this.$set(msg,'checked',msg.checked?false:true); 
			  for(var key of this.comarr[Parent_index].child){
			  		if(key.checked){
			  			_this.ChildArray.push(key);
			  		}
			  };
			  for(var sum of this.comarr){
				  for(var val of sum.child){
					  if(val.checked){
						 this.SumMoney.push(val);  
					  };
				  }
			  }
			  if(this.comarr[Parent_index].child.length === this.ChildArray.length){
				  this.$set(this.comarr[Parent_index],'checked',true);
			  }else{
				  this.$set(this.comarr[Parent_index],'checked',false); 
			  }
			  this.total=await this.getMoney();
		 },
		async AllSelect(){
			 this.SumMoney=[];
			 if(this.AllState){
				 for(var key of this.comarr){
					 this.$set(key,'checked',false);
					 for(var childKey of key.child ){
						  this.$set(childKey,'checked',false);
					 }
				 }
			 }else{
				for(var key of this.comarr){
					this.$set(key,'checked',true);
					for(var childKey of key.child ){
						 this.$set(childKey,'checked',true); 
						 this.SumMoney.push(childKey);
					}
				} 
			 }
			 this.total=await this.getMoney();
			 this.AllState=this.AllState?false:true;
		 },
		async count(data,index,type){
			if(type === 0 && data.count === 1){
				uni.showToast({title: '至少要购买1件'}); 
			};
			 if(type === 0 && data.count > 1){//减法
				 this.$set(data,'count',--data.count); 
			 }else if(type === 1){//加法
				 this.$set(data,'count',++data.count);  
			 }
			 this.total=await this.getMoney();
		 },
		async getMoney(){
			let sum= await new Promise((resolve, reject)=>{
				let ValueSum=0;
				_this.SumMoney.map((data)=>{
					ValueSum+=(data.count*data.price);
				});
				 resolve(ValueSum);
			 });
			 return sum;
		},
		handlingData(){
			var delArr=[];
			for(var key of this.comarr){
				key.child.forEach((value,index,array)=>{
					if(value.checked){
						delArr.push(value);
					}
				})
			};
			return delArr;
		},
		del(){
			this.$emit('del',this.handlingData());
		},
		submit(){
			this.$emit('submit',this.handlingData());
		}
	 }
 }
</script>

<style lang="scss" scoped>
	.content{
		height: calc(100vh - 50upx - var(--window-top) - var(--window-bottom) - var(--status-bar-height));
		box-sizing: border-box;
	}
	.f-w{
		display: flex;
		flex-wrap: wrap;
	}
	.icon{
		width: 100%;
		height: 100%;
	}
	.text-space{
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	.com-box{
		width: 95vw;
		height: calc(100vh - 190upx - var(--window-bottom) - var(--status-bar-height) - var(--window-top));
		overflow: hidden;
		margin: 0px auto;
		.com-list{
			width: 100%;
			height: auto;
			box-sizing: border-box;
			margin: 0 auto;
			margin-top: 10rpx;
			margin-bottom: 20rpx;
			/* box-shadow: 0rpx 0rpx 5rpx 5rpx #CCCCCC; */
			border-radius: 10rpx;
			background: #fff;
			.com-list-by{
				width: 100%;
				height: auto;
				.com-list-business{
					width: 100%;
					height: 100rpx;
					padding-top: 5rpx;
					margin-bottom: 10rpx;
					border-bottom: 1px solid #CCCCCC;
					.com-list-business-select{
						width: 40rpx;
						height: 40rpx;
						margin-left: 10rpx;
						margin-top: 5rpx;
						
					}
					.com-list-business-icon{
						width: 60rpx;
						height: 60rpx;
						margin-left: 20rpx;
						border-radius: 50%;
						overflow: hidden;
					}
					.com-list-business-text{
						width: 500rpx;
						height: auto;
						margin-left: 20rpx;
						margin-top: 10rpx;
					}
				}
				.com-list-body{
					width: 100%;
					height: 250rpx;
					margin: 0 auto;
					.com-list-body-select{
						width:9%;
						height: 250rpx;
						&>radio{
							margin-left: 10rpx;
							padding-top: 100rpx;
						}
					}
					.com-list-body-box{
						width: 85%;
						height: 250rpx;
						// border: 1px solid;
						.com-list-body-img{
							width: 200rpx;
							height: 200rpx;
							border-radius: 10rpx;
							overflow: hidden;
							margin-top: 10rpx;
						}
						.com-list-body-box-cont{
							width:380rpx;
							height: auto;
							padding-left: 20rpx;
							padding-top: 15rpx;
							.com-list-body-box-cont-title{
								width: 100%;
								height: 80upx;
								line-height: 40upx;
								overflow:hidden; //超出文本隐藏
								text-overflow:ellipsis; //溢出省略号显示
								display:-webkit-box; //将对象作为弹性伸缩盒子
								-webkit-box-orient:vertical; //设置伸缩盒子的子元素排列方式-从上到下垂直排列
								-webkit-line-clamp:2; //这个属性不是css的规范属性，需要组合上面两个属性，数组代表显示的行数,如2,3,4....
							}
							.com-list-body-box-cont-op{
								width: 100%;
								height: auto;
								margin-top: 70rpx;
								.com-list-money{
									width: 180rpx;
									height: 50rpx;
									// border: 1rpx solid;
									color: #F0250F;
									overflow: hidden;
								}
								.com-list-count{
									width: 164rpx;
									height: 50rpx;
									// border: 1rpx solid;
									// overflow: hidden;
									margin-left: 35rpx;
									&>view{
										width: 54rpx;
										height: auto;
										text-align: center;
										box-shadow: 0rpx 0rpx 1rpx 1rpx #f8f8f8;
										color: #545456;
										
										// border: 1px solid;
									}
								}
							}
						}
					}
				}
			}
			
		}
	}
	//合计
	.com-count{
		width: 100vw;
		height: 100rpx;
		border-top: 1rpx solid #C0C0C0;
		position: fixed;
		/* bottom: 100upx; */
		z-index: 1000;
		background: #FFFFFF;
		.com-count-box{
			width: 350rpx;
			height: auto;
			font-size: 34rpx;
			// border: 1rpx solid;
			text-align: center;
			line-height:100rpx;
			overflow: hidden;
			&>button:nth-child(1){
				padding-left: 50rpx;
				padding-right: 50rpx;
				height: 80rpx;
				color: #FFFFFF;
				border-radius: 100rpx;
				line-height: 80rpx;
				margin-top: 10rpx;
				margin-right: 5rpx;
				float: left;
			}
			&>button:nth-child(2){
				padding-left: 50rpx;
				padding-right: 50rpx;
				height: 80rpx;
				background: #1aad19;
				color: #FFFFFF;
				border-radius: 100rpx;
				line-height: 80rpx;
				margin-top: 10rpx;
				float: left;
			}
		}
		.com-count-box:nth-child(2){
			width: auto;
			float: right;
		}
	}
</style>
