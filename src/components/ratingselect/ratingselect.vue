<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="block positive" @click="select(2,$event)" :class="{'active':selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span class="block positive" @click="select(0,$event)" :class="{'active':selectType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span class="block negative" @click="select(1,$event)" :class="{'active':selectType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
      // 需要一些评价数据才能完成评价组件
      props: {
          ratings: {
              type: Array,
              default() {
                  return [];
              }
          },
          // 全部，满意，不满意
          selectType: {
              type: Number,
              default: ALL // 默认情况时ALL,值等于2
          },
          onlyContent: { // 只看有内容的评价还是所有的评价
              type: Boolean,
              default: false // 设置为可以看到所有的评价
          },
          desc: { // 描述
              type: Object,
              default() { // 默认desc是这三种，在商品详情页的时候传入推荐或者吐槽
                  return {
                      all: '全部',
                      positive: '满意',
                      negative: '不满意'
                  };
              }
          }
      },
      computed: {
          positives() { // 对应所有正向评价的数组
              return this.ratings.filter((rating) => {
                  return rating.rateType === POSITIVE;
              });
          },
          negatives() {
              return this.ratings.filter((rating) => {
                  return rating.rateType === NEGATIVE;
              });
          }
      },
      methods: {
          select (type, event) { // 点击的时候外层是有一个BScroll的，所以要传递event阻止默认点击
              if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
                  return;
              }
              // 将this.selectType设置成传入的参数,而不是food传过来的初始化的值，之后样式就可以随着点击改变了
              this.selectType = type;
              // 派发事件通知父组件food.vue selectType的改变,将type值传出去
              // this.$emit('se-type', type);
              this.$emit('increment', 'selectType', this.selecttype);
          },
          toggleContent (event) {
              if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
                  return;
              }
              this.onlyContent = !this.onlyContent;
              // this.$emit('toggle-content', this.oContent);
              this.$emit('increment', 'onlyContent', this.onlyContent);
          }
      }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px //保证横线的长度
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block //没有写文字的时候是没有被撑开的
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        line-height 16px
        font-size 12px
        color rgb(77,85,93)
        &.active  // block的active要设置一下
          color #ffffff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0,160,220,.2)
          &.active
            background rgb(0,160,220)
        &.negative
          background  rgba(77,85,93,0.2)
          &.active
            background  rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      &.on
        .icon-check_circle
          color #00c850
      .icon-check_circle
        margin-right 4px
        display inline-block
        vertical-align top
        font-size 24px
      .text
        display inline-block
        vertical-align top
        font-size 12px
</style>
