<template>
  <div class="login-container">
    <n-card title="Вход в SocialNet">
      <n-form>
        <n-form-item label="Email">
          <n-input v-model:value="form.email" placeholder="Введите email" />
        </n-form-item>
        <n-form-item label="Пароль">
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
  email: "",
  password: "",
});

const handleLogin = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    params.append("username", form.value.email);
    params.append("password", form.value.password);

    await authStore.login(params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    router.push("/");
  } catch (error) {
    console.error("Ошибка входа:", error);
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
