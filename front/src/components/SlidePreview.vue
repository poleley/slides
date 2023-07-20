<script setup lang="ts">
import { ref, watch } from "vue";
import UiModal from "../components/UI/UiModal.vue";
import SlidesInAnswer from "../components/SlidesInAnswer.vue";
import UiTooltip from "../components/UI/UiTooltip.vue";
import { answerApi, questionApi } from "../use/apiCalls";
import { useAnswerForm, useQuestionForm } from "../use/oneFieldForm";
import { type Slide } from "../use/interfaces.js";

const props = defineProps<{
  slide: Slide;
  slides: Slide[];
  isLeadOn: boolean;
}>();

defineEmits(["leadOn", "leadOff"]);

const maxLength: number = 255;

function required(v: string) {
  return !!v;
}

function isMaxLength(v: string) {
  return (v: string) => v.length <= maxLength;
}

export interface AnswerPreview {
  id: number;
  answerText: string;
  isNewAnswer: boolean;
  isEdited: boolean;
  slidesNums: string;
  slidesIds: number[];
}

const question = questionApi;
const answer = answerApi;
const answers = ref<AnswerPreview[]>([]);

const formQuestion = useQuestionForm({
  questionText: {
    value: "",
    validators: { required, isMaxLength },
  },
});

const formAnswer = useAnswerForm({
  answerText: {
    value: "",
    validators: { required, isMaxLength },
  },
});

const slidesIds = ref<number[]>([]);
const isSlidesIdsModified = ref<boolean>(false);
const isSlideHasQuestion = ref<boolean>(false);

if (props.slide.question_id) {
  isSlideHasQuestion.value = true;
  question.getQuestion(props.slide.question_id).then(() => {
    if (question.question.value !== undefined)
      formQuestion.questionText.value = question.question.value!.question_text;
    for (let answer of question.question.value!.answer_set) {
      let slideOrdering = "";
      let slidesIDs = [];
      for (let slide of answer.slides) {
        slidesIDs.push(slide.id);
        slideOrdering += Number(slide["ordering"] + 1) + ", ";
      }
      answers.value.push({
        id: answer.id,
        isNewAnswer: false,
        isEdited: false,
        answerText: answer.answer_text,
        slidesNums: slideOrdering.slice(0, -2),
        slidesIds: slidesIDs,
      });
    }
  });
}

const isShowDialogQuestion = ref(false);
const isShowDialogAnswer = ref(false);
const isShowDialogAnswerEdit = ref(false);

const showDialogQuestion = () => {
  isShowDialogQuestion.value = true;
};
const showDialogAnswer = () => {
  isShowDialogAnswer.value = true;
  if ("answerText" in formAnswer) formAnswer.answerText.value = "";
};

watch(isShowDialogQuestion, () => {
  if (!isShowDialogQuestion.value && !isSlideHasQuestion.value) {
    if ("questionText" in formQuestion) formQuestion.questionText.value = "";
    answers.value = [];
  }
});

function createAnswer() {
  if ("answerText" in formAnswer)
    if (formAnswer.answerText.valid && slidesIds.value.length !== 0) {
      let slideOrdering = [];
      for (let slideId of slidesIds.value) {
        for (let slide of props.slides)
          if (slideId === slide.id) slideOrdering.push(Number(slide["ordering"] + 1));
      }
      answers.value.push({
        id: Date.now(),
        isNewAnswer: true,
        isEdited: false,
        answerText: formAnswer.answerText.value,
        slidesIds: slidesIds.value,
        slidesNums: slideOrdering
          .sort(function (a, b) {
            return a - b;
          })
          .join(", "),
      });
      slidesIds.value = [];
      formAnswer.answerText.value = "";
      isSlidesIdsModified.value = false;
      isShowDialogAnswer.value = false;
    }
}

function createQuestion() {
  if ("questionText" in formQuestion)
    question
      .createQuestion({
        slide_id: props.slide.id,
        question_text: formQuestion.questionText.value,
      })
      .then(() => {
        let newAnswers = [];
        for (let answerToAdd of answers.value)
          if (answerToAdd.isNewAnswer) {
            newAnswers.push({
              answer_text: answerToAdd.answerText,
              slides_ids: answerToAdd.slidesIds,
            });
          }
        answer.createAnswer(question.question.value!.id, newAnswers);
        isShowDialogQuestion.value = false;
        isSlideHasQuestion.value = true;
      });
}

