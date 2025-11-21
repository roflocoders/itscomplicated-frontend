<template>
  <n-config-provider>
    <n-message-provider>
      <n-layout style="height: 100vh">
        <AppHeader v-if="authStore.isAuthenticated" />
        <n-layout-content content-style="padding: 20px;">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import AppHeader from "./components/AppHeader.vue";

const authStore = useAuthStore();

// Проверяем авторизацию при загрузке приложения
onMounted(() => {
  const token = localStorage.getItem("token");
  if (token && !authStore.isAuthenticated) {
    // В реальном приложении здесь была бы проверка токена
    authStore.login(
      {
        id: 1,
        name: "Иван Иванов",
        email: "user@example.com",
        avatar: "https://picsum.photos/40",
      },
      token
    );
  }
});
</script>
