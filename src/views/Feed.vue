<template>
  <div class="feed-container">
    <n-card class="create-post-card" :content-style="{ padding: 0 }">
      <div class="create-post-header">
        <n-avatar
          round
          size="medium"
          :src="authStore.user?.avatar"
          class="user-avatar"
        />
        <n-button
          text
          class="create-post-trigger"
          @click="showCreatePost = true"
        >
          Что у вас нового, {{ authStore.user?.full_name || authStore.user?.username }}?
        </n-button>
      </div>
    </n-card>

    <div class="posts-grid">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
        class="post-item"
      />
    </div>

    <n-modal
      v-model:show="showCreatePost"
      :mask-closable="false"
      class="create-post-modal"
    >
      <n-card
        style="width: 90vw; max-width: 600px"
        title="Создать пост"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          <n-button text @click="showCreatePost = false">
            <n-icon size="20">
              <CloseIcon />
            </n-icon>
          </n-button>
        </template>

        <n-form class="create-post-form">
          <n-form-item>
            <n-input
              v-model:value="newPost.content"
              type="textarea"
              placeholder="Поделитесь своими мыслями..."
              :rows="4"
              :autosize="{ minRows: 4, maxRows: 8 }"
              class="post-textarea"
            />
          </n-form-item>

          <n-form-item label="Добавить изображение">
            <n-input
              v-model:value="newPost.image"
              placeholder="https://example.com/image.jpg"
              round
            />
          </n-form-item>

          <div v-if="newPost.image" class="image-preview">
            <img :src="newPost.image" alt="Preview" class="preview-image" />
            <n-button text class="remove-image" @click="newPost.image = ''">
              <n-icon size="16">
                <CloseIcon />
              </n-icon>
            </n-button>
          </div>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreatePost = false"> Отмена </n-button>
            <n-button
              type="primary"
              @click="createPost"
              :disabled="!newPost.content.trim()"
              :loading="posting"
            >
              Опубликовать
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>
.feed-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 20px;
}

.create-post-card {
  margin-bottom: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: none;
}

.create-post-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  flex-shrink: 0;
}

.create-post-trigger {
  flex: 1;
  justify-content: flex-start;
  background: #f8f9fa;
  border-radius: 24px;
  padding: 12px 20px;
  color: #666;
  font-weight: 500;
  transition: all 0.2s ease;
}

.create-post-trigger:hover {
  background: #e9ecef;
  color: #333;
}

.posts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-item {
  transition: all 0.3s ease;
}

.create-post-modal :deep(.n-card__content) {
  padding: 0;
}

.create-post-form {
  padding: 0 16px;
}

.post-textarea :deep(textarea) {
  font-size: 16px;
  line-height: 1.5;
  border: none;
  resize: none;
  box-shadow: none !important;
}

.post-textarea :deep(textarea):focus {
  border: none;
  box-shadow: none !important;
}

.image-preview {
  position: relative;
  margin-top: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.9);
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/PostCard.vue";
import { CloseOutline as CloseIcon } from "@vicons/ionicons5";

const authStore = useAuthStore();
const posts = ref([]);
const newPost = ref({
  content: "",
  image: "",
});
const showCreatePost = ref(false);
const posting = ref(false);

// Обновленные моковые данные с временными метками
const mockPosts = [
  {
    id: 1,
    author: "Иван Иванов",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan",
    content:
      "Сегодня прекрасный день для программирования! 🚀 Только что закончил новый фича на Vue 3. Что думаете о Composition API?",
    likes: 15,
    isLiked: false,
    timestamp: Date.now() - 3600000, // 1 час назад
    comments: [
      {
        id: 1,
        author: "Петр",
        text: "Полностью согласен! Composition API - это game changer!",
        timestamp: Date.now() - 1800000,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Peter",
      },
    ],
  },
  {
    id: 2,
    author: "Мария Петрова",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    content:
      "Только что закончила новый проект на Vue 3! Использовала Naive UI - потрясающая библиотека компонентов!",
    image:
      "https://png.pngtree.com/thumb_back/fh260/background/20230610/pngtree-picture-of-a-blue-bird-on-a-black-background-image_2937385.jpg",
    likes: 23,
    isLiked: true,
    timestamp: Date.now() - 7200000, // 2 часа назад
    comments: [],
  },
  {
    id: 3,
    author: "Алексей Смирнов",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
    content:
      "Ребята, посмотрите на этот закат! 🌅 Иногда нужно отвлекаться от кода и наслаждаться природой.",
    image:
      "https://zastavki.gas-kvas.com/uploads/posts/2024-05/thumbs/zastavki-gas-kvas-com-ihrv-p-zastavki-smeshnie-na-avu-7.jpg",
    likes: 42,
    isLiked: false,
    timestamp: Date.now() - 86400000, // 1 день назад
    comments: [
      {
        id: 2,
        author: "Мария",
        text: "Как красиво! Где это снято?",
        timestamp: Date.now() - 43200000,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      },
      {
        id: 3,
        author: "Алексей",
        text: "Это в Крыму, недалеко от Ялты!",
        timestamp: Date.now() - 36000000,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey",
      },
    ],
  },
];

onMounted(() => {
  posts.value = mockPosts;
});

const createPost = () => {
  if (newPost.value.content.trim()) {
    posting.value = true;

    setTimeout(() => {
      const post = {
        id: Date.now(),
        author: authStore.user?.name || "Аноним",
        avatar: authStore.user?.avatar,
        content: newPost.value.content,
        image: newPost.value.image,
        likes: 0,
        isLiked: false,
        timestamp: new Date(),
        comments: [],
      };

      posts.value.unshift(post);
      newPost.value.content = "";
      newPost.value.image = "";
      showCreatePost.value = false;
      posting.value = false;
    }, 800);
  }
};
</script>