function editQuestion() {
  if ("questionText" in formQuestion)
    question
      .editQuestion(question.question.value!.id, {
        question_text: formQuestion.questionText.value,
      })
      .then(() => {
        let newAnswers = [];
        for (let answerOfAnswers of answers.value) {
          if (answerOfAnswers.isNewAnswer) {
            newAnswers.push({
              answer_text: answerOfAnswers.answerText,
              slides_ids: answerOfAnswers.slidesIds,
            });
          } else if (answerOfAnswers.isEdited) {
            answer.editAnswer(question.question.value!.id, answerOfAnswers.id, {
              answer_text: answerOfAnswers.answerText,
              slides_ids: answerOfAnswers.slidesIds,
            });
          }
        }
        answer.createAnswer(question.question.value!.id, newAnswers);
        isShowDialogQuestion.value = false;
      });
}

function createOrEditQuestion() {
  if ("questionText" in formQuestion)
    if (formQuestion.questionText.valid && answers.value.length !== 0) {
      if (question.question.value) {
        editQuestion();
      } else {
        createQuestion();
      }
    }
}

const editableAnswer = ref<number>();

function startEditAnswer(answer: AnswerPreview) {
  isShowDialogAnswerEdit.value = true;
  if ("answerText" in formAnswer) formAnswer.answerText.value = answer.answerText;
  slidesIds.value = answer.slidesIds;
  editableAnswer.value = answers.value.indexOf(answer);
}

function editAnswer() {
  if ("answerText" in formAnswer)
    if (
      formAnswer.answerText.valid &&
      slidesIds.value.length !== 0 &&
      editableAnswer.value !== undefined
    ) {
      answers.value[editableAnswer.value].isEdited = true;
      answers.value[editableAnswer.value].answerText = formAnswer.answerText.value;
      answers.value[editableAnswer.value].slidesIds = slidesIds.value;
      let slideOrdering = [];
      for (let slideId of slidesIds.value) {
        for (let slide of props.slides)
          if (slideId === slide.id) slideOrdering.push(Number(slide["ordering"] + 1));
      }
      answers.value[editableAnswer.value].slidesNums = slideOrdering
        .sort(function (a, b) {
          return a - b;
        })
        .join(", ");
      slidesIds.value = [];
      formAnswer.answerText.value = "";
      isSlidesIdsModified.value = false;
      isShowDialogAnswerEdit.value = false;
    }
}

function updateSlidesIds(slide: Slide, event: Event) {
  isSlidesIdsModified.value = true;
  if ((event.target as HTMLInputElement).checked) slidesIds.value.push(slide.id);
  else slidesIds.value = slidesIds.value.filter((slideId) => slideId !== slide.id);
}

function deleteAnswer(answerToDelete: AnswerPreview) {
  if (!answerToDelete.isNewAnswer)
    answer.deleteAnswer(question.question.value!.id, answerToDelete.id);
  answers.value = answers.value.filter((answer) => answer.id !== answerToDelete.id);
}

function deleteQuestion() {
  question.deleteQuestion(question.question.value!.id);
  isSlideHasQuestion.value = false;
  if ("questionText" in formQuestion) formQuestion.questionText.value = "";
  answers.value = [];
}
</script>

