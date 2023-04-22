<template>
  <EditorHtml v-model="markdownContent"></EditorHtml>
  {{ markdownContent }}
</template>

<script setup>
import { ref } from "vue";

const markdownContent = ref("# fd");
</script>

<style lang="scss" scoped>
</style>
