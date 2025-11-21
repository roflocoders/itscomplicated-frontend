<template>
  <div style="max-width: 600px; margin: 0 auto">
    <n-card title="Мой профиль">
      <n-space vertical>
        <n-space align="center">
          <n-avatar round size="large" :src="authStore.user?.avatar" />
          <div>
            <h3 style="margin: 0">{{ authStore.user?.name }}</h3>
            <p style="margin: 0; color: #666">{{ authStore.user?.email }}</p>
          </div>
        </n-space>

        <n-form>
          <n-form-item label="Имя">
            <n-input :value="authStore.user?.name" disabled />
          </n-form-item>
          <n-form-item label="Email">
            <n-input :value="authStore.user?.email" disabled />
          </n-form-item>
        </n-form>

        <n-button
          @click="
            authStore.logout();
            $router.push('/login');
          "
          type="error"
        >
          Выйти из аккаунта
        </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
</script>
