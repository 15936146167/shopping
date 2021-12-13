# 文档 
### cell props

| 属性 | 说明	| 类型 | 默认值 |
| --- | ---- | ----- | ---- |
|cellkey	|组件key起标识作用|	String|	- |
|iconsrc	|左边图标(可以是图片也可以是字体图标)	|String|	- |
|title	|标题|	String	|-|
|titlecolor	|标题颜色	|String|	- |
|label	|文本描述	|String|	- |
|labelcolor|	文本描述颜色|String|	- |
|mun	|数字	|String|	- |
|muncolor	|数字颜色	|String|	- |
|munbgcolor	|背景色	|String|	- |
|iconcolor	|右边图标颜色	|String|	- |
|icontype	|右边图标类型	|String|	icon 或 switch  |
|ischecked |右边图标如果是switch有效	|	Boolean |false |


### cell events
switchvalue

|事件名	|说明	|返回值|
| --- | ---- | ----- |
|switchvalue	|获取当前开关的值|	cellkey,当前值|
|changeview|	点击cell回调 	|cellkey|


### 使用例子：
 1.在 main 引用注册
 import xsbCell from 'components/xsb-cell/cell.vue'
 Vue.component('xsb-cell',xsbCell)
 
 2.在对应页面
 <xsb-cell title='adddddddddddddddddd' />

