<template>
  <div class="presentation-outer">
    <div class="presentation-inner">
      <div class="title-date">
        <div class="title">
          {{ presentations.presentation.value.title }}
        </div>
        <div class="date">
          {{ dateCreated }}
        </div>
      </div>
      <div class="slides">
        <i
            class="switch bi bi-caret-left-fill"
            @click="prevSlide"
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
            @click="nextSlide"
            :class="{
          'disabled': isLast
            }"
        >
        </i>
      </div>
      <div class="presentation-progress">
        <div
            v-for="(slide, index) in presentations.presentation.value.slides"
            class="progress-item"
            :key="slide"
            :class="{
              'current-progress-item': index === slideNum
            }"
        >
        </div>
      </div>
      <div class="info justify-content-between">
        <div class="stats">
          <div class="total-views">
            <i class="bi bi-eye"></i>{{ totalViews }}
          </div>
          <div class="total-favorite">
            <i class="bi bi-star"></i>{{ totalFavorite }}
          </div>
        </div>
        <div v-if="isUserOwner" class="buttons">
          <i class="bi bi-bar-chart-line-fill ui-tooltip">
            <ui-tooltip>Статистика</ui-tooltip>
          </i>
          <i class="bi bi-share-fill ui-tooltip">
            <ui-tooltip>Поделиться</ui-tooltip>
          </i>
          <i class="bi bi-pencil-fill ui-tooltip">
            <ui-tooltip>Редактировать</ui-tooltip>
          </i>
        </div>
        <div v-else>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiTooltip from '@/components/UI/UiTooltip.vue'
import Router from "@/routers/router";
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";
import {computed, onMounted, ref, watch} from "vue";

const presentations = usePresentations();
const userStore = useUserStore();

const imgSrc = ref('');
const slideNum = ref(0);
const isLast = ref(false);
const totalViews = ref(0);
const totalFavorite = ref(0);
const isUserOwner = ref(false);

const dateCreated = computed(() => {
  return (new Date(presentations.presentation.value.date_created))
      .toLocaleDateString('ru', {dateStyle: "long"})
})

onMounted(async () => {
  await presentations.getPresentation(Router.currentRoute.value.params.id);
  imgSrc.value = `/media/${presentations.presentation.value.slides[slideNum.value]}`;
  isLast.value = slideNum.value === presentations.presentation.value.slides.length - 1;
  totalViews.value = presentations.presentation.value.description.views.total_views || 0;
  totalFavorite.value = presentations.presentation.value.description.total_favorite || 0;
  if (presentations.presentation.value.user.id === userStore.user.id)
    isUserOwner.value = true
})

function nextSlide() {
  if (slideNum.value < presentations.presentation.value.slides.length - 1) {
    slideNum.value += 1
    imgSrc.value = `/media/${presentations.presentation.value.slides[slideNum.value]}`
  }
}

function prevSlide() {
  if (slideNum.value > 0) {
    slideNum.value -= 1
    imgSrc.value = `/media/${presentations.presentation.value.slides[slideNum.value]}`
  }
}

watch(slideNum, () => {
  isLast.value = slideNum.value === presentations.presentation.value.slides.length - 1;
})

</script>

<style scoped>
.ui-tooltip {
  position: relative;
  display: inline-block;
}

.ui-tooltip:hover .tooltiptext {
  visibility: visible;
}

.presentation-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.presentation-inner {
  text-align: center;
  width: 80%;
}

.slides {
  width: 70%;
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  justify-content: space-around;
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

.title-date {
  display: flex;
  width: 62%;
  margin: 0 auto 0.25rem auto;
  align-items: end;
  justify-content: space-between;
}

.title {
  width: 70%;
  text-align: left;
  font-size: 32px;
  font-weight: bold;
}

.date {
  text-align: right;
  width: 30%;
}

img {
  width: 100%;
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.slide {
  margin-left: auto;
  margin-right: auto;
}

.presentation-progress {
  display: flex;
  width: 60%;
  margin: 0.75rem auto 0 auto;
}

.progress-item {
  height: 8px;
  border-radius: 4px;
  margin: 8px;
  background-color: #bebebe;
  width: 100%;
}

.current-progress-item {
  background-color: #81673e;
}

.info {
  position: relative;
  display: flex;
  width: 62%;
  margin: 1rem auto;
  align-items: center;
}

.bi-eye, .bi-star {
  margin-right: 4px;
}

.total-favorite {
  margin-left: 8px;
}

.buttons {
  color: #81673e;
}

.buttons > .bi {
  margin: 0 8px;
}

.buttons > .bi:hover {
  cursor: pointer;
  color: #564425;
}

.stats {
  display: flex;
  color: #81673e;
}

</style>