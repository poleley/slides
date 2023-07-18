<script setup lang="ts">
import SlidePreview from "../components/SlidePreview.vue";
import { Slide, usePresentations } from "../use/presentations";
import {useUserStore} from "../stores";
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter()

const presentations = usePresentations()
const userStore = useUserStore();

const slides = ref<Slide[]>([]);

presentations.getPresentation(router.currentRoute.value.params.id, {'edit': 'true'})
    .then(() => {
      if (userStore.user.id !== presentations.presentation.value.user.id)
        router.replace({name: 'all-presentations'})
      slides.value = presentations.presentation.value.slide_set
    })

function SlideLeadOn(slideId: number) {
  let description = ref(presentations.presentation.value.description)
  description.value.lead[String(slideId)] = true
  presentations.editPresentation(
      presentations.presentation.value.id,
      {"description": description.value}
  )
}

function SlideLeadOff(slideId: number) {
  let description = ref(presentations.presentation.value.description)
  delete description.value.lead[String(slideId)]
  presentations.editPresentation(
      presentations.presentation.value.id,
      {"description": description.value}
  )
}

</script>

<template>
  <div class="presentation-outer">
    <div class="presentation-inner">
      <slide-preview
          v-for="slide in slides.slice(0, slides.length - 1)"
          :key="slide.id"
          :slide="slide"
          :slides="slides"
          :is-lead-on="slide.id in presentations.presentation.value.description.lead"
          @lead-on="SlideLeadOn"
          @lead-off="SlideLeadOff"
      />
    </div>
  </div>
</template>

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