<script setup>

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

</script>

<template>
  <div v-if="modelValue" class="dialog" @click="$emit('update:modelValue', false)">
    <div class="dialog-body" @click.stop>
      <div class="header d-flex justify-content-between align-items-center">
      <div class="my-modal-title">
        <slot name="title"></slot>
      </div>
        <button class="btn-close" @click="$emit('update:modelValue', false)"></button>
      </div>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<style scoped>
.dialog {
  z-index: 1 !important;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
}

.header {
  margin-bottom: 2rem;
}

.my-modal-title {
  font-size: 24px;
  font-weight: bold;
}

.dialog-body {
  margin: auto;
  background: white;
  border-radius: 8px;
  min-height: 50px;
  min-width: 300px;
  padding: 1.5rem;
}
</style>