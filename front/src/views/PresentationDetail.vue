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
      Запросить консультацию
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

  <ui-dialog v-model="isShowShare">
    <template v-slot:title>
      <ul class="share-type">
        <li class="link">
          <input type="radio" id="link" name="share" value="1" v-model="share"/>
          <label for="link">Ссылка</label>
        </li>
        <li class="embed">
          <input type="radio" id="embed" name="share" value="2" v-model="share"/>
          <label for="embed">Встроить</label>
        </li>
      </ul>
    </template>
    <template v-slot:body>
      <div class="input-group share">
        <template v-if="share === '1'">
          <input class="form-control input-share" type="text" :value="shareLink">
        </template>
        <template v-else>
          <textarea
              class="form-control input-share"
              rows="2"
              readonly="readonly"
          ><iframe src={{shareLink}} width="480" height="216"></iframe></textarea>
        </template>
        <ui-button class="copy" @click="copyShare"><i class="bi bi-clipboard"></i></ui-button>
      </div>
    </template>
  </ui-dialog>

  <div class="presentation-outer">
    <div class="presentation-inner">
      <template v-if="presentations.errCode.value === 404">
        <h2 class="err-title">Презентации не существует</h2>
      </template>
      <template v-else-if="presentations.errCode.value === 403">
        <h2 class="err-title">Презентация не является публичной</h2>
      </template>
      <template v-else>
        <div class="title-date">
          <div class="w-75">
            <div class="title">
              {{ presentations.presentation.value.title }}
            </div>
          </div>
          <div class="date">
            {{ dateCreated }}
          </div>
        </div>
        <player
            :img-src="imgSrc"
            :slide-num="slideNum"
            :is-last="isLast"
            @next="nextSlide"
            @prev="prevSlide"
        />
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
        <div class="info">
        <span class="topic">
          {{ topics[presentations.presentation.value.topic] }}
        </span>
          <i
              class="bi bi-share-fill ui-tooltip title-icon"
              @click="isShowShare = true"
              v-if="presentations.presentation.value.privacy === 1"
          >
            <ui-tooltip>Поделиться</ui-tooltip>
          </i>
          <div class="star" @click="toggleFavorite">
            <i class="bi bi-star ui-tooltip title-icon" v-if="!isFavorite">
              <ui-tooltip>В избранное</ui-tooltip>
            </i>
            <i class="bi bi-star-fill ui-tooltip title-icon" v-else>
              <ui-tooltip>Удалить из избранного</ui-tooltip>
            </i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import UiTooltip from '@/components/UI/UiTooltip.vue'
import {usePresentations} from "@/use/presentations";
import {useUserStore} from "@/stores";
import {computed, ref, watch} from "vue";
import UiButton from "@/components/UI/UiButton.vue";
import UiDialog from "@/components/UI/UiDialog.vue";
import UiToast from "@/components/UI/UiToast.vue";
import {useDefaultForm} from "@/use/defaultForm";
import {useLead} from "@/use/leads";
import {useQuestion} from "@/use/question";
import Question from "@/components/UI/Question.vue";
import {useRouter} from "vue-router";
import Player from "@/components/Player.vue";
import {useAnswer} from "@/use/answer";

const presentations = usePresentations();
const userStore = useUserStore();
const questions = useQuestion();
const answers = useAnswer();
const router = useRouter();

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
const isShowShare = ref(false);
const share = ref('1');
const shareLink = ref(location.href);
const slides = ref([])
const answerId = ref('')
const isLead = ref(false)
const isFavorite = ref(false)
const topics = {
  1: 'Искусство',
  2: 'Бизнес',
  3: 'Дизайн',
  4: 'Экономика',
  5: 'Образование',
  6: 'Здоровье',
  7: 'Закон',
  8: 'Маркетинг',
  9: 'Наука',
  10: 'Самообразование',
  11: 'Спорт',
  12: 'Технологии',
  13: 'Путешествия'
}

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
  isShowModal.value = slides.value[slideNum.value].id in presentations.presentation.value.description.lead
  if (presentations.presentation.value.slide_set[slideNum.value].question_id) {
    questions.getQuestion(presentations.presentation.value.slide_set[slideNum.value].question_id).then(() => {
      isShowQuestion.value = true
    })
  }
})

watch(isShowModal, () => {
  leadForm.firstName.value = ''
  leadForm.firstName.touched = false
  leadForm.lastName.value = ''
  leadForm.lastName.touched = false
  leadForm.email.value = ''
  leadForm.email.touched = false
})

watch(share, () => {
  if (share.value === '1')
    shareLink.value = location.href
  else
    shareLink.value = location.protocol + '//' + location.host + `/embed/${presentations.presentation.value.id}/`
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

presentations.getPresentation(router.currentRoute.value.params.id)
    .then(() => {
      isLead.value = Object.keys(presentations.presentation.value.description.lead).length !== 0
      slides.value = presentations.presentation.value.slide_set
      slideNum.value = 0
      isShowModal.value = slides.value[slideNum.value].id in presentations.presentation.value.description.lead
      currentSlideId.value = slides.value[slideNum.value].id;
      imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
      isLast.value = slideNum.value === slides.value.length - 1;
      totalViews.value = presentations.presentation.value.description.views.total_views || 0;
      totalFavorite.value = presentations.presentation.value.favorite.length || 0;
      if (userStore.user) {
        isFavorite.value = presentations.presentation.value.favorite.includes(userStore.user.id)
        if (presentations.presentation.value.user.id === userStore.user.id)
          isUserOwner.value = true
      }
    })

function toggleFavorite() {
  if (!userStore.user) {
    router.replace({name: 'signup'})
  } else {
    isFavorite.value = !isFavorite.value
    if (presentations.presentation.value.favorite.includes(userStore.user.id)) {
      presentations.removeFromFavorite(presentations.presentation.value.id)
      presentations.presentation.value.favorite = presentations.presentation.value.favorite.filter(id => id !== userStore.user.id)
      totalFavorite.value -= 1
    } else {
      presentations.addToFavorite(presentations.presentation.value.id)
      presentations.presentation.value.favorite.push(userStore.user.id)
      totalFavorite.value += 1
    }
  }
}

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

function copyShare() {
  const inputShare = document.querySelector('.input-share')
  inputShare.select()
  document.execCommand("copy");
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
    answers.chooseAnswer(
        questions.question.value.id,
        answerId.value
    )
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

.title-date {
  display: flex;
  width: 62%;
  margin: 0 auto 0.25rem auto;
  align-items: end;
  justify-content: space-between;
}

.title {
  text-align: left;
  font-size: 32px;
  font-weight: bold;
}

.date {
  text-align: right;
  width: 25%;
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

.buttons, .title-icon {
  color: #81673e;
}

.buttons > .bi, .to-item, .title-icon {
  margin: 0 8px;
}

.buttons > .bi:hover, .title-icon:hover {
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

.copy {
  color: #81673e;
  border: 1px solid #ced4da;
}

.copy:focus {
  border: 1px solid #81673e;
  box-shadow: 0 0 0 0.25rem rgba(129, 103, 62, 0.25) !important;
}

.input-share {
  width: 24rem;
}

textarea.input-share {
  resize: none;
}

.share-type {
  list-style-type: none;
  padding: 0;
}

.share-type li {
  float: left;
  margin: 0 8px 0 0;
  height: 38px;
  position: relative;
}

.share-type li.link {
  width: 88px;
}

.share-type li.embed {
  width: 106px;
}

.share-type label,
.share-type input {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.share-type input[type="radio"] {
  opacity: 0.01;
  z-index: 100;
  cursor: pointer;
}

.share-type input[type="radio"]:checked + label,
.Checked + label {
  background-color: #81673e;
  color: white;
  border: none;
}

.share-type label {
  padding: 6px 14px;
  border: 1px solid #81673e;
  color: #81673e;
  border-radius: 8px;
  cursor: pointer;
  z-index: 90;
  font-size: 16px !important;
}

.share-type label:hover {
  background: #DDD;
}

.topic {
  background-color: rgba(129, 103, 62, 0.35);
  color: white;
  border-radius: 16px;
  padding: 4px 8px;
}

.err-title {
  color: #81673e;
}

</style>