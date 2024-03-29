<script setup lang="ts">
import router from "../routers/router";
import UiTooltip from "../components/UI/UiTooltip.vue";
import { useUserStore } from "../stores";
import { ref } from "vue";
import Router from "../routers/router";
import { type Presentation } from "../use/interfaces.js";

const userStore = useUserStore();

const props = defineProps<{
  presentation: Presentation;
}>();

const emit = defineEmits(["delete", "updateFavorite"]);

const imgSrc = `/media/${props.presentation.slide_set[0].name}`;
const currentRoute = Router.currentRoute.value.name;

function presentationDetail(id: number) {
  router.replace({ path: `/presentation/${id}` });
}

function editPresentation(id: number) {
  router.replace({ name: "presentation-edit", params: { id: id } });
}

const isFavorite = ref<boolean>(false);

if (userStore.user)
  isFavorite.value = props.presentation.favorite.includes(userStore.user.id);

function toggleFavorite() {
  if (userStore.user) {
    isFavorite.value = !isFavorite.value;
  }
  emit("updateFavorite", props.presentation);
}
</script>

<template>
  <div class="col-4">
    <div class="presentation">
      <div class="preview" @click="presentationDetail(presentation.id)">
        <img class="img-preview" alt="Превью" :src="imgSrc" />
      </div>
      <div class="info">
        <template v-if="currentRoute !== 'library'">
          <div class="row-1">
            <div class="title">
              <template v-if="presentation.title.length > 18">
                {{ presentation.title.slice(0, 18) }}...
              </template>
              <template v-else>
                {{ presentation.title }}
              </template>
            </div>
            <div class="star" @click="toggleFavorite">
              <i v-if="!isFavorite" class="bi bi-star"></i>
              <i v-else class="bi bi-star-fill"></i>
            </div>
          </div>
          <div class="row-2">
            <div class="creator">
              {{ presentation.user.username }}
            </div>
            <div class="views">
              {{ presentation.description.views.total_views || 0 }}
              <i class="bi bi-eye"></i>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row-1">
            <div class="title">
              <template v-if="presentation.title.length > 18">
                {{ presentation.title.slice(0, 18) }}...
              </template>
              <template v-else>
                {{ presentation.title }}
              </template>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="buttons">
              <router-link
                :to="{ name: 'statistics', params: { id: presentation.id } }"
                class="ui-link to-item"
              >
                <i class="bi bi-bar-chart-line-fill ui-tooltip">
                  <ui-tooltip>Статистика</ui-tooltip>
                </i>
              </router-link>
              <i
                class="bi bi-pencil-fill ui-tooltip"
                @click="editPresentation(presentation.id)"
              >
                <ui-tooltip>Редактировать</ui-tooltip>
              </i>
              <i
                class="bi bi-trash3-fill ui-tooltip"
                @click="emit('delete', presentation)"
              >
                <ui-tooltip>Удалить</ui-tooltip>
              </i>
            </div>
            <div class="views">
              {{ presentation.description.views.total_views || 0 }}
              <i class="bi bi-eye"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.presentation {
  width: 19rem;
  margin: 1rem auto;
  border-radius: 0 0 12px 12px;
  border: 1px solid #e1d6c6;
}

.row-1,
.row-2 {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.row-1 {
  margin-bottom: 8px;
}

.img-preview {
  cursor: pointer;
  max-width: 100%;
  /*width: 100%;*/
  height: 11rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  /*margin: 0 auto;*/
}

.preview {
  height: 11rem;
  position: relative;
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

.bi {
  color: #81673e;
}

.bi-share-fill,
.bi-pencil-fill,
.bi-trash3-fill {
  margin-left: 8px;
}

.buttons > .bi:hover {
  cursor: pointer;
  color: #564425;
}

.ui-tooltip {
  position: relative;
  display: inline-block;
}

.ui-tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
