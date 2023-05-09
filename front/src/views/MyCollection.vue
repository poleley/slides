<script setup>
import Presentation from "@/components/Presentation.vue";
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";

const presentations = usePresentations();

const userStore = useUserStore();

presentations.getUserPresentations(userStore.user.id);

const updatePresentations = (deletedPresentation) => {
  presentations.deletePresentation(deletedPresentation.id).then(() => {
    presentations.userPresentations.value = presentations.userPresentations.value.filter(
        presentation => presentation.id !== deletedPresentation.id
    )
  })
}

</script>

<template>
  <div class="container">
    <div class="row">
      <presentation
          v-for="presentation in presentations.userPresentations.value"
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