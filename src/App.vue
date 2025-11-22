<template>
  <n-config-provider :theme="theme">
    <n-message-provider>
      <n-loading-bar-provider>
        <n-dialog-provider>
          <n-layout style="height: 100vh">
            <AppHeader v-if="authStore.isAuthenticated" />
            <n-layout-content content-style="padding: 0;">
              <router-view />
            </n-layout-content>
          </n-layout>
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "./stores/auth";
import AppHeader from "./components/AppHeader.vue";
import { darkTheme } from "naive-ui";

const authStore = useAuthStore();
const theme = ref(null); // Можно переключить на darkTheme для темной темы
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  background: #f8f9fa;
  color: #1a1a1a;
}

#app {
  min-height: 100vh;
}

/* Кастомные scrollbars */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
