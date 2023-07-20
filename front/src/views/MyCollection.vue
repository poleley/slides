<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { presentationApi } from "../use/apiCalls";
import { type Presentation } from "../use/interfaces.js";
import { useUserStore } from "../stores";
import { ref } from "vue";

const presentations = ref<Presentation[]>([]);

const userStore = useUserStore();

presentationApi.getUserPresentations(Number(userStore.user!.id)).then(
  (data) => {presentations.value = data}
);

const updatePresentations = (deletedPresentation: Presentation) => {
  presentationApi.deletePresentation(deletedPresentation.id).then(() => {
    presentationApi.getUserPresentations(Number(userStore.user!.id)).then(
      (data) => {presentations.value = data}
    );
  });
};
</script>

<template>
  <div class="container">
    <div class="row">
      <presentation-preview
        v-for="presentation in presentations"
        :key="presentation.id"
        :presentation="presentation"
        @delete="updatePresentations"
      />
    </div>
  </div>
</template>

<style scoped>
.help-text {
  color: #564425;
}
</style>
