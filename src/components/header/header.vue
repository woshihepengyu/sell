<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <!-- 一开始是不存在的 所以用vue:bundle -->
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- data.json中显示support是一个数组,支持减免等活动,异步过程获取的support为undefined,所以用v-if判断 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <!-- 当我们点击按钮的时候，图层出现-->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 弹出图层，固定在上方，并通过v-show来控制弹出的隐藏-->
    <!-- https://cn.vuejs.org/v2/guide/transitions.html-->
    <transition name="slide-fade">
    <div v-show="detailShow" class="detail" transition="fade">
      <!-- 清除浮动-->
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports" :key="(item.id,index.id)">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        // vue在实例化的时候会去遍历data里的对象，并去给对象添加getter和setter
        data() {
            return {
                detailShow: false // 在data中添加detailShow并初始化，默认不展示图层
            };
        },
        methods: {
            showDetail() {
                this.detailShow = true; // 点击按钮detailShow显示为true，即显示隐藏的界面
            },
            hideDetail() {
                this.detailShow = false;
            }
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        // 注册组件为子组件
        components: {
            star
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  /*引入style库不能再package.json中配置script，那个配置只适用js库*/
  @import "../../common/stylus/mixin.styl";
  /*设置左右两栏为inlin-block时，左右两栏中间有空隙，这时，设置其fuyu父元素的font-size ： 0
  即可消除缝隙，在子元素中再重新设置font-size，span不可设置宽高，在mixin中定义2x和3x图片，不要忘了在当前目录下引入图片*/
  .header
    position: relative
    color: #fff
    background: rgba(7, 17, 27, 0.5)

    .content-wrapper
      /*上右下左*/
      padding: 24px 12px 18px 24px
      position: relative

      .avatar
        display: inline-block
        /*图片与文字顶部对齐*/
        vertical-align: top

        img
          border-radius: 2px

      .content
        display: inline-block
        margin-left: 16px
        font-size: 14px

        .title
          margin: 2px 0 8px 0

          .brand
            display: inline-block
            width: 30px
            height: 18px
            bg-image('brand') /* 区分2x和3x图片，在mixin.styl中定义bg-image图片 */
            background-repeat: no-repeat
            background-size: 30px 18px
            /* 设置图片与文字对其方式 */
            vertical-align: top

          .name
            margin-left: 6px
            font-size 16px
            line-height 18px
            font-weight bold

        .support
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 4px
            vertical-align: top /* 设置对其方式 */
            background-size: 12px
            background-repeat: no-repeat

            &.decrease
              bg-image('decrease_1')

            &.discount
              bg-image('discount_1')

            &.guarantee
              bg-image('guarantee_1')

            &.invoice
              bg-image('invoice_1')

            &.special
              bg-image('special_1')

            .text
              line-height: 12px
              font-size: 10px /* 父类定义了font-size：0，这里要重新定义字体才能显示*/
              vertical-align: top

      /* 设置对其方式 */

      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background-color: rgba(0, 0, 0, .2)
        text-align: center

        .count
          font-size: 10px
          vertical-align: top

        .icon-keyboard_arrow_right
          font-size: 10px
          margin-left: 2px
          line-height 24px

    /* line-height默认为1，垂直居中的话 要重写一下*/

    .bulletin-wrapper
      background-color: rgba(7, 17, 27, 0.2)
      position relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap /* 文本不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止*/
      overflow: hidden /* 内容会被修剪，并且其余内容是不可见的。*/
      text-overflow: ellipsis /*显示省略符号来代表被修剪的文本。*/
      background: rgba(7, 17, 27, 0.2)

      .bulletin-title
        display: inline-block /* span */
        width: 22px
        height: 12px
        bg-image('bulletin');
        margin-top 8px
        vertical-align top
        background-size: 22px 12px

      .bulletin-text
        font-size: 10px
        vertical-align: top

      /*把元素的顶端与行中最高元素的顶端对齐*/

      .icon-keyboard_arrow_right
        position absolute
        top: 0px
        right: 12px
        font-size: 10px
        line-height: 28px

    /*设置数字，此数字会与当前的字体尺寸相乘来设置行间距。*/

    .background /* header部分背景图的实现，z-index设为-1即可 */
      position absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1 /*设置元素的堆叠顺序。一个层在所有层的下面当背景 ; 值大的在上面，值小的就会被覆盖，实际开发中弹出模态框就会常用到这个*/
      /* 模糊效果 给图像设置高斯模糊。"radius"一值设定高斯函数的标准差，或者是屏幕上以多少像素融在一起，
       所以值越大越模糊；如果没有设定值，则默认是0；这个参数可设置css长度值，但不接受百分比值*/
      filter: blur(10px)

    .detail
      position: fixed /*生成绝对定位的元素，相对于浏览器窗口进行定位。*/
      top: 0
      left: 0
      z-index: 100
      width: 100%
      height: 100%
      overflow: auto
      backdrop-filter: blur(10px)
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      transition all 0.9s
      &.fade-transition
        opacity 1
         background rgba(7,17,27,0.8)
      &.fade-enter,&.fade-leave
        opacity 0
        background rgba(7,17,27,0)
      .detail-wrapper /* 外层容器*/
        width : 100%
        min-height : 100%
        .detail-main /* 除close按钮意外的内容区*/
          margin-top : 64px
          /* detail-wrapper和detail-close平级构成detail内容页，但是detail-wrapper
            中的detail-main要在底部留出64px的空间来盛放close符号 即内容没有满屏的话要将close上移 */
          padding-bottom: 64px
          .name
            line-height: 16px
            font-size: 16px
            text-align: center
            font-weight: 700
          .star-wrapper
            margin-top 18px
            padding 2px 0
            text-align center
          .title
            display flex /* postcss 工具 给有兼容性问题的css属性自动添加兼容性代码 */
            width 80%
            margin 28px auto 24px auto
            .line
              flex 1 /* 等分 */
              position relative
              top -6px
              border-bottom 1px solid rgba(255,255,255,0.2)
            .text
              padding 0px 12px
              font-size 16px
              font-weight 700px
          .supports
            width 80%
            margin 22px auto
            .support-item
              padding 0 12px
              font-size 0px
              margin-bottom 12px
              &:last-child
                margin-bottom 0px
              .icon
                display inline-block
                width 16px
                height 16px
                vertical-align top
                margin-right 6px
                background-size 16px 16px
                background-repeat no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height 16px
                font-size 12px
                color #ffffff

          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px
        .detail-close
          position: relative
          width: 32px
          height: 32px
          margin: -64px auto 0 auto /* 对应padding-bottom*/
          font-size: 14px
          clear both
    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
      transition: all .4s ease;
    }
    .slide-fade-leave-active {
      transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .slide-fade-enter, .slide-fade-leave-to{
      /* .slide-fade-leave-active for below version 2.1.8 */
      transform: translateX(10px);
      opacity: 0;
    }
</style>
