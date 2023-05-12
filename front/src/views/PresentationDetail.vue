<template>
  <ui-toast :show="isShowToast">
    <template v-slot:header>{{ leads.leadCreateMessage.value.header }}</template>
    <template v-slot:body>{{ leads.leadCreateMessage.value.body }}</template>
  </ui-toast>

  <question v-model="isShowQuestion">
    <template v-slot:question>
      {{ questions.question.value.question_text }}
    </template>
    <template v-slot:answers>
      <div v-for="answer in questions.question.value.answer_set">
        <div class="form-check">
          <input
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              :id="answer.id"
              :value="answer.id"
              v-model="answerId"
          >
          <label class="form-check-label" :for="answer.id">
            {{ answer.answer_text }}
          </label>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <ui-button
          type="submit"
          class="button-submit"
          @click.prevent="answerTheQuestion"
          :disabled="answerId.value === ''"
      >
        Ответить
      </ui-button>
    </template>
  </question>

  <ui-dialog
      v-model="isShowModal"
  >
    <template v-slot:title>
      Хотите узнать больше?
    </template>
    <template v-slot:body>
      <div class="help-text">
        Оставьте свои контактные данные и мы свяжемся с вами
      </div>
      <form @submit.prevent="sendLead">
        <div class="input-item">
          <input
              v-model="leadForm.firstName.value"
              type="text"
              placeholder="Имя"
              class="form-control"
              :class="{'is-invalid': !leadForm.firstName.valid && leadForm.firstName.touched}"
              @blur="leadForm.firstName.blur"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="leadForm.lastName.value"
              type="text"
              placeholder="Фамилия"
              class="form-control"
              :class="{'is-invalid': !leadForm.lastName.valid && leadForm.lastName.touched}"
              @blur="leadForm.lastName.blur"
          />
          <div class="invalid-feedback">
            Заполните это поле
          </div>
        </div>

        <div class="input-item">
          <input
              v-model="leadForm.email.value"
              type="email"
              placeholder="Электронная почта"
              class="form-control"
              :class="{'is-invalid': !leadForm.email.valid && leadForm.email.touched}"
              @blur="leadForm.email.blur"
          />
          <template v-if="leadForm.email.errors.required">
            <div class="invalid-feedback">
              Заполните это поле
            </div>
          </template>
          <template v-else-if="leadForm.email.errors.isEmail">
            <div class="invalid-feedback">
              Введите корректную электронную почту
            </div>
          </template>
        </div>

        <ui-button
            type="submit"
            :disabled="!leadForm.valid"
            class="button-submit"
        >
          Отправить
        </ui-button>
      </form>
    </template>
  </ui-dialog>
  <div class="presentation-outer">
    <div class="presentation-inner">
      <div class="title-date">
        <div class="title">
          {{ presentations.presentation.value.title }}
        </div>
        <div class="date">
          {{ dateCreated }}
        </div>
      </div>
      <div class="slides">
        <i
            class="switch bi bi-caret-left-fill"
            @click="prevSlide"
            :class="{
          'disabled': slideNum === 0
            }"
        >
        </i>
        <div class="slide">
          <img :src="imgSrc" alt="Слайд">
        </div>
        <i
            class="switch bi bi-caret-right-fill"
            @click="nextSlide"
            :class="{
          'disabled': isLast
            }"
        >
        </i>
      </div>
      <div class="presentation-progress">
        <div
            v-for="(slide, index) in slides"
            class="progress-item"
            :class="{
              'current-progress-item': index === slideNum
            }"
        >
        </div>
      </div>
      <div class="info justify-content-between">
        <div class="stats">
          <div class="total-views">
            <i class="bi bi-eye"></i>{{ totalViews }}
          </div>
          <div class="total-favorite">
            <i class="bi bi-star"></i>{{ totalFavorite }}
          </div>
        </div>
        <div v-if="isUserOwner" class="buttons">
          <router-link
              :to="{name: 'statistics', params: {id: router.currentRoute.value.params.id}}"
              class="ui-link to-item"
          >
          <i class="bi bi-bar-chart-line-fill ui-tooltip">
            <ui-tooltip>Статистика</ui-tooltip>
          </i>
          </router-link>
          <i class="bi bi-share-fill ui-tooltip">
            <ui-tooltip>Поделиться</ui-tooltip>
          </i>
          <router-link
              :to="{name: 'presentation-edit', params: {id: router.currentRoute.value.params.id}}"
              class="ui-link to-item"
          >
          <i class="bi bi-pencil-fill ui-tooltip" @click="editPresentation(presentations.presentation.value.id)">
            <ui-tooltip>Редактировать</ui-tooltip>
          </i>
          </router-link>
          <i class="bi bi-trash3-fill ui-tooltip" @click="deletePresentation(presentations.presentation.value.id)">
            <ui-tooltip>Удалить</ui-tooltip>
          </i>
        </div>
        <div v-else-if="isLead">
          <ui-button
              class="button-submit"
              @click="leadStart"
          >
            Оставить контакты
          </ui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UiTooltip from '@/components/UI/UiTooltip.vue'
import Router from "@/routers/router";
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";
import {computed, ref, watch} from "vue";
import UiButton from "@/components/UI/UiButton.vue";
import UiDialog from "@/components/UI/UiDialog.vue";
import UiToast from "@/components/UI/UiToast.vue";
import {useDefaultForm} from "@/use/defaultForm";
import {useLead} from "@/use/leads";
import router from "@/routers/router";
import {useQuestion} from "@/use/question";
import Question from "@/components/UI/Question.vue";

const presentations = usePresentations();
const userStore = useUserStore();
const questions = useQuestion();

