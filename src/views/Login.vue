<template>
  <div class="login-container">
    <n-card title="Вход в SocialNet">
      <n-form>
        <n-form-item
          label="Никнейм или email"
          :feedback="formErrors.username"
          :validation-status="formErrors.username ? 'error' : null"
        >
          <n-input
            v-model:value="form.username"
            placeholder="Введите никнейм или email"
          />
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
          />
        </n-form-item>
        <n-button type="primary" @click="handleLogin" :loading="loading" block>
          Войти
        </n-button>

        <n-divider />

        <n-space justify="center">
          <span>Нет аккаунта?</span>
          <n-button text @click="$router.push('/register')" type="primary">
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
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}

.login-container :deep(.n-card) {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: none;
}
</style>
