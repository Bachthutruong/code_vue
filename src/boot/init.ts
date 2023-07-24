import { boot } from 'quasar/wrappers';
// @ts-ignore
import vClickOutside from 'click-outside-vue3';
import 'floating-vue/dist/style.css';
import FloatingVue from 'floating-vue';
// @ts-ignore
import VueZoomer from 'vue-zoomer';
import VHighlight from 'components/directive/v-hightlight';
// @ts-ignore
import VueVirtualScroller from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';
export default boot(async ({ app, router, redirect, store, urlPath, publicPath }) => {
  app.use(vClickOutside);
  app.use(VueZoomer);
  // @ts-ignore
  app.directive('highlight', VHighlight);
  app.use(VueVirtualScroller);
});
