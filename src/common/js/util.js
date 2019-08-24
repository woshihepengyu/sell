/**
 * 解析url参数
 * Created by yi on 2016-12-28.
 * @return Object {id:12334}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]]+/g;
  let arr = url.match(reg);
  // ['?id=123454','&a=b']

  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');// 先分割取到id=123454，之后用=号分开
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  // return obj;
  return {id: 123123};
};
