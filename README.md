# react-drag
基于react的拖拽容器组件
react-drag提供了一个可拖拽的容器, 你可以自由的设置内容以及className和style
同时提供了以下属性的设置
- node :默认为字符串 clone, 克隆你的容器, 进行拖拽操作, 如果你希望拖拽的时候是你设定的样式, 可以设置一个回调函数, 在回调函数内返回一个元素即为可拖拽元素
- dragstart :开始拖拽的回掉函数, 单纯的点击事件不会触发dragstart, 触发条件: 位置偏移超过了 20px
- dragend :拖拽结束的回调函数, 当你设置了`dragClass`属性时, 该回掉函数的第二个参数会包含拖拽到的元素
- dragClass :传入一个CSS选择器, 作为可接受放置的元素选择器, 拖拽到匹配的元素中中可以触发`dragEnd`回掉函数的第二个参数变化

## 引入
引入使用`import DropBox from './dragBox'` 即可

## 使用
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