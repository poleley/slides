<script setup lang="ts">
import PresentationPreview from "../components/PresentationPreview.vue";
import { type Presentation } from "../use/interfaces.js";
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";
import { presentationApi } from "../use/apiCalls";
import { ref } from "vue";

const presentations = ref<Presentation[]>([]);

presentationApi.getPublicPresentations().then(
  (data) => {
    presentations.value = data
  }
)

const userStore = useUserStore();
const router = useRouter();

const currentRoute = router.currentRoute.value.path;

const toggleFavorite = (presentation: Presentation) => {
  if (!userStore.user) {
    router.replace({ name: "signup" });
  } else {
    if (presentation.favorite.includes(userStore.user.id)) {
      presentationApi.removeFromFavorite(presentation.id);
      presentation.favorite = presentation.favorite.filter(
        (id) => id !== userStore.user!.id,
      );
    } else {
      presentationApi.addToFavorite(presentation.id);
      presentation.favorite.push(userStore.user.id);
    }
  }
};
</script>

<template>
  <div class="container">
    <div class="row">
      <presentation-preview
        v-for="presentation in presentations"
        :key="presentation.id"
        :presentation="presentation"
        :current-route="currentRoute"
        @update-favorite="toggleFavorite"
      />
    </div>
  </div>
</template>
