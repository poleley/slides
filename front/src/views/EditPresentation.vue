<script setup>
import {useDefaultForm} from "@/use/defaultForm";
import {onMounted, ref, watch} from "vue";
import {usePresentations} from "@/use/presentations";
import PresentationForm from "@/components/PresentationForm.vue";
import UiButton from "@/components/UI/UiButton.vue";
import Router from "@/routers/router";
import {useUserStore} from "@/stores";
import router from "@/routers/router";

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

const {form} = useDefaultForm({
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
const description = ref({})

const userStore = useUserStore();

onMounted(async () => {
  await presentations.getPresentation(Router.currentRoute.value.params.id, {'edit': 'true'});
  if (userStore.user.id !== presentations.presentation.value.user.id)
    await router.replace({name: 'signup'})
  else {
    form.title.value = presentations.presentation.value.title;
    form.privacy.value = presentations.presentation.value.privacy;
    form.tags.value = presentations.presentation.value.tags;
    form.topic.value = presentations.presentation.value.topic;
    form.lead.value = String(presentations.presentation.value.description.lead);
    description.value = presentations.presentation.value.description;
    checked.value = [1 === form.privacy.value, 2 === form.privacy.value, 3 === form.privacy.value];
  }
})

watch(() => form.privacy.value, () => {
  form.privacy.value = Number(form.privacy.value)
})

watch(() => form.topic.value, () => {
  form.topic.value = Number(form.topic.value)
})

watch(() => form.lead.value, () => {
  description.value.lead = form.lead.value === "true"
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

function edit() {
  if (form.valid) {
    let formData = new FormData();
    let tags = []
    if (form.tags.value !== '') {
      for (let t of form.tags.value.split(',')) {
        tags.push(t.trim())
      }
      formData.append('tags', tags)
    }
    formData.append('title', form.title.value)
    formData.append('topic', form.topic.value)
    formData.append('tags', tags)
    formData.append('privacy', form.privacy.value)
    formData.append('description', JSON.stringify(description.value))
    presentations.editPresentation(presentations.presentation.value.id, formData)
  }
}
</script>

<template>
  <div class="edit-outer">
    <div class="edit-inner">
      <h2 class="fw-bold mb-4">Редактировать презентацию</h2>
      <form @submit.prevent="edit">
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
                      value="true"
                      class="form-check-input"
                      v-model="form.lead.value"
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
                      value="false"
                      class="form-check-input"
                      v-model="form.lead.value"
                  >
                </div>
              </div>
            </div>
            <div class="col-6">
              <a href="#" class="ui-link interactivity">
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