import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const user = ref(null);
  const token = ref(localStorage.getItem("token"));

  const isAuthenticated = computed(() => !!token.value);

  const updateUserData = (userData, userToken) => {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    router.push("/login");
  };

  return {
    user,
    token,
    isAuthenticated,
    updateUserData,
    logout,
  };
});
