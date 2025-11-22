<template>
  <div class="feed-container">
    <div class="feed-background">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <CreatePost @post-created="handlePostCreated" />

    <PostsContainer ref="postsContainerRef" :basePostsUrl="'posts/feed'" />
  </div>
</template>

<script setup>
import CreatePost from "../components/CreatePost.vue";
import PostsContainer from "../components/PostsContainer.vue";
import { ref } from "vue";

const postsContainerRef = ref(null);

const handlePostCreated = (post) => {
  // Передать созданный пост в компонент PostsContainer
  postsContainerRef.value?.posts.unshift(post);
};
</script>

<style scoped>
.feed-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  min-height: 100vh;
}
</style>
