
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/tabbar/index/index","pages/tabbar/fenlei/fenlei","pages/tabbar/shopping/shopping","pages/tabbar/me/me","pages/tabbar/details/detail","pages/tabbar/me/orderAll/orderAll","pages/tabbar/me/edit/edit","pages/tabbar/me/set/set","pages/tabbar/me/address/address","pages/tabbar/goods/goodlist","pages/tabbar/me/login/login","pages/tabbar/me/login/reg","pages/tabbar/me/login/forget","pages/tabbar/me/login/updatePwd","pages/tabbar/me/login/smsLogin","pages/tabbar/details/comment","pages/tabbar/index/search","pages/tabbar/me/fav/fav","pages/tabbar/about/about","pages/tabbar/me/address/setAddr","pages/tabbar/order/order","pages/tabbar/me/connect/connect"],"window":{"navigationBarTextStyle":"black","navigationBarTitleText":"uni-app","navigationBarBackgroundColor":"#F8F8F8","backgroundColor":"#F8F8F8","navigationStyle":"custom"},"tabBar":{"borderStyle":"white","backgroundColor":"#fff","color":"#8F8F94","selectedColor":"#2f54eb","list":[{"pagePath":"pages/tabbar/index/index","iconPath":"static/img/tabbar/home.png","selectedIconPath":"static/img/tabbar/homeactive.png","text":"首页"},{"pagePath":"pages/tabbar/fenlei/fenlei","iconPath":"static/img/tabbar/fenlei.png","selectedIconPath":"static/img/tabbar/fenleiactive.png","text":"分类"},{"pagePath":"pages/tabbar/shopping/shopping","iconPath":"static/img/tabbar/shopping.png","selectedIconPath":"static/img/tabbar/shoppingactive.png","text":"购物车"},{"pagePath":"pages/tabbar/me/me","iconPath":"static/img/tabbar/me.png","selectedIconPath":"static/img/tabbar/meactive.png","text":"我"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"weex","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"创硕商城","compilerVersion":"3.2.15","entryPagePath":"pages/tabbar/index/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/tabbar/index/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationBarTitleText":"uni-app"}},{"path":"/pages/tabbar/fenlei/fenlei","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/tabbar/shopping/shopping","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/tabbar/me/me","meta":{"isQuit":true,"isTabBar":true},"window":{}},{"path":"/pages/tabbar/details/detail","meta":{},"window":{}},{"path":"/pages/tabbar/me/orderAll/orderAll","meta":{},"window":{}},{"path":"/pages/tabbar/me/edit/edit","meta":{},"window":{}},{"path":"/pages/tabbar/me/set/set","meta":{},"window":{}},{"path":"/pages/tabbar/me/address/address","meta":{},"window":{}},{"path":"/pages/tabbar/goods/goodlist","meta":{},"window":{}},{"path":"/pages/tabbar/me/login/login","meta":{},"window":{}},{"path":"/pages/tabbar/me/login/reg","meta":{},"window":{}},{"path":"/pages/tabbar/me/login/forget","meta":{},"window":{}},{"path":"/pages/tabbar/me/login/updatePwd","meta":{},"window":{}},{"path":"/pages/tabbar/me/login/smsLogin","meta":{},"window":{}},{"path":"/pages/tabbar/details/comment","meta":{},"window":{}},{"path":"/pages/tabbar/index/search","meta":{},"window":{}},{"path":"/pages/tabbar/me/fav/fav","meta":{},"window":{}},{"path":"/pages/tabbar/about/about","meta":{},"window":{}},{"path":"/pages/tabbar/me/address/setAddr","meta":{},"window":{}},{"path":"/pages/tabbar/order/order","meta":{},"window":{}},{"path":"/pages/tabbar/me/connect/connect","meta":{},"window":{}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
