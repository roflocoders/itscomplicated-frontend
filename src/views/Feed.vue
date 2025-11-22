<template>
  <div class="feed-container">
    <div class="feed-background">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <CreatePost @post-created="handlePostCreated" />

    <n-spin :show="loading">
      <div class="posts-grid">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          class="post-item fade-in"
        />
        <div v-if="!loading && posts.length > 0" class="load-more-container">
          <n-button
            v-if="hasMore"
            @click="loadMorePosts"
            :loading="loadingMore"
            type="primary"
            ghost
            block
            class="load-more-button"
          >
            Загрузить еще
          </n-button>
          <n-divider v-else>Больше постов нет</n-divider>
        </div>
      </div>
    </n-spin>

  </div>
</template>

<style scoped>
.feed-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}

.feed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 100%
  );
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: 20%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  right: 20%;
  animation-delay: 4s;
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

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.load-more-container {
  margin-top: 8px;
  padding: 20px 0;
}

.load-more-button {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.load-more-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.post-item {
  transition: all 0.4s ease;
  animation-duration: 0.6s;
  animation-fill-mode: both;
}

.post-item:nth-child(odd) {
  animation-delay: 0.1s;
}

.post-item:nth-child(even) {
  animation-delay: 0.2s;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/PostCard.vue";
import CreatePost from "../components/CreatePost.vue";

const authStore = useAuthStore();
const posts = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const skip = ref(0);
const limit = 10;
const hasMore = ref(true);

// Функция для преобразования данных поста из API в формат для PostCard
const transformPost = (post) => {
  return {
    id: post.id,
    author_username: post.author_username,
    author_full_name: post.author_full_name,
    content: post.content,
    image: post.media_url || null,
    likes: 0, // Пока нет данных о лайках
    isLiked: false,
    timestamp: new Date(post.created_at).getTime(),
    comments: [], // Комментарии пока пустые
  };
};

// Загрузка постов из ленты
const loadPosts = async () => {
  loading.value = true;
  skip.value = 0;
  hasMore.value = true;
  
  try {
    const feedPosts = await authStore.getFeedPosts(0, limit);
    posts.value = feedPosts.map(transformPost);
    skip.value = feedPosts.length;
    
    // Если получили меньше постов, чем запрашивали, значит больше нет
    if (feedPosts.length < limit) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error("Ошибка загрузки постов:", error);
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

// Загрузка следующих постов
const loadMorePosts = async () => {
  if (loadingMore.value || !hasMore.value) {
    return;
  }

  loadingMore.value = true;
  try {
    const feedPosts = await authStore.getFeedPosts(skip.value, limit);
    
    if (feedPosts.length === 0) {
      hasMore.value = false;
      return;
    }

    const transformedPosts = feedPosts.map(transformPost);
    posts.value.push(...transformedPosts);
    skip.value += feedPosts.length;
    
    // Если получили меньше постов, чем запрашивали, значит больше нет
    if (feedPosts.length < limit) {
      hasMore.value = false;
    }
  } catch (error) {
    console.error("Ошибка загрузки постов:", error);
    hasMore.value = false;
  } finally {
    loadingMore.value = false;
  }
};

onMounted(() => {
  loadPosts();
});

// Обработчик создания нового поста
const handlePostCreated = (post) => {
  posts.value.unshift(post);
};
</script>
