<template>
  <div class="selected-image" v-if="image">
    <img :src="image" alt="Selected Image" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 接收祖父组件传来的图片 URL
const props = defineProps({
  image: String,
});
</script>

<style>
.selected-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.selected-image img {
  align-items: center;
  max-width: 100%;
  height: auto;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
