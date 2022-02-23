import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import { createFromIconfontCN } from '@ant-design/icons-vue';

const IconFont = createFromIconfontCN({
  scriptUrl: 'https://at.alicdn.com/t/font_3186885_0w1zd3odi83.js',
});

createApp(App)
  .use(Antd)
  .use(store)
  .use(router)
  .component('IconFont',IconFont)
  .mount('#app')
