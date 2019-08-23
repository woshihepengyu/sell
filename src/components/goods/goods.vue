<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul><!-- 如果index等于currentIndex,就为这个li添加一个current类，改变左侧导航栏的背景颜色-->
          <li v-for="(item,index) in goods" :key="item.id" class="menu-item"
              :class="{'current': currentIndex === index}"
              @click="selectMenu(index, $event)">
          <span class="text border-1px">
          <!-- item.type > 0时候 -->
             <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
           </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <!-- hook被JS选择 -->
          <li v-for="item in goods" :key="item.id" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>  <!-- 特色粥品-->
            <!-- 粥类可能有很多种粥品-->
            <ul>
              <li @click="selectFood(food,$event)" v-for="food in item.foods" :key="food.id" class="food-item">
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
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice"
                :min-price="seller.minPrice"></shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import shopcart from '../shopcart/shopcart';
    import cartcontrol from '../cartcontrol/cartcontrol';
    import food from '../food/food';

    const ERR_OK = 0;
    export default {
        props: {
            seller: {
                type: Object
            }
        },
        data() {
            return {
                goods: [],
                listHeight: [], // 存储区块的高度
                scrollY: 0,
                selectedFood: {}
            };
        },
        computed: {
            currentIndex() { // currentIndex对应菜单栏的下标
                for (let i = 0; i < this.listHeight.length; i++) { // 不要忘了加this引用
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i + 1];
                    // 获得了一个区间的上下范围，判断scrollY落到这个区间，!height2是判断最后一个区间
                    // 避免i溢出，>= 向下的是一个闭区间，这样第一个就会高亮了
                    if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
                        return i; // 映射到第5行menu的变化
                    }
                }
                return 0;
            },
            selectFoods() { // 遍历foods，看看选中了哪些商品
                let foods = [];
                this.goods.forEach((good) => { // 先取到每一个分类
                    good.foods.forEach((food) => { // 后取到每一个分类下的不同food
                        if (food.count) {
                            foods.push(food); // 两层遍历，取到所有被选中的foods
                        }
                    });
                });
                return foods; // 将结果传回到shopcart
            }
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
                    // 初始化betterScroll的时候，DOM的更新时异步的,所以我们在这虽然改变了数据，但是DOM并没有变化，计算不到正确的高度
                    this.$nextTick(() => {
                        // 计算正确menu的高度
                        this._initScroll();
                        // 拿到数据以后计算高度
                        this._calculateHeight();
                    });
                }
            });
        },
        methods: {
            selectFood(food, event) {
                if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
                    return;
                }
                this.selectedFood = food;
                this.$refs.food.show();
            },
            _initScroll() {
                // this.$refs.foodsWrapper 不行 , 所以把div也改了 line3 and 13
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true // 阻止默认，允许点击
                });
                this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                    click: true,
                    // 实时告诉滚动位置
                    // //BScroll滚动时，能实时告诉我们滚动的位置，类似探针的效果
                    probeType: 3
                });
                // foodsScroll监听事件,在scroll滚动时能见位置实时暴露出来
                this.foodsScroll.on('scroll', (pos) => {
                    this.scrollY = Math.abs(Math.round(pos.y)); // 取正值
                });
            },
            _calculateHeight() {
                // food-list-hook类的添加知识为了能拿到food列表,例如，拿到的是多个类似整个粥品的区块
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                // console.log(foodList); // OK
                let height = 0;
                this.listHeight.push(height); // listHeight是一个递增的区间数组，是每个专区高度的累加
                for (let i = 0; i < foodList.length; i++) {
                    let item = foodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index, event) {
                if (!event._constructed) { // 浏览器直接return掉,去掉自带click事件的点击
                    return;
                }
                let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let ref = foodList[index]; // 取到index对应的DOM
                this.foodsScroll.scrollToElement(ref, 300); // 滚动到DOM所在位置
                // console.log(index); // ok
            },
            cartAdd(target) {
                // 拿到traget(DOM对象)之后，将其传入shopcart组件中drop(target){}方法，
                // 此处用this.$refs调用子组件,访问DOM时用的是ref="menuWrapper"
                // 异步执行下落动画
                this.$nextTick(() => { // 回调函数异步执行，两个动画效果就不会卡顿了
                    this.$refs.shopcart.drop(target);
                });
            }
        },
        components: {
            // 注册组件
            shopcart,
            cartcontrol,
            food
        },
        events: {
            'cart-add'(target) {
                this.cartAdd(target);
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
        display: table; /* 使用table做垂直居中最好的布局 此元素会作为块级表格来显示（类似 <table>），表格前后带有换行符。*/
        height: 54px
        width: 56px
        padding: 12px 12px /* 水平居中 */
        line-height 14px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top /* 设置对其方式 */
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
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
        color rgb(147, 153, 159)
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
            color rgb(7, 17, 27)
          .desc, .extra
            font-size 10px
            line-height 12px
            color rgb(147, 153, 159)
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
              color rgb(240, 20, 20)
            .old
              text-decoration: line-through // 划掉的横线
              color rgb(147, 153, 159)
              font-size 10px
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 24px
</style>
