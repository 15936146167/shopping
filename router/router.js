// router.js
import {RouterMount,createRouter} from 'uni-simple-router';

const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,  
	routes: [...ROUTES]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	let token="";
	try {
	    const value = uni.getStorageSync('token');
	    if (value) {
			token=value;
	    }
	} catch (e) {
	    // error
	}
	if(token){
		next();
	}else{
		if(to.path==="/pages/tabbar/me/login/login"||to.path==="/pages/tabbar/me/login/reg"||to.path==="/pages/tabbar/me/login/forget"||to.path==="/pages/tabbar/me/login/smsLogin"){
			next();
		}else{
			next("/pages/tabbar/me/login/login");
		}
	}
	
});
// 全局路由后置守卫
router.afterEach((to, from) => {
    console.log('跳转结束')
})

export {
	router,
	RouterMount
}