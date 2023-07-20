<script setup lang="ts">
import { ref, reactive } from "vue";
import PresentationForm from "../components/PresentationForm.vue";
import { useUserStore } from "../stores";
import { useRouter } from "vue-router";
import { type TopicOption } from "../components/PresentationForm.vue";
import { presentationApi } from "../use/apiCalls";
import { useForm } from "../use/form.js";
import type { Presentation } from "../use/interfaces.js";

const router = useRouter();

const MAX_TITLE_LENGTH: number = 255;
const MAX_TAG_LENGTH: number = 100;

function required(v: string) {
  return !!v;
}

function maxTitleLength(v: string) {
  return v.length <= MAX_TITLE_LENGTH;
}

const form = reactive(
  useForm({
    title: { validators: { required, maxTitleLength } },
    privacy: { validators: { required } },
    topic: { validators: { required } },
  }),
);

const checked = ref<boolean[]>([]);

const userStore = useUserStore();

const presentation = ref<Presentation>();

presentationApi
  .getPresentation(Number(router.currentRoute.value.params.id), { edit: "true" })
  .then((data) => {
    presentation.value = data;
    if (userStore.user?.id !== presentation.value!.user.id)
      router.replace({ name: "signup" });
    else {
      form.title.value = presentation.value!.title;
      form.privacy.value = String(presentation.value!.privacy);
      checked.value = ["1" === form.privacy.value, "2" === form.privacy.value];
      form.topic.value = String(presentation.value!.topic);
    }
  });

const topicOptions = ref<TopicOption[]>([
  { val: 1, text: "Искусство" },
  { val: 2, text: "Бизнес" },
  { val: 3, text: "Дизайн" },
  { val: 4, text: "Экономика" },
  { val: 5, text: "Образование" },
  { val: 6, text: "Здоровье" },
  { val: 7, text: "Закон" },
  { val: 8, text: "Маркетинг" },
  { val: 9, text: "Наука" },
  { val: 10, text: "Самообразование" },
  { val: 11, text: "Спорт" },
  { val: 12, text: "Технологии" },
  { val: 13, text: "Путешествия" }
]);

function edit() {
  if (form.valid) {
    let formData = new FormData();
    if ("title" in form && "topic" in form && "privacy" in form) {
      formData.append("title", form.title.value);
      formData.append("topic", form.topic.value);
      formData.append("privacy", form.privacy.value);
    }
    presentationApi
      .editPresentation(presentation.value!.id, formData)
      .then(() => {
        router.replace({ name: "library" });
      });
  }
}

function updateModelValue(key: Exclude<keyof typeof form, "valid">, value: string) {
  form[key].value = value;
}
</script>

<template>
  <div class="edit-outer">
    <div class="edit-inner">
      <template v-if="presentation !== undefined">
        <h2 class="fw-bold mb-4">Редактировать презентацию</h2>
        <form @submit.prevent="edit">
          <div class="container p-0">
            <presentation-form
              :model-value="form"
              :topic-options="topicOptions"
              :max-tag-length="MAX_TAG_LENGTH"
              :max-title-length="MAX_TITLE_LENGTH"
              :checked2="checked[1]"
              :checked1="checked[0]"
              :is-edit="true"
              @update:model-value-field="updateModelValue"
            >
              <div class="col-3">
                <router-link
                  :to="{
                  name: 'interactivity',
                  params: { id: router.currentRoute.value.params.id },
                }"
                  class="ui-link interactivity"
                >
                  Настроить интерактивность
                </router-link>
              </div>
            </presentation-form>
          </div>
          <button
            type="submit"
            class="btn button-submit w-100 mt-3"
            :disabled="!form.valid"
          >
            Сохранить
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<style scoped>
h2 {
  color: #564425;
}

.edit-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.edit-inner {
  width: 60%;
}

.interactivity {
  font-weight: bold;
}
</style>
