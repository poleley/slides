<script setup>
import Presentation from "@/components/Presentation.vue";
import {usePresentations} from "@/use/presentations";
import {onMounted} from "vue";
import Router from "@/routers/router";

const presentations = usePresentations();

onMounted(async () => {
  await presentations.getPublicPresentations();
  console.log(presentations.presentationsPublic.value)
})

const currentRoute = Router.currentRoute.value.path

</script>

<template>
  <div class="container">
    <div class="row">
      <presentation
          v-for="presentation in presentations.presentationsPublic.value"
          :presentation="presentation"
          :current-route="currentRoute"
      />
    </div>
  </div>
</template>

<style scoped>

</style>