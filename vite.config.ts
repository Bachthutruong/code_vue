import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueI18n from '@intlify/vite-plugin-vue-i18n';

export default defineConfig({
  plugins: [
    vue(), // you need to install `@vitejs/plugin-vue`
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, './src/i18n/**'),
    }),
  ],
});
