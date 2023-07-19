<script setup lang="ts">
import UiTooltip from '../components/UI/UiTooltip.vue'
import { type Slide } from "../use/presentations.js";
import { usePresentations } from "../use/presentations";
import {useUserStore} from "../stores";
import {computed, ref, watch} from "vue";
import UiDialog from "../components/UI/UiDialog.vue";
import UiToast from "../components/UI/UiToast.vue";
import {useLeadForm} from "../use/defaultForm";
import {useLead} from "../use/leads";
import {useQuestion} from "../use/question";
import Question from "../components/UI/PresentationQuestion.vue";
import {useRouter} from "vue-router";
import Player from "../components/PresentationPlayer.vue";
import {useAnswer} from "../use/answer";

const presentations = usePresentations();
const userStore = useUserStore();
const questions = useQuestion();
const answers = useAnswer();
const router = useRouter();

const imgSrc = ref<string>('');
const slideNum = ref<number>(0);
const isLast = ref<boolean>(false);
const totalViews = ref<number>(0);
const totalFavorite = ref<number>(0);
const isUserOwner = ref<boolean>(false);
const isShowModal = ref<boolean>(false);
const currentSlideId = ref<number>();
const isShowToast = ref<boolean>(false);
const isShowQuestion = ref<boolean>(false);
const isShowShare = ref<boolean>(false);
const share = ref<string>('1');
const shareLink = ref<string>(location.href);
const slides = ref<Slide[]>([])
const answerId = ref<string>('')
const isLead = ref<boolean>(false)
const isFavorite = ref<boolean>(false)
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

function required(v: string) {
  return !!v;
}

function isEmail(v: string) {
  return EMAIL_REGEXP.test(v);
}

const leadForm = useLeadForm({
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
})

watch(slideNum, () => {
  isShowModal.value = slides.value[slideNum.value].id in presentations.presentation.value!.description.lead
  if (slides.value[slideNum.value].question_id !== null) {
    questions.getQuestion(Number(presentations.presentation.value!.slide_set[slideNum.value].question_id)).then(() => {
      isShowQuestion.value = true
    })
  }
})

watch(isShowModal, () => {
  if ("firstName" in leadForm) {
    leadForm.firstName.value = "";
    leadForm.firstName.touched = false
  }
  if ("lastName" in leadForm) {
    leadForm.lastName.value = ''
    leadForm.lastName.touched = false
  }
  if ("email" in leadForm) {
    leadForm.email.value = ''
    leadForm.email.touched = false
  }
})

watch(share, () => {
  if (share.value === '1')
    shareLink.value = location.href
  else
    shareLink.value = location.protocol + '//' + location.host + `/embed/${presentations.presentation.value!.id}/`
})

const dateCreated = computed<string>(() => {
  return (new Date(presentations.presentation.value!.date_created))
      .toLocaleDateString('ru', {dateStyle: "long"})
})

function editPresentation(id: number) {
  router.replace({name: 'presentation-edit', params: {id: id}})
}

function deletePresentation(id: number) {
  presentations.deletePresentation(id)
      .then(() => router.replace({name: 'library'}))
}

presentations.getPresentation(Number(router.currentRoute.value.params.id))
    .then(() => {
      isLead.value = Object.keys(presentations.presentation.value!.description.lead).length !== 0
      slides.value = presentations.presentation.value!.slide_set
      slideNum.value = 0
      isShowModal.value = slides.value[slideNum.value].id in presentations.presentation.value!.description.lead
      currentSlideId.value = slides.value[slideNum.value].id;
      imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
      isLast.value = slideNum.value === slides.value.length - 1;
      totalViews.value = presentations.presentation.value!.description.views.total_views || 0;
      totalFavorite.value = presentations.presentation.value!.favorite.length || 0;
      if (userStore.user) {
        isFavorite.value = presentations.presentation.value!.favorite.includes(userStore.user.id)
        if (presentations.presentation.value!.user.id === userStore.user.id)
          isUserOwner.value = true
      }
    })

function toggleFavorite() {
  if (!userStore.user) {
    router.replace({name: 'signup'})
  } else {
    isFavorite.value = !isFavorite.value
    if (presentations.presentation.value !== undefined)
      if (presentations.presentation.value!.favorite.includes(userStore.user.id)) {
        presentations.removeFromFavorite(presentations.presentation.value!.id)
        presentations.presentation.value!.favorite = presentations.presentation.value!.favorite.filter(id => id !== userStore.user!.id)
        totalFavorite.value -= 1
      } else {
        presentations.addToFavorite(presentations.presentation.value!.id)
        presentations.presentation.value!.favorite.push(userStore.user.id)
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
  const inputShare = document.querySelector('.input-share');
  (inputShare as HTMLInputElement).select();
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
    if (currentSlideId.value !== undefined)
      leads.createLead(Number(currentSlideId.value), formData)
    isShowToast.value = true
    setTimeout(hideToast, 3000)
  } else {
    isShowModal.value = true
  }
}


function sendLead() {
  if (leadForm.valid && "firstName" in leadForm && "lastName" in leadForm && "email" in leadForm) {
      const formData = {
        'first_name': leadForm.firstName.value,
        'last_name': leadForm.lastName.value,
        'email': leadForm.email.value
      }
      if (currentSlideId.value !== undefined)
        leads.createLead(Number(currentSlideId.value), formData)
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
    let answer = questions.question.value!.answer_set.find(({id}) => id === Number(answerId.value))
    slides.value = [...slides.value.slice(0, slideNum.value + 1), ...answer!.slides]
    slideNum.value = slides.value.indexOf(answer!.slides[0])
    currentSlideId.value = slides.value[slideNum.value].id;
    imgSrc.value = `/media/${slides.value[slideNum.value].name}`;
    isLast.value = slideNum.value === slides.value.length - 1;
    isShowQuestion.value = false
    answers.chooseAnswer(
        questions.question.value!.id,
        Number(answerId.value)
    )
    answerId.value = ''
  }
}

</script>

<template>
  <ui-toast :show="isShowToast">
    <template #header>{{ leads.leadCreateMessage.value.header }}</template>
    <template #body>{{ leads.leadCreateMessage.value.body }}</template>
  </ui-toast>

  <question v-model="isShowQuestion">
    <template #question>
      {{ questions.question.value?.question_text }}
    </template>
    <template #answers>
      <div
          v-for="answer in questions.question.value?.answer_set"
          :key="answer.id"
      >
        <div class="form-check">
          <input
              :id="String(answer.id)"
              v-model="answerId"
              class="form-check-input"
              type="radio"
              name="flexRadioDefault"
              :value="answer.id"
          >
          <label class="form-check-label" :for="String(answer.id)">
            {{ answer.answer_text }}
          </label>
        </div>
      </div>
    </template>
    <template #footer>
      <button
          type="submit"
          class="btn button-submit"
          :disabled="answerId === ''"
          @click.prevent="answerTheQuestion"
      >
        Ответить
      </button>
    </template>
  </question>

  <ui-dialog
      v-model="isShowModal"
  >
    <template #title>
      Запросить консультацию
    </template>
    <template #body>
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

        <button
            type="submit"
            :disabled="!leadForm.valid"
            class="btn button-submit"
        >
          Отправить
        </button>
      </form>
    </template>
  </ui-dialog>

  <ui-dialog v-model="isShowShare">
    <template #title>
      <ul class="share-type">
        <li class="link">
          <input id="link" v-model="share" type="radio" name="share" value="1"/>
          <label for="link">Ссылка</label>
        </li>
        <li class="embed">
          <input id="embed" v-model="share" type="radio" name="share" value="2"/>
          <label for="embed">Встроить</label>
        </li>
      </ul>
    </template>
    <template #body>
      <div>
        <template v-if="share === '1'">
          <div class="input-group share">
            <input class="form-control input-share" type="text" :value="shareLink" readonly>
            <button class="btn copy" @click="copyShare"><i class="bi bi-clipboard"></i></button>
            <button class="btn copy">
              <a :href="`https://vk.com/share.php?url=${shareLink}/`">
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 2048 2048"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <rect width="2048" height="2048" fill="url(#pattern0)"/>
                  <defs>
                    <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                      <use xlink:href="#image0_3_2" transform="scale(0.000488281)"/>
                    </pattern>
                    <image
                        id="image0_3_2"
                        width="2048"
                        height="2048"
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACAAAAAgACAYAAACyp9MwAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAACAAElEQVR42uzdeZidZX34/8/9nJkESMKiqKgs2mrdWm2l2P7a2lKrYJaJy7dDVSQbkQgYyCRhqa16bNXKkkyEL34bJJkQl2pSN7IBxRa1al2wra11V1BUtEUlZCGZOc/9+wNtiwKZOducc+b1uq5etUUmz/O+zzXPeXI+57kjAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/397cCAAAAAAIMjfeoMJKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AZvZZvWL+wliAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA1LTE2VDA1OjIzOjMyKzAwOjAwRm2KNAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNS0xNlQwNToyMzozMiswMDowMDcwMogAAAAASUVORK5CYII="
                    />
                  </defs>
                </svg>
              </a>
            </button>
          </div>
        </template>
        <template v-else>
          <div class="input-group share">
          <textarea
              class="form-control input-share"
              rows="2"
              readonly
              :value="`<iframe src=${shareLink} width='480' height='216'></iframe>`"
          ></textarea>
            <button class="btn copy" @click="copyShare"><i class="bi bi-clipboard"></i></button>
          </div>
        </template>

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
      <template v-else-if="presentations.presentation.value !== undefined">
        <div class="title-date">
          <div class="w-75">
            <div class="title">
              {{ presentations.presentation.value?.title }}
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
            :is-embed="false"
            @next="nextSlide"
            @prev="prevSlide"
        />
        <div class="presentation-progress">
          <div
              v-for="(slide, index) in slides"
              :key="slide.id"
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
                :to="{name: 'presentation-edit', params: {id: router.currentRoute.value?.params.id}}"
                class="ui-link to-item"
            >
              <i class="bi bi-pencil-fill ui-tooltip" @click="editPresentation(presentations.presentation.value?.id)">
                <ui-tooltip>Редактировать</ui-tooltip>
              </i>
            </router-link>
            <i class="bi bi-trash3-fill ui-tooltip" @click="deletePresentation(presentations.presentation.value?.id)">
              <ui-tooltip>Удалить</ui-tooltip>
            </i>
          </div>
          <div v-else-if="isLead">
            <button
                class="btn button-submit"
                @click="leadStart"
            >
              Оставить контакты
            </button>
          </div>
        </div>
        <div class="info">
        <span
          v-if="presentations.presentation.value.topic !== undefined"
          class="topic"
        >
          {{ topics[Number(presentations.presentation.value.topic)] }}
        </span>
          <i
              v-if="presentations.presentation.value?.privacy === 1"
              class="bi bi-share-fill ui-tooltip title-icon"
              @click="isShowShare = true"
          >
            <ui-tooltip>Поделиться</ui-tooltip>
          </i>
          <div class="star" @click="toggleFavorite">
            <i v-if="!isFavorite" class="bi bi-star ui-tooltip title-icon">
              <ui-tooltip>В избранное</ui-tooltip>
            </i>
            <i v-else class="bi bi-star-fill ui-tooltip title-icon">
              <ui-tooltip>Удалить из избранного</ui-tooltip>
            </i>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

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