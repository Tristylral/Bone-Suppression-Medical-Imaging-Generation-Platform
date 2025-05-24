/*
 * @Author: yrh
 * @Date: 2022-04-20 17:13:36
 * @LastEditors: yrh
 * @LastEditTime: 2022-04-20 17:19:46
 * @Description: file content
 */

import svgIcon from './index.vue';

export default {
  install(Vue) {
    Vue.component(svgIcon.name, svgIcon);
  },
};
