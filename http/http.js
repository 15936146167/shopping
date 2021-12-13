const BASE_URL = 'https://58050afe-7051-4051-8799-241e6f77dfa3.bspapp.com/http';   //定义自己的域名（绑定的云函数域名）
export function http(arg){                                                           //抛出一个http函数，arg是一个对象
	return new Promise((resolve,reject)=>{                                          //创建一个Promise()构造函数  三个状态 pending: 等待中 resolved: 成功  rejected: 失败
		uni.showLoading({															
			title:"加载中..."
		})
		uni.request({
			url:BASE_URL + arg.url,
			data:arg.data || {},
			method:arg.method || "GET",
			success:(res)=>{
				if(res.statusCode !== 200){
					uni.showToast({
						title:"接口请求失败",
						icon:"none"
					})
				}
				resolve(res)
			},
			fail:(err)=>{
				uni.showToast({
					title:"网络请求失败",
					icon:"none"
				})
				reject(err)
			},
			complete:()=>{
				uni.hideLoading()
				uni.stopPullDownRefresh()
			}
		})
	})
}