<template>
	<view class="cell_page">
		<view class="cell_view" @click="getview(icontype)">
			<view :class="['cell_icon','iconfont',iconsrc]" v-if="showlefticom=='icon'"></view>
			<image class="cell_icon" v-if="showlefticom=='img'" :src="iconsrc" mode="widthFix"></image>
			<view class="cell_name">
				<view :class="['cell_title',label?'title_label':'']" :style="'color:'+titlecolor">{{title}}</view>
				<view class="cell_label" v-if="label" :style="'color:'+labelcolor">{{label}}</view>
			</view>
			<view class="cell_mun" :style="munstyle" v-if="mun">{{mun}}</view>
			<view class="cell_rigth">
				<view class="iconfont icon-rigth cell_rigth_icon" v-if="icontype=='icon'" :style="'color:'+iconcolor"></view>
				<switch :checked=ischecked :color='iconcolor' @change="switchChange" style="transform: scale(0.7,0.7)" v-if="icontype=='switch'"/>
			</view>
		</view>
	</view>
</template>

<script>
	// 调用方式参数
	// <xsb-cell title='adddddddddddddddddd' iconsrc="../static/idea-kefu/emoj/1.gif" label="这是个描述" mun='105' muncolor="red" munbgcolor="#ddd"  iconcolor="red" icontype='switch'/>
	export default {
		name:"cell",
		props:{
			cellkey:{
				type:String,//类型，一个标识一点要穿
				default:''
			},
			iconsrc:{
				type:String,
				default:''
			},
			title:{
				type:String,
				default:''
			},
			titlecolor:{
				type:String,
				default:'#555'
			},
			label:{
				type:String,
				default:''
			},
			labelcolor:{
				type:String,
				default:'#999'
			},
			mun:{
				type:String,
				default:''
			},
			muncolor:{
				type:String,
				default:''
			},
			munbgcolor:{
				type:String,
				default:''
			},
			iconcolor:{
				type:String,
				default:''
			},
			icontype:{
				type:String,
				default:''
			},
			ischecked:{
				type:Boolean,
				default:false
			}
		},
		watch:{
			'cellkey':{
				handler(newval) {
					if(!newval){
						console.error('cellkey必传')
					}
				},
				immediate: true,
			}
		},
		computed:{
			munstyle(){
				return "color:"+this.muncolor+";background-color:"+this.munbgcolor;
			},
			showlefticom(){
				 let reg = /\.(png|jpg|gif|jpeg|webp)$/
				 if(this.iconsrc){
					 return reg.test(this.iconsrc)?'img':'icon'
				 }else{
					 return ''
				 }
				
			}
		},
		data() {
			return {
				
			};
		},
		methods:{
			switchChange(e){
				// console.log(this.cellkey,e.detail.value)
				this.$emit('switchvalue',this.cellkey,e.detail.value)
			},
			getview(name){
				if(name!='switch'){
					this.$emit('changeview',this.cellkey)
				}
			}
		}
	}
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont"; /* Project id 2797607 */
  src: 
       url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAKUAAsAAAAABlAAAAJJAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACCcApMXQE2AiQDCAsGAAQgBYRnBy8bmAXIHpIkRaoQSlFA6WbDICEevvb7nbtvv+CSVLNoFk1kEonSSDCd6Z4ZUpbqJbz/W2v/8AQZn5DWIupJ6+7Jn9m99dmPNctUt+iRdw3tNB6NeIlmGfJl7tOfyllAAX4glOyOTXvSookfqPWCNIAda1AJeyWveA2WV341+yY/I9BoSYeS3YGxSai+TFMAdco4nUFeHpeOSEOVjsoyLdSFKro0i1uokK5L3oCb+PPxz4gqkkrBqTq46M9BYe6IYvF/keLD4nIN9LSECgrMAZk46c/uKRVtfKlGb5kRWpsFX8oy9IhDO4X665zSZjBMhWcSfelRCwkeq6cOoG/S1URHwtfu7+96MLex+/baJ9b33k/s6+LVT31xiLs/8FnXcljMrz5UYROgLKS/YhtSCF5q08KsWf2uN2XwGb+Pw2Uhw/ygvgtv8D/M5yAxmxgpt4m6Pek4hdboJijBCXb6mGrrOm8x1HVN8NcM5SjUjVCZm0FFkxVU1a2h0az+1U26REpFbsCEFYLQ7hJJqzcU2j1SmXtHRa8vVLX7RaOzaNmuyURkeyWmCXMss8CcbBhwz0qx0XEUM15aNqWmUSYOTTBd0aqFQQxQzjEjmRUGEWdchj4bkKeh54UskmEes6TYRFGLqvK2tyjZ0IdeEkojKIfJWMA4skIBHpKp/H3jkDDDkyZBajorJRxqnNEpNIAaNAVQy4O8kpglGAjhGE4K+ZgBPQh5PCEmah+Uh7KIwp6QjrRQXRJHTcr2Fv/XdkEjx57C7VOoXDmCbAAA') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-rigth:before {
  content: "\e621";
}

.cell_page{
	border-top:10upx solid #ececec;
	border-bottom:10upx solid #ececec;
	background-color: #fff;
	.cell_view{
		padding: 0 30upx;
		display: flex;
		align-items: center;
		.cell_icon{
			width: 60upx;
			height: 60upx;
			font-size: 58upx;
			font-weight: bold;
			margin-right: 20upx;
		}
		.cell_name{
			flex: 1;
			height: 120upx;
			.cell_title{
				height: 70upx;
				line-height: 120upx;
				font-size: 34upx;
				font-weight: bold;
			}
			.title_label{
				line-height: 80upx;
			}
			.cell_label{
				height: 40upx;
				line-height: 40upx;
				font-size: 28upx;
			}
			
		}
		.cell_mun{
			padding: 10upx;
			text-align: center;
			font-size: 26upx;
			border-radius:50upx ;
		}
		.cell_rigth{
			.cell_rigth_icon{
				color: #888;
				font-size: 34upx;
			}
		}
	}
}








</style>
