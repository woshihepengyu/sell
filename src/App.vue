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
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
    import header from 'components/header/header';

    const ERR_OK = 0;

    export default {
        data() {
            return {
                seller: {}
            };
        },
        created() {
            // ajax地址
            this.$http.get('/api/seller').then((response) => {
                // response是一个属性，将其转化为json对象
                response = response.body;
                if (response.errno === ERR_OK) {
                    // 数据在data字段中,将seller对象传给header组件，通过:seller
                    this.seller = response.data;
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
