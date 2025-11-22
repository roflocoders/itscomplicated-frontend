<template>
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/PostCard.vue";

const props = defineProps({
  basePostsUrl: {
    type: String,
    required: true,
  },
});

const posts = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const skip = ref(0);
const limit = 10;
const hasMore = ref(true);

const authStore = useAuthStore();

defineExpose({
  posts,
});

const transformPost = (post) => ({
  id: post.id,
  author_username: post.author_username,
  author_full_name: post.author_full_name,
  title: post.title,
  content: post.content,
  image: post.media_url || null,
  likes: 0,
  isLiked: false,
  timestamp: new Date(post.created_at).getTime(),
  comments: [],
});

const loadPosts = async () => {
  loading.value = true;
  skip.value = 0;
  hasMore.value = true;
  try {
    const feedPosts = await authStore.getFeedPosts(
      props.basePostsUrl,
      0,
      limit
    );
    posts.value = feedPosts.map(transformPost);
    skip.value = feedPosts.length;
    if (feedPosts.length < limit) hasMore.value = false;
  } catch {
    hasMore.value = false;
  } finally {
    loading.value = false;
  }
};

const loadMorePosts = async () => {
  if (loadingMore.value || !hasMore.value) return;
  loadingMore.value = true;
  try {
    const feedPosts = await authStore.getFeedPosts(
      props.basePostsUrl,
      skip.value,
      limit
    );
    if (feedPosts.length === 0) {
      hasMore.value = false;
      return;
    }
    posts.value.push(...feedPosts.map(transformPost));
    skip.value += feedPosts.length;
    if (feedPosts.length < limit) hasMore.value = false;
  } catch {
    hasMore.value = false;
  } finally {
    loadingMore.value = false;
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.posts-grid {
  margin-top: 20px;
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
