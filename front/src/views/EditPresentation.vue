<script setup>
import {useDefaultForm} from "@/use/defaultForm";
import {ref, watch} from "vue";
import {usePresentations} from "@/use/presentations";
import PresentationForm from "@/components/PresentationForm.vue";
import UiButton from "@/components/UI/UiButton.vue";
import {useUserStore} from "@/stores";
import {useRouter} from "vue-router";

const router = useRouter()

const MAX_TITLE_LENGTH = 255
const MAX_TAG_LENGTH = 100

const required = v => !!v
const MaxTitleLength = v => v.length <= MAX_TITLE_LENGTH

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
  topic: {
    value: '',
    validators: {required}
  },
})

const checked = ref([])
const description = ref({})

const userStore = useUserStore();

presentations.getPresentation(router.currentRoute.value.params.id, {'edit': 'true'})
    .then(() => {
      if (userStore.user.id !== presentations.presentation.value.user.id)
        router.replace({name: 'signup'})
      else {
        form.title.value = presentations.presentation.value.title;
        form.privacy.value = presentations.presentation.value.privacy;
        form.topic.value = presentations.presentation.value.topic;
        checked.value = [1 === form.privacy.value, 2 === form.privacy.value];
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

function edit() {
  if (form.valid) {
    let formData = new FormData();
    formData.append('title', form.title.value)
    formData.append('topic', form.topic.value)
    formData.append('privacy', form.privacy.value)
    presentations.editPresentation(presentations.presentation.value.id, formData).then(() => {
      router.replace({name: 'library'})
    })
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
              :checked2="checked[1]"
              :checked1="checked[0]"
              :is-edit="true"
          >
            <div class="col-3">
              <router-link
                  :to="{name: 'interactivity', params: {id: router.currentRoute.value.params.id}}"
                  class="ui-link interactivity"
              >
                Настроить интерактивность
              </router-link>
            </div>
          </presentation-form>
<!--          <div class="row mt-2 align-items-center">-->
<!--            <div class="col-6">-->
<!--              Собирать лиды-->
<!--              <div>-->
<!--                <div class="form-check form-check-inline">-->
<!--                  <label for="lead-yes">-->
<!--                    Да-->
<!--                  </label>-->
<!--                  <input-->
<!--                      id="lead-yes"-->
<!--                      type="radio"-->
<!--                      name="lead"-->
<!--                      value="true"-->
<!--                      class="form-check-input"-->
<!--                      v-model="form.lead.value"-->
<!--                  >-->
<!--                </div>-->
<!--                <div class="form-check form-check-inline">-->
<!--                  <label for="lead-no">-->
<!--                    Нет-->
<!--                  </label>-->
<!--                  <input-->
<!--                      id="lead-no"-->
<!--                      type="radio"-->
<!--                      name="lead"-->
<!--                      value="false"-->
<!--                      class="form-check-input"-->
<!--                      v-model="form.lead.value"-->
<!--                  >-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="col-6">-->
<!--              <router-link-->
<!--                  :to="{name: 'interactivity', params: {id: router.currentRoute.value.params.id}}"-->
<!--                  class="ui-link interactivity"-->
<!--              >-->
<!--                Настроить интерактивность-->
<!--              </router-link>-->
<!--            </div>-->
<!--          </div>-->
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