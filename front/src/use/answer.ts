import axios from "axios";

export function useAnswer() {
    const createAnswer = async (question_id, data) => {
        return await axios.post(`/api/v1/question/${question_id}/answer/`, data)
            .then((res) => console.log(res))
    }

    const editAnswer = async (question_id, answer_id, data) => {
        return await axios.patch(`/api/v1/question/${question_id}/answer/${answer_id}/`, data)
            .then((res) => console.log(res))
    }

    const deleteAnswer = async (question_id, answer_id) => {
        return await axios.delete(`/api/v1/question/${question_id}/answer/${answer_id}/`)
            .then((res) => console.log(res))
    }

    const chooseAnswer = async (question_id, answer_id) => {
        return await axios.patch(`/api/v1/question/${question_id}/answer/${answer_id}/choose/`)
            .then((res) => console.log(res))
    }

    return {
        createAnswer,
        editAnswer,
        deleteAnswer,
        chooseAnswer
    }
}