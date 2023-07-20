import axios from "axios";
import type { leadCreateMessage } from "./interfaces.js";


export namespace questionApi {

  export async function getQuestion(questionId: number) {
    const response = await axios.get(`/api/v1/question/${questionId}/`);
    return response.data;
  }

  export async function createQuestion(data: unknown) {
    const response = await axios.post(`/api/v1/question/`, data);
    return response.data;
  }

  export async function editQuestion(questionId: number, data: unknown) {
    const response = await axios.patch(`/api/v1/question/${questionId}/`, data);
    return response.data;
  }

  export async function deleteQuestion(questionId: number) {
    await axios.delete(`/api/v1/question/${questionId}/`);
  }
}

export namespace answerApi {
  /**
   * Создать вариант ответа
   *
   * @param question_id id вопроса
   * @param data Тело запроса
   */
  export async function createAnswer(question_id: number, data: unknown) {
    const response = await axios.post(`/api/v1/question/${question_id}/answer/`, data);
    return response.data;
  }

  /**
   * Отредактировать вариант ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   * @param data Тело запроса
   */
  export async function editAnswer(question_id: number, answer_id: number, data: unknown) {
    const response = await axios.patch(`/api/v1/question/${question_id}/answer/${answer_id}/`, data);
    return response.data;
  }

  /**
   * Удалить вариант ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   */
  export async function deleteAnswer(question_id: number, answer_id: number) {
    await axios.delete(`/api/v1/question/${question_id}/answer/${answer_id}/`);
  }

  /**
   * Сохранить факт выбора варианта ответа
   *
   * @param question_id id вопроса
   * @param answer_id id варианта ответа
   */
  export async function chooseAnswer(question_id: number, answer_id: number) {
    await axios.patch(`/api/v1/question/${question_id}/answer/${answer_id}/choose/`);
  }

}

export namespace presentationApi {
  export async function getPublicPresentations(params = {}) {
    const response = await axios
      .get("/api/v1/presentation/", { params: params });
    return response.data;
  }

  export async function getUserPresentations(user_id: number) {
    const response = await axios
      .get("/api/v1/presentation/", { params: { user_id: user_id } });
    return response.data;
  }

  export async function getPresentation(id: number, params: unknown = {}) {
    const response = await axios
      .get(`/api/v1/presentation/${id}/`, { params: params });
    return response.data;
  }

  export async function createPresentation(data: unknown) {
    await axios.post("/api/v1/presentation/", data);
  }

  export async function editPresentation(id: number, data: unknown) {
    await axios.patch(`/api/v1/presentation/${id}/`, data);
  }

  export async function deletePresentation(id: number) {
    await axios.delete(`/api/v1/presentation/${id}/`);
  }

  export async function addToFavorite(id: number) {
    await axios.patch(`/api/v1/presentation/${id}/add_to_favorite/`);
  }

  export async function removeFromFavorite(id: number) {
    await axios.patch(`/api/v1/presentation/${id}/remove_from_favorite/`);
  }

  export async function getStatistics(id: number) {
    const response = await axios.get(`/api/v1/presentation/${id}/statistics`);
    return response.data;
  }

}

export namespace leadApi {
  export async function createLead(
    id: number,
    data: unknown
  ) {
    let leadCreateMessage: leadCreateMessage = { header: "", body: "" };
    try {
      const response = await axios.post(`/api/v1/slide/${id}/lead/`, data);
      if (response.status < 400) {
        leadCreateMessage.header = "Успешно";
        leadCreateMessage.body = "Контактные данные оставлены";
      } else {
        leadCreateMessage.header = "Ошибка";
        leadCreateMessage.body = "Вы уже оставили свои данные";
      }
    } catch (e: unknown) {
      leadCreateMessage.header = "Ошибка";
      leadCreateMessage.body = "Вы уже оставили свои данные";
    }
    return leadCreateMessage;
  }
}
