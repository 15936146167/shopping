<template>
	<view class="car-count">
		<view class="car-list"  v-for="(item,shopIndex) in carList" :key="item.shopId">
			<view class="shop-mes clearfix">
				<view class="name-mes centerboth">
					<view class="btn centerboth" v-if="item.selected==true" @click="selShop(shopIndex)">
						<text class="iconfont car-sel"></text>
					</view>
					<view class="btn centerboth" v-else @click="selShop(shopIndex)">
						<text class="iconfont car-unsel"></text>
					</view>
					<view class="shop-name">{{item.title}}</view>
				</view>
			</view>
			<view class="list" v-for="(itm,gIndex) in item.glist" :key="itm.id">
				<view class="btn centerboth" v-if="itm.selected==true" @click="selThis(shopIndex,gIndex)">
					<text class="iconfont car-sel"></text>
				</view>
				<view class="btn centerboth" v-else @click="selThis(shopIndex,gIndex)">
					<text class="iconfont car-unsel"></text>
				</view>
				<image class="car-img" :src="itm.img" mode="aspectFill"></image>
				<view class="car-mes centerboth">
					<view class="mes-box">
						<view class="g-name line2">{{itm.name}}</view>
						<view class="gz-box"><text>{{itm.spec_key_name}}</text></view>
						<view class="price-change-num clearfix">
							<view class="price">￥<text class="yj-price">{{itm.price}}</text></view>
							<view class="num-box centerboth">
								<text class="iconfont car-sub" @click="changeNum(item.total,shopIndex,gIndex,itm.stock,itm.number,0,itm.id)" ></text>
								<view>{{itm.number}}</view>
								<text class="iconfont car-add" @click="changeNum(item.total,shopIndex,gIndex,itm.stock,itm.number,1,itm.id)"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="car-bottom-btn">
			<view class="all-sel-btn centerboth" @click="allSelBtn">
				<text v-if="allSel==true" class="iconfont car-sel"></text>
				<text v-else class="iconfont car-unsel"></text>
				全选
			</view>
			<view class="all-cost centerboth">
				合计:<text class="icon">￥</text><text class="money">{{allAmount}}</text>
			</view>
			<view class="car-btn-box centerboth">
				<view class="del-btn centerboth" @click="delCars">删除</view>
				<view class="js-btn centerboth" @click="jsCars">
					结算({{allNumber}})
				</view>
			</view>
		</view>
		<mask-model ref="askmodel" btnType="1" @confirm="confirm" @cancel="cancel" titleColoe="#666666" cancelColor="#666666" confirmColor="#007AFF" :maskTitle="maskTitle"></mask-model>
	</view>
