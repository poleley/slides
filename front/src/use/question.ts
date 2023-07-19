import axios from "axios";
import { ref } from "vue";
import { type Answer } from "./answer.js";

export interface Question {
  id: number,
  question_text: string,
  answer_set: Answer[]
}

export function useQuestion() {
  const question = ref<Question>();

  const getQuestion = async (questionId: number) => {
    return await axios.get(`/api/v1/question/${questionId}/`)
      .then((res) => {
        question.value = res.data;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createQuestion = async (data: object) => {
    return await axios.post(`/api/v1/question/`, data)
      .then((res) => question.value = res.data);
  };

  const editQuestion = async (questionId: number, data: object) => {
    return await axios.patch(`/api/v1/question/${questionId}/`, data)
      .then((res) => question.value = res.data);
  };

  const deleteQuestion = async (questionId: number) => {
    return await axios.delete(`/api/v1/question/${questionId}/`)
      .then(() => {
      });
  };

  return {
    question,
    getQuestion,
    createQuestion,
    editQuestion,
    deleteQuestion
  };
}