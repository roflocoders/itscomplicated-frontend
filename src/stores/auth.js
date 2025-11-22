import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API_BASE = "http://localhost:8000/";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref(null); // будет хранить данные пользователя
  const token = ref(localStorage.getItem("token"));

  axios.defaults.baseURL = API_BASE;
  if (token.value) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token.value}`;
  }

  const isAuthenticated = computed(() => !!token.value);

  // Функция для загрузки данных пользователя
  const fetchUserData = async () => {
    if (token.value) {
      try {
        const userResponse = await axios.get("auth/users/me");
        user.value = userResponse.data;
      } catch (error) {
        // Если токен невалидный, очищаем его
        console.error("Ошибка загрузки данных пользователя:", error);
        token.value = null;
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        user.value = null;
      }
    }
  };

  // Загружаем данные пользователя при инициализации, если есть токен
  if (token.value) {
    fetchUserData();
  }

  const login = async (data, config = {}) => {
    const response = await axios.post("auth/login", data, config);
    const accessToken = response.data.access_token;

    token.value = accessToken;
    localStorage.setItem("token", accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    const userResponse = await axios.get("auth/users/me");
    user.value = userResponse.data;
  };

  const register = async (data) => {
    await axios.post("auth/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    // После регистрации автоматически логинимся
    const loginParams = new URLSearchParams();
    loginParams.append("username", data.username);
    loginParams.append("password", data.password);

    await login(loginParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    router.push("auth/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUserData,
  };
});
