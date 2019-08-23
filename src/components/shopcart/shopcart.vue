<template>
  <!-- shopcart是goods组件的一部分，要将其引入到goods组件中,template下只能有一个div，所以添加一个div做最外层 -->
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList"> <!--  详情界面-->
        <div class="content-left">
          <div class="logo-wrapper">
            <!-- 购物车上方圆角商品个数的添加，直接引用food.count进行累加 -->
            <div class="logo" :class="{'highlight': totalCount > 0}">
              <i class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></i>
            </div>
            <!-- 购物车中有东西时才出现 -->
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <!-- 当total>0时，购物车totalPrice颜色改变，在css中添加相应的highlight样式 -->
          <div class="price" :class="{'highlight': totalCount > 0}"> ￥{{totalPrice}}元</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <!-- 点击去结算,结算过后因为事件冒泡的原因（pay按钮是content详情界面的子节点），详情列表会被展开，用stop.prevent阻止事件冒泡-->
        <div class="content-right" @click.stop.prevent="pay">
          <!-- 右下角三种情况：（）元起送，还差（）起送，去结算，payDesc(){return}实现 -->
          <div class="pay" :class="payClass"> <!-- 在这里做一个状态的判断 可以结算的时候背景变颜色-->
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls" :key="ball.id">
          <transition name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div v-show="ball.show" class="ball">
              <div class="inner inner-hook">
              </div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fade">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" :key="food.id">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food"></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
      <!-- listShow表示当list详情列表显示的时候mask才显示 -->
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol';

    export default {
        components: {cartcontrol},
        props: {
            selectFoods: { // 保存一个被选择商品的数组,包括被选择商品的单价和数量
                type: Array,
                default() { // 当type是一个数组时，defalut就是一个函数
                    return [
                        {
                            price: 10,
                            count: 1
                        }
                    ];
                }
            },
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            }
        },
        // ball-container中存放小球，小球的状态存放在一个数组中，初始状态都是隐藏的
        data() {
            return {
                balls: [{ // 每一个成员都用来维护当前小球的状态,初始状态都是隐藏的
                    show: false
                },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    },
                    {
                        show: false
                    }],
                // 添加一个变量，用来存贮已经下落的小球
                dropBalls: [],
                fold: true // 购物车详情列表默认折叠
            };
        },
        computed: {
            totalPrice() { // 计算总价格
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() { // 计算被选中商品的数量
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            // 右侧结算部分有三种状态，（）元起送，还差（）元起送，结算，状态的描述依赖于selectFoods的变化，
            // 用payDesc来描述,返回一个描述
            payDesc() {
                if (this.totalCount === 0) { // 不要忘了加this
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;// 忘了加this
                    return `还差￥${diff}元起送`;// 不要忘了加$
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow: {
                get: function () {
                    if (!this.totalCount) { // 如果选择食品数量为 0 ，则不显示
                        return false;
                    }
                    return this.fold;
                },
                set: function () {
                    // 没有商品时为折叠状态
                    if (!this.totalCount) {
                        this.fold = false;
                        // return false;
                    }
                    // 有商品的时候以变量show做状态切换
                    // fold为true(折叠)则show为false(折叠)，fold为false(展开)，则show为true(展开);
                    // 这样，show就跟v-show的true和false状态同步了，变为true时展开，false时折叠
                    let show = !this.fold;
                    if (show) {
                        this.$nextTick(() => {
                            if (!this.scroll) {
                                this.scroll = new BScroll(this.$refs.listContent, {
                                    click: true
                                });
                            } else {
                                this.scroll.refresh();
                            }
                        });
                    }
                    return show;
                }
            }
        },
        methods: {
            drop(el) {
                // console.log(el); //验证是否能正确输出
                // 遍历balls，拿到第一个show为false的球，做一个动画
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) { // show为false的球
                        ball.show = true; // 小球下落
                        ball.el = el;// 保留当前的DOM对象，用来计算位置
                        this.dropBalls.push(ball); // dropBalls存的是已经下落的小球,后续要对已经下落的小球进行处理
                        return;
                    }
                }
            },
            // 定义三个钩子函数实现动画
            beforeEnter(el) {
                // el为当前执行transition动画的DOM对象
                // 先找到所有为true的小球（连续点击的情况）
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) { // 这个是要运动的小球true
                        let rect = ball.el.getBoundingClientRect();// 获得元素相当于视口的位置
                        let x = rect.left - 32;
                        let y = -(window.innerHeight - rect.top - 22);
                        el.style.display = ''; // v-show默认display：none，设置为空，让它显示
                        // 外层元素是纵向的动画，内层元素是横向的动画
                        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                        el.style.transform = `translate3d(0,${y}px,0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;
                    }
                }
            },
            enter(el) {
                // 触发浏览器重绘，重绘之后才可以设置transform
                /* eslint-disable no-unused-vars */
                let rf = el.offsetHeight;
                this.$nextTick(() => { // 样式重置
                    el.style.webKitTransform = 'translate3d(0,0,0)';// 没有变量时只能用单引，不能用反引
                    el.style.transform = 'translate3d(0,0,0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0,0,0)';
                    inner.style.transform = 'translate3d(0,0,0)';
                });
            },
            afterEnter(el) { // 动画完成
                let ball = this.dropBalls.shift();// 删除并返回第一个ball
                if (ball) {
                    ball.show = false; // 重置ball.show的状态
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if (!this.totalCount) { // 购物车没有商品的时候不可点击
                    return;
                }
                this.listShow = false; // 主要目的创建 better-scroll 实例或者 refresh
                this.fold = !this.fold; // 当前是收起状态就展开，展开状态就收起
            },
            empty() {
                this.selectFoods.forEach((food) => { // 遍历food，将food的count都置零
                    food.count = 0;
                });
                this.listShow = false; // 隐藏购物车列表
            },
            hideList() {
                this.fold = true; // 点击mark层，购物车详情列表被收回
            },
            pay() { // 点击去结算
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                window.alert(`支付￥${this.totalPrice}元`);
                // .alert('支付' + this.totalPrice + '元');
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0 //解决inline-block的缝隙问题
      .content-left
        flex 1 //自适应
        .logo-wrapper // 包裹着logo图片和上侧num的一个wrapper，圆形，相对于content有一个高出的部分
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box // 宽度包括了padding在内
          border-radius 50%
          background #141d27 // 不设置颜色默认透明不显示
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px //88/2=44
              font-size 24px
              color #80858a
              &.highlight
                color #ffffff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px // 绝对定位要指定宽高才会被撑开
            line-height 16px // 垂直居中
            text-align center // 水平居中
            border-radius 16px
            font-size 9px
            font-weight 700px
            color #ffffff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          box-sizing border-box
          padding-right 12px
          border-right 1px solid rgba(255,255,255,.1) // 总价格旁竖线
          font-size 16px
          font-weight 700px
          color rgba(255,255,255,.4)
          &.highlight
            color #ffffff
        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          font-weight 700
          font-size 10px
          color rgba(255,255,255,.4)
      .content-right
        flex 0 0 105
        width 105px
        .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          color rgba(255,255,255,.8)
          font-weight 700px
          background #2b333b
          /* 钱不够时 */
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fffff
    .ball-container
      .ball
        position fixed //相对于视口做布局
        left 32px
        bottom 22px
        z-index 200
        transition: all 0.6s cubic-bezier(0.49, -0.29, 0.75, 0.41)  // 由四个点组成的曲线 在运动的时候拉一个贝塞尔曲线
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear  // x轴做一个线性的过渡即可
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      transform translate3d(0, -100%, 0) // 整个列表相对于当前自身的高度做一个偏移
      &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s linear
        transform translate3d(0, -100%, 0) // 每个表项相对于当前自身的高度做一个偏移
      &.fade-enter, &.fade-leave-active
        transform translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background  #ffffff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
    .list-mask
      position fixed
      top 0
      left 0
      width 100%
      height 100%
      z-index 40 //z-index要小于shopcart的index
      backdrop-filter blur(10px) // 模糊效果
      -webkit-backdrop-filter blur(10px)
      opacity 1
      background rgba(7, 17, 27, 0.6)
      &.fade-enter-active, &.fade-leave-active
        opacity 1
        transition: all 0.5s //设置缓动效果
        background rgba(7, 17, 27, 0.6)
      &.fade-enter, &.fade-leave-active
        opacity 0
        background rgba(7, 17, 27, 0)
</style>
