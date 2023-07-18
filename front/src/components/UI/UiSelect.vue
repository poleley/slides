<script setup lang="ts">

defineProps({
  modelValue: {
    type: Object,
    default() {
      return []
    }
  },
  options: {
    type: Array,
    default:
        () => []
  }
})

</script>

<template>
  <select
      :value="modelValue.value"
      class="form-select"
  >
    <option disabled selected hidden value="">
      <slot></slot>
    </option>
    <option
        v-for="option in options"
        :key="option.val"
        :value="option.val"
    >
      {{ option.text }}
    </option>
  </select>
</template>

<style module>

</style>