<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menu-wrapper">
      <ul><!-- 如果index等于currentIndex,就为这个li添加一个current类，改变左侧导航栏的背景颜色-->
        <li v-for="item in goods" :key="item.id" class="menu-item">
          <span class="text border-1px">
          <!-- item.type > 0时候 -->
             <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
           </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>  <!-- 特色粥品-->
          <!-- 粥类可能有很多种粥品-->
          <ul>
            <li v-for="food in item.foods" :key="food.id" class="food-item">
              <div class="icon">
                <img width="57px" :src="food.icon" alt="">
              </div>
              <div class="content">
                <!-- 商品名称 -->
                <h2 class="name">{{food.name}}</h2>
                <!-- 描述 -->
                <p class="desc">{{food.description}}</p>
                <!-- 额外属性 -->
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <!-- 价格 : 售价/原价不是所有商品都会有的 v-show -->
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol v-on:cart-add="cartAdd" :food="food"></cartcontrol> <!-- 传入food!!!-->
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: []
            };
        },
        created() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

            // ajax地址
            this.$http.get('/api/goods').then((response) => {
                // response是一个属性，将其转化为json对象
                response = response.body;
                if (response.errno === ERR_OK) {
                    // console.log(this.goods);
                    // 数据在data字段中,将seller对象传给header组件，通过:seller
                    // 异步更新
                    this.goods = response.data;
                    this.$nextTick(() => {
                        // 计算正确menu的高度
                        this._initScroll();
                    });
                }
            });
        },
        methods: {
            _initScroll() {
                this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {});
                this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {});
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .goods
    display: flex
    position: absolute
    width: 100%
    top: 174px /* header的高度 */
    bottom: 46px /* 购物车的高度 */
    overflow: hidden /* 超过的部分需要隐藏 */
    .menu-wrapper
      flex: 0 0 80px /* 等分 缩放 宽度*/
      width: 80px
      background: #f3f5f7
      .menu-item // li
        display: table;  /* 使用table做垂直居中最好的布局 此元素会作为块级表格来显示（类似 <table>），表格前后带有换行符。*/
        height: 54px
        width: 56px
        padding: 12px 12px /* 水平居中 */
        line-height 14px
        .icon
          display : inline-block
          vertical-align : top /* 设置对其方式 */
          width : 12px
          height : 12px
          margin-right : 2px
          background-size : 12px 12px
          background-repeat : no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display table-cell
          font-size 12px
          width 56px
          text-align middle /*垂直居中*/
          border-1px(rgba(7, 17, 27, 0.1))
    .foods-wrapper
      flex: 1
      background: #FFF
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display flex
        margin 18px
        padding 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child // 最后一个good的border和margin都是零
          border-none()
          margin-bottom 0px
        .icon
          flex 0 0 57px /* 左侧宽度固定*/
          margin-right 10px
        .content
          flex 1 //右侧自适应
          .name
            font-size 17px
            margin 2px 0 8px 0
            height 17px
            line-height 17px
            color rgb(7,17,27)
          .desc,.extra
            font-size 10px
            line-height 10px
            color rgb(147,153,159)
          .desc
            margin-bottom 8px
          .extra
            line-height 10px
            .count
              margin-right 12px
          .price
            line-height 24px
            font-weight: 700
            .now
              margin-right 8px
              font-size 14px
              color rgb(240,20,20)
            .old
              text-decoration line-through // 划掉的横线
              color rgb(147,153,159)
              font-size 10px
</style>
