<script setup>

import router from "@/routers/router";

const props = defineProps({
  presentation: {
    type: Object,
    required: true,
    default: () => {
    },
  },
  currentRoute: {
    type: String,
    required: false,
    default: () => ""
  }
});

const imgSrc = `/media/${props.presentation.slides[0]}`;

function presentationDetail(id) {
  router.replace({path: `/presentation/${id}`})
}
</script>

<template>
  <div class="col-4">
    <div class="presentation" @dblclick="presentationDetail(presentation.id)">
      <div class="preview">
        <img class="img-preview" alt="Превью" :src="imgSrc">
      </div>
      <div class="info">
        <template v-if="currentRoute === '/'">
          <div class="row-1">
            <div class="title">
              <template v-if="presentation.title.length > 19">
                {{ presentation.title.slice(0, 19) }}...
              </template>
              <template v-else>
                {{ presentation.title }}
              </template>
            </div>
            <div class="star">
              <i class="bi bi-star"></i>
            </div>
          </div>
          <div class="row-2">
            <div class="creator">
              {{ presentation.user.last_name }} {{ presentation.user.first_name }}
            </div>
            <div class="views">
              {{ presentation.description.views.total_views || 0 }} <i class="bi bi-eye"></i>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row-1">
            <div class="title">
              <template v-if="presentation.title.length > 19">
                {{ presentation.title.slice(0, 19) }}...
              </template>
              <template v-else>
                {{ presentation.title }}
              </template>
            </div>
            <div class="views">
              {{ presentation.description.views.total_views || 0 }} <i class="bi bi-eye"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presentation {
  cursor: pointer;
  width: 90%;
  margin: 1rem auto;
  border-radius: 0 0 12px 12px;
  border: 1px solid #e1d6c6;
}

.row-1, .row-2 {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.row-1 {
  margin-bottom: 8px;
}

.img-preview, .preview {
  max-width: 100%;
  width: 100%;
}

.title {
  font-weight: bold;
  font-size: 20px;
}

.star {
  cursor: pointer;
}

.views {
  color: #3d3d3d;
}

.info {
  border-top: 1px solid #e1d6c6;
  padding: 0.5rem 1rem;
}
</style>