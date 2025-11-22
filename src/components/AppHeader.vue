<template>
  <n-layout-header bordered class="app-header">
    <div class="header-content">
      <n-space align="center" class="header-left">
        <div class="logo" @click="$router.push('/')">
          <n-gradient-text
            style="color: white !important"
            type="success"
            size="24"
          >
            🌿 SocialNet
          </n-gradient-text>
        </div>
        <n-button
          text
          @click="$router.push('/')"
          class="nav-button"
          :class="{ active: $route.path === '/' }"
        >
          <template #icon>
            <n-icon>
              <HomeIcon />
            </n-icon>
          </template>
          Лента
        </n-button>
        <n-button
          text
          @click="$router.push(`/profile/${authStore.user?.username}`)"
          class="nav-button"
          :class="{ active: $route.path.startsWith('/profile/') }"
        >
          <template #icon>
            <n-icon>
              <PersonIcon />
            </n-icon>
          </template>
          Профиль
        </n-button>
      </n-space>

      <n-space align="center" class="header-right">
        <n-dropdown :options="userMenuOptions" @select="handleUserMenuSelect">
          <n-space align="center" class="user-info">
            <n-avatar
              round
              size="small"
              :src="authStore.user?.avatar"
              class="user-avatar"
            />
            <span class="user-name">{{
              authStore.user?.full_name || authStore.user?.username
            }}</span>
            <n-icon size="16" class="dropdown-arrow">
              <ChevronDownIcon />
            </n-icon>
          </n-space>
        </n-dropdown>
      </n-space>
    </div>

    <!-- Decorative elements -->
    <div class="header-decoration">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </n-layout-header>
</template>

<script setup>
import { ref, computed, h } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";
import {
  HomeOutline as HomeIcon,
  PersonOutline as PersonIcon,
  LogOutOutline as LogoutIcon,
  ChevronDownOutline as ChevronDownIcon,
} from "@vicons/ionicons5";

const authStore = useAuthStore();
const router = useRouter();

const userMenuOptions = computed(() => [
  {
    label: "Профиль",
    key: "profile",
    icon: () => h(PersonIcon),
  },
  {
    label: "Выйти",
    key: "logout",
    icon: () => h(LogoutIcon),
    props: {
      style: { color: "#d03050" },
    },
  },
]);

const handleUserMenuSelect = (key) => {
  if (key === "profile") {
    router.push(`/profile/${authStore.user?.username}`);
  } else if (key === "logout") {
    handleLogout();
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: none;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  position: relative;
  z-index: 2;
}

.logo {
  cursor: pointer;
  font-weight: 700;
  margin-right: 8px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.header-left {
  flex-flow: row nowrap !important;
}

.nav-button {
  color: rgba(255, 255, 255, 0.9) !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 10px 18px;
  position: relative;
  overflow: hidden;
}

.nav-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.nav-button:hover::before {
  left: 100%;
}

.nav-button :deep(.n-button__content) {
  margin-left: 8px;
}

.nav-button :deep(.n-button__icon) {
  margin-right: 0;
}

.nav-button:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.15) !important;
  transform: translateY(-1px);
}

.nav-button.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-info {
  flex-flow: row nowrap !important;
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 16px;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info:hover .user-avatar {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

.user-name {
  font-weight: 600;
  color: white;
  margin: 0 8px;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info:hover .dropdown-arrow {
  transform: rotate(180deg);
  color: white;
}

/* Decorative elements */
.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 80px;
  height: 80px;
  top: -40px;
  right: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  left: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 40px;
  height: 40px;
  top: 50%;
  right: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.1;
  }
  50% {
    transform: translateY(-10px) scale(1.05);
    opacity: 0.15;
  }
}

@media (max-width: 580px) {
  .nav-button {
    display: none !important;
  }

  .header-left {
    gap: 0px !important;
  }

  .logo {
    margin-right: 8px;
  }
}

@media (max-width: 400px) {
  .user-info {
    gap: 4px !important;
    padding: 8px 12px;
  }

  .user-name {
    display: none;
    margin: 0;
  }
}
</style>

<style>
.n-dropdown-menu {
  padding: 8px !important;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1) !important;
}

.n-dropdown-option-body__prefix {
  align-self: center;
  margin-right: 10px;
  width: 25px !important;
  height: 25px !important;
}
</style>
