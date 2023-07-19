<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { usePresentations } from "../use/presentations";
import { type Presentation } from "../use/presentations.js";
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";

const presentations = usePresentations();

const userStore = useUserStore();

const router = useRouter();

const currentRoute = router.currentRoute.value.path;

presentations.getPublicPresentations({ favorite__id: userStore.user!.id });

const toggleFavorite = (presentation: Presentation) => {
  if (!userStore.user) {
    router.replace({ name: "signup" });
  } else {
    if (presentation.favorite.includes(userStore.user.id)) {
      presentations.presentationsPublic.value =
        presentations.presentationsPublic.value.filter(
          (publicPresentation) => publicPresentation.id !== presentation.id,
        );
      presentations.removeFromFavorite(presentation.id);
      presentation.favorite = presentation.favorite.filter(
        (id) => id !== userStore.user!.id,
      );
    } else {
      presentations.addToFavorite(presentation.id);
      presentation.favorite.push(userStore.user.id);
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="row">
      <presentation-preview
        v-for="presentation in presentations.presentationsPublic.value"
        :key="presentation.id"
        :presentation="presentation"
        :current-route="currentRoute"
        @update-favorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<style scoped></style>
