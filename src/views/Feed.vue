<template>
  <div>
    <n-grid :cols="2" :x-gap="16">
      <n-grid-item :span="1">
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
            <n-form-item label="Изображение (URL)">
              <n-input
                v-model:value="newPost.image"
                placeholder="https://example.com/image.jpg"
              />
            </n-form-item>
            <n-button type="primary" @click="createPost">
              Опубликовать
            </n-button>
          </n-form>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="1">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import PostCard from "../components/PostCard.vue";

const authStore = useAuthStore();
const posts = ref([]);
const newPost = ref({
  content: "",
  image: "",
});

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
  }
};
</script>
