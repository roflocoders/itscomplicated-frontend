<template>
  <n-card class="post-card" :content-style="{ padding: 0 }">
    <div class="post-header">
      <n-space align="center">
        <n-avatar round size="medium" class="profile-avatar" />
        <div class="author-info">
          <div class="author-name" @click="goToProfile(post.author_username)">
            {{ post.author_full_name || post.author_username }}
          </div>
          <div class="post-time">{{ formatTime(post.timestamp) }}</div>
        </div>
      </n-space>
      <n-button text class="more-actions" ghost>
        <n-icon size="18">
          <EllipsisHorizontalIcon />
        </n-icon>
      </n-button>
    </div>

    <div class="post-title">
      {{ post.title }}
    </div>

    <div class="post-content">
      <p>{{ post.content }}</p>

      <div v-if="post.image" class="post-image-container">
        <img
          :src="post.image"
          :alt="post.content"
          class="post-image"
          @click="showImagePreview = true"
        />
        <div class="image-overlay" @click="showImagePreview = true">
          <n-icon size="24" color="white">
            <ExpandIcon />
          </n-icon>
        </div>
      </div>
    </div>

    <div class="post-stats">
      <n-space align="center" justify="space-between">
        <n-space align="center">
          <n-space
            align="center"
            @click="handleLike"
            class="stat-item"
            :class="{ liked: post.isLiked }"
          >
            <n-icon size="18" :color="post.isLiked ? '#ff4757' : '#666'">
              <HeartIcon :fill="post.isLiked ? '#ff4757' : 'none'" />
            </n-icon>
            <span>{{ post.likes }}</span>
          </n-space>
          <n-space
            align="center"
            class="stat-item"
            @click="showComments = !showComments"
          >
            <n-icon size="18">
              <ChatbubbleOutlineIcon />
            </n-icon>
            <span>{{ post.comments?.length || 0 }}</span>
          </n-space>
        </n-space>
      </n-space>
    </div>

    <div v-if="showComments" class="comments-section">
      <div class="comments-list">
        <!-- <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <n-avatar round size="small" class="comment-avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <strong
                class="author-name"
                @click="goToProfile(comment.author_username)"
                >{{
                  getUserFullName(comment.author_username) ||
                  comment.author_username
                }}</strong
              >
              <span class="comment-time">{{
                formatTime(comment.timestamp)
              }}</span>
            </div>
            <div class="comment-text">{{ comment.text }}</div>
          </div>
        </div> -->
      </div>
    </div>

    <div class="add-comment">
      <n-input
        v-model:value="newComment"
        placeholder="Напишите комментарий..."
        round
        @keyup.enter="addComment"
        class="comment-input"
      >
        <template #suffix>
          <n-button
            text
            :disabled="!newComment.trim()"
            @click="addComment"
            class="send-button"
            ghost
          >
            <n-icon size="20">
              <SendIcon />
            </n-icon>
          </n-button>
        </template>
      </n-input>
    </div>

    <n-modal
      v-model:show="showImagePreview"
      class="image-preview-modal"
      transform-origin="center"
    >
      <n-card
        style="width: 90vw; max-width: 800px; max-height: 90vh"
        :bordered="false"
        content-style="padding: 0; display: flex; justify-content: center; align-items: center;"
      >
        <img
          :src="post.image"
          style="
            max-width: 100%;
            max-height: 80vh;
            border-radius: 12px;
            object-fit: contain;
          "
        />
      </n-card>
    </n-modal>
  </n-card>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import {
  HeartOutline as HeartIcon,
  ChatbubbleOutline as ChatbubbleOutlineIcon,
  SendOutline as SendIcon,
  EllipsisHorizontalOutline as EllipsisHorizontalIcon,
  ExpandOutline as ExpandIcon,
} from "@vicons/ionicons5";
import { generateId } from "../utils/idGenerator";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const authStore = useAuthStore();
const showComments = ref(false);
const newComment = ref("");
const showImagePreview = ref(false);

// Хранилище для full_name пользователей
// const userFullNames = ref({});

const formatTime = (timestamp) => {
  if (!timestamp) return "только что";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return "только что";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин. назад`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч. назад`;
  return date.toLocaleDateString("ru-RU");
};

const goToProfile = (username) => {
  if (username) {
    router.push(`/profile/${username}`);
  }
};

const handleLike = () => {
  if (props.post.isLiked) {
    props.post.likes--;
  } else {
    props.post.likes++;
  }
  props.post.isLiked = !props.post.isLiked;
};

// Синхронная функция для получения full_name из хранилища
// const getUserFullName = (username) => {
//   if (!username) return null;

