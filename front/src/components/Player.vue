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
    <div class="slide" @mouseover="isShowControls = true" @mouseleave="isShowControls = false">
      <img :src="imgSrc" alt="Слайд" :class="{'img': !isFullScreen, 'h-100': isFullScreen}">
      <div class="controls text-end" :class="{'d-none': !isShowControls && !isFullScreen || isFullScreen}">
        <i class="bi bi-fullscreen" @click="fullScreen($event)"></i>
      </div>
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

import {ref} from "vue";

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

const emit = defineEmits(['next', 'prev'])

const isShowControls = ref(false)
const isFullScreen = ref(false)

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight')
    emit('next')
  if (event.code === 'ArrowLeft')
    emit('prev')
})

if (document.addEventListener)
{
  document.addEventListener('fullscreenchange', exitHandler, false);
  document.addEventListener('mozfullscreenchange', exitHandler, false);
  document.addEventListener('MSFullscreenChange', exitHandler, false);
  document.addEventListener('webkitfullscreenchange', exitHandler, false);
}

function exitHandler()
{
  if (!document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement)
  {
    isFullScreen.value = false
  }
}

function fullScreen(event) {
  const fullScreenElement = document.querySelector('.slide')
  isFullScreen.value = true
  if (event.target.requestFullscreen) {
    fullScreenElement.requestFullscreen();
  } else if (event.target.webkitrequestFullscreen) {
    fullScreenElement.webkitRequestFullscreen();
  } else if (event.target.mozRequestFullscreen) {
    fullScreenElement.mozRequestFullScreen();
  }
}

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