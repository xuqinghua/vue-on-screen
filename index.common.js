/*!
  * vue-on-screen v1.0.6
  * (c) 2020 xuqinghua
  * @description verify dom is in screen
  * @license MIT
  */
'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dist = createCommonjsModule(function (module, exports) {
/**
 * 1.支持传参最小高度和最小宽度的
 * 2.支持宽度的判断
 * 3.支持更多的参数返回
 * 4.支持的更多特定事件回调
 */
function getPlugin() {
    var EventTypes = {
        Enter: 'enter',
        Exit: 'exit',
        Progress: 'progress'
    };
    //节流函数
    function throttle(handler, timeout) {
        if ( timeout === void 0 ) timeout = 0;

        if (!handler || typeof handler !== 'function') {
            throw new Error('handler必须是回调方法');
        }
        var timeoutTime = 0;
        return function (e) {
            if (timeoutTime) { return }
            timeoutTime = setTimeout(function () {
                timeoutTime = 0;
                handler(e);
            }, timeout);
        }
    }

    function createInstance(Vue, options) {

        var items = {},
            defaultCallBk = options.callbk || function(){},
            defaultMinShowHeight = options.minShowHeight || 1,
            defaultMinShowWidth =  options.minShowWidth || 1,
            scrollThrottledHandler = throttle(scrollHandler, 40);

        var scrollValue = window.pageYOffset,
            itemIndex = 0;


        window.addEventListener('scroll', function () {
            scrollThrottledHandler();
        });
        window.addEventListener('resize', function () {
            scrollThrottledHandler();
        });
        // window.addEventListener('touchmove',function(){
        //   //console.log('touchmove');
        //   scrollThrottledHandler();
        // });

        function scrollHandler(e) {
            var viewportTop = window.pageYOffset, //当前滚动的上下的距离
                viewportBottom = window.pageYOffset + window.document.documentElement.clientHeight,
                viewportLeft = window.pageXOffset, //左右滚动的距离
                viewportRight = window.pageXOffset + window.document.documentElement.clientWidth,
                viewportHeight = window.document.documentElement.clientHeight, //页面可视化窗口高度
                viewportWidth = window.document.documentElement.clientWidth, //页面可视化窗口宽度
                documentHeight = window.document.documentElement.scrollHeight; //页面全文高度
            //documentWidth = window.document.documentElement.scrollWidth, //页面宽度 暂时用不到
            //scrollPercent = roundPercent(window.pageYOffset / (documentHeight - viewportHeight)); //滚动的长度占可滚动高度的占比


            scrollValue = viewportTop - scrollValue; //当前滚动的值
            function getInType(i) {
                var element = i.element,
                    rect = element.getBoundingClientRect(),
                    elementTop = rect.top + viewportTop, //元素的顶部距离文档顶部的距离
                    elementBottom = elementTop + rect.height, //元素底部距离文档顶部的距离
                    elementLeft = rect.left + viewportLeft, //元素的左边距离文档的左边的距离
                    elementRight = elementLeft + rect.width; //元素的右边距离文档的左边的距离
                var elementHeight = element.offsetHeight;
                var elementWidth = element.offsetWidth;
                //console.log(element,rect);
                var minShowHeight = i.minShowHeight || defaultMinShowHeight, //最小展示高度 表示要超过该高度才算展示。小于这个高端算不展示
                    minShowWidth = i.minShowWidth || defaultMinShowWidth; //最小展示宽度 表示要超过该宽度才算展示。小于这个高端算不展示
                //如果指定的高度大于元素高度，则用元素的高度或者宽度，即表示元素完全暴露在屏幕内。
                //isForceHeight 强制是否强制使用传入的高度，isForceWidth 强制是否强制使用传入的宽度。为true表示不再和元素的高度或者宽度求最小值了。主要解决一些元素因为是动态插入的，导致初始的elementHeight是0或者很小。
                minShowHeight = minShowHeight > elementHeight && !i.isForceHeight ? elementHeight : minShowHeight;
                minShowWidth = minShowWidth > elementWidth && !i.isForceWidth ? elementWidth : minShowWidth;
                var isTopIn = false,
                    isTopInOnePixMore = false,
                    isBottomIn = false,
                    isBottomInOnePixMore = false,
                    isLeftIn = false,
                    isLeftInOnePixMore = false,
                    isRightIn = false,
                    isRightInOnePixMore = false;
                if (rect.top >= 0 && rect.height > 0 &&  rect.width > 0) { //顶部视口还没有贴到当前元素
                    isTopIn = viewportHeight - rect.top >= minShowHeight;
                    isTopInOnePixMore = viewportHeight - rect.top > 0; //表示已经进入了，且超过1像素。
                } else if(rect.height > 0 &&  rect.width > 0){ //已经有一部分消失在顶部了，剩余的是否足够算展示
                    isBottomIn = rect.top + elementHeight >= minShowHeight;
                    isBottomInOnePixMore = rect.top + elementHeight >= 0; //表示已经进入了，且超过1像素。
                }

                if (rect.left >= 0 && rect.height > 0 &&  rect.width > 0) {
                    isLeftIn = viewportWidth - rect.left >= minShowWidth;
                    isLeftInOnePixMore = viewportWidth - rect.left > 0; //表示已经进入了，且超过1像素。
                } else if(rect.height > 0 &&  rect.width > 0){
                    isRightIn = elementWidth + rect.left >= minShowWidth;
                    isRightInOnePixMore = elementWidth + rect.left > 0; //表示已经进入了，且超过1像素。
                }

                var isInView = false;
                var isInViewOnePixMore = false;
                if(rect && rect.height > 0 &&  rect.width > 0){ //如果元素高度和宽度为0 表示可能被 display:none;掉 所以理解不在屏幕内
                    isInView = (isTopIn || isBottomIn) && (isRightIn || isLeftIn);
                    isInViewOnePixMore = (isTopInOnePixMore || isBottomInOnePixMore) && (isRightInOnePixMore || isLeftInOnePixMore);
                }
                
                // 头部进入view viewportBottom - elementTop 
                // 底部进入view elementBottom - viewportTop
                var onScreenHeigh = isTopInOnePixMore || isBottomInOnePixMore ? ((isBottomInOnePixMore ? elementBottom : viewportBottom) - (isTopInOnePixMore ? elementTop : viewportTop)) : 0;
                var onScreenWidth = isLeftInOnePixMore || isRightInOnePixMore ? ((isRightInOnePixMore ? elementRight : viewportRight) - (isLeftInOnePixMore ? elementLeft : viewportLeft)) : 0;
                var heightPercentInView = parseFloat(onScreenHeigh / (rect.height || 1) || 0).toFixed(2),
                    widthPercentInView = parseFloat(onScreenWidth / (rect.width || 1) || 0).toFixed(2),
                    isAbove = heightPercentInView === 0 && rect.top <= 0, //是否在屏幕中顶部
                    isBelow = heightPercentInView === 0 && rect.top > 0, //是否在屏幕底部
                    isLeft = widthPercentInView === 0 && rect.left <= 0, //是否在屏幕左边
                    isRight = widthPercentInView === 0 && rect.top > 0; //是否在屏幕右边 
                var showResult = {
                    isInView: isInView,
                    isInViewOnePixMore: isInViewOnePixMore,
                    isTopIn: isTopIn,
                    isTopInOnePixMore: isTopInOnePixMore,
                    isBottomIn: isBottomIn,
                    isBottomInOnePixMore: isBottomInOnePixMore,
                    isLeftIn: isLeftIn,
                    isLeftInOnePixMore: isLeftInOnePixMore,
                    isRightIn: isRightIn,
                    isRightInOnePixMore: isRightInOnePixMore,
                    onScreenHeigh: onScreenHeigh,
                    onScreenWidth: onScreenWidth,
                    heightPercentInView: heightPercentInView,
                    widthPercentInView: widthPercentInView,
                    isAbove: isAbove,
                    isBelow: isBelow,
                    isLeft: isLeft,
                    isRight: isRight,
                    rect: rect
                };
                //console.log(showResult)
                return showResult;
            }

            for (var id in items) {
                var i = items[id],
                    returnInType = getInType(i),
                    inViewChange = !i.isInView && returnInType.isInView,
                    outViewChange = i.isInView && !returnInType.isInView;

                //if (!i.isInView && !returnInType.isInView) continue //当前没有，前一个状态也没有在屏幕内 直接返回
                i.rect = returnInType.rect;

                var eventType = (inViewChange && EventTypes.Enter) || (outViewChange && EventTypes.Exit) || EventTypes.Progress;
                var param = Object.assign(returnInType, {
                    eventType: eventType,
                    target: i,
                    callbkParam: i.callbkParam || {}
                });
                if (typeof i.onceenter === 'function' && eventType === EventTypes.Enter) {
                    i.onceenter(param);
                    delete i.onceenter;
                } else if (typeof i.onceexit === 'function' && eventType === EventTypes.Exit) {
                    i.onceexit(param);
                    delete i.onceexit;
                } else if (typeof i.always === 'function') {
                    i.always(param);
                } else if (typeof i.handler === 'function' && returnInType.isInView) { //在屏幕内就调用
                    i.handler(param);
                }
                i.isInView = returnInType.isInView;
            }

            scrollValue = viewportTop;
        }

        Vue.directive('on-screen', {
            unbind: function (element, bind) {
                delete items[element.$scrollId];
            },
            inserted: function (element, bind) {
                var id = element.$scrollId || ('scrollId-' + itemIndex++),
                    item = items[id] || {
                        element: element,
                        classes: {},
                        percent: -1,
                        rect: {}
                    };
                //console.log(defaultCallBk);
                //bind的value 支持 对象
                var bValue = bind.value;
                if (bind.modifiers && (bind.modifiers.once || bind.modifiers.onceenter)) { //进入只执行一次
                    item.onceenter = bValue.callbk || defaultCallBk;
                }
                if (bind.modifiers && bind.modifiers.onceexit) { //退出调用一次
                    item.onceexit = bValue.callbk|| defaultCallBk;
                }
                if (bind.modifiers && bind.modifiers.always) { //总是调用,不管在不在屏幕内
                    item.always = bValue.callbk|| defaultCallBk;
                }
                if (!bind.modifiers.once && !bind.modifiers.onceenter && !bind.modifiers.onceexit && !bind.modifiers.always) {
                    item.handler = bValue.callbk|| defaultCallBk;
                }
                //minShowHeight要考虑底部tab导航被遮挡的问题高度。
                Object.assign(item, bValue);
                // item.minShowHeight = bValue.minShowHeight || 0;
                // item.minShowWidth = bValue.minShowWidth || 0;
                // item.minShowWidth = bValue.minShowWidth || 0;
                // item.callbkParam = bValue.callbkParam || {}; //用于回调的入参
                element.$scrollId = id;
                items[id] = item;
                scrollThrottledHandler();
            }
        });
    }

    return {
        install: function (Vue, options) {
            Vue.directive('on-screen', Vue.prototype.$isServer ? {} : createInstance(Vue, options || {}));
        }
    }
}

{
    module.exports = getPlugin();
}
});

module.exports = dist;