</template>
<script>
	import maskModel from '../mask-model/mask-model.vue'
	export default {
		props: {
			carList:{//提示信息字体颜色
				type: Array,
				default(){
					return []
				}
			}
		},
		data() {
			return {
				maskTitle:'',
				allSel:true,
				allAmount:'0.00',
				allNumber:0,
				delIds:'',//要删除的购物车id
				btnType:0,//0删除  1结算
			};
		},
		mounted() {
			this.getAllMount();
		},
		created() {

		},
		computed: {
			
		},
		methods: {
			confirm:function(){//确定按钮
				var that = this;
				console.log('您点击了确定按钮');
				if(that.btnType==0){
					that.$emit('delbtn',that.delIds,that.carList);
				}else{
					let ids = that.getCarIds();
					this.$emit('jsbtn',ids)
				}
			},
			cancel:function(){//取消按钮
				console.log('您点击了取消按钮');
			},
			jsCars:function(){
				var that = this;
				that.btnType = 1;
				that.$refs.askmodel.show();
				that.maskTitle = '是否结算选中的商品?'
			},
			delCars:function(){
				var that = this;
				that.delIds = '';//清除上次删除记录
				var delIds = that.getCarIds();
				
				if(!delIds){
					uni.showToast({
						title:'请选择要删除的商品',
						icon:'none'
					})
					return false;
				}
				
				that.delIds = delIds;
				that.btnType = 0;
				that.$refs.askmodel.show();
				that.maskTitle = '是否将选中商品移除购物车?'
			},
			selThis: function(shopIndex, gIndex) { //选择商品
				var that = this;
				let carList = that.carList;
				if (carList[shopIndex].glist[gIndex].selected == false) {
					carList[shopIndex].glist[gIndex].selected = true;
				} else {
					carList[shopIndex].glist[gIndex].selected = false;
				}
				for (let i = 0; i < carList.length; i++) {
					var indexNum = 0;
					for (let k = 0; k < carList[i].glist.length; k++) {
						if (carList[i].glist[k].selected == false) {
							carList[i].selected = false;
						}else{
							indexNum = indexNum+1;
							if(indexNum>0 && carList[i].glist.length==indexNum){
								carList[i].selected = true;
							}
						}
					}
				}
				
				that.setAllSel();
				that.$emit('selGoods',carList);
			},
			selShop:function(shopIndex){
				var that = this;
				let carList = that.carList;
				if(carList[shopIndex].selected == false){
					carList[shopIndex].selected = true;
					for(let i=0;i<carList[shopIndex].glist.length;i++){
						carList[shopIndex].glist[i].selected = true;
					}
				}else{
					carList[shopIndex].selected = false;
					for(let i=0;i<carList[shopIndex].glist.length;i++){
						carList[shopIndex].glist[i].selected = false;
					}
				}
				that.setAllSel();
				that.$emit('selShop',carList);
			},
			setAllSel:function(){//是否全选
				let shopNum = 0;
				for(let i=0;i<this.carList.length;i++){
					if(this.carList[i].selected == true){
						shopNum = shopNum+1;
					}
				}
				if(shopNum == this.carList.length && shopNum>0){
					this.allSel = true;
				}else{
					this.allSel = false;
				}
				this.getAllMount();
			},
			allSelBtn: function() {//全选
				var that = this;
				this.allSel = !this.allSel;
				var carList = that.carList;
				for (let i = 0; i < carList.length; i++) {
					for (let k = 0; k < carList[i].glist.length; k++) {
						if (this.allSel) {
							carList[i].glist[k].selected = true;
							carList[i].selected = true;
						} else {
							carList[i].selected = false;
							carList[i].glist[k].selected = false;
						}
					}
				}
				that.$emit('allSelBtn',carList);
				that.getAllMount();
			},
			getAllMount: function() { //计算选中总价
				var that = this;
				let allPrice = 0;
				var selNum = 0;
				let carList = that.carList;
				for (let i = 0; i < carList.length; i++) {
					for (let k = 0; k < carList[i].glist.length; k++) {
						if (carList[i].glist[k].selected == true) {
							selNum = selNum + carList[i].glist[k].number;
							allPrice = allPrice + (carList[i].glist[k].number * carList[i].glist[k].price);
						}
					}
				}
				that.allNumber = selNum;
				that.allAmount = allPrice.toFixed(2);
			},
			getCarIds: function() { //获取要结算的商品
				var that = this;
				var carList = that.carList;
				var haveSel = [];
				for (let i = 0; i < carList.length; i++) {
					for (let k = 0; k < carList[i].glist.length; k++) {
						if (carList[i].glist[k].selected == true) {
							haveSel.push(carList[i].glist[k].id);
						}
					}
				}
				if (haveSel.length == 0) {
					uni.showToast({
						title:'请选择要结算的商品',
						icon:'none'
					})
					return false;
				}
				let cartIds = haveSel.join(',');
				return cartIds;
			},
			changeNum: function(total, shopIndex, gIndex, stock, number, type, id) {//适用于根据数量改变购物车
				var that = this;
				var carList = that.carList;
				if (type == 0) { //减少
					if (number <= 1) {
						return false;
					}
					number = number - 1;
				} else { //增加
					if (number >= stock) {
						uni.showToast({
							title: '库存不足',
							icon: 'none'
						})
						return false;
					}
					number = number + 1;
				}
				that.$emit('changeNum',total,carList,shopIndex,gIndex,number,id,type);
			},
		}
	}
</script>

