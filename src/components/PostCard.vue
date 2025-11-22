<template>
  <n-card class="post-card" :content-style="{ padding: 0 }">
    <div class="post-header">
      <n-space align="center">
        <n-avatar round size="medium" class="profile-avatar" />
        <div class="author-info">
          <div class="author-name" @click="goToProfile(post.author_username)">
            {{ getUserFullName(post.author_username) || post.author_username }}
          </div>
          <div class="post-time">{{ formatTime(post.timestamp) }}</div>
        </div>
      </n-space>
      <n-button text class="more-actions">
        <n-icon size="18">
          <EllipsisHorizontalIcon />
        </n-icon>
      </n-button>
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
      </div>
    </div>

    <div class="post-stats">
      <n-space align="center" justify="space-between">
        <n-space align="center">
          <n-space align="center" @click="handleLike" class="stat-item">
            <n-icon size="16" :color="post.isLiked ? '#ff4757' : '#666'">
              <HeartIcon :fill="post.isLiked ? '#ff4757' : 'none'" />
            </n-icon>
            <span>{{ post.likes }}</span>
          </n-space>
          <n-space
            align="center"
            class="stat-item"
            @click="showComments = !showComments"
          >
            <n-icon size="16">
              <ChatbubbleOutlineIcon />
            </n-icon>
            <span>{{ post.comments?.length || 0 }}</span>
          </n-space>
        </n-space>
      </n-space>
    </div>

    <div v-if="showComments" class="comments-section">
      <div class="comments-list">
        <div v-for="comment in post.comments" :key="comment.id" class="comment">
          <n-avatar round size="small" class="profile-avatar" />
          <div class="comment-content">
            <div class="comment-header">
              <strong
                class="author-name"
                @click="goToProfile(comment.author_username)"
                >{{ getUserFullName(comment.author_username) || comment.author_username }}</strong
              >
              <span class="comment-time">{{
                formatTime(comment.timestamp)
              }}</span>
            </div>
            <div class="comment-text">{{ comment.text }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="add-comment">
      <n-input
        v-model:value="newComment"
        placeholder="Напишите комментарий..."
        round
        @keyup.enter="addComment"
      >
        <template #suffix>
          <n-button
            text
            :disabled="!newComment.trim()"
            @click="addComment"
            class="send-button"
          >
            <n-icon size="18">
              <SendIcon />
            </n-icon>
          </n-button>
        </template>
      </n-input>
    </div>

    <n-modal v-model:show="showImagePreview">
      <n-card style="width: 90vw; max-width: 800px">
        <img :src="post.image" style="width: 100%; border-radius: 8px" />
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
const userFullNames = ref({});

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
  if (props.post.isLiked) props.post.likes--;
  else props.post.likes++;
  props.post.isLiked = !props.post.isLiked;
};

// Синхронная функция для получения full_name из хранилища
const getUserFullName = (username) => {
  if (!username) return null;
  
  // Если это текущий пользователь, возвращаем его full_name
  if (authStore.user?.username === username) {
    return authStore.user?.full_name || null;
  }
  
  // Возвращаем из хранилища (может быть null, если еще не загружено)
  return userFullNames.value[username] || null;
};

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
    const uniqueUsernames = [...new Set(props.post.comments.map(c => c.author_username).filter(Boolean))];
    await Promise.all(uniqueUsernames.map(username => loadUserFullName(username)));
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
watch(() => [props.post.author_username, props.post.comments], () => {
  loadUserFullNames();
}, { deep: true });
</script>

<style scoped>
.post-card {
  margin-bottom: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: none;
}

.post-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.post-header {
  padding: 16px 20px 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
}

.profile-avatar {
  flex-shrink: 0;
  margin-right: 12px;
}

.author-name {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 2px;
  cursor: pointer;
  transition: color 0.2s ease;
}

.author-name:hover {
  color: #1890ff;
}

.post-time {
  font-size: 12px;
  color: #666;
}

.more-actions {
  color: #666;
}

.post-content {
  padding: 16px 20px;
}

.post-content p {
  margin: 0;
  line-height: 1.5;
  color: #2c3e50;
}

.post-image-container {
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  border-radius: 12px;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.post-image:hover {
  transform: scale(1.02);
}

.post-stats {
  padding: 12px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  color: #666;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.stat-item:hover {
  background: #f5f5f5;
}

.post-actions {
  padding: 8px 20px;
  display: flex;
  gap: 8px;
}

.action-button {
  flex: 1;
  color: #666;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: #f0f7ff;
  color: #1890ff;
}

.action-button.liked {
  color: #ff4757;
}

.action-button.liked:hover {
  background: #fff0f0;
}

.comments-section {
  border-top: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 0 0 16px 16px;
}

.comments-list {
  padding: 16px 20px 12px;
  max-height: 300px;
  overflow-y: auto;
}

.comment {
  display: flex;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.comment-avatar {
  flex-shrink: 0;
  margin-right: 12px;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.comment-time {
  font-size: 11px;
  color: #999;
}

.comment-text {
  color: #2c3e50;
  font-size: 14px;
  line-height: 1.4;
}

.add-comment {
  padding: 12px 20px 16px;
  background: white;
  border-radius: 0 0 16px 16px;
}

.send-button {
  color: #1890ff;
}

.send-button:disabled {
  color: #ccc;
}
</style>
