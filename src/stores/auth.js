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

  // Функция для очистки авторизации
  const clearAuth = () => {
    token.value = null;
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    user.value = null;
    if (router.currentRoute.value.name !== "Login" && router.currentRoute.value.name !== "Register") {
      router.push("/login");
    }
  };

  // Функция для загрузки данных пользователя
  const fetchUserData = async () => {
    if (token.value) {
      try {
        const userResponse = await axios.get("auth/users/me");
        user.value = userResponse.data;
      } catch (error) {
        // Очищаем токен только при 401 (неавторизован) или 403 (запрещено)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn("Токен истек или невалиден, выполняется выход");
          clearAuth();
        } else {
          // При других ошибках просто логируем, но не удаляем токен
          console.error("Ошибка загрузки данных пользователя:", error);
        }
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
      const response = await axios.get(`/follow/users/${username}/profile`);
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

  const getFeedPosts = async (baseUrl, skip = 0, limit = 10) => {
    try {
      const response = await axios.get(
        `${baseUrl}?skip=${skip}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Ошибка загрузки постов:", error);
      throw error;
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axios.post("posts/", {
        title: postData.title || "",
        content: postData.content,
        post_type: postData.media_url ? "image" : "text",
        media_url: postData.media_url || "",
        is_published: true,
        wall_user_id: postData.wall_user_id,
      });
      return response.data;
    } catch (error) {
      console.error("Ошибка создания поста:", error);
      throw error;
    }
  };

  const logout = () => {
    clearAuth();
    router.push("/login");
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
    createPost,
  };
});
