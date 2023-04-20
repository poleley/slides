<script setup>
import {defineProps, defineEmits, ref, watch} from 'vue'

const emits = defineEmits([
    'update:modelValue'
])

const {modelValue} = defineProps({
  modelValue: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'email', 'password'].includes(v)
  }
})

const value = ref(modelValue);

watch(value, () => {
  emits('update:modelValue', value);
});


</script>

<template>
  <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :type="type"
  >
</template>

<style scoped>

</style>