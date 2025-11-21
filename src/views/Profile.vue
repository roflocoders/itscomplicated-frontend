<template>
  <div class="profile-container">
    <n-card title="Мой профиль">
      <n-space vertical>
        <n-space align="center">
          <n-avatar round size="large" :src="authStore.user?.avatar" />
          <div>
            <h3 style="margin: 0">{{ authStore.user?.username }}</h3>
            <p style="margin: 0; color: #666">{{ authStore.user?.full_name }}</p>
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

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.profile-container :deep(.n-card) {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: none;
}
</style>

<script setup>
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
</script>
