### 组件开篇
<h4>
	多商家购物车组件，包含购物车常规操作，以及h5，app，小程序统一提示框，适配app、h5、微信小程,其他未测试，理论支持，
	maskModel组件请从 (https://ext.dcloud.net.cn/plugin?id=3500)  下载
</h4>
### 使用方法
```html
<template>
	<view class="container">
		<car-list ref="mycar" :carList="carList" @allSelBtn="allSelBtn" @selShop="selShop" @selGoods="selGoods" @jsbtn="jsbtn" @delbtn="delbtn" @changeNum="changeNum"></car-list>
	</view>
</template>
```
```javascript
  <script>
  	import carList from '../../components/car-list/car-list.vue'
  	export default {
  		components:{
  			carList
  		},
  		data() {
  			return {
  				maskTitle:'',
  				carList:[
  					{	
  						shopId: 1,
  						title: "天猫超市",
  						total: 2,
  						goodsAmount: 6051,
  						selected:true,
  						glist:[
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
  							}
  						]
  					},
  					{
  						shopId: 2,
  						title: "京东超市",
  						total: 11,
  						selected:true,
  						goodsAmount: 6051,
  						glist:[
  							{
  								id: 188,
  								gid: 31,
  								name: "橘子",
  								img: "https://xthotel.palmbly.com/uploads/images/20201020/af19843b3416a2d81455a91aa99f2a1d.jpg",
  								gsId: 50,
  								spec_key_name: "件装:2件",
  								spec: [{name: "件装", value: "2件"}],
  								price: 3,
  								number: 10,
  								stock: 78,
  								selected:true,
  							},
  							{
  								id: 235,
  								gid: 35,
  								name: "积分购买测试",
  								img: "https://xthotel.palmbly.com/uploads/images/20201020/4dab5e724b06cbdbd5333585f5473c52.png",
  								gsId: 56,
  								spec_key_name: "尺寸:M 颜色:黑色",
  								spec: [{name: "尺寸", value: "M"}, {name: "颜色", value: "黑色"}],
  								price: 1,
  								number: 1,
  								stock: 97,
  								selected:true,
  							}
  						]
  					}
  				]
  			}
  		},
  		onLoad() {
  			
  		},
  		onShow() {
  			
  		},
  		methods: {
  			confirm:function(){//确定按钮
  				console.log('您点击了确定按钮');
  			},
  			cancel:function(){//取消按钮
  				console.log('您点击了取消按钮');
  			},
  			selGoods:function(carList){
  				var that = this;
  				that.carList = carList;
  			},
  			selShop:function(carList){
  				var that = this;
  				that.carList = carList;
  			},
  			allSelBtn:function(carList){
  				var that = this;
  				that.carList = carList;
  			},
  			jsbtn:function(ids){//结算按钮
  				var that = this;
  				console.log(ids);
  				var that = this;
  				/* 
  				 跳转结算页面
  				 
  				*/
  			},
  			delbtn:function(ids,list){//删除按钮
  				var that = this;
  				/* 
  				 请求接口数据
  				 
  				*/
  				for (let i = 0; i < list.length; i++) {
  					for (let k = 0; k < list[i].glist.length; k++) {
  						if (list[i].glist[k].selected == true) {
  							list[i].glist.splice(k,1);
  							k--
  						}
  					}
  					if(list[i].glist.length==0){//若当前店铺商品删除完，删除当前店铺
  						list.splice(i,1);
  						i--
  					}
  				}
  				that.carList = list;
  				
  				that.$refs.mycar.getAllMount(list);//计算价格展示
  			},
  			changeNum:function(total,carList,shopIndex,gIndex,number,id,type){
  				var that = this;
  				/* 
  				 请求接口数据
  				 
  				*/
  				carList[shopIndex].glist[gIndex].number = number;
  				if (type == 0) {
  					carList[shopIndex].total = total - 1;
  				} else {
  					carList[shopIndex].total = total + 1;
  				}
  				that.carList = carList;
  				that.$refs.mycar.getAllMount(carList);//计算价格展示
  			}
  		},
  		onReachBottom() {
  			
  		},
  		onShareAppMessage() {
  			
  		}
  	}
  </script>
```
```css
<style scoped>
	car-list{
		width: 100%;
	}
</style>
```

