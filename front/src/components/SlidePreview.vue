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
          :disabled="slidesIds.length === 0 || !formAnswer.answerText.valid"
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
                <i class="bi bi-trash3-fill ui-tooltip" @click="deleteAnswer(answer)">
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
          :disabled="!formQuestion.questionText.valid || answers.length === 0"
          @click.prevent="createOrEditQuestion"
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
    <div class="col col-6 d-flex justify-content-start align-items-center">
      <div class="align-items-center" id="buttons-interactivity">
        <div>
          <template v-if="isSlideHasQuestion">
            <button class="button-submit my-button w-16">
              <button
                  @click.prevent="showDialogQuestion"
                  class="btn button-edit-question"
              >
                Редактировать вопрос
              </button>
              <button
                  @click.prevent="deleteQuestion"
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
                :disabled="isLeadOn"
            >
              Добавить вопрос
            </ui-button>
          </template>
        </div>
        <div>
          <ui-button
              class="button-submit text-center w-16"
              v-if="!isLeadOn"
              @click="$emit('leadOn', props.slide.id)"
              :disabled="isSlideHasQuestion"
          >
            Добавить сбор контактов
          </ui-button>
          <ui-button
              class="button-submit text-center w-16"
              v-else
              @click="$emit('leadOff', props.slide.id)"
          >
            Отключить сбор контактов
          </ui-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import UiButton from "@/components/UI/UiButton.vue";
import UiModal from "@/components/UI/UiModal.vue";
import SlidesInAnswer from "@/components/SlidesInAnswer.vue";
import {useQuestion} from "@/use/question";
import UiTooltip from '@/components/UI/UiTooltip.vue'
import {useAnswer} from "@/use/answer";
import {useOneFieldForm} from "@/use/oneFieldForm";

const props = defineProps({
  slide: {
    type: Object,
    required: true
  },
  slides: {
    type: Array,
    required: true
  },
  isLeadOn: {
    type: Boolean,
    default: false
  }
})

defineEmits(['leadOn', 'leadOff'])

const maxLength = 255
const required = v => !!v
const isMaxLength = v => v.length <= maxLength

const question = useQuestion()
const answer = useAnswer()
const answers = ref([])

const formQuestion = useOneFieldForm({
  questionText: {
    value: '',
    validators: {required, isMaxLength}
  }
}).form

const formAnswer = useOneFieldForm({
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
  question.getQuestion(props.slide.question_id).then(() => {
    formQuestion.questionText.value = question.question.value.question_text
    for (let answer of question.question.value.answer_set) {
      let slideOrdering = ""
      let slidesIDs = []
      for (let slide of answer.slides) {
        slidesIDs.push(slide.id)
        slideOrdering += Number(slide["ordering"] + 1) + ', '
      }
      answers.value.push(
          {
            id: answer.id,
            isNewAnswer: false,
            isEdited: false,
            answerText: answer.answer_text,
            slidesNums: slideOrdering.slice(0, -2),
            slidesIds: slidesIDs
          }
      )
    }
  })
}


const isShowDialogQuestion = ref(false)
const isShowDialogAnswer = ref(false)
const isShowDialogAnswerEdit = ref(false)

const showDialogQuestion = () => {
  isShowDialogQuestion.value = true
}
const showDialogAnswer = () => {
  isShowDialogAnswer.value = true
  formAnswer.answerText.value = ""
}

watch(isShowDialogQuestion, () => {
  if (!isShowDialogQuestion.value && !isSlideHasQuestion.value) {
    formQuestion.questionText.value = ""
    answers.value = []
  }
})

function createAnswer() {
  if (formAnswer.answerText.valid && slidesIds.value.length !== 0) {
    let slideOrdering = []
    for (let slideId of slidesIds.value) {
      for (let slide of props.slides)
        if (slideId === slide.id)
          slideOrdering.push(Number(slide["ordering"] + 1))
    }
    answers.value.push(
        {
          id: Date.now(),
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
  question.createQuestion(
      {
        "slide_id": props.slide.id,
        "question_text": formQuestion.questionText.value
      }
  ).then(
      () => {
        let newAnswers = []
        for (let answerToAdd of answers.value)
          if (answerToAdd.isNewAnswer) {
            newAnswers.push(
                {
                  "answer_text": answerToAdd.answerText,
                  "slides_ids": answerToAdd.slidesIds
                }
            )
          }
        answer.createAnswer(
            question.question.value.id,
            newAnswers
        )
        isShowDialogQuestion.value = false
        isSlideHasQuestion.value = true
      }
  )
}

function editQuestion() {
  question.editQuestion(
      question.question.value.id,
      {
        "question_text": formQuestion.questionText.value
      }
  ).then(
      () => {
        let newAnswers = []
        for (let answerOfAnswers of answers.value) {
          if (answerOfAnswers.isNewAnswer) {
            newAnswers.push(
                {
                  "answer_text": answerOfAnswers.answerText,
                  "slides_ids": answerOfAnswers.slidesIds
                }
            )
          } else if (answerOfAnswers.isEdited) {
            answer.editAnswer(
                question.question.value.id,
                answerOfAnswers.id,
                {
                  "answer_text": answerOfAnswers.answerText,
                  "slides_ids": answerOfAnswers.slidesIds
                }
            )
          }
        }
        answer.createAnswer(
            question.question.value.id,
            newAnswers
        )
        isShowDialogQuestion.value = false
      }
  )
}

function createOrEditQuestion() {
  if (formQuestion.questionText.valid && answers.value.length !== 0) {
    if (question.question.value) {
      editQuestion()
    } else {
      createQuestion()
    }
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
  if (formAnswer.answerText.valid && slidesIds.value.length !== 0) {
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

function deleteAnswer(answerToDelete) {
  if (!answerToDelete.isNewAnswer)
    answer.deleteAnswer(question.question.value.id, answerToDelete.id)
  answers.value = answers.value.filter((answer) => answer.id !== answerToDelete.id)
}

function deleteQuestion() {
  question.deleteQuestion(question.question.value.id)
  isSlideHasQuestion.value = false
  formQuestion.questionText.value = ""
  answers.value = []
}

</script>

<style scoped>

.w-16 {
  width: 16rem;
}

#buttons-interactivity > div {
  margin: 0.5rem;
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