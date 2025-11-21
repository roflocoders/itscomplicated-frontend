import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Naive UI импорты
import {
  // Layout
  NConfigProvider,
  NMessageProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,

  // General
  NButton,
  NAvatar,

  // Data Display
  NCard,
  NSpace,
  NGrid,
  NGridItem,

  // Data Input
  NInput,
  NForm,
  NFormItem,
  NUpload, // Добавлено

  // Feedback
  NModal,
  NSpin,
  NIcon, // Добавлено
} from "naive-ui";

const app = createApp(App);

// Регистрируем компоненты глобально
const naiveComponents = {
  NConfigProvider,
  NMessageProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NButton,
  NAvatar,
  NCard,
  NSpace,
  NGrid,
  NGridItem,
  NInput,
  NForm,
  NFormItem,
  NUpload, // Добавлено
  NModal,
  NSpin,
  NIcon, // Добавлено
};

Object.entries(naiveComponents).forEach(([name, component]) => {
  app.component(name, component);
});

app.use(createPinia());
app.use(router);
app.mount("#app");
