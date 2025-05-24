import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createHtmlPlugin } from 'vite-plugin-html';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus';
import autoImports from 'unplugin-auto-import/vite';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';

const config = ({ mode }) => {
  const isProd = mode === 'production';
  const envPrefix = 'APP_';
  const { APP_TITLE = '', APP_BASE_PATH } = loadEnv(mode, process.cwd(), envPrefix);

  return {
    base: isProd ? APP_BASE_PATH : '/',
    plugins: [
      vue(),
      autoImports({
        imports: ['vue'],
        dts: './typings/auto-imports.d.ts',
        eslintrc: {
          enabled: true, // 一般更新 imports 启动一次即可
        },
      }),
      vueSetupExtend(),
      vueJsx(),
      createHtmlPlugin({
        minify: isProd,
        inject: {
          data: {
            title: APP_TITLE,
          },
        },
      }),
    ],
    build: {
      target: 'es2015',
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
        },
      },
    },
    envPrefix,
    resolve: {
      alias: [
        { find: /^@\//, replacement: resolve(__dirname, 'src') + '/' },
        { find: /^~/, replacement: '' },
        { find: /^vue-i18n/, replacement: 'vue-i18n/dist/vue-i18n.cjs.js' },
      ],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css'],
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: [
              'Android 4.1',
              'iOS 7.1',
              'Chrome > 31',
              'ff > 31',
              'ie >= 8',
              'last 2 versions',
            ],
          }),
        ],
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: `@import '${resolve(__dirname, 'src/styles/variable.less')}';`,
        },
      },
    },
    server: {
      port: 3000,
      open: true,
      publicDir: resolve(__dirname, 'public'), // 明确指定 public 目录
      proxy: {
        [process.env.VUE_APP_BASE_API]: {
          target: 'http://localhost:8080', // 修正 proxy URL
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${process.env.VUE_APP_BASE_API}`), ''),
        },
      },
    },
    preview: {
      port: 5000,
    },
  };
};

export default defineConfig(config);
