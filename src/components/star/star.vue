<template>
  <div class="star" :class="starType">  <!-- star表示一行星星，star-item循环这几个星星,starType返回star-48 -->
    <!-- itemClasses记为result数组的值，itemclass的值为on off half -->
    <span v-for="(itemClass,index) in itemClasses" :class="itemClass" class="star-item" :key="index"></span>
  </div>
</template>

<script type="text/ecmascript-6">
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_HALF = 'half';
    const CLS_OFF = 'off';

    export default {
        props: {
            size: {
                type: Number
            },
            score: {
                type: Number
            }
        },
        // 计算starType属性，图片名称实例：star24_half@2x.png
        computed: {
            starType() {
                return 'star-' + this.size; // 拼出来一个类型
            },
            itemClasses() {
                let result = [];
                // 向下去0.5的倍数
                let score = Math.floor(this.score * 2) / 2;
                let hasDecimal = score % 1 !== 0; // 是否半星
                let integer = Math.floor(score); // 控制全星
                for (let i = 0; i < integer; i++) {
                    // console.log(CLS_ON + 'CLS_ON'); // 进来了
                    result.push(CLS_ON); // 全星
                }
                if (hasDecimal) { // 有小数部分
                    // console.log(CLS_HALF + 'CLS_HALF');
                    result.push(CLS_HALF); // 半星 只会出现一个
                }
                while (result.length < LENGTH) { // 灰色星星补齐
                    result.push(CLS_OFF);
                }
                return result;
            }
        }
    };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    display: flex
    align-items: center
    justify-content: center

    .star-item
      background-repeat: no-repeat

    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: 20px 20px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star48_on')

        &.half
          bg-image('star48_half')

        &.off
          bg-image('star48_off')

    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: 15px 15px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star36_on')

        &.half
          bg-image('star36_half')

        &.off
          bg-image('star36_off')

    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: 10px 10px

        &:last-child
          margin-right: 0

        &.on
          bg-image('star24_on')

        &.half
          bg-image('star24_half')

        &.off
          bg-image('star24_off')
</style>
