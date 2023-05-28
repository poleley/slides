<script setup>
import Presentation from "@/components/Presentation.vue";
import {usePresentations} from "@/use/presentations";
import {onMounted} from "vue";
import Router from "@/routers/router";
import router from "@/routers/router";
import {useUserStore} from "@/stores";

const presentations = usePresentations();
const userStore = useUserStore()

onMounted(async () => {
  await presentations.getPublicPresentations();
})

const currentRoute = Router.currentRoute.value.path

const toggleFavorite = (presentation) => {
  if (!userStore.user) {
    router.replace({name: 'signup'})
  } else {
    if (presentation.favorite.includes(userStore.user.id)) {
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