<template>

  <ui-modal v-model="isShowDialogAnswer" :is70rem="true">
    <template v-slot:title>Добавить ответ</template>
    <template v-slot:body>
      <form class="add-question">
        <div class="input-question-item">
          <label for="answer-text">Текст ответа</label>
          <input
              class="form-control"
              id="answer-text"
              v-model="formAnswer.answerText.value"
          >
        </div>
        <label>Выберите слайды, которые будут показаны, если выбран этот вариант ответа</label>
        <slides-in-answer :slides="slides.slice(slideNum)"/>
      </form>
    </template>
    <template class="dialog-footer" v-slot:footer>
      <button
          class="btn btn-secondary footer-button"
          @click.prevent="isShowDialogAnswer = false"
      >
        Отмена
      </button>
      <ui-button type="submit" class="button-submit footer-button">Сохранить</ui-button>
    </template>
  </ui-modal>

  <ui-modal v-model="isShowDialogQuestion" :is-modal-answer="isShowDialogAnswer">
    <template v-slot:title>Добавить вопрос к слайду №{{ slideNum }}</template>
    <template v-slot:body>
      <form class="add-question">
        <div class="input-question-item">
          <label for="question-text">Текст вопроса</label>
          <input
              class="form-control"
              id="question-text"
              v-model="formQuestion.questionText.value"
          >
        </div>
        <table class="table">
          <thead>
          <tr>
            <th>Ответ</th>
            <th>Слайды</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="answer in questionAnswers.question.value.answer_set"
              class="answer"
          >
            <td>{{ answer.answer_text }}</td>
            <td>{{ slidesNums[answer.id] }}</td>
            <td class="actions">
              <div class="icon-actions">
                <i class="bi bi-pencil-fill ui-tooltip">
                  <ui-tooltip>Редактировать</ui-tooltip>
                </i>
                <i class="bi bi-trash3-fill ui-tooltip">
                  <ui-tooltip>Удалить</ui-tooltip>
                </i>
              </div>
            </td>
          </tr>
          <tr @click.prevent="showDialogAnswer" class="button-add-answer">
            <td colspan="3" class="text-center">
              Добавить ответ
            </td>
          </tr>
          </tbody>
        </table>
      </form>
      <pre class="text-start">{{ formQuestion }}</pre>
    </template>
    <template class="dialog-footer" v-slot:footer>
      <button
          class="btn btn-secondary footer-button"
          @click="isShowDialogQuestion = false"
      >
        Отмена
      </button>
      <ui-button
          type="submit"
          class="button-submit footer-button"
          :disabled="!formQuestion.valid"
      >
        Сохранить
      </ui-button>
    </template>
  </ui-modal>

  <div class="row slide">
    <div class="col col-6">
      <div class="d-flex align-items-center justify-content-end">
        <div class="slide-number fw-bold">{{ slideNum }}</div>
        <div class="preview">
          <img :src="`/media/${slide.name}`" alt="Слайд">
        </div>
      </div>
    </div>
    <div class="col col-6">
      <div class="question d-flex justify-content-start align-items-center h-100">
        <ui-button
            class="button-submit"
            @click.prevent="showDialogQuestion"
        >
          <i class="bi bi-plus-lg"></i> Добавить вопрос
        </ui-button>
      </div>
    </div>
  </div>

</template>

<script setup>
import {onMounted, ref} from "vue";
import UiButton from "@/components/UI/UiButton.vue";
import UiModal from "@/components/UI/UiModal.vue";
import SlidesInAnswer from "@/components/SlidesInAnswer.vue";
import {useQuestion} from "@/use/question";
import UiTooltip from '@/components/UI/UiTooltip.vue'
import {useForm} from "@/use/form";
import {useDefaultForm} from "@/use/defaultForm";

const props = defineProps({
  slide: {
    type: Object,
    required: true
  },
  slideNum: {
    type: Number,
    required: true
  },
  slides: {
    type: Array,
    required: true
  }
})

const questionAnswers = useQuestion()
const slidesNums = ref({})

const maxLength = 255
const required = v => !!v
const isMaxLength = v => v.length <= maxLength

const answers = ref([])

const {formQuestion} = useForm({
  questionText: {
    value: '',
    validators: {required, isMaxLength}
  }
}, {}, true)

const formAnswer = useDefaultForm({
  answerText: {
    value: '',
    validators: {required, isMaxLength}
  },
  slidesIds: {
    value: [],
    validators: {required}
  }
}).form

onMounted(() => {
  if (props.slide.question_id) {
    questionAnswers.getQuestion(props.slide.question_id).then(() => {
      formQuestion.questionText.value = questionAnswers.question.value.question_text
      for (let answer of questionAnswers.question.value.answer_set) {
        let slideOrdering = ""
        for (let slide of answer.slides)
          slideOrdering += Number(slide["ordering"] + 1) + ', '
        slidesNums.value[answer.id] = slideOrdering.slice(0, -2)
      }
    })
  } else
    questionAnswers.question.value = {answer_set: []}
})

const isShowDialogQuestion = ref(false)
const isShowDialogAnswer = ref(false)
const showDialogQuestion = () => isShowDialogQuestion.value = true
const showDialogAnswer = () => {
  isShowDialogAnswer.value = true
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

.preview {
  width: 20rem;
}

.question {
  text-align: left;
}

img {
  width: 100%;
}

textarea {
  resize: none;
}

.slide-number {
  margin-right: 2rem;
  font-size: 2rem;
  color: #81673e;
}

.slide {
  margin: 2rem auto;
}

.input-question-item {
  text-align: left;
  margin-bottom: 1rem;
}

.footer-button {
  margin: 0 4px;
}

.add-question {
  text-align: left;
}

.icon-actions > i {
  margin: 0 4px;
}

.icon-actions {
  opacity: 0;
  color: #81673e;
}

.answer:hover .icon-actions {
  opacity: 1;
}

.button-add-answer {
  cursor: pointer;
  color: #81673e;
  font-weight: bold;
}

.button-add-answer:hover {
  color: #564425;
}

.table {
  margin-bottom: 0;
}

</style>