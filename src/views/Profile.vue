<template>
  <div class="profile-container">
    <n-card :title="isOwnProfile ? 'Мой профиль' : 'Профиль пользователя'">
      <n-space vertical>
        <n-space align="center">
          <n-avatar round size="large" :src="profileUser?.avatar" />
          <div>
            <h3 style="margin: 0">{{ profileUser?.username }}</h3>
            <p style="margin: 0; color: #666">{{ profileUser?.full_name }}</p>
            <p v-if="isOwnProfile" style="margin: 0; color: #666">
              {{ profileUser?.email }}
            </p>
          </div>
        </n-space>

        <!-- <n-form>
          <n-form-item label="Имя">
            <n-input :value="authStore.user?.name" disabled />
          </n-form-item>
          <n-form-item label="Email">
            <n-input :value="authStore.user?.email" disabled />
          </n-form-item>
        </n-form> -->

        <n-button
          v-if="isOwnProfile"
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
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const profileUser = ref(null);
const loading = ref(false);

const username = computed(() => {
  return route.params.username || null;
});

const isOwnProfile = computed(() => {
  if (!username.value) return false;
  return authStore.user?.username === username.value;
});

const loadUserProfile = async () => {
  if (!username.value) {
    router.push("/");
    return;
  }

  loading.value = true;
  try {
    // Проверяем, является ли это профилем текущего пользователя
    if (authStore.user?.username === username.value) {
      // Показываем текущего пользователя
      profileUser.value = authStore.user;
    } else {
      // Загружаем данные другого пользователя
      profileUser.value = await authStore.getUserByUsername(username.value);
    }
  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    if (error.response?.status === 404) {
      router.push("/");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserProfile();
});

watch(() => route.params.username, () => {
  loadUserProfile();
});
</script>
