<script setup>
import Presentation from "@/components/Presentation.vue";
import {usePresentations} from "@/use/presentations";
import {onMounted} from "vue";
import {useUserStore} from "@/stores";

const presentations = usePresentations();

const userStore = useUserStore();

onMounted(async () => {
  await presentations.getUserPresentations(userStore.user.id);
  console.log(presentations.userPresentations.value)
})

</script>

<template>
  <div class="container">
    <div class="row">
      <presentation
          v-for="presentation in presentations.userPresentations.value"
          :presentation="presentation"
      />
    </div>
  </div>
</template>

<style scoped>

</style>