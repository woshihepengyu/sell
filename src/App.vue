<template>
  <div>
    <v-header></v-header>
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

<script>
    import header from 'components/header/header';

    export default {
        components: {
            // 表示vue组件 与header区分开
            'v-header': header
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px

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
