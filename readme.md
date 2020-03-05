# Check if element is in viewport with Vue2.0+

## Install

```
npm i vue-on-screen
```

```

import vueOnScreen from 'vue-on-screen'
Vue.use(vueOnScreen)

```

## Add directive 'v-on-screen' to elements

### Example

```
<!--minShowHeight:展示最低多少的高度才算展示,100表示在屏幕内展示出100px的高度,才算该元素展示了, 默认为1 -->
<!--isForceHeight:isForceHeight 强制是否强制使用传入的高度,一般在元素是动态高度的时候需要传入,默认为false，表示计算 minShowHeight = Math.min(元素高度,minShowHeight) -->
<!--minShowWidth:展示最低多少的宽度才算展示,100表示在屏幕内展示出100px的宽度,才算该元素展示了 ,默认为1 -->
<!--isForceWidth:isForceWidth 强制是否强制使用传入的宽度,一般在元素是动态款固定的时候需要传入,默认为false，表示计算 minShowWidth = Math.min(元素宽度,minShowWidth), -->
<!--callbkParam:表示位置需要传给回调函数callbk的对象,和callbk配合使用,默认值{} -->
<!--callbk:当元素符合条件展示在页面内的时候回调函数，默认为空 -->
<!--once，vue的modifiers,可以仅回调一次，这个和onceenter表现一致。为了向前兼容。和callbk配合使用>
<!--onceenter，vue的modifiers,可以在该元素符合进入条件时回调一次。和callbk配合使用>
<!--onceexit，vue的modifiers,可以在该元素符合退出条件时回调一次。和callbk配合使用>
<!--always，vue的modifiers,页面滚动的时候总是执行回调。和callbk配合使用>
<div v-on-screen.onceenter="{
    minShowHeight:100,
    isForceHeight:true,
    minShowWidth:100,
    callbkParam:{
        index:2
    },
    callbk:onScreenCallbk
}">
    Content
</div>
```

```
funtion onScreenCallbk (e) {
    console.log(e.eventType) // 'enter' 'exit' 'process' 表示当前元素在屏幕的位置
    console.log(e.isInView) // 是否在页面内展示了
    console.log(e.isTopIn）// 是否顶部在页面内
    console.log(e.isBottomIn) //是否底部在页面内
    console.log(e.isLeftIn) //是否左边缘在页面内
    console.log(e.isRightIn) //是否右边缘在页面内
    console.log(e.onScreenHeigh) //展示出来的高度PX
    console.log(e.onScreenWidth) //展示出来的宽度Px
    console.log(e.heightPercentInView) //展示出来的高度占元素总高度的百分比
    console.log(e.widthPercentInView) //展示出来的宽度占元素总宽度的百分比
    console.log(e.isAbove) //是否在屏幕的顶部
    console.log(e.isBelow) //是否在屏幕的底部
    console.log(e.isLeft) //是否在屏幕的左边
    console.log(e.isRight) //是否在屏幕的右边
    console.log(e.rect) // 元素的getBoundingClientRect返回值
    console.log(e.target) //当前元素
    console.log(e.callbkParam) //自定义传入的回调参数
}
```