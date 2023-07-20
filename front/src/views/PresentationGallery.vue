<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { type Presentation } from "../use/interfaces.js";
import { onMounted } from "vue";
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";
import { presentationApi } from "../use/apiCalls";

const presentations = presentationApi;
const userStore = useUserStore();
const router = useRouter();

onMounted(async () => {
  await presentations.getPublicPresentations();
});

const currentRoute = router.currentRoute.value.path;

const toggleFavorite = (presentation: Presentation) => {
  if (!userStore.user) {
    router.replace({ name: "signup" });
  } else {
    if (presentation.favorite.includes(userStore.user.id)) {
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
