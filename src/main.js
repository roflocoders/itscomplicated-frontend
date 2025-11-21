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

  // Feedback
  NModal,
  NSpin,
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
  NModal,
  NSpin,
};

Object.entries(naiveComponents).forEach(([name, component]) => {
  app.component(name, component);
});

app.use(createPinia());
app.use(router);
app.mount("#app");
