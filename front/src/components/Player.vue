<template>
  <div class="slides" :class="{'width-70': !isEmbed}">
    <i
        class="switch bi bi-caret-left-fill"
        @click="$emit('prev')"
        :class="{
          'disabled': slideNum === 0
            }"
    >
    </i>
    <div class="slide">
      <img :src="imgSrc" alt="Слайд">
    </div>
    <i
        class="switch bi bi-caret-right-fill"
        @click="$emit('next')"
        :class="{
          'disabled': isLast
            }"
    >
    </i>
  </div>
</template>

<script setup>

defineProps({
  slideNum: {
    type: Number,
    required: true
  },
  imgSrc: {
    type: String,
    required: true
  },
  isLast: {
    type: Boolean,
    required: true
  },
  isEmbed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['next', 'prev'])

</script>

<style scoped>
.slides {
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  justify-content: space-around;
}

.width-70 {
  width: 70%;
}

img {
  width: 100%;
  max-width: 100%;
}

.switch {
  font-size: 3rem;
  color: #81673e;
  cursor: pointer;
}

.switch:hover {
  color: #564425;
}

.disabled {
  color: #bebebe;
  cursor: default;
}

.disabled:hover {
  color: #bebebe;
}
</style>