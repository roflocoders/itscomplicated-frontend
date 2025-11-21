<template>
  <n-card :title="post.author">
    <template #header-extra>
      <n-space>
        <n-button text @click="handleLike"> ❤️ {{ post.likes }} </n-button>
        <n-button text @click="showComments = !showComments">
          💬 {{ post.comments?.length || 0 }}
        </n-button>
      </n-space>
    </template>

    <p>{{ post.content }}</p>

    <n-space v-if="post.image" justify="center">
      <img :src="post.image" style="max-width: 100%; border-radius: 8px" />
    </n-space>

    <template #footer v-if="showComments">
      <div v-for="comment in post.comments" :key="comment.id" class="comment">
        <strong>{{ comment.author }}:</strong> {{ comment.text }}
      </div>
      <n-input
        v-model:value="newComment"
        placeholder="Добавить комментарий..."
        @keyup.enter="addComment"
      />
    </template>
  </n-card>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const showComments = ref(false);
const newComment = ref("");

const handleLike = () => {
  props.post.likes++;
};

const addComment = () => {
  if (newComment.value.trim()) {
    if (!props.post.comments) {
      props.post.comments = [];
    }
    props.post.comments.push({
      id: Date.now(),
      author: "Вы",
      text: newComment.value,
    });
    newComment.value = "";
  }
};
</script>

<style scoped>
.comment {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
</style>
