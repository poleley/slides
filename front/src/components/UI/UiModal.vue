<script setup lang="ts">

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isOthersModal: {
    type: Array,
    default() {
      return [false]
    }
  },
  is70rem: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

</script>

<template>
  <div v-if="modelValue && !isOthersModal.includes(true)" class="dialog" @click="$emit('update:modelValue', false)">
    <div
        :class="{'width-70-rem': is70rem}"
        class="dialog-body"
        @click.stop
    >
      <div class="header d-flex justify-content-between align-items-center">
        <div class="my-modal-title">
          <slot name="title"></slot>
        </div>
        <button class="btn-close" @click="$emit('update:modelValue', false)"></button>
      </div>
      <div class="body">
        <slot name="body"></slot>
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
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  display: flex;
  overflow-y: auto;
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
  width: 40rem;
}

.footer {
  margin-top: 2rem;
  display: flex;
  justify-content: end;
}

.width-70-rem {
  width: 70rem !important;
}
</style>