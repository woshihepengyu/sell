![doodles](https://www.google.com/logos/doodles/2016/teachers-day-2016-us-6296626244091904.2-hp2x.gif)

----
[![码云Gitee](https://gitee.com/binary/weixin-java-tools-springmvc/badge/star.svg?theme=blue)](https://gitee.com/binary/weixin-java-tools-springmvc)
[![Github](http://github-svg-buttons.herokuapp.com/star.svg?user=Wechat-Group&repo=weixin-java-demo-springmvc&style=flat&background=1081C1)](https://github.com/Wechat-Group/weixin-java-demo-springmvc)
[![Build Status](https://travis-ci.org/Wechat-Group/weixin-java-demo-springmvc.svg?branch=master)](https://travis-ci.org/Wechat-Group/weixin-java-demo-springmvc)


# sell
<<<<<<< HEAD
vue project for sell
=======

> sell app

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
>>>>>>> first stable version commit
#2.0
>npm run build 生成项目下dist文件内容
>index.js文件中：
>build: {
     // Template for index.html
     index: path.resolve(__dirname, '../dist/index.html'),
     port: 9000,  // 指定端口
 
     /**
      * Source Maps
      */
     // false 压缩的文件少很多 不允许js调试
     productionSourceMap: true,
     ......
}
>node prod.server.js 启动服务运行
>http://localhost:9000/?id=123#/goods
>>>>>>>
>>>>#2.0变化
#v-for指令 => 加key

#v-el、v-ref变化 =>  ref="......"

#模板变化 组件只允许一个根元素 可以尝试加一层大的div包裹

#组件通信变化$dispatch废除  => $emit('cart-add', event.target) 父组件@cart-add来获取数据

#keep-alive属性变为<keep-alive>
  
#transition属性升级为组件
