<template>
  <ui-modal
      v-model="isShowDialogAnswerEdit"
      :is70rem="true"

  >
    <template v-slot:title>Редактировать ответ</template>
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
        <slides-in-answer
            :slides="slides.slice(slide.ordering + 1)"
            :selected-slides-ids="slidesIds"
            @change-slides-ids="updateSlidesIds"
        />
      </form>
    </template>
    <template class="dialog-footer" v-slot:footer>
      <button
          class="btn btn-secondary footer-button"
          @click.prevent="isShowDialogAnswerEdit = false"
      >
        Отмена
      </button>
      <ui-button
          type="submit"
          class="button-submit footer-button"
          :disabled="slidesIds.length === 0 || !formAnswer.answerText.valid"
          @click="editAnswer(editableAnswer)"
      >
        Сохранить
      </ui-button>
    </template>
  </ui-modal>

  <ui-modal
      v-model="isShowDialogAnswer"
      :is70rem="true"

  >
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
        <slides-in-answer
            :slides="slides.slice(slide.ordering + 1)"
            @change-slides-ids="updateSlidesIds"
        />
      </form>
    </template>
    <template class="dialog-footer" v-slot:footer>
      <button
          class="btn btn-secondary footer-button"
          @click.prevent="isShowDialogAnswer = false"
      >
        Отмена
      </button>
      <ui-button
          type="submit"
          class="button-submit footer-button"
          :disabled="slidesIds.length === 0 || !formAnswer.valid"
          @click="createAnswer"
      >
        Сохранить
      </ui-button>
    </template>
  </ui-modal>

  <ui-modal v-model="isShowDialogQuestion" :is-others-modal="[isShowDialogAnswer, isShowDialogAnswerEdit]">
    <template v-if="!isSlideHasQuestion" v-slot:title>Добавить вопрос к слайду №{{ slide.ordering + 1 }}</template>
    <template v-else v-slot:title>Редактировать вопрос к слайду №{{ slide.ordering + 1 }}</template>
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
            <th class="th-actions">Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="answer in answers"
              class="answer"
          >
            <td>{{ answer.answerText }}</td>
            <td>{{ answer.slidesNums }}</td>
            <td class="actions">
              <div class="icon-actions">
                <i class="bi bi-pencil-fill ui-tooltip" @click="startEditAnswer(answer)">
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
          :disabled="!formQuestion.questionText.valid"
          @click.prevent="createQuestion"
      >
        Сохранить
      </ui-button>
    </template>
  </ui-modal>

  <div class="row slide">
    <div class="col col-6">
      <div class="d-flex align-items-center justify-content-end">
        <div class="slide-number fw-bold">{{ slide.ordering + 1 }}</div>
        <div class="preview">
          <img :src="`/media/${slide.name}`" alt="Слайд">
        </div>
      </div>
    </div>
    <div class="col col-6">
      <div class="question d-flex justify-content-start align-items-center h-100">
        <template v-if="isSlideHasQuestion">
          <button class="button-submit my-button w-16">
            <button
                @click.prevent="showDialogQuestion"
                class="btn button-edit-question"
            >
              Редактировать вопрос
            </button>
            <button
                class="btn button-delete-question"
            >
              <i class="bi bi-trash3-fill ui-tooltip">
                <ui-tooltip>Удалить вопрос</ui-tooltip>
              </i>
            </button>
          </button>
        </template>
        <template v-else>
          <ui-button
              class="button-submit text-center w-16"
              @click.prevent="showDialogQuestion"
          >
            Добавить вопрос
          </ui-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import UiButton from "@/components/UI/UiButton.vue";
import UiModal from "@/components/UI/UiModal.vue";
import SlidesInAnswer from "@/components/SlidesInAnswer.vue";
import {useQuestion} from "@/use/question";
import UiTooltip from '@/components/UI/UiTooltip.vue'
import {useDefaultForm} from "@/use/defaultForm";
import {useAnswer} from "@/use/answer";

const props = defineProps({
  slide: {
    type: Object,
    required: true
  },
  slides: {
    type: Array,
    required: true
  }
})

const questionAnswers = useQuestion()

const maxLength = 255
const required = v => !!v
const isMaxLength = v => v.length <= maxLength

const question = useQuestion()
const answer = useAnswer()
const answers = ref([])

const formQuestion = useDefaultForm({
  questionText: {
    value: '',
    validators: {required, isMaxLength}
  }
}).form

const formAnswer = useDefaultForm({
  answerText: {
    value: '',
    validators: {required, isMaxLength}
  }
}).form

const slidesIds = ref([])
const isSlidesIdsModified = ref(false)
const isSlideHasQuestion = ref(false)

if (props.slide.question_id) {
  isSlideHasQuestion.value = true
  questionAnswers.getQuestion(props.slide.question_id).then(() => {
    formQuestion.questionText.value = questionAnswers.question.value.question_text
    for (let answer of questionAnswers.question.value.answer_set) {
      let slideOrdering = ""
      let slidesIDs = []
      for (let slide of answer.slides) {
        slidesIDs.push(slide.id)
        slideOrdering += Number(slide["ordering"] + 1) + ', '
      }
      answers.value.push(
          {
            answerId: answer.id,
            isNewAnswer: false,
            isEdited: false,
            answerText: answer.answer_text,
            slidesNums: slideOrdering.slice(0, -2),
            slidesIds: slidesIDs
          }
      )
    }
  })
} else {
  questionAnswers.question.value = {answer_set: []}
}


const isShowDialogQuestion = ref(false)
const isShowDialogAnswer = ref(false)
const isShowDialogAnswerEdit = ref(false)

const showDialogQuestion = () => isShowDialogQuestion.value = true
const showDialogAnswer = () => isShowDialogAnswer.value = true


function createAnswer() {
  if (formAnswer.valid && slidesIds.value.length !== 0) {
    let slideOrdering = []
    for (let slideId of slidesIds.value) {
      for (let slide of props.slides)
        if (slideId === slide.id)
          slideOrdering.push(Number(slide["ordering"] + 1))
    }
    answers.value.push(
        {
          answerId: Date.now(),
          isNewAnswer: true,
          isEdited: false,
          answerText: formAnswer.answerText.value,
          slidesIds: slidesIds.value,
          slidesNums: slideOrdering.sort(function (a, b) {
            return a - b
          }).join(', ')
        }
    )
    slidesIds.value = []
    formAnswer.answerText.value = ''
    isSlidesIdsModified.value = false
    isShowDialogAnswer.value = false
  }
}

function createQuestion() {
  if (formQuestion.questionText.valid && answers.value.length !== 0) {
    question.createQuestion(
        {
          "slide_id": props.slide.id,
          "question_text": formQuestion.questionText.value
        }
    ).then(
        () => {
          for (let answerToAdd of answers.value)
            if (answerToAdd.isNewAnswer) {
              answer.createAnswer(
                  question.question.value.id,
                  {
                    "answer_text": answerToAdd.answerText,
                    "slides_ids": answerToAdd.slidesIds
                  }
              )
            }
          isShowDialogQuestion.value = false
          isSlideHasQuestion.value = true
        }
    )
  }
}

const editableAnswer = ref(null)

function startEditAnswer(answer) {
  isShowDialogAnswerEdit.value = true
  formAnswer.answerText.value = answer.answerText
  slidesIds.value = answer.slidesIds
  editableAnswer.value = answers.value.indexOf(answer)
}

function editAnswer() {
  if (formAnswer.valid && slidesIds.value.length !== 0) {
    answers.value[editableAnswer.value].isEdited = true
    answers.value[editableAnswer.value].answerText = formAnswer.answerText.value
    answers.value[editableAnswer.value].slidesIds = slidesIds.value
    let slideOrdering = []
    for (let slideId of slidesIds.value) {
      for (let slide of props.slides)
        if (slideId === slide.id)
          slideOrdering.push(Number(slide["ordering"] + 1))
    }
    answers.value[editableAnswer.value].slidesNums = slideOrdering.sort(function (a, b) {
      return a - b
    }).join(', ')
    slidesIds.value = []
    formAnswer.answerText.value = ''
    isSlidesIdsModified.value = false
    isShowDialogAnswerEdit.value = false
  }
}

function updateSlidesIds(slide, event) {
  isSlidesIdsModified.value = true
  if (event.target.checked)
    slidesIds.value.push(slide.id)
  else
    slidesIds.value = slidesIds.value.filter((slideId) => slideId !== slide.id)
}

</script>

<style scoped>

.w-16 {
  width: 16rem;
}

.my-button {
  border-radius: 0.375rem;
  outline: none;
  border: none;
}

.button-edit-question, .button-delete-question {
  background-color: #81673e;
  border-radius: 0;
  color: white;
}

.button-edit-question {
  border-right: 1px solid #fff;
  border-radius: 0.375rem 0 0 0.375rem;
}

.button-delete-question {
  border-radius: 0 0.375rem 0.375rem 0;
}

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

.th-actions, .actions {
  width: 20%;
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