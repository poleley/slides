<script setup lang="ts">
import { ref } from "vue";
import { useEventListener } from "@vueuse/core";

defineProps<{
  slideNum: number;
  imgSrc: string;
  isLast: boolean;
  isEmbed: boolean;
}>();

const emit = defineEmits(["next", "prev"]);

const isShowControls = ref<boolean>(false);
const isFullScreen = ref<boolean>(false);
const slide = ref<HTMLElement>();

useEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") emit("next");
  if (event.code === "ArrowLeft") emit("prev");
});

useEventListener(document, "fullscreenchange", exitHandler, false);
useEventListener(document, "mozfullscreenchange", exitHandler, false);
useEventListener(document, "MSFullscreenChange", exitHandler, false);
useEventListener(document, "webkitfullscreenchange", exitHandler, false);

function exitHandler() {
  isFullScreen.value = false;
}

function fullScreen(event: Event) {
  isFullScreen.value = true;
  if ((event.target as HTMLElement)["requestFullscreen"])
    (slide.value as HTMLElement)["requestFullscreen"]();
}
</script>

<template>
  <div :class="[$style.slides, { [$style['width-70']]: !isEmbed }]">
    <i
      class="bi bi-caret-left-fill"
      :class="[$style.switch, { [$style.disabled]: slideNum === 0 }]"
      @click="$emit('prev')"
    >
    </i>
    <div
      ref="slide"
      :class="$style.slide"
      @mouseover="isShowControls = true"
      @mouseleave="isShowControls = false"
    >
      <img
        :src="imgSrc"
        alt="Слайд"
        :class="{ [$style.img]: !isFullScreen, 'h-100': isFullScreen }"
      />
      <div
        class="text-end"
        :class="[
          $style.controls,
          { 'd-none': (!isShowControls && !isFullScreen) || isFullScreen },
        ]"
      >
        <i
          class="bi bi-fullscreen"
          :class="$style['bi-fullscreen']"
          @click="fullScreen($event)"
        ></i>
      </div>
    </div>
    <i
      class="bi bi-caret-right-fill"
      :class="[$style.switch, { [$style.disabled]: isLast }]"
      @click="$emit('next')"
    >
    </i>
  </div>
</template>

<style module>
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

.slide {
  position: relative;
}

.img {
  width: 100%;
  max-width: 100%;
}

.controls {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 4px 8px;
  z-index: 1;
}

.bi-fullscreen {
  color: #fff;
  cursor: pointer;
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