const imgSrc = ref('');
const slideNum = ref(null);
const isLast = ref(false);
const totalViews = ref(0);
const totalFavorite = ref(0);
const isUserOwner = ref(false);
const isShowModal = ref(false);
const currentSlideId = ref('');
const isShowToast = ref(false);
const isShowQuestion = ref(false);
const slides = ref([])
const answerId = ref('')
const isLead = ref(false)

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

const required = v => !!v
const isEmail = v => EMAIL_REGEXP.test(v)

const leadForm = useDefaultForm({
  firstName: {
    value: '',
    validators: {required}
  },
  lastName: {
    value: '',
    validators: {required}
  },
  email: {
    value: '',
    validators: {required, isEmail}
  },
}).form

watch(slideNum, () => {
  if (presentations.presentation.value.slide_set[slideNum.value].question_id) {
    questions.getQuestion(presentations.presentation.value.slide_set[slideNum.value].question_id).then(() => {
      isShowQuestion.value = true
    })
  }
})

const dateCreated = computed(() => {
  return (new Date(presentations.presentation.value.date_created))
      .toLocaleDateString('ru', {dateStyle: "long"})
})

function editPresentation(id) {
  router.replace({name: 'presentation-edit', params: {id: id}})
}

function deletePresentation(id) {
  presentations.deletePresentation(id)
      .then(() => router.replace({name: 'library'}))
}

presentations.getPresentation(Router.currentRoute.value.params.id)
    .then(() => {
      isLead.value = presentations.presentation.value.description.lead
      slides.value = presentations.presentation.value.slide_set
      slideNum.value = 0
      currentSlideId.value = slides.value[slideNum.value].id;
      imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
      isLast.value = slideNum.value === slides.value.length - 1;
      totalViews.value = presentations.presentation.value.description.views.total_views || 0;
      totalFavorite.value = presentations.presentation.value.description.total_favorite || 0;
      if (userStore.user)
        if (presentations.presentation.value.user.id === userStore.user.id)
          isUserOwner.value = true
    })

function nextSlide() {
  if (slideNum.value < slides.value.length - 1) {
    slideNum.value += 1
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`
    currentSlideId.value = slides.value[slideNum.value].id
    answerId.value = ''
  }
}

function prevSlide() {
  if (slideNum.value > 0) {
    slideNum.value -= 1
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`
    currentSlideId.value = slides.value[slideNum.value].id
    answerId.value = ''
  }
}

const leads = useLead()

function hideToast() {
  isShowToast.value = false
}

function leadStart() {
  if (userStore.user) {
    const formData = {
      'first_name': userStore.user.firstName,
      'last_name': userStore.user.lastName,
      'email': userStore.user.email
    }
    leads.createLead(currentSlideId.value, formData)
    isShowToast.value = true
    setTimeout(hideToast, 3000)
  } else {
    isShowModal.value = true
  }
}


function sendLead() {
  if (leadForm.valid) {
    const formData = {
      'first_name': leadForm.firstName.value,
      'last_name': leadForm.lastName.value,
      'email': leadForm.email.value
    }
    leads.createLead(currentSlideId.value, formData)
    isShowModal.value = false
    isShowToast.value = true
    setTimeout(hideToast, 3000)
    leadForm.firstName.value = '';
    leadForm.lastName.value = '';
    leadForm.email.value = '';
  }
}

watch(slideNum, () => {
  isLast.value = slideNum.value === slides.value.length - 1;
})

function answerTheQuestion() {
  if (answerId.value !== '') {
    let answer = questions.question.value.answer_set.find(({id}) => id === Number(answerId.value))
    slides.value = [...slides.value.slice(0, slideNum.value + 1), ...answer.slides]
    slideNum.value = slides.value.indexOf(answer.slides[0])
    currentSlideId.value = slides.value[slideNum.value].id;
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
    isLast.value = slideNum.value === slides.value.length - 1;
    isShowQuestion.value = false
    answerId.value = ''
  }
}

</script>

<style scoped>
.ui-tooltip {
  position: relative;
  display: inline-block;
}

.ui-tooltip:hover .tooltiptext {
  visibility: visible;
}

.presentation-outer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.presentation-inner {
  text-align: center;
  width: 80%;
}

.slides {
  width: 70%;
  display: flex;
  align-items: center;
  margin-right: auto;
  margin-left: auto;
  justify-content: space-around;
}

.switch {
  font-size: 3rem;
  color: #81673e;
  cursor: pointer;
}

.switch:hover {
  color: #564425;
}

.disabled {
  color: #bebebe;
  cursor: default;
}

.disabled:hover {
  color: #bebebe;
}

.title-date {
  display: flex;
  width: 62%;
  margin: 0 auto 0.25rem auto;
  align-items: end;
  justify-content: space-between;
}

.title {
  width: 70%;
  text-align: left;
  font-size: 32px;
  font-weight: bold;
}

.date {
  text-align: right;
  width: 30%;
}

img {
  width: 100%;
  max-width: 100%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.slide {
  margin-left: auto;
  margin-right: auto;
}

.presentation-progress {
  display: flex;
  width: 60%;
  margin: 0.75rem auto 0 auto;
}

.progress-item {
  height: 8px;
  border-radius: 4px;
  margin: 8px;
  background-color: #bebebe;
  width: 100%;
}

.current-progress-item {
  background-color: #81673e;
}

.info {
  position: relative;
  display: flex;
  width: 62%;
  margin: 1rem auto;
  align-items: center;
}

.bi-eye, .bi-star {
  margin-right: 4px;
}

.total-favorite {
  margin-left: 8px;
}

.buttons {
  color: #81673e;
}

.buttons > .bi, .to-item {
  margin: 0 8px;
}

.buttons > .bi:hover {
  cursor: pointer;
  color: #564425;
}

.stats {
  display: flex;
  color: #81673e;
}

.input-item {
  margin: 1rem 0;
}

</style>