<template>
  <ui-modal v-model="isShowDialogAnswerEdit" :is70rem="true">
    <template #title>Редактировать ответ</template>
    <template #body>
      <form class="add-question">
        <div class="input-question-item">
          <label for="answer-text">Текст ответа</label>
          <input
            id="answer-text"
            v-model="formAnswer.answerText.value"
            class="form-control"
          />
        </div>
        <label
          >Выберите слайды, которые будут показаны, если выбран этот вариант
          ответа</label
        >
        <slides-in-answer
          :slides="slides.slice(slide.ordering + 1)"
          :selected-slides-ids="slidesIds"
          @change-slides-ids="updateSlidesIds"
        />
      </form>
    </template>
    <template #footer>
      <button
        class="btn btn-secondary footer-button"
        @click.prevent="isShowDialogAnswerEdit = false"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="btn button-submit footer-button"
        :disabled="slidesIds.length === 0 || !formAnswer.answerText.valid"
        @click="editAnswer"
      >
        Сохранить
      </button>
    </template>
  </ui-modal>

  <ui-modal v-model="isShowDialogAnswer" :is70rem="true">
    <template #title>Добавить ответ</template>
    <template #body>
      <form class="add-question">
        <div class="input-question-item">
          <label for="answer-text">Текст ответа</label>
          <input
            id="answer-text"
            v-model="formAnswer.answerText.value"
            class="form-control"
          />
        </div>
        <label
          >Выберите слайды, которые будут показаны, если выбран этот вариант
          ответа</label
        >
        <slides-in-answer
          :slides="slides.slice(slide.ordering + 1)"
          :selected-slides-ids="[]"
          @change-slides-ids="updateSlidesIds"
        />
      </form>
    </template>
    <template #footer>
      <button
        class="btn btn-secondary footer-button"
        @click.prevent="isShowDialogAnswer = false"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="btn button-submit footer-button"
        :disabled="slidesIds.length === 0 || !formAnswer.answerText.valid"
        @click="createAnswer"
      >
        Сохранить
      </button>
    </template>
  </ui-modal>

  <ui-modal
    v-model="isShowDialogQuestion"
    :is-others-modal="[isShowDialogAnswer, isShowDialogAnswerEdit]"
  >
    <template v-if="!isSlideHasQuestion" #title
      >Добавить вопрос к слайду №{{ slide.ordering + 1 }}</template
    >
    <template v-else #title
      >Редактировать вопрос к слайду №{{ slide.ordering + 1 }}</template
    >
    <template #body>
      <form class="add-question">
        <div class="input-question-item">
          <label for="question-text">Текст вопроса</label>
          <input
            id="question-text"
            v-model="formQuestion.questionText.value"
            class="form-control"
          />
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
            <tr v-for="answerElem in answers" :key="answerElem.id" class="answer">
              <td>{{ answerElem.answerText }}</td>
              <td>{{ answerElem.slidesNums }}</td>
              <td class="actions">
                <div class="icon-actions">
                  <i
                    class="bi bi-pencil-fill ui-tooltip"
                    @click="startEditAnswer(answerElem)"
                  >
                    <ui-tooltip>Редактировать</ui-tooltip>
                  </i>
                  <i
                    class="bi bi-trash3-fill ui-tooltip"
                    @click="deleteAnswer(answerElem)"
                  >
                    <ui-tooltip>Удалить</ui-tooltip>
                  </i>
                </div>
              </td>
            </tr>
            <tr class="button-add-answer" @click.prevent="showDialogAnswer">
              <td colspan="3" class="text-center">Добавить ответ</td>
            </tr>
          </tbody>
        </table>
      </form>
    </template>
    <template #footer>
      <button
        class="btn btn-secondary footer-button"
        @click="isShowDialogQuestion = false"
      >
        Отмена
      </button>
      <button
        type="submit"
        class="btn button-submit footer-button"
        :disabled="!formQuestion.questionText.valid || answers.length === 0"
        @click.prevent="createOrEditQuestion"
      >
        Сохранить
      </button>
    </template>
  </ui-modal>

  <div class="row slide">
    <div class="col col-6">
      <div class="d-flex align-items-center justify-content-end">
        <div class="slide-number fw-bold">{{ slide.ordering + 1 }}</div>
        <div class="preview">
          <img :src="`/media/${slide.name}`" alt="Слайд" />
        </div>
      </div>
    </div>
    <div class="col col-6 d-flex justify-content-start align-items-center">
      <div id="buttons-interactivity" class="align-items-center">
        <div>
          <template v-if="isSlideHasQuestion">
            <button class="button-submit my-button w-16">
              <button
                class="btn button-edit-question"
                @click.prevent="showDialogQuestion"
              >
                Редактировать вопрос
              </button>
              <button
                class="btn button-delete-question"
                @click.prevent="deleteQuestion"
              >
                <i class="bi bi-trash3-fill ui-tooltip">
                  <ui-tooltip>Удалить вопрос</ui-tooltip>
                </i>
              </button>
            </button>
          </template>
          <template v-else>
            <button
              class="btn button-submit text-center w-16"
              :disabled="isLeadOn"
              @click.prevent="showDialogQuestion"
            >
              Добавить вопрос
            </button>
          </template>
        </div>
        <div>
          <button
            v-if="!isLeadOn"
            class="btn button-submit text-center w-16"
            :disabled="isSlideHasQuestion"
            @click="$emit('leadOn', props.slide.id)"
          >
            Добавить сбор контактов
          </button>
          <button
            v-else
            class="btn button-submit text-center w-16"
            @click="$emit('leadOff', props.slide.id)"
          >
            Отключить сбор контактов
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

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

.button-edit-question,
.button-delete-question {
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

.th-actions,
.actions {
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
