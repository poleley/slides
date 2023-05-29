<script setup>
import Presentation from "@/components/Presentation.vue";
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";
import Router from "@/routers/router";
import router from "@/routers/router";

const presentations = usePresentations();

const userStore = useUserStore();

const currentRoute = Router.currentRoute.value.path

presentations.getPublicPresentations({"favorite__id": userStore.user.id});

const toggleFavorite = (presentation) => {
  if (!userStore.user) {
    router.replace({name: 'signup'})
  } else {
    if (presentation.favorite.includes(userStore.user.id)) {
      presentations.presentationsPublic.value = presentations.presentationsPublic.value
          .filter(publicPresentation => publicPresentation.id !== presentation.id)
      presentations.removeFromFavorite(presentation.id)
      presentation.favorite = presentation.favorite.filter(id => id !== userStore.user.id)
    } else {
      presentations.addToFavorite(presentation.id)
      presentation.favorite.push(userStore.user.id)
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <presentation
          v-for="presentation in presentations.presentationsPublic.value"
          :presentation="presentation"
          :current-route="currentRoute"
          @updateFavorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<style scoped>

</style>