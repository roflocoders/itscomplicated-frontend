<template>
  <div>
    <n-card class="create-post-card" :content-style="{ padding: 0 }">
      <div class="create-post-header">
        <n-avatar
          round
          size="medium"
          class="profile-avatar"
          :src="authStore.user?.avatar"
        />
        <n-button
          text
          class="create-post-trigger"
          @click="showCreatePost = true"
        >
          Что у вас нового,
          {{ authStore.user?.full_name || authStore.user?.username }}?
        </n-button>
      </div>
    </n-card>

    <n-modal
      v-model:show="showCreatePost"
      :mask-closable="false"
      class="create-post-modal"
      transform-origin="center"
    >
      <n-card
        style="width: 90vw; max-width: 600px"
        title="Создать пост"
        :bordered="false"
        size="small"
        role="dialog"
        aria-modal="true"
        class="create-post-modal-card"
      >
        <template #header-extra>
          <n-button text @click="showCreatePost = false" class="close-button">
            <n-icon size="20">
              <CloseIcon />
            </n-icon>
          </n-button>
        </template>

        <n-form class="create-post-form">
          <n-form-item>
            <n-input
              v-model:value="newPost.title"
              type="textbox"
              placeholder="Заголовок поста"
              class="post-textbox"
            />
          </n-form-item>

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
            <n-button @click="showCreatePost = false" class="cancel-btn">
              Отмена
            </n-button>
            <n-button
              type="primary"
              @click="handleCreatePost"
              :disabled="!newPost.content.trim()"
              :loading="posting"
              class="publish-btn"
            >
              Опубликовать
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { CloseOutline as CloseIcon } from "@vicons/ionicons5";
import { generateId } from "../utils/idGenerator";

const emit = defineEmits(["post-created"]);

const authStore = useAuthStore();
const showCreatePost = ref(false);
const posting = ref(false);
const newPost = ref({
  title: "",
  content: "",
  image: "",
});

const handleCreatePost = () => {
  if (newPost.value.content.trim()) {
    posting.value = true;

    setTimeout(() => {
      const post = {
        title: newPost.value.title,
        id: generateId(),
        author_username: authStore.user?.username,
        author_full_name: authStore.user?.full_name,
        content: newPost.value.content,
        image: newPost.value.image,
        likes: 0,
        isLiked: false,
        timestamp: new Date().getTime(),
        comments: [],
      };

      emit("post-created", post);
      newPost.value.title = "";
      newPost.value.content = "";
      newPost.value.image = "";
      showCreatePost.value = false;
      posting.value = false;
    }, 800);
  }
};
</script>

<style scoped>
.create-post-card {
  margin-bottom: 24px;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
}

.create-post-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.create-post-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  flex-shrink: 0;
  border: 3px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
}

.create-post-trigger {
  flex: 1;
  justify-content: flex-start;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 20px;
  padding: 14px 20px;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px dashed rgba(102, 126, 234, 0.2);
  height: auto;
  min-height: 52px;
}

.create-post-trigger:hover {
  background: rgba(102, 126, 234, 0.05);
  color: #6366f1;
  border-color: rgba(102, 126, 234, 0.4);
  transform: translateY(-1px);
}

.create-post-modal :deep(.n-card__content) {
  padding: 0;
}

.create-post-form {
  padding: 0 20px;
}

.post-textarea :deep(textarea) {
  font-size: 16px;
  line-height: 1.6;
  border: none;
  resize: none;
  box-shadow: none !important;
  background: rgba(248, 250, 252, 0.5);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.post-textarea :deep(textarea):focus {
  border: none;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2) !important;
  background: white;
}

.image-preview {
  position: relative;
  margin-top: 16px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 16px;
  transition: transform 0.3s ease;
}

.preview-image:hover {
  transform: scale(1.02);
}

.remove-image {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}
</style>

<style>
.create-post-modal-card {
  border-radius: 24px !important;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2) !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
}

.create-post-modal-card .n-card-header {
  padding: 24px 24px 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.create-post-modal-card .n-card__content {
  padding: 0 !important;
}

.create-post-modal-card .n-card-footer {
  padding: 20px 24px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.close-button {
  color: #666 !important;
  transition: all 0.3s ease;
}

.close-button:hover {
  color: #ff4757 !important;
  background: rgba(255, 71, 87, 0.1) !important;
}

.cancel-btn {
  border-radius: 12px;
  padding: 0 20px;
}

.publish-btn {
  border-radius: 12px;
  padding: 0 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.publish-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.publish-btn:active {
  transform: translateY(0);
}
</style>
