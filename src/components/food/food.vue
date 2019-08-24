<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{ food.name }}</h1>
          <div class="detail">
            <span class="sell-count">月售{{ food.sellCount }}</span>
            <span class="rating">好评率{{ food.rating }}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{ food.price }}</span>
            <span v-show="food.oldPrice" class="old">￥{{ food.oldPrice }}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{ food.info }}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <!-- v-show="needShow(rating.rateType, rating.text)" -->
              <li  v-show="needShow(rating.rateType, rating.text)" v-for="rating in food.ratings" class="ratings-item border-1px" :key="rating.id">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" height="12" width="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType === 0, 'icon-thumb_down':rating.rateType === 1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Vue from 'vue';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import split from '../split/split';
    import ratingselect from '../ratingselect/ratingselect';
    import {formatDate} from '../../common/js/date';
    const POSITIVE = 0;
    const NEGATIVE = 1;
    const ALL = 2;

    export default {
        props: {
            food: {
                type: Object
            }
        },
        components: {
            cartcontrol,
            split,
            ratingselect
        },
        events: {
            'ratingtype.select'(type) {
                this.selectType = type;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            },
            'content.toggle'(onlyContent) {
                this.onlyContent = onlyContent;
                this.$nextTick(() => {
                    this.scroll.refresh();
                });
            }
        },
        // 日期格式化
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        data() {
            return {
                showFlag: false,
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '推荐',
                    negative: '吐槽'
                }
            };
        },
        methods: {
            needShow(type, text) {
                if (this.onlyContent && !text) {
                    return false;
                }
                if (this.selectType === ALL) {
                    return true;
                } else {
                    return type === this.selectType;
                }
            },
            // 所以在界面展示的时候，对betterScroll进行初始化，即在show函数中进行初始化
            show() {
                this.showFlag = true;
                // 初始化部分，ratingselect组件是被被不同的商品使用的，所以我们希望在点开不同的商品时，能有一样的初始化状态
                this.selectType = ALL;
                this.onlyContent = false;
                // 展示界面时用到BScroll
                this.$nextTick(() => {
                    if (!this.scroll) {
                        this.scroll = new BScroll(this.$refs.food, {
                            click: true // 可以被点击
                        });
                    } else {
                        this.scroll.refresh();
                    }
                });
            },
            hide() {
                this.showFlag = false;
            },
            addFirst(event) {
                if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
                    return;
                }
                // 第一次的时候el消失，找不到小球发出的其实位置，所以第一次小球动画消失
                // 解决办法就是将购物车的消失做成一个动画，而不是立马display:none
                // 添加的时候添加小球动画，派发事件，之后goods.vue就可以监听到cart-add，并传递给shopcart.vue
                this.$emit('cart-add', event.target);
                Vue.set(this.food, 'count', 1); // 初始化this.food.count = 1;
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed;
    left 0;
    top 0
    bottom 48px
    z-index 30
    width 100%
    background #fff
    &.move-enter-active, &.move-leave-active
      transition all .3s linear //为动画过程添加缓动和最终状态
      transform translate3d(0,0,0)
    &.move-enter, &.move-leave-active
      opacity 0
      transform translate3d(100%, 0, 0) //动画x轴方向移动
    .image-header
      position relative
      width 100%
      height 0
      padding-top 100% // 百分比是相对于盒子的宽度来计算的，看起来就像是一个正方形
      img
        position absolute
        left 0
        top 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px // 图片不要变大，但是点击区域会扩大
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700px
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        height 10px
        line-height 10px
        font-size 0 // 因为后面两个span是inline-block布局
        .sell-count, .rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
          margin-right 12px
      .price
        line-height 24px
        font-weight: 700
        .now
          margin-right 8px
          font-size 14px
          color rgb(240,20,20)
        .old
          text-decoration line-through
          color rgb(147,153,159)
          font-size 10px

    .cartcontrol-wrapper
      position absolute
      right 12px
      bottom 12px
    .buy
      position absolute
      right 18px
      bottom 18px
      z-index 10 // 要盖住加减号组件
      height 24px
      line-height 24px
      padding 0 12px
      box-sizing border-box
      font-size 10px
      border-radius 10px
      color #fff
      background rgb(0,160,220)
      &.fade-enter-active, &.fade-leave-active
        transition all 0.2s
        opacity 1
      &.fade-enter, &fade-leave-active
        opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 16px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating // 因为要在rating title下方画一条横线，所以不能用padding-left，改用title的margin代替
      padding-top: 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .ratings-item
          position relative
          padding 16px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
              margin-right 6px
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
          .no-ratings
            padding 16px 0
            font-size 12px
            color rgb(147,153,159)
</style>
