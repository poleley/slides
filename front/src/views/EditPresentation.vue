<script setup>
import {usePresentationForm} from "@/use/presentationForm";
import {onMounted, ref, watch} from "vue";
import {usePresentations} from "@/use/presentations";
import PresentationForm from "@/components/PresentationForm.vue";
import UiButton from "@/components/UI/UiButton.vue";
import Router from "@/routers/router";

const MAX_TITLE_LENGTH = 255
const MAX_TAG_LENGTH = 100

const required = v => !!v
const MaxTitleLength = v => v.length <= MAX_TITLE_LENGTH
const MaxTagLength = v => {
  for (let t of v.split(',')) {
    if (t.trim().length > MAX_TAG_LENGTH)
      return false
  }
  return true
}

const presentations = usePresentations()

const {form} = usePresentationForm({
  title: {
    value: '',
    validators: {required, MaxTitleLength}
  },
  privacy: {
    value: '',
    validators: {required}
  },
  tags: {
    value: '',
    validators: {MaxTagLength}
  },
  topic: {
    value: '',
    validators: {required}
  },
  lead: {
    value: ''
  }
})

const checked = ref([])

onMounted(async () => {
  await presentations.getPresentation(Router.currentRoute.value.params.id);
  form.title.value = presentations.presentation.value.title;
  form.privacy.value = presentations.presentation.value.privacy;
  form.tags.value = presentations.presentation.value.tags.join(', ');
  form.topic.value = presentations.presentation.value.topic;
  form.lead.value = presentations.presentation.value.description.lead;
  checked.value = [1 === form.privacy.value, 2 === form.privacy.value, 3 === form.privacy.value];
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

function submit() {
  if (form.valid) {
    let tags = []
    for (let t of form.tags.value.split(',')) {
      tags.push(t.trim())
    }
    let formData = new FormData();
    formData.append('title', form.title.value)
    formData.append('topic', form.topic.value)
    formData.append('tags', tags)
    formData.append('privacy', form.privacy.value)
    // presentations.createPresentation(formData)
  }
}
</script>

<template>
  <div class="edit-outer">
    <div class="edit-inner">
      <h2 class="fw-bold mb-4">Редактировать презентацию</h2>
      <form @submit.prevent="submit">
        <div class="container p-0">
          <presentation-form
              :model-value="form"
              :topic-options="topicOptions"
              :max-tag-length="MAX_TAG_LENGTH"
              :max-title-length="MAX_TITLE_LENGTH"
              :checked3="checked[2]"
              :checked2="checked[1]"
              :checked1="checked[0]"
          />
          <div class="row mt-2 align-items-center">
            <div class="col-6">
              Собирать лиды
              <div>
                <div class="form-check form-check-inline">
                  <label for="lead-yes">
                    Да
                  </label>
                  <input
                      id="lead-yes"
                      type="radio"
                      name="lead"
                      value="1"
                      class="form-check-input"
                      :checked="form.lead.value"
                  >
                </div>
                <div class="form-check form-check-inline">
                  <label for="lead-no">
                    Нет
                  </label>
                  <input
                      id="lead-no"
                      type="radio"
                      name="lead"
                      value="0"
                      class="form-check-input"
                      :checked="!form.lead.value"
                  >
                </div>
              </div>
            </div>
            <div class="col-6">
              <a href="#" class="interactivity">
                Настроить интерактивность
              </a>
            </div>
          </div>
        </div>
        <ui-button
            type="submit"
            class="button-submit w-100 mt-3"
            :disabled="!form.valid"
        >
          Сохранить
        </ui-button>
      </form>
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