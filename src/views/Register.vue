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
  padding: 20px;
}

.register-container :deep(.n-card) {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: none;
}
</style>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { generateId } from "../utils/idGenerator";

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

const validators = {
  name: (value) => {
    if (!value.trim()) return "Имя обязательно для заполнения";
    if (value.trim().length < 3)
      return "Имя должно содержать хотя бы 3 символа";
    if (value.trim().length > 30)
      return "Имя не должно быть длиннее 30 символов";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(value))
      return "Имя должно содержать только буквы, пробелы и дефисы";
    return "";
  },

  email: (value) => {
    if (!value.trim()) return "Email обязателен для заполнения";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Введите корректный email адрес";
    if (value.length > 50) return "Email не должен быть длиннее 50 символов";
    return "";
  },

  password: (value) => {
    if (!value) return "Пароль обязателен для заполнения";
    if (value.length < 8) return "Пароль должен содержать хотя бы 8 символов";
    if (value.length > 100) return "Пароль не должен быть длиннее 100 символов";
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value))
      return "Пароль должен содержать заглавные и строчные буквы";
    if (!/(?=.*\d)/.test(value))
      return "Пароль должен содержать хотя бы одну цифру";
    if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(value))
      return "Пароль должен содержать хотя бы один специальный символ";
    return "";
  },

  confirmPassword: (value, password) => {
    if (!value) return "Подтверждение пароля обязательно";
    if (value !== password) return "Пароли не совпадают";
    return "";
  },
};

const validateForm = () => {
  let isValid = true;
  formErrors.value = { name: "", email: "", password: "", confirmPassword: "" };

  // Валидируем каждое поле
  const nameError = validators.name(form.value.name);
  if (nameError) {
    formErrors.value.name = nameError;
    isValid = false;
  }

  const emailError = validators.email(form.value.email);
  if (emailError) {
    formErrors.value.email = emailError;
    isValid = false;
  }

  const passwordError = validators.password(form.value.password);
  if (passwordError) {
    formErrors.value.password = passwordError;
    isValid = false;
  }

  const confirmError = validators.confirmPassword(
    form.value.confirmPassword,
    form.value.password
  );
  if (confirmError) {
    formErrors.value.confirmPassword = confirmError;
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
        id: generateId(),
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
