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

  const updateUserData = (userData, userToken) => {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem("token", userToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  // Логин теперь только получает токен, затем запрашивает пользователя
  const login = async (data, config = {}) => {
    const response = await axios.post("auth/login", data, config);
    const accessToken = response.data.access_token;

    // Сохраняем токен
    token.value = accessToken;
    localStorage.setItem("token", accessToken);
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    // Запрашиваем данные пользователя с токеном
    const userResponse = await axios.get("auth/users/me");
    user.value = userResponse.data;
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
    updateUserData,
    logout,
  };
});
