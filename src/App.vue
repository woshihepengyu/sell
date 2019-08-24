<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 此处挂载的是商品、评论和商家的内容 -->
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <!-- 切换界面时会闪现，是因为界面被重新渲染了，声明周期被重新执行了一遍，我们希望切换组件的时候，
         组件之前的状态也能被保留，vue中提供  router切换组件保留的功能，keeplive，在APP.vue中添加 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
    import header from 'components/header/header';
    import {urlParse} from './common/js/util';

    const ERR_OK = 0;

    export default {
        data() {
            return {
                seller: {
                    // 每一个商家都有一个唯一的id，这个id存在url中，所以封装一个函数，将url解析成对象的模式
                    id: (() => {
                        let queryParam = urlParse();
                        // console.log(queryParam);
                        return queryParam.id;
                    })()
                }
            };
        },
        created() {
            // ajax地址
            this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
                // response是一个属性，将其转化为json对象
                response = response.body;
                if (response.errno === ERR_OK) {
                    // 数据在data字段中,将seller对象传给header组件，通过:seller
                    // this.seller = response.data;
                    // 给seller扩展属性
                    this.seller = Object.assign({},this.seller,response.data);
                    console.log(this.seller.id);
                }
            });
        },
        components: {
            // 表示vue组件 与header区分开
            'v-header': header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import './common/stylus/mixin.styl';
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))

    .tab-item
      flex: 1
      text-align: center

      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        // 配置超链接active时变色

        &.active
          color: rgb(240, 20, 20)
</style>
