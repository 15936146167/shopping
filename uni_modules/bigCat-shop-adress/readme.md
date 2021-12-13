# bigCat-shop-adress

自定义 收货地址选择 模态框组件

**使用方式：**

在 script 中引用组件

```javascript
import shopAdress from '@/components/shop-adress.vue';
export default {
    components: {shopAdress}
}
```

基础使用方式

```html
<shopAdress :adressShow="adressShow" :adressList="adressList" @cancelDialog="cancelDialog" @confirmDialog="confirmDialog" @addAddress = 'addAddress'></shopAdress>
```


**属性说明：**

|属性名	|类型		|默认值	|说明	|
|---	|----		|---	|---	|
|adressShow|Boolean||控制显示和隐藏	|
|adressList|Array||地址集合|


**事件说明：**

|事件名|说明		|
|cancelDialog|点击取消时触发事件|
|confirmDialog|点击确认按钮时触发事件|
|addAddress|点击添加地址按钮时触发事件|

|事件名称	|说明		|
|---	|----		|
|cancelDialog|点击取消时触发事件|
|confirmDialog|点击确认按钮时触发事件|
|addAddress|点击添加地址按钮时触发事件|


**其他**
* 使用过程出现问题或有新的需求可在评论区留言。
