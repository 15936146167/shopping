<template>
	<view class="content">
		<!-- 返回 -->
		<view class="topNav">
			<uni-nav-bar fixed left-icon="back" left-text="返回" title="收货地址" @clickLeft="back"></uni-nav-bar>
		</view>
		<scroll-view scroll-y="true">
			<view class="addr" v-for="(i,s) in addr">
				<uni-list>
					<uni-list-item :title="i.name+' '+i.tel" :note="i.addr_text"></uni-list-item>
				</uni-list>
				<uni-row class="demo-uni-row">
					<uni-col :span="8" style="font-size: 18px;">
						<uni-icons class="mr-30" type="checkbox-filled" font-family="iconfont" color="#007AFF" size="20"
							v-show="i.is_default"></uni-icons>
						<uni-icons v-show="!i.is_default" class="mr-30" type="circle" font-family="iconfont" color="#007AFF" size="20"
							@click="checked(i.is_default,i._id)"></uni-icons>
						<text style="padding-left: 10upx;">
							默认地址
						</text>
					</uni-col>
					<uni-col :span="8" style="font-size: 18px;">
						<view @click="edit(i._id)">
							<uni-icons class="mr-30" type="compose" font-family="iconfont" color="#bfbfbf" size="20">
							</uni-icons>
							<text style="padding-left: 10upx;">
								编辑
							</text>
						</view>
					</uni-col>
					<uni-col :span="8" style="font-size: 18px;">
						<view @click="del(i._id)">
							<uni-icons class="mr-30" type="trash" font-family="iconfont" color="#bfbfbf" size="20">
							</uni-icons>
							<text style="padding-left: 10upx;">
								删除
							</text>
						</view>
					</uni-col>
				</uni-row>
			</view>
			<button type="default" style="width: 90%;margin-top: 100upx;" @click="toSetAddr">添加收货地址</button>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addr: []
			}
		},
		mounted() {
			
		},
		onShow(){
			this.addrs();
		},
		onLoad() {
			this.addrs();
		},
		methods: {
			async addrs(){
				let uid = "";
				let token = "";
				try {
					const uidValue = uni.getStorageSync('uid');
					const tokenValue = uni.getStorageSync('token');
					if (uidValue) {
						uid = uidValue;
					}
					if (tokenValue) {
						token = tokenValue;
					}
				} catch (e) {
					// error
				}
				// 获取收货地址列表
				let res = await this.$http({
					url: "/order/getAddrList",
					data: {
						uid: uid,
						token: token
					},
					method: "POST"
				});
				console.log(res);
				this.addr=res.data.data;
			},
			back() {
				uni.navigateBack({
					
				})
			},
			change(e) {

			},
			checked(is_default,_id) {
				if(!is_default){
					let uid = "";
					try {
						const uidValue = uni.getStorageSync('uid');
						if (uidValue) {
							uid = uidValue;
						}
					} catch (e) {
						// error
					}
					// 获取收货地址列表
					(async () => {
						let res = await this.$http({
							url: "/order/set_default_addr",
							data: {
								uid: uid,
								_id: _id
							},
							method: "POST"
						});
						this.addrs();
						if(res.data.code==1){
							location.reload();
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							});
						}else{
							uni.showToast({
								title:res.data.msg,
								icon:"none"
							});
						}
					})();
				}
			},
			edit(id) {
				uni.navigateTo({
					url: "pages/tabbar/me/address/setAddr?_id="+id
				})
			},
			del(id) {
				let uid = "";
				try {
					const uidValue = uni.getStorageSync('uid');
					if (uidValue) {
						uid = uidValue;
					}
				} catch (e) {
					// error
				}
				// 获取收货地址列表
				(async () => {
					let res = await this.$http({
						url: "/order/del_addr",
						data: {
							uid: uid,
							_id: id
						},
						method: "POST"
					});				
					if(res.data.code==1){
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
						this.addrs();
					}else{
						uni.showToast({
							title:res.data.msg,
							icon:"none"
						});
					}
				})();
			},
			toSetAddr(){
				uni.navigateTo({
					url: "pages/tabbar/me/address/setAddr"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background: #F1F1F1;
		height: calc(100vh - var(--window-bottom) - var(--status-bar-height));
		margin-top: var(--status-bar-height);

		.addr {
			background: #fff;
			width: 90%;
			overflow: hidden;
			margin: 20upx auto;
			border-radius: 10upx;

			button::after {
				border: none;
			}

			.uni-col {
				text-align: center;
				padding: 20upx 0px;
			}
		}
	}
</style>
