<template>
  <div class="register-container">
    <n-card title="Регистрация в SocialNet">
      <n-form>
        <n-form-item
          label="Имя"
          :feedback="formErrors.name"
          :validation-status="formErrors.name ? 'error' : null"
        >
          <n-input v-model:value="form.name" placeholder="Введите ваше имя" />
        </n-form-item>

        <n-form-item
          label="Email"
          :feedback="formErrors.email"
          :validation-status="formErrors.email ? 'error' : null"
        >
          <n-input v-model:value="form.email" placeholder="Введите email" />
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
            @keyup.enter="handleRegister"
          />
        </n-form-item>

        <n-form-item
          label="Подтверждение пароля"
          :feedback="formErrors.confirmPassword"
          :validation-status="formErrors.confirmPassword ? 'error' : null"
        >
          <n-input
            v-model:value="form.confirmPassword"
            type="password"
            placeholder="Повторите пароль"
            @keyup.enter="handleRegister"
          />
        </n-form-item>

        <n-button
          type="primary"
          @click="handleRegister"
          :loading="loading"
          block
        >
          Зарегистрироваться
        </n-button>

        <n-divider />

        <n-space justify="center">
          <span>Уже есть аккаунт?</span>
          <n-button text @click="$router.push('/login')" type="primary">
            Войти
          </n-button>
        </n-space>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const formErrors = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const validateForm = () => {
  let isValid = true;
  formErrors.value = { name: "", email: "", password: "", confirmPassword: "" };

  if (!form.value.name.trim()) {
    formErrors.value.name = "Имя обязательно для заполнения";
    isValid = false;
  }

  if (!form.value.email.trim()) {
    formErrors.value.email = "Email обязателен для заполнения";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    formErrors.value.email = "Введите корректный email";
    isValid = false;
  }

  if (!form.value.password) {
    formErrors.value.password = "Пароль обязателен для заполнения";
    isValid = false;
  } else if (form.value.password.length < 6) {
    formErrors.value.password = "Пароль должен содержать минимум 6 символов";
    isValid = false;
  }

  if (!form.value.confirmPassword) {
    formErrors.value.confirmPassword = "Подтверждение пароля обязательно";
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    formErrors.value.confirmPassword = "Пароли не совпадают";
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  // Имитация регистрации
  setTimeout(() => {
    // В реальном приложении здесь был бы API запрос
    authStore.updateUserData(
      {
        id: Date.now(), // Генерируем уникальный ID
        name: form.value.name,
        email: form.value.email,
        avatar: `"https://avatars.mds.yandex.net/i?id=434f653e3450f644f16f7982c997a7dcac60a3ec-5561596-images-thumbs&n=13"`,
      },
      "fake-jwt-token-" + Date.now()
    );

    router.push("/");
    loading.value = false;
  }, 1000);
};
</script>
