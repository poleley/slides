<script setup>

import UiButton from "@/components/UI/UiButton.vue";
import FileInput from "@/components/UI/FileInput.vue";
import {usePresentationForm} from "@/use/presentationForm";
import {ref, watch} from "vue";
import UiSelect from "@/components/UI/UiSelect.vue";
import {usePresentations} from "@/use/presentations";

const MAX_TITLE_LENGTH = 255
const MAX_TAG_LENGTH = 100
const MAX_FILE_SIZE = 5242880

const required = v => !!v
const MaxTitleLength = v => v.length <= MAX_TITLE_LENGTH
const MaxTagLength = v => {
  for (let t of v.split(',')) {
    if (t.trim().length > MAX_TAG_LENGTH)
      return false
  }
  return true
}
const isPdf = v => {
  if (v === '')
    return false
  const nameSplit = v.name.split('.');
  return !nameSplit[nameSplit.length - 1] !== 'pdf'
}
const maxSize = v => {
  if (v === '')
    return false
  return v.size <= MAX_FILE_SIZE
}

const {form} = usePresentationForm({
  file: {
    value: '',
    validators: {required, isPdf, maxSize}
  },
  title: {
    value: '',
    validators: {required, MaxTitleLength}
  },
  privacy: {
    value: 3,
    validators: {required}
  },
  tags: {
    value: '',
    validators: {MaxTagLength}
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

function submit() {
  if (form.valid) {
    let tags = []
    for (let t of form.tags.value.split(',')) {
      tags.push(t.trim())
    }
    let formData = new FormData();
    formData.append('file', form.file.value)
    formData.append('title', form.title.value)
    formData.append('topic', form.topic.value)
    formData.append('tags', tags)
    formData.append('privacy', form.privacy.value)
    presentations.createPresentation(formData)
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
          <div class="row align-items-center mt-2">
            <div class="row">
              <div class="col-6">
                <div class="w-100">
                  <label for="title">
                    Название*
                  </label>
                  <input
                      class="form-control title"
                      id="title"
                      v-model="form.title.value"
                      @blur="form.title.blur"
                  >
                  <div class="help-text">*Обязательно</div>
                </div>
              </div>
              <div class="col-6">
                Кто может просматривать эту презентацию?
                <div class="form-check">
                  <label>
                    Только я
                    <input
                        type="radio"
                        name="privacy"
                        value="3"
                        class="form-check-input"
                        checked="checked"
                        v-model="form.privacy.value"
                    >
                  </label>
                </div>
                <div class="form-check">
                  <label>
                    Только те, у кого есть ссылка
                    <input
                        type="radio"
                        name="privacy"
                        value="2"
                        class="form-check-input"
                        v-model="form.privacy.value"
                    >
                  </label>
                </div>
                <div class="form-check">
                  <label>
                    Все
                    <input
                        type="radio"
                        name="privacy"
                        value="1"
                        class="form-check-input"
                        v-model="form.privacy.value"
                    >
                  </label>
                </div>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6">
                <div class="w-100">
                  <label for="tags">Теги</label>
                  <input
                      v-model="form.tags.value"
                      class="form-control"
                      id="tags"
                  >
                </div>
              </div>
              <div class="col-6">
                <div class="w-100">
                  <label for="topic">
                    Тема презентации*
                  </label>
                  <ui-select
                      id="topic"
                      @blur="form.topic.blur"
                      v-model="form.topic"
                      :options="topicOptions"
                  >
                    Выберите тему...
                  </ui-select>
                  <div class="help-text">*Обязательно</div>
                </div>
              </div>
            </div>
          </div>
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

textarea {
  resize: none;
}

.help-text {
  font-size: 12px;
}

</style>