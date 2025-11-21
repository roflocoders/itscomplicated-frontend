<template>
  <n-layout-header bordered style="padding: 12px 20px; background: #fff">
    <n-space justify="space-between" align="center">
      <n-space align="center">
        <h2 style="margin: 0; color: #18a058">SocialNet</h2>
        <n-button text @click="$router.push('/')"> Лента </n-button>
        <n-button text @click="$router.push('/profile')"> Профиль </n-button>
      </n-space>

      <n-space align="center">
        <n-avatar round :src="authStore.user?.avatar" />
        <span>{{ authStore.user?.name }}</span>
        <n-button @click="handleLogout"> Выйти </n-button>
      </n-space>
    </n-space>
  </n-layout-header>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
