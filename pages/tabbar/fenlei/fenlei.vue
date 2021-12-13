<template>
	<view class="main">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed title="分类" color="#2F54EB"></uni-nav-bar>
		</view>
		<view class="nav">
			<scroll-view scroll-y="true" class="nav-left">
				<view class="nav-left-item" v-for="(item,index) in categoryList" @click="categoryClickMain(item,index)"
					:key="index"
					:style="index==categoryActive?'color:'+activeTextColor+';background-color:'+activeBackgroundColor:''">
					{{item.name}}
				</view>
			</scroll-view>
			<scroll-view scroll-y="true" class="nav-right">
				<view class="nav-right-item" v-for="(item,index2) in subCategoryList[categoryActive]" :key="index2"
					@click="categoryClickSub(item._id)">
					<image :src="item.img" />
					<view
						style="width: 100%;font-size: 24upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
						{{item.name}}
						</view>
				</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	export default {
		name: "category",
		data() {
			return {
				categoryList: [],
				subCategoryList: [],
				height: 0,
				// 父级id
				cate_id: "",
				// 子级id
				goods_id:"",
				scrollTop: 0,
				scrollHeight: 0,
				categoryActive: 0,
				activeStyle: {
					color: this.activeTextColor,
					backgroundColor: this.activeBackgroundColor
				}
			}
		},
		props: {
			//主分类激活索引
			defaultActive: {
				type: Number,
				default: 0
			},
			activeTextColor: {
				type: String,
				default: '#2F54EB'
			},
			activeBackgroundColor: {
				type: String,
				default: ''
			},
			label: {
				type: String,
				default: 'name'
			},
			imgSrc: {
				type: String,
				default: 'logo'
			},
			//主分类点击事件
			categoryMainClick: {},
			//子分类点击事件
			categorySubClick: {}
		},
		onLoad() {
			this.cate();
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
			//请求分类
			async cate() {
				let res = await this.$http({
					url: "/api/get_cate",
					method: "POST"
				})
				this.categoryList = res.data.data;
				for (var i = 0; i < res.data.data.length; i++) {
					this.subCategoryList.push(res.data.data[i].children);
				}
				this.cate_id = this.categoryList[0]._id;
				console.log(res)
			},
			scroll(e) {
				this.scrollHeight = e.detail.scrollHeight;
			},
			categoryClickMain(category, index) {
				this.$emit('categoryMainClick', category)
				this.categoryActive = index;
				this.scrollTop = -this.scrollHeight * index;
			},
			categoryClickSub(goods_id) {
				let url="/pages/tabbar/goods/goodlist?cate_id="+goods_id;
				uni.navigateTo({
					url: url
				});

			}
		},
		mounted() {
			this.categoryActive = this.defaultActive
			uni.getSystemInfo({
				success: res => {
					this.height = res.screenHeight;
				}
			})
		},
		watch: {
			subCategoryList(newValue, oldValue) {

			}
		},
	}
</script>

<style scoped lang="scss">
	.main {
		width: 100%;
		height: calc(100vh - var(--window--bottom) - var(--window--top));
		margin-top: calc(var(--status-bar-height));

		.nav {
			display: flex;
			width: 100%;
			height: calc(100vh - var(--window-bottom) - var(--status-bar-height) - var(--window-top) - 100upx);
		}

		.nav-left {
			width: 30%;
			border-right: solid 1px #E0E0E0;
		}

		.nav-left-item {
			height: 50px;
			// border-right: solid 1px #E0E0E0;
			border-bottom: solid 1px #E0E0E0;
			font-size: 14px;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.nav-right {
			width: 70%;
			padding-top: 11px;
		}

		.nav-right-item {
			width: 28%;
			height: 100px;
			float: left;
			text-align: center;
			padding: 5px;
			font-size: 13px;
		}

		.nav-right-item image {
			width: 50px;
			height: 50px;
		}

		.active {
			color: #2F54EB;
		}

		.padding {
			height: var(--status-bar-height);
			width: 100%;
			top: 0;
			position: fixed;
			background-color: #F24544;
		}
	}
</style>
