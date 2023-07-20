import axios from "axios";
import { ref } from "vue";
import type { Presentation, Question, Statistics } from "./interfaces.js";


export namespace questionApi {
  export const question = ref<Question>();

  export const getQuestion = async (questionId: number) => {
    return await axios
      .get(`/api/v1/question/${questionId}/`)
      .then((res) => {
        question.value = res.data;
      })
      .catch((e) => {
        console.log(e);
      });
  };

  export const createQuestion = async (data: object) => {
    return await axios
      .post(`/api/v1/question/`, data)
      .then((res) => (question.value = res.data));
  };

  export const editQuestion = async (questionId: number, data: object) => {
    return await axios
      .patch(`/api/v1/question/${questionId}/`, data)
      .then((res) => (question.value = res.data));
  };

  export const deleteQuestion = async (questionId: number) => {
    return await axios.delete(`/api/v1/question/${questionId}/`).then(() => {});
  };
}

export namespace answerApi {
  /**
   * Создать вариант ответа
   *
   * @param question_id id вопроса
   * @param data Тело запроса
   */
  export const createAnswer = async (question_id: number, data: unknown) => {
    return await axios
      .post(`/api/v1/question/${question_id}/answer/`, data)
      .then((res) => console.log(res));
  };

  /**
   * Отредактировать вариант ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   * @param data Тело запроса
   */
  export const editAnswer = async (question_id: number, answer_id: number, data: unknown) => {
    return await axios
      .patch(`/api/v1/question/${question_id}/answer/${answer_id}/`, data)
      .then((res) => console.log(res));
  };

  /**
   * Удалить вариант ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   */
  export const deleteAnswer = async (question_id: number, answer_id: number) => {
    return await axios
      .delete(`/api/v1/question/${question_id}/answer/${answer_id}/`)
      .then((res) => console.log(res));
  };

  /**
   * Сохранить факт выбора варианта ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   */
  export const chooseAnswer = async (question_id: number, answer_id: number) => {
    return await axios
      .patch(`/api/v1/question/${question_id}/answer/${answer_id}/choose/`)
      .then((res) => console.log(res));
  };

}

export namespace presentationApi {
  export const presentationsPublic = ref<Presentation[]>([]);
  export const userPresentations = ref<Presentation[]>([]);
  export const presentation = ref<Presentation>();
  export const statistics = ref<Statistics>();
  export const errCode = ref<number>(0);

  export const getPublicPresentations = async (params = {}) => {
    return await axios
      .get("/api/v1/presentation/", { params: params })
      .then((res) => {
        presentationsPublic.value = res.data;
      })
      .catch((e) => console.log(e));
  };

  export const getUserPresentations = async (user_id: number) => {
    return await axios
      .get("/api/v1/presentation/", { params: { user_id: user_id } })
      .then((res) => {
        userPresentations.value = res.data;
      })
      .catch((e) => console.log(e));
  };

  export const getPresentation = async (id: number, params: unknown = {}) => {
    return await axios
      .get(`/api/v1/presentation/${id}/`, { params: params })
      .then((res) => {
        presentation.value = res.data;
      })
      .catch((e) => (errCode.value = e.response.status));
  };

  export const createPresentation = async (data: unknown) => {
    return await axios
      .post("/api/v1/presentation/", data)
      .then((res) => console.log(res));
  };

  export const editPresentation = async (id: number, data: unknown) => {
    return await axios
      .patch(`/api/v1/presentation/${id}/`, data)
      .then((res) => console.log(res));
  };

  export const deletePresentation = async (id: number) => {
    return await axios
      .delete(`/api/v1/presentation/${id}/`)
      .then((res) => console.log(res));
  };

  export const addToFavorite = async (id: number) => {
    return await axios
      .patch(`/api/v1/presentation/${id}/add_to_favorite/`)
      .then((res) => console.log(res));
  };

  export const removeFromFavorite = async (id: number) => {
    return await axios
      .patch(`/api/v1/presentation/${id}/remove_from_favorite/`)
      .then((res) => console.log(res));
  };

  export const getStatistics = async (id: number) => {
    return await axios
      .get(`/api/v1/presentation/${id}/statistics`)
      .then((res) => {
        statistics.value = res.data;
      })
      .catch((e) => console.log(e));
  };

}

export namespace leadApi {
  export const leads = ref([]);

  export const leadCreateMessage = ref({ header: "", body: "" });

  export const createLead = async (id: number, data: object) => {
    console.log(data);
    return await axios
      .post(`/api/v1/slide/${id}/lead/`, data)
      .then((res) => {
        if (res.status < 400) {
          leadCreateMessage.value.header = "Успешно";
          leadCreateMessage.value.body = "Контактные данные оставлены";
        } else {
          leadCreateMessage.value.header = "Ошибка";
          leadCreateMessage.value.body = "Вы уже оставили свои данные";
        }
        console.log(res);
      })
      .catch(() => {
        leadCreateMessage.value.header = "Ошибка";
        leadCreateMessage.value.body = "Вы уже оставили свои данные";
      });
  };
}
