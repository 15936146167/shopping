import App from './App.vue'
import {router,RouterMount} from './router/router.js'  //路径换成自己的
Vue.use(router)

// #ifndef VUE3
import Vue from 'vue'
import {http} from 'http/http.js'  //由于不是全部抛出，所以要用{http},全部抛出是export default{},就不用加大括号

Vue.prototype.$http=http;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})





// 拦截器
uni.addInterceptor('request', {
  invoke(args) {
    // request 触发前拼接 url 
    args.header = {};
	let token="";
	try {
	    const value = uni.getStorageSync('token');
	    if (value) {
			token=value;
	    }
	} catch (e) {
	    // error
	}
	args.header.token=token;
  },
  success(args) {
    // 请求成功后，修改code值为1
    /* args.data.code = 1 */
	// 30203登录过期
	if(args.data.code==30203){
		uni.showToast({
			title:"登录过期，请重新登录",
			icon:"none"
		});
		uni.navigateTo({
			url:'/pages/tabbar/me/login/login'
		})
	}
  }, 
  fail(err) {
    /* console.log('interceptor-fail',err); */
  }, 
  complete(res) {
    /* console.log('interceptor-complete',res) */
  }
})


//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	//为了兼容小程序及app端必须这样写才有效果(不适应手机端)
	/* app.$mount(); */
// #endif

app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
