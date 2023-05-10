<template>
  <div class="answer">
    <div class="answer">{{ answerText }}</div>
    <div class="slide-numbers">{{ slideNumbers.join(', ') }}</div>
  </div>
</template>

<script setup>
defineProps({
  answerText: {
    type: String,
    required: true
  },
  slideNumbers: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>

</style>