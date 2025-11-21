<template>
  <div class="feed-container">
    <n-card title="Создать пост">
      <n-form>
        <n-form-item label="Текст поста">
          <n-input
            v-model:value="newPost.content"
            type="textarea"
            placeholder="Что у вас нового?"
            :rows="3"
          />
        </n-form-item>

        <n-form-item label="Изображение">
          <n-space vertical>
            <!-- Поле для URL изображения -->
            <n-input
              v-model:value="newPost.image"
              placeholder="https://example.com/image.jpg"
              style="margin-bottom: 10px"
            />

            <!-- Кнопка для загрузки с компьютера -->
            <n-upload
              accept="image/*"
              :show-file-list="false"
              :custom-request="handleImageUpload"
            >
              <n-button>
                <template #icon>
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        fill="currentColor"
                        d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z"
                      />
                    </svg>
                  </n-icon>
                </template>
                Загрузить с компьютера
              </n-button>
            </n-upload>

            <!-- Предпросмотр загруженного изображения -->
            <div v-if="uploadedImagePreview" class="image-preview">
              <img
                :src="uploadedImagePreview"
                alt="Preview"
                class="preview-image"
              />
              <n-button
                size="small"
                @click="removeUploadedImage"
                type="error"
                text
                style="margin-top: 8px"
              >
                Удалить
              </n-button>
            </div>
          </n-space>
        </n-form-item>

        <n-button
          type="primary"
          @click="createPost"
          :disabled="!newPost.content.trim()"
        >
          Опубликовать
        </n-button>
      </n-form>
    </n-card>

    <PostCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<style scoped>
.feed-container {
  max-width: 800px;
  margin: auto;
}

.n-card {
  margin-block: 1em;
}

.image-preview {
  margin-top: 10px;
  text-align: center;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/PostCard.vue";
import { useMessage } from "naive-ui";

const authStore = useAuthStore();
const message = useMessage();
const posts = ref([]);
const newPost = ref({
  content: "",
  image: "",
});
const uploadedImagePreview = ref("");

// Моковые данные для демонстрации
const mockPosts = [
  {
    id: 1,
    author: "Иван Иванов",
    content: "Сегодня прекрасный день для программирования! 🚀",
    likes: 15,
    comments: [{ id: 1, author: "Петр", text: "Полностью согласен!" }],
  },
  {
    id: 2,
    author: "Мария Петрова",
    content: "Только что закончила новый проект на Vue 3!",
    image: "https://picsum.photos/400/200",
    likes: 23,
    comments: [],
  },
];

onMounted(() => {
  posts.value = mockPosts;
});

// Обработка загрузки изображения
const handleImageUpload = ({ file }) => {
  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!validImageTypes.includes(file.file?.type)) {
    message.error(
      "Пожалуйста, выберите файл изображения (JPEG, PNG, GIF, WebP)"
    );
    return;
  }

  if (file.file && file.file.size > 5 * 1024 * 1024) {
    // 5MB limit
    message.error("Размер файла не должен превышать 5MB");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImagePreview.value = e.target.result;
    newPost.value.image = e.target.result; // Используем Data URL для предпросмотра
  };
  reader.readAsDataURL(file.file);
};

// Удаление загруженного изображения
const removeUploadedImage = () => {
  uploadedImagePreview.value = "";
  newPost.value.image = "";
};

// Создание поста
const createPost = () => {
  if (newPost.value.content.trim()) {
    const post = {
      id: Date.now(),
      author: authStore.user?.name || "Аноним",
      content: newPost.value.content,
      image: newPost.value.image,
      likes: 0,
      comments: [],
    };

    posts.value.unshift(post);
    newPost.value.content = "";
    newPost.value.image = "";
    uploadedImagePreview.value = "";

    message.success("Пост успешно опубликован!");
  } else {
    message.warning("Введите текст поста");
  }
};
</script>