<style scoped>
	@font-face {
	  font-family: 'iconfont';  /* project id 1143282 */
	  src: url('https://at.alicdn.com/t/font_1143282_zy7677qexck.eot');
	  src: url('https://at.alicdn.com/t/font_1143282_zy7677qexck.eot?#iefix') format('embedded-opentype'),
	  url('https://at.alicdn.com/t/font_1143282_zy7677qexck.woff2') format('woff2'),
	  url('https://at.alicdn.com/t/font_1143282_zy7677qexck.woff') format('woff'),
	  url('https://at.alicdn.com/t/font_1143282_zy7677qexck.ttf') format('truetype'),
	  url('https://at.alicdn.com/t/font_1143282_zy7677qexck.svg#iconfont') format('svg');
	}
	
	.iconfont {
	  font-family: "iconfont" !important;
	  font-size: 16px;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	
	.car-add:before{
		content: "\e8a6";
	}
	.car-sub:before{
		content: "\e8a7";
	}
	.car-no:before{
		content: "\e64d";
	}
	.car-unsel:before{
		content: "\e63a";
	}
	.car-sel:before{
		content: "\e639";
	}
	.car-del:before{
		content: "\e622";
	}
	.car-count {
		width: 100%;
		padding-bottom: 120rpx;
	}
	.manage-btn {
		width: 100%;
		height: 75rpx;
		background: #FFFFFF;
		text-align: right;
	}
	
	.manage-btn text {
		font-size: 30rpx;
		color: #76a28c;
		line-height: 75rpx;
		padding: 0 24rpx;
	}
	
	

	.all-sel-btn {
		height: 100%;
		float: left;
	}
	.all-sel-btn .iconfont{
		margin-right: 10rpx;
		color: #76a28c;
	}
	
	.car-list {
		width: 100%;
		padding: 24rpx 24rpx 0 24rpx;
	}
	
	.car-list .list {
		width: 100%;
		padding: 20rpx 20rpx 20rpx 0;
		display: flex;
		background: #FFFFFF;
		border-radius: 10rpx;
		border-bottom: 1px solid #F5F5F5;
	}
	.car-list .list:nth-child(1){
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.car-list .list:nth-last-child(1){
		margin: 0;
	}
	
	.car-list .list .btn {
		width: 70rpx;
		height: 190rpx;
	}
	.car-list .list .btn .iconfont{
		color: #76a28c;
		font-size: 38rpx;
	}

	.car-list .list .car-img {
		width: 190rpx;
		height: 190rpx;
		border-radius: 10rpx;
	}
	
	.car-list .list .car-mes {
		flex: 1;
		margin-left: 20rpx;
	}
	
	.car-list .g-name {
		font-size: 28rpx;
		color: #2a2a2a;
		/* height: 38rpx; */
	}
	
	.car-list .mes-box {
		width: 100%;
	}
	
	.car-list .gz-box {
		font-size: 26rpx;
		color: #999999;
		margin: 10rpx 0;
	}
	
	.car-list .mes-box .price {
		color: #ff5621;
		font-weight: bold;
		font-size: 24rpx;
	}
	
	.car-list .mes-box .yj-price {
		font-size: 36rpx;
	}
	
	.car-list .price .num {
		color: #2a2a2a;
		font-size: 28rpx;
		font-weight: normal;
		float: right;
	}
	
	.car-list .num-box {
		float: right;
	}
	
	.car-list .num-box .iconfont {
		font-size: 50rpx;
		color: #999999;
	}
	
	.car-list .num-box view {
		width: 60rpx;
		text-align: center;
		height: 50rpx;
		line-height: 50rpx;
		font-size: 30rpx;
		color: #2A2A2A;
		margin: 0 10rpx;
	}
	
	.price-change-num .price {
		float: left;
	}
	
	.car-bottom-btn {
		position: fixed;
		width: 100%;
		height: 100rpx;
		background: #FFFFFF;
		left: 0;
		bottom: 0;
		z-index: 6;
		box-shadow: 0px -5px 10px -5px #d0d0d0;
		padding: 0 300rpx 0 40rpx;
		display: flex;
		justify-content: space-between;
	}
	.car-bottom-btn .all-cost{
		margin-right: 10rpx;
	}
	.car-bottom-btn .all-cost .icon{
		font-size: 28rpx;
		margin-top: 5rpx;
	}
	.car-bottom-btn text {
		color: #ff5621;
		font-size: 38rpx;
		line-height: 80rpx;
	}
	.car-btn-box{
		position: absolute;
		right: 0;
		height: 100%;
		z-index: 9;
		top: 0;
	}
	.car-btn-box view{
		width: 150rpx;
		height: 100%;
		cursor: pointer;
	}
	.del-btn{
		background: red;
		color: #FFFFFF;
	}
	.js-btn{
		background: #76a28c;
		color: #FFFFFF;
	}
	.shop-mes{
		padding: 20rpx;
		background: #FFFFFF;
		border-bottom: 1px solid #F5F5F5;
	}
	.shop-mes .iconfont{
		font-size: 38rpx;
		margin-right: 20rpx;
		color: #76a28c;
	}
	.shop-mes .name-mes{
		float: left;
	}
</style>
