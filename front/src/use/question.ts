import axios from "axios";
import {ref} from "vue";
import { Answer } from "./answer";

export interface Question {
    id: number,
    question_text: string,
    answer_set: Answer[]
}

export function useQuestion() {
    const question = ref<Question | null>(null)

    const getQuestion = async (questionId) => {
        return await axios.get(`/api/v1/question/${questionId}/`)
            .then((res) => {
                question.value = res.data
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const createQuestion = async (data) => {
        return await axios.post(`/api/v1/question/`, data)
            .then((res) => question.value = res.data)
    }

    const editQuestion = async (questionId, data) => {
        return await axios.patch(`/api/v1/question/${questionId}/`, data)
            .then((res) => question.value = res.data)
    }

    const deleteQuestion = async (questionId) => {
        return await axios.delete(`/api/v1/question/${questionId}/`)
            .then(() => question.value = null)
    }

    return {
        question,
        getQuestion,
        createQuestion,
        editQuestion,
        deleteQuestion
    }
}