<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <n-loading-bar-provider>
        <n-dialog-provider>
          <n-layout style="height: 100vh" class="app-layout">
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

const authStore = useAuthStore();
const theme = ref(null);

const themeOverrides = {
  common: {
    primaryColor: "#6366f1",
    primaryColorHover: "#5b5ee0",
    primaryColorPressed: "#5255d1",
    primaryColorSuppl: "#6366f1",
  },
  Card: {
    borderRadius: "20px",
    colorEmbedded: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
  },
  Button: {
    borderRadiusMedium: "12px",
    borderRadiusSmall: "10px",
    borderRadiusLarge: "14px",
  },
  Input: {
    borderRadius: "12px",
  },
};
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
  color: #1a1a1a;
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}

.app-layout {
  background: transparent !important;
}

/* Кастомные scrollbars */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
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

/* Глобальные анимации */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

.slide-in {
  animation: slideIn 0.4s ease-out;
}
</style>
