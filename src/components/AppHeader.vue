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
          @click="$router.push('/profile')"
          class="nav-button"
          :class="{ active: $route.path === '/profile' }"
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
            <span class="user-name">{{ authStore.user?.username }}</span>
            <n-icon size="16" class="dropdown-arrow">
              <ChevronDownIcon />
            </n-icon>
          </n-space>
        </n-dropdown>
      </n-space>
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
    router.push("/profile");
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
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: none;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.logo {
  cursor: pointer;
  font-weight: 700;
  margin-right: 8px;
}

.header-left{
  flex-flow: row nowrap !important;
}

.nav-button {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px 16px;
}

.nav-button :deep(.n-button__content) {
  margin-left: 8px;
}

.nav-button :deep(.n-button__icon) {
  margin-right: 0;
}

.nav-button:hover {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
  transform: translateY(-1px);
}

.nav-button.active {
  color: white !important;
  background: rgba(255, 255, 255, 0.2) !important;
}

.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-info {
  flex-flow: row nowrap !important;
  cursor: pointer;
  padding: 12px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
  color: white;
  display: flex;
  align-items: center;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info:hover .user-avatar {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.user-name {
  font-weight: 500;
  color: white;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-info:hover .dropdown-arrow {
  transform: rotate(180deg);
  color: white;
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
  border-radius: 8px;
  width: 139px;
}

.n-dropdown-option-body__prefix {
  align-self: center;
  margin-right: 10px;
  width: 25px !important;
  height: 25px !important;
}
</style>
