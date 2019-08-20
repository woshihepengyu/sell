// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* 引入样式 index.styl 在webpack-base中配置alias 加入common：，之后就不用加./了 */
import './common/stylus/index.styl';
import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  {
    path: '/',
    name: 'index',
    component: App,
    children: [
      {path: '/goods', component: goods},
      {path: '/ratings', component: ratings},
      {path: '/seller', component: seller}]
  }
];

const router = new VueRouter({
  'linkActiveClass': 'active', // 此处默认active链接为红色
  routes // short for `routes: routes`
});

new Vue({
  router
}).$mount('#app');
