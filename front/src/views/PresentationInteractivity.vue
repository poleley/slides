<script setup lang="ts">
import SlidePreview from "../components/SlidePreview.vue";
import type { Description, Presentation, Slide } from "../use/interfaces.js";
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { presentationApi } from "../use/apiCalls";

const router = useRouter();

const presentation = ref<Presentation>();
const userStore = useUserStore();

const slides = ref<Slide[]>([]);

presentationApi
  .getPresentation(Number(router.currentRoute.value.params.id), { edit: "true" })
  .then((data) => {
    presentation.value = data
  }).then(() => {
    if (userStore.user!.id !== presentation.value!.user.id)
      router.replace({ name: "all-presentations" });
    slides.value = presentation.value!.slide_set;
  });

function SlideLeadOn(slideId: number) {
  if (presentation.value !== undefined) {
    let description = ref(presentation.value!.description);
    description.value.lead[String(slideId)] = true;
    presentationApi.editPresentation(presentation.value!.id, {
      description: description.value,
    });
  }
}

function SlideLeadOff(slideId: number) {
  if (presentation.value !== undefined) {
    let description = ref<Description>(presentation.value!.description);
    delete description.value.lead[String(slideId)];
    presentationApi.editPresentation(presentation.value!.id, {
      description: description.value,
    });
  }
}
</script>

<template>
  <div v-if="presentation !== undefined" class="presentation-outer">
    <div class="presentation-inner">
      <slide-preview
        v-for="slide in slides.slice(0, slides.length - 1)"
        :key="slide.id"
        :slide="slide"
        :slides="slides"
        :is-lead-on="slide.id in presentation?.description.lead"
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
