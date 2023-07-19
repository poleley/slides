<script setup lang="ts">
import FileInput from "../components/UI/FileInput.vue";
import { usePresentationForm } from "../use/defaultForm";
import { ref } from "vue";
import { usePresentations } from "../use/presentations";
import PresentationForm from "../components/PresentationForm.vue";
import router from "../routers/router";

const MAX_TITLE_LENGTH = 255;
const MAX_FILE_SIZE = 5242880;

function required(v: string) {
  return !!v;
}

function maxTitleLength(v: string) {
  return v.length <= MAX_TITLE_LENGTH;
}
function isPdf(v: object | string) {
  if (typeof v === "string") return false;
  const nameSplit = v.name.split(".");
  return nameSplit[nameSplit.length - 1] === "pdf";
}
function maxSize(v: object | string) {
  if (typeof v === "string") return false;
  return v.size <= MAX_FILE_SIZE;
}

const form = usePresentationForm({
  file: {
    value: "",
    validators: { required, isPdf, maxSize },
  },
  title: {
    value: "",
    validators: { required, maxTitleLength },
  },
  privacy: {
    value: "2",
    validators: { required },
  },
  topic: {
    value: "",
    validators: { required },
  },
});

const topicOptions = ref([
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
  { val: 13, text: "Путешествия" },
]);

const presentations = usePresentations();

async function submit() {
  if (
    form.valid &&
    "file" in form &&
    "title" in form &&
    "topic" in form &&
    "privacy" in form
  ) {
    let formData = new FormData();
    formData.append("file", form.file!.value);
    formData.append("title", form.title.value);
    formData.append("topic", form.topic.value);
    formData.append("privacy", form.privacy.value);
    await presentations.createPresentation(formData);
    await router.replace({ path: "library" });
  }
}

function updateModelValue(value: string, modelValueKey: string) {
  console.log(value);
  form[modelValueKey].value = value;
}

function updateFormFile(file: FileList) {
  if ("file" in form) {
    form.file!.value = file;
    form.file!.touched = true;
  }
}
</script>

<template>
  <div :class="$style['file-upload-outer']">
    <div :class="$style['file-upload-inner']">
      <h2 class="fw-bold mb-4">Загрузить презентацию</h2>
      <form @submit.prevent="submit">
        <div class="container p-0">
          <div class="row">
            <div class="col-12">
              <file-input
                :model-value="form.file"
                @update:model-value="updateFormFile"
              />
            </div>
          </div>
          <presentation-form
            :model-value="form"
            :topic-options="topicOptions"
            :max-title-length="MAX_TITLE_LENGTH"
            :checked2="true"
            :checked1="false"
            :is-edit="false"
            @update:model-value="updateModelValue"
          />
        </div>
        <button
          type="submit"
          class="btn button-submit w-100 mt-3"
          :disabled="!form.valid"
        >
          Загрузить
        </button>
      </form>
    </div>
  </div>
</template>

<style module>
h2 {
  color: #564425;
}

.file-upload-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.file-upload-inner {
  width: 60%;
}
</style>
