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
          <slot name="question"></slot>
        </div>
        <button class="btn-close" @click="$emit('update:modelValue', false)"></button>
      </div>
      <div class="body">
        <slot name="answers"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
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
  position: fixed;
  display: flex;
  overflow-y: auto;
}

.header {
  margin-bottom: 1rem;
}

.my-modal-title {
  font-size: 20px;
  font-weight: bold;
}

.dialog-body {
  position: absolute;
  right: 0.5rem;
  top: 4rem;
  background: white;
  border-radius: 8px;
  min-height: 50px;
  min-width: 26rem;
  max-width: 28rem;
  padding: 1.5rem;
  border: 1px solid rgba(178, 154, 113, 0.56);
}

.footer {
  margin-top: 1rem;
  display: flex;
  justify-content: end;
}
</style>