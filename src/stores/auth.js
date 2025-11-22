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

  const getUserByUsername = async (username) => {
    try {
      const response = await axios.get(`admin/users/${username}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      throw error;
    }
  };

  const getUserProfile = async (username) => {
    try {
      const response = await axios.get(`follow/users/${username}/profile`);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки профиля пользователя:", error);
      throw error;
    }
  };

  const checkFollowStatus = async (targetUsername) => {
    try {
      const response = await axios.get(`follow/${targetUsername}/status`);
      return response.data.is_following || false;
    } catch (error) {
      console.error("Ошибка проверки статуса подписки:", error);
      throw error;
    }
  };

  const toggleFollowUser = async (targetUsername, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        // Отписываемся
        await axios.delete(`follow/${targetUsername}`);
      } else {
        // Подписываемся
        await axios.post(`follow/${targetUsername}`);
      }
    } catch (error) {
      console.error("Ошибка изменения статуса подписки:", error);
      throw error;
    }
  };

  const getFeedPosts = async (skip = 0, limit = 10) => {
    try {
      const response = await axios.get(`posts/feed?skip=${skip}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки постов:", error);
      throw error;
    }
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
    getUserByUsername,
    getUserProfile,
    checkFollowStatus,
    toggleFollowUser,
    getFeedPosts,
  };
});
