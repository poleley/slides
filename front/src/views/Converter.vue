<script setup>

import UiButton from "@/components/UI/UiButton.vue";
import FileInput from "@/components/UI/FileInput.vue";
import {useDefaultForm} from "@/use/defaultForm";
import {ref, watch} from "vue";
import {usePresentations} from "@/use/presentations";
import PresentationForm from "@/components/PresentationForm.vue";
import router from "@/routers/router";

const MAX_TITLE_LENGTH = 255
const MAX_FILE_SIZE = 5242880

const required = v => !!v
const MaxTitleLength = v => v.length <= MAX_TITLE_LENGTH
const isPdf = v => {
  if (v === '')
    return false
  const nameSplit = v.name.split('.');
  return nameSplit[nameSplit.length - 1] === 'pdf'
}
const maxSize = v => {
  if (v === '')
    return false
  return v.size <= MAX_FILE_SIZE
}

const {form} = useDefaultForm({
  file: {
    value: '',
    validators: {required, isPdf, maxSize}
  },
  title: {
    value: '',
    validators: {required, MaxTitleLength}
  },
  privacy: {
    value: "2",
    validators: {required}
  },
  topic: {
    value: '',
    validators: {required}
  }
})

watch(() => form.privacy.value, () => {
  form.privacy.value = Number(form.privacy.value)
})

watch(() => form.topic.value, () => {
  form.topic.value = Number(form.topic.value)
})

const topicOptions = ref([
  {val: 1, text: 'Искусство'},
  {val: 2, text: 'Бизнес'},
  {val: 3, text: 'Дизайн'},
  {val: 4, text: 'Экономика'},
  {val: 5, text: 'Образование'},
  {val: 6, text: 'Здоровье'},
  {val: 7, text: 'Закон'},
  {val: 8, text: 'Маркетинг'},
  {val: 9, text: 'Наука'},
  {val: 10, text: 'Самообразование'},
  {val: 11, text: 'Спорт'},
  {val: 12, text: 'Технологии'},
  {val: 13, text: 'Путешествия'}
])

const presentations = usePresentations()

async function submit() {
  if (form.valid) {
    let formData = new FormData();
    formData.append('file', form.file.value)
    formData.append('title', form.title.value)
    formData.append('topic', form.topic.value)
    formData.append('privacy', form.privacy.value)
    await presentations.createPresentation(formData)
    await router.replace({path: 'library'})
  }
}

</script>

<template>
  <div class="file-upload-outer">
    <div class="file-upload-inner">
      <h2 class="fw-bold mb-4">Загрузить презентацию</h2>
      <form @submit.prevent="submit">
        <div class="container p-0">
          <div class="row">
            <div class="col-12">
              <file-input
                  v-model="form.file"
              />
            </div>
          </div>
          <presentation-form
          :model-value="form"
          :topic-options="topicOptions"
          :max-title-length="MAX_TITLE_LENGTH"
          />
        </div>
        <ui-button
            type="submit"
            class="button-submit w-100 mt-3"
            :disabled="!form.valid"
        >
          Загрузить
        </ui-button>
      </form>
    </div>
  </div>
</template>

<style scoped>

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