<template>
  <div class="presentation-outer">
    <div class="presentation-inner">
      <slide-preview
          v-for="(slide, index) in slides.slice(0, slides.length - 1)"
          :slide="slide"
          :slides="slides"
      />
    </div>
  </div>
</template>

<script setup>
import SlidePreview from "@/components/SlidePreview.vue";
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";
import {useRouter} from "vue-router";
import {ref} from "vue";
import UiButton from "@/components/UI/UiButton.vue";

const router = useRouter()

const presentations = usePresentations()
const userStore = useUserStore();

const slides = ref([]);

presentations.getPresentation(router.currentRoute.value.params.id, {'edit': 'true'})
    .then(() => {
      if (userStore.user.id !== presentations.presentation.value.user.id)
        router.replace({name: 'all-presentations'})
      slides.value = presentations.presentation.value.slide_set
    })

</script>

<style scoped>
.presentation-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.presentation-inner {
  margin: 2rem auto;
  text-align: center;
  width: 80%;
}
</style>