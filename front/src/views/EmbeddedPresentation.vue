<script setup lang="ts">

import Player from "../components/PresentationPlayer.vue";
import { usePresentations } from "../use/presentations";
import { type Slide } from "../use/presentations.js";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";

const presentations = usePresentations()
const router = useRouter()

const slideNum = ref<number>(0)
const isLast = ref<boolean>(false)
const imgSrc = ref<string>('')
const slides = ref<Slide[]>([])


presentations.getPresentation(Number(router.currentRoute.value.params.id))
    .then(() => {
      slides.value = presentations.presentation.value!.slide_set
      slideNum.value = 0
      imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
      isLast.value = slideNum.value === slides.value.length - 1;
    })

function nextSlide() {
  if (slideNum.value < slides.value.length - 1) {
    slideNum.value += 1
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`
  }
}

function prevSlide() {
  if (slideNum.value > 0) {
    slideNum.value -= 1
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`
  }
}

watch(slideNum, () => {
  isLast.value = slideNum.value === slides.value.length - 1;
})

</script>

<template>
  <div v-if="presentations.presentation.value?.privacy === 1" class="embed">
    <player
        :is-last="isLast"
        :img-src="imgSrc"
        :slide-num="slideNum"
        :is-embed="true"
        @next="nextSlide"
        @prev="prevSlide"
    />
  </div>
  <div v-else>
    <h2>Презентация не является публичной</h2>
  </div>
</template>