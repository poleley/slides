<script setup lang="ts">
import { type TopicOption } from "../PresentationForm.vue";

defineProps<{
  value: string;
  options: TopicOption[];
}>();
</script>

<template>
  <select :value="value" class="form-select">
    <option disabled selected hidden value="">
      <slot></slot>
    </option>
    <option v-for="option in options" :key="option.val" :value="option.val">
      {{ option.text }}
    </option>
  </select>
</template>

<style module></style>
