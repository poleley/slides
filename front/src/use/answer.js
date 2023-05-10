import axios from "axios";
import {ref} from "vue";

export function useAnswer() {
    const answer = ref({})

    const createAnswer = async (question_id, data) => {
        return await axios.post(`/api/v1/question/${question_id}/answer/`, data)
            .then((res) => console.log(res))
    }

    const editAnswer = async (question_id, answer_id, data) => {
        return await axios.patch(`/api/v1/question/${question_id}/answer/${answer_id}/`, data)
            .then((res) => console.log(res))
    }

    return {
        createAnswer,
        editAnswer
    }
}