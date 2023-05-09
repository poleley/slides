import axios from "axios";
import {ref} from "vue";

export function useQuestion() {
    const question = ref({})

    const getQuestion = async (question_id) => {
        return await axios.get(`/api/v1/question/${question_id}/`)
            .then((res) => {
                question.value = res.data
            })
            .catch((e) => {
                console.log(e)
            })
    }

    const createQuestion = async (data) => {
        return await axios.post(`/api/v1/question/`, data)
            .then((res) => console.log(res))
    }

    return {
        question,
        getQuestion,
        createQuestion
    }
}