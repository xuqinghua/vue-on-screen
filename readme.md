# Check if element is in viewport with Vue2.0+

## Install

```
npm i vue-on-screen
```

```

import vueOnScreen from 'vue-on-screen'
Vue.use(vueOnScreen)

```

## Add directive 'on-screen' to elements

### Example

```
<!--minShowHeight:展示最低多少的高度才算展示,100表示在屏幕内展示出100px的高度,才算该元素展示了默认为1 -->
<!--minShowHeight:展示最低多少的宽度才算展示,100表示在屏幕内展示出100px的宽度,才算该元素展示了默认为1 -->
<!--callbkParam:表示位置需要传给回调函数callbk的对象,和callbk配合使用,默认值{} -->
<!--callbk:当页面触发scroll 和resize的时候回调函数，默认为空 -->
<!--once，vue的modifiers,可以仅回调一次。和callbk配合使用>
<div v-on-sreen.once=="{
    minShowHeight:100,
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
    console.log(e.isInView) // 是否在页面内展示了
    console.log(e.isTopIn）// 是否顶部在页面内
    console.log(e.isBottomIn) //是否底部在页面内
    console.log(e.isLeftIn) //是否左边缘在页面内
    console.log(e.isRightIn) //是否右边缘在页面内
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