<script setup lang="ts">
import { type Slide } from "../use/interfaces.js";

defineProps<{
  slides: Slide[];
  selectedSlidesIds: number[];
}>();

defineEmits(["changeSlidesIds"]);
</script>

<template>
  <div class="row row-slides">
    <div v-for="slide in slides" :key="slide.id" class="col col-4 slide-item">
      <div class="img-slide-preview">
        <input
          class="form-check-input input-check-slide"
          type="checkbox"
          :value="slide.id"
          :checked="selectedSlidesIds.includes(slide.id)"
          @change="$emit('changeSlidesIds', slide, $event)"
        />
        <img class="img-slide" :src="`/media/${slide.name}`" alt="Слайд" />
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 18rem;
}

.img-slide-preview {
  margin: auto;
  position: relative;
  width: 20rem;
}

.img-slide {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -9rem;
  margin-top: 1rem;
}

.input-check-slide {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  z-index: 2;
}

.slide-item {
  height: 12rem;
  margin: 1rem 0;
}

.row-slides {
  overflow-y: auto;
  max-height: 27rem;
}
</style>