//   // Если это текущий пользователь, возвращаем его full_name
//   if (authStore.user?.username === username) {
//     return authStore.user?.full_name || null;
//   }

//   // Возвращаем из хранилища (может быть null, если еще не загружено)
//   return userFullNames.value[username] || null;
// };

// Асинхронная функция для загрузки full_name
const loadUserFullName = async (username) => {
  if (!username) return;

  // Если это текущий пользователь, пропускаем
  if (authStore.user?.username === username) {
    return;
  }

  // Если уже загружено, пропускаем
  if (userFullNames.value[username] !== undefined) {
    return;
  }

  // Загружаем данные пользователя
  try {
    const userData = await authStore.getUserByUsername(username);
    const fullName = userData?.full_name || null;
    userFullNames.value[username] = fullName;
  } catch (error) {
    console.error(`Ошибка загрузки данных пользователя ${username}:`, error);
    userFullNames.value[username] = null;
  }
};

// Загружаем full_name для автора поста и всех комментариев
const loadUserFullNames = async () => {
  // Загружаем для автора поста
  if (props.post.author_username) {
    await loadUserFullName(props.post.author_username);
  }

  // Загружаем для авторов комментариев
  if (props.post.comments) {
    const uniqueUsernames = [
      ...new Set(
        props.post.comments.map((c) => c.author_username).filter(Boolean)
      ),
    ];
    await Promise.all(
      uniqueUsernames.map((username) => loadUserFullName(username))
    );
  }
};

const addComment = () => {
  if (newComment.value.trim()) {
    if (!props.post.comments) {
      props.post.comments = [];
    }
    const username = authStore.user?.username;
    props.post.comments.push({
      id: generateId(),
      author_username: username,
      text: newComment.value,
      timestamp: new Date(),
    });
    newComment.value = "";
    showComments.value = true;

    // Загружаем full_name для нового комментария
    if (username) {
      loadUserFullName(username);
    }
  }
};

// Загружаем full_name при монтировании компонента
onMounted(() => {
  loadUserFullNames();
});

// Загружаем full_name при изменении поста или комментариев
watch(
  () => [props.post.author_username, props.post.comments],
  () => {
    loadUserFullNames();
  },
  { deep: true }
);
</script>

<style scoped>
.post-card {
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
}

.post-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.post-card:hover::before {
  transform: scaleX(1);
}

.post-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.post-header {
  padding: 20px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.02) 0%,
    rgba(118, 75, 162, 0.02) 100%
  );
}

.profile-avatar {
  flex-shrink: 0;
  margin-right: 12px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.profile-avatar:hover {
  border-color: rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

.author-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
}

.author-name:hover {
  color: #6366f1;
  transform: translateX(2px);
}

.post-time {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.more-actions {
  color: #888;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.more-actions:hover {
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
}

.post-content {
  padding: 20px 24px;
}

.post-content p {
  margin: 0;
  line-height: 1.6;
  color: #2c3e50;
  font-size: 15px;
}

.post-image-container {
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.post-image {
  width: 100%;
  border-radius: 16px;
  cursor: zoom-in;
  transition: all 0.4s ease;
  display: block;
}

.post-image:hover {
  transform: scale(1.02);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  cursor: zoom-in;
}

.post-image-container:hover .image-overlay {
  opacity: 1;
}

.post-stats {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(248, 250, 252, 0.6);
}

.stat-item {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.stat-item:hover {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  transform: translateY(-1px);
}

.stat-item.liked {
  color: #ff4757;
}

.stat-item.liked:hover {
  background: rgba(255, 71, 87, 0.1);
}

.comments-section {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8) 0%,
    rgba(241, 245, 249, 0.8) 100%
  );
  border-radius: 0 0 20px 20px;
}

.comments-list {
  padding: 20px 24px 16px;
  max-height: 300px;
  overflow-y: auto;
}

.comment {
  display: flex;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.comment:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.comment-avatar {
  flex-shrink: 0;
  margin-right: 12px;
  border: 2px solid rgba(102, 126, 234, 0.2);
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.comment-time {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}

.comment-text {
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.5;
}

.add-comment {
  padding: 16px 24px 20px;
  background: white;
  border-radius: 0 0 20px 20px;
}

.comment-input {
  border-radius: 16px;
}

.comment-input :deep(.n-input__border) {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.comment-input:focus-within :deep(.n-input__border) {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.send-button {
  color: #6366f1;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.send-button:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.1);
  transform: scale(1.1);
}

.send-button:disabled {
  color: #ccc;
}
</style>

<style>
.image-preview-modal .n-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}
</style>
