<template>
  <div class="profile-container">
    <div class="profile-background">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <n-card
      class="profile-card"
      :title="isOwnProfile ? 'Мой профиль' : 'Профиль пользователя'"
    >
      <template #header-extra>
        <div class="profile-badge" v-if="isOwnProfile">
          <n-tag type="success" round size="small">
            <template #icon>
              <n-icon>
                <CheckmarkIcon />
              </n-icon>
            </template>
            Это вы
          </n-tag>
        </div>
      </template>

      <n-space vertical size="large">
        <n-space align="center" class="profile-header">
          <div class="avatar-container">
            <n-avatar
              round
              size="xx-large"
              :src="profileUser?.avatar"
              class="profile-avatar"
            />
            <div class="avatar-status" :class="{ online: true }"></div>
          </div>
          <div class="profile-info">
            <h2 class="profile-name">{{ profileUser?.username }}</h2>
            <p class="profile-fullname">{{ profileUser?.full_name }}</p>
            <p v-if="isOwnProfile" class="profile-email">
              <n-icon size="16" style="margin-right: 6px">
                <MailIcon />
              </n-icon>
              {{ profileUser?.email }}
            </p>
            <div class="profile-stats">
              <n-space>
                <div class="stat">
                  <strong>42</strong>
                  <span>постов</span>
                </div>
                <div class="stat">
                  <strong>128</strong>
                  <span>подписчиков</span>
                </div>
                <div class="stat">
                  <strong>96</strong>
                  <span>подписок</span>
                </div>
              </n-space>
            </div>
          </div>
        </n-space>

        <n-space vertical class="profile-actions">
          <n-button
            v-if="isOwnProfile"
            @click="
              authStore.logout();
              $router.push('/login');
            "
            type="error"
            ghost
            class="logout-button"
          >
            <template #icon>
              <n-icon>
                <LogOutIcon />
              </n-icon>
            </template>
            Выйти из аккаунта
          </n-button>

          <n-button v-else type="primary" class="follow-button">
            <template #icon>
              <n-icon>
                <PersonAddIcon />
              </n-icon>
            </template>
            Подписаться
          </n-button>
        </n-space>
      </n-space>
    </n-card>
  </div>
</template>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

.profile-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.profile-card {
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.4s ease;
}

.profile-card:hover {
  box-shadow: 0 16px 50px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.profile-card :deep(.n-card-header) {
  padding: 32px 32px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.02) 0%,
    rgba(118, 75, 162, 0.02) 100%
  );
}

.profile-badge {
  margin-top: 8px;
}

.profile-header {
  padding: 8px 0;
}

.avatar-container {
  position: relative;
  margin-right: 24px;
}

.profile-avatar {
  border: 4px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
}

.profile-avatar:hover {
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

.avatar-status {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  background: #ccc;
  transition: all 0.3s ease;
}

.avatar-status.online {
  background: #00d68f;
  box-shadow: 0 0 0 2px rgba(0, 214, 143, 0.3);
}

.profile-info {
  flex: 1;
}

.profile-name {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-fullname {
  margin: 0 0 12px 0;
  font-size: 18px;
  color: #666;
  font-weight: 500;
}

.profile-email {
  margin: 0 0 20px 0;
  color: #888;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.profile-stats {
  margin-top: 16px;
}

.stat {
  text-align: center;
  padding: 0 20px;
  border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.stat:last-child {
  border-right: none;
}

.stat strong {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat span {
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-actions {
  padding: 16px 0 8px;
}

.logout-button {
  border-radius: 12px;
  padding: 0 24px;
  height: 44px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 77, 79, 0.3);
}

.follow-button {
  border-radius: 12px;
  padding: 0 28px;
  height: 44px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.follow-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .avatar-container {
    margin-right: 0;
    margin-bottom: 20px;
  }

  .profile-stats .n-space {
    justify-content: center;
  }

  .stat {
    padding: 0 15px;
  }
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";
import {
  CheckmarkOutline as CheckmarkIcon,
  MailOutline as MailIcon,
  LogOutOutline as LogOutIcon,
  PersonAddOutline as PersonAddIcon,
} from "@vicons/ionicons5";

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

watch(
  () => route.params.username,
  () => {
    loadUserProfile();
  }
);
</script>
