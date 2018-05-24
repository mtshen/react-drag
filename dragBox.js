/**
 * dragbox 拖拽容器
 * 提供了一个可拖拽的容器, 你可以自由的设置内容以及className和style
 * 同时提供了以下属性的设置
 * node: {clone | function} 默认为字符串 clone, 克隆你的容器, 进行拖拽操作, 
 *                          如果你希望拖拽的时候是你设定的样式, 可以设置一个回调函数, 在回调函数内返回一个元素即为可拖拽元素
 * dragstart: function      开始拖拽, 单纯的点击事件不会触发dragstart, 触发条件: 位置偏移超过了 20px
 * dragend: function        拖拽结束的回调函数
 * dragto: function         与拖拽结束类似, 但是只有在拖入某个元素后才会触发
 * dragout: function        拖拽出限定区域
 * outClass: className      拖拽限定区域
 * dragClass: className     拖拽到该元素中可以触发dragEnd
 */

import React, { Component } from 'react';
import './dragBox.css';

class DragBox extends Component {
    constructor() {
        super();

        // 初始化属性
        [
            // 拖拽容器
            this.element,
            this.dragElement,
            // 是否已经开始拖拽
            this.isStart,
            // 起始坐标
            this.startClientX,
            this.startClientY,
            // 当前坐标
            this.clientX,
            this.clientY,
            // 鼠标与元素的偏移值
            this.targetOffsetTop,
            this.targetOffsetLeft
        ] = [];
    }

    componentDidMount() {
        const box = this.refs.dragBox;
        this.element = box;

        // 为事件绑定this指向
        this.mousedown = this.mousedown.bind(this);
        this.mouseup = this.mouseup.bind(this);
        this.mousemove = this.mousemove.bind(this);

        // 初始化完成后添加事件
        box.addEventListener('mousedown', this.mousedown);
    }

    // 鼠标按下
    mousedown(event) {
        // 当鼠标按下时再绑定其他事件, 可以有效提高性能
        document.addEventListener('mouseup', this.mouseup);
        document.addEventListener('mousemove', this.mousemove);

        let {clientX, clientY} = event;
        this.startClientX = clientX;
        this.startClientY = clientY;
        
        // 得到鼠标偏移量
        let {scrollTop, scrollLeft} = document.documentElement;
        this.targetOffsetTop = clientY - (offsetTop(this.element) - scrollTop);
        this.targetOffsetLeft = clientX - (offsetLeft(this.element) - scrollLeft);
    }

    // 鼠标抬起
    mouseup(event) {
        // 鼠标离开时, 解除事件绑定
        document.removeEventListener('mouseup', this.mouseup);
        document.removeEventListener('mousemove', this.mousemove);
        this.startClientX = null;
        this.startClientY = null;
        this.targetOffsetTop = null;
        this.targetOffsetLeft = null;

        // 如果进行了拖拽, 则销毁拖拽元素
        if (this.isStart) {
            // 如果没有设置dragClass 则不触发运算
            const {dragClass, outClass, dragend, dragto, dragout} = this.props;
            let dragElementList = [], outElementList = [];
            if (dragClass) {
                dragElementList = this.getDragElementList(this.dragElement, dragClass);
            }

            // 触发拖拽结束事件
            if (typeof dragend === 'function') {
                dragend(event, dragElementList);
            }

            // 触发拖拽进入事件
            if (dragElementList.length && typeof dragto === 'function') {
                dragto(event, dragElementList);
            }

            // 触发拖出事件
            if (outClass && typeof dragout === 'function') {
                outElementList = this.getDragElementList(this.dragElement, outClass);
                if (!outElementList.length) {
                    dragout(event, document.querySelectorAll(outClass));
                }
            }

            document.body.removeChild(this.dragElement);
            document.body.classList.remove('react-drop-noselect');
            this.dragElement = null;
            this.isStart = false;
        }
    }

    // 获取与传入元素位置重叠的一组元素
    getDragElementList(element, className) {
        const elementList = document.querySelectorAll(className);
        const dragElementList = [];
        const elementPosition = findPosition(element);
        [...elementList].forEach(function(el) {
            const elPosition = findPosition(el);
            const overlap = (
                elementPosition[2] >= elPosition[0] && 
                elementPosition[3] >= elPosition[1] && 
                elementPosition[0] <= elPosition[2] && 
                elementPosition[1] <= elPosition[3]);
            if (overlap) {
                dragElementList.push(el);
            }
        });

        return dragElementList;
    }

    // 鼠标移动
    mousemove(event) {
        const { clientX, clientY } = event;
        const { startClientX, startClientY, targetOffsetTop, targetOffsetLeft, dragElement } = this;

        if (this.isStart) {
            dragElement.style.top = (clientY - targetOffsetTop) + 'px';
            dragElement.style.left = (clientX - targetOffsetLeft) + 'px';
        } else if (
            // 当偏移量达到某个值时(20PX), 则创建拖拽元素
            Math.abs(clientX - startClientX) >= 20 ||
            Math.abs(clientY - startClientY) >= 20
        ) {
            this.dragElement = this.createdragElement(clientX, clientY, targetOffsetTop, targetOffsetLeft);
            this.isStart = true;
            document.body.classList.add('react-drop-noselect');
            // 触发拖拽开始事件
            const dragstart = this.props.dragstart;
            if (typeof dragstart === 'function') {
                dragstart(event);
            }
        }
    }
    
    // 创建元素
    createdragElement(clientX = 0, clientY = 0, targetOffsetTop = 0, targetOffsetLeft = 0) {
        const { node } = this.props;
        let el;
        if (typeof node === 'function') {
            el = node(this.element);
        } else {
            el = this.element.cloneNode(true);
        }

        // 初始化设置拖拽的元素属性
        el.style.top = (clientY - targetOffsetTop) + 'px';
        el.style.left = (clientX - targetOffsetLeft) + 'px';
        el.classList.add('react-drop-box');
        
        // 添加到body中去
        document.body.appendChild(el);
        return el;
    }

    /**
     * 创建 DragBox, 每个DragBox都会继承传入的所有属性, 并且会自动加入react-drag-box标识符
     */
    render() {
        const { className, children, style } = this.props;
        return (<div className={className} ref='dragBox' style={style} react-drag-box='true'>{children}</div>);
    }
}

// 获取元素的offsetTop
function offsetTop(elements) {
    var top = elements.offsetTop;
    var parent = elements.offsetParent;
    while (parent != null) {
        top += parent.offsetTop;
        parent = parent.offsetParent;
    };
    return top;
};

// 获取元素的offsetLeft
function offsetLeft(elements) {
    var left = elements.offsetLeft;
    var parent = elements.offsetParent;
    while (parent != null) {
        left += parent.offsetLeft;
        parent = parent.offsetParent;
    };
    return left;
};


function findPosition(oElement) {
    let x2 = 0, 
        y2 = 0,
        width = oElement.offsetWidth,
        height = oElement.offsetHeight;
    if (typeof oElement.offsetParent !== 'undefined') {
        for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        x2 = posX + width;
        y2 = posY + height;
        return [posX, posY, x2, y2];

    } else {
        x2 = oElement.x + width;
        y2 = oElement.y + height;
        return [oElement.x, oElement.y, x2, y2];
    }
}

export default DragBox;
