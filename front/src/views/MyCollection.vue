<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { Presentation, usePresentations } from "../use/presentations";
import {useUserStore} from "../stores";

const presentations = usePresentations();

const userStore = useUserStore();

presentations.getUserPresentations(userStore.user.id);

const updatePresentations = (deletedPresentation: Presentation) => {
  presentations.deletePresentation(deletedPresentation.id).then(() => {
    presentations.getUserPresentations(userStore.user.id);
  })
}

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