# 基于react的拖拽容器组件 react-drag 1.1
react-drag提供了一个可拖拽的容器, 你可以自由的设置内容以及className和style
---
### 可用的属性及方法
属性名 | 类型 | 默认 | 说明
-|-|-|-
node | string 或 function | 'clone' | 拖拽元素设置, 默认克隆你的元素, 如果你希望拖拽的时候是你设定的样式, 可以设置一个回调函数, 在回调函数内返回一个元素即为可拖拽元素
dragClass | string | '' | 传入一个css选择器, 如果拖拽入指定的元素即可触发 dragto 事件
outClass | string | '' | 传入一个css选择器, 如果拖出指定的元素即可触发 dragout 事件
dragstart |function | | 开始拖拽的回掉函数, 单纯的点击事件不会触发dragstart, 触发条件: 位置偏移超过了 20px
dragend | function | | 拖拽结束的回调函数, 当你设置了`dragClass`属性时, 该回掉函数的第二个参数会包含拖拽到的元素
dragto | function | | 如果拖拽入dragClass指定的元素, 则触发
dragout | function | | 如果拖拽出outClass指定的元素, 则触发

### outClass
当你想利用`outClass`特性时需要注意, 当你的元素拖出所有`outClass`匹配的元素才会触发`dragout` 

## 引入
引入使用`import DropBox from './dragBox'` 即可

## 这里是一个示例
```js
import React from 'react';
import ReactDOM from 'react-dom';
import DropBox from './dragBox';
ReactDOM.render(
    <DropBox className="dropDemo" dragClass=".on" 
        dragstart={function() {
            console.log('拖拽开始');
        }} 
        dragend={function(event, nodeList) {
            console.log('拖拽结束');
            console.log('拖拽到了元素 =>', nodeList);
        }}>
    拖拽容器测试</DropBox>, document.getElementById('root'));
```