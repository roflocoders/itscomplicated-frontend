<template>
  <div class="login-container">
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <n-card class="login-card" title="Вход в SocialNet">
      <template #header-extra>
        <div class="logo-wrapper">
          <n-gradient-text type="success" size="20">
            🌿 SocialNet
          </n-gradient-text>
        </div>
      </template>

      <n-form class="login-form">
        <n-form-item
          label="Никнейм или email"
          :feedback="formErrors.username"
          :validation-status="formErrors.username ? 'error' : null"
        >
          <n-input
            v-model:value="form.username"
            placeholder="Введите никнейм или email"
            round
            size="large"
            class="input-field"
          >
            <template #prefix>
              <n-icon>
                <PersonIcon />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item
          label="Пароль"
          :feedback="formErrors.password"
          :validation-status="formErrors.password ? 'error' : null"
        >
          <n-input
            v-model:value="form.password"
            type="password"
            placeholder="Введите пароль"
            @keyup.enter="handleLogin"
            round
            size="large"
            class="input-field"
          >
            <template #prefix>
              <n-icon>
                <LockClosedIcon />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-button
          type="primary"
          @click="handleLogin"
          :loading="loading"
          block
          size="large"
          class="login-button"
        >
          Войти
        </n-button>

        <n-divider />

        <n-space justify="center" class="register-prompt">
          <span>Нет аккаунта?</span>
          <n-button
            text
            @click="$router.push('/register')"
            type="primary"
            class="register-link"
          >
            Зарегистрироваться
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { useAuthStore } from "../stores/auth";
import {
  PersonOutline as PersonIcon,
  LockClosedOutline as LockClosedIcon,
} from "@vicons/ionicons5";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const form = ref({
  username: "",
  password: "",
});

const formErrors = ref({
  username: "",
  password: "",
});

const validators = {
  username: (value) => {
    if (!value.trim()) return "Никнейм обязателен для заполнения";
    return "";
  },

  password: (value) => {
    if (!value) return "Пароль обязателен для заполнения";
    return "";
  },
};

const validateForm = () => {
  let isValid = true;
  formErrors.value = {
    username: "",
    password: "",
  };

  // Валидируем каждое поле
  const nameError = validators.username(form.value.username);
  if (nameError) {
    formErrors.value.username = nameError;
    isValid = false;
  }

  const passwordError = validators.password(form.value.password);
  if (passwordError) {
    formErrors.value.password = passwordError;
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }
  loading.value = true;
  // Очищаем предыдущие ошибки
  formErrors.value = {
    username: "",
    password: "",
  };

  try {
    const params = new URLSearchParams();
    params.append("username", form.value.username);
    params.append("password", form.value.password);

    await authStore.login(params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    router.push("/");
  } catch (error) {
    console.error("Ошибка входа:", error);

    // Обработка ошибки 401 (неверные данные для входа)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      formErrors.value.password = "Неверный никнейм или пароль";
      formErrors.value.username = "";
    } else {
      // Обработка других ошибок
      const errorMessage =
        error?.response?.data?.detail ||
        error?.message ||
        "Произошла неизвестная ошибка. Попробуйте позже.";
      formErrors.value.password = errorMessage;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  bottom: 20%;
  right: 10%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 50%;
  left: 20%;
  animation-delay: 4s;
}

.shape-4 {
  width: 80px;
  height: 80px;
  bottom: 30%;
  right: 20%;
  animation-delay: 1s;
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

.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
  transition: all 0.4s ease;
}

.login-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.25);
}

.login-card :deep(.n-card-header) {
  padding: 32px 32px 16px;
  text-align: center;
}

.logo-wrapper {
  margin-bottom: 8px;
}

.login-form {
  padding: 0 8px;
}

.input-field {
  margin-bottom: 8px;
}

.input-field :deep(.n-input__border) {
  border: 2px solid rgba(0, 0, 0, 0.08);
}

.input-field:focus-within :deep(.n-input__border) {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.login-button {
  height: 48px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  margin-top: 8px;
}

.login-button:hover:not(.n-button--disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

.register-prompt {
  margin-top: 8px;
}

.register-link {
  font-weight: 600;
}
</style>
