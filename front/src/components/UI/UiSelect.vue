<script setup>

defineProps({
  modelValue: {
    type: Object
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
      @change="modelValue.value = $event.target.value"
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

<style scoped>

</style>