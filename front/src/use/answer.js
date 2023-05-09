import axios from "axios";
import {ref} from "vue";

export function useAnswer() {
    const answer = ref({})

    const createAnswer = async (question_id, data) => {
        return await axios.post(`/api/v1/question/${question_id}/answer/`, data)
            .then((res) => console.log(res))
    }

    return {
        createAnswer
    }
}