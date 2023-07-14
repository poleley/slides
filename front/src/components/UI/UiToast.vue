<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <Transition>
  <div v-if="props.show" class="ui-toast">
    <div class="ui-toast-header">
      <strong class="me-auto">
        <slot name="header"></slot>
      </strong>
    </div>
    <div class="ui-toast-body">
      <slot name="body"></slot>
    </div>
  </div>
  </Transition>
</template>

<style scoped>
.ui-toast-header {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  color: #6c757d;
  border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.ui-toast-body {
  padding: 0.75rem;
  word-wrap: break-word;
}

.ui-toast {
  position: absolute;
  right: 0.5rem;
  top: 4rem;
  width: 350px;
  max-width: 100%;
  font-size: .875rem;
  pointer-events: auto;
  background-color: rgba(255, 255, 255, .85);
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, .1);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, .15);
  border-radius: 0.25rem;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>