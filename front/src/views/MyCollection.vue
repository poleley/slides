<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { presentationApi } from "../use/apiCalls";
import { type Presentation } from "../use/interfaces.js";
import { useUserStore } from "../stores";

const presentations = presentationApi;

const userStore = useUserStore();

presentations.getUserPresentations(Number(userStore.user!.id));

const updatePresentations = (deletedPresentation: Presentation) => {
  presentations.deletePresentation(deletedPresentation.id).then(() => {
    presentations.getUserPresentations(Number(userStore.user!.id));
  });
};
</script>

<template>
  <div class="container">
    <div class="row">
      <presentation-preview
        v-for="presentation in presentations.userPresentations.value"
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
