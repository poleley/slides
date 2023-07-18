import axios from "axios";
import {ref} from "vue";
import { Question } from "./question";

export interface Presentation {
    id: number,
    user: User,
    favorite: number[],
    title: string,
    slide_set: Slide[],
    topic: number,
    description: Description,
    privacy: number,
    date_created: string
}

export interface User {
    id: number,
    username: string,
    last_name: string,
    first_name: string,
}

export interface Slide {
    id: number,
    name: string,
    ordering: number,
    question_id: null | number,
}

export interface Description {
    lead: object,
    views: object,
    favorite: object
}

export interface Statistics {
    user_id: number,
    title: string,
    date_created: string,
    total_views: number,
    views: object,
    total_favorite: number,
    favorite: object,
    first_slide: Slide,
    leads: Lead[],
    questions: Question[]
}

export interface Lead {
    id: number,
    slide: Slide,
    email: string,
    first_name: string,
    last_name: string
}

export function usePresentations() {
    const presentationsPublic = ref<Presentation[]>([])
    const userPresentations = ref<Presentation[]>([])
    const presentation = ref<Presentation>()
    const statistics = ref<Statistics>()
    const errCode = ref<number>(0)

    const getPublicPresentations = async (params = {}) => {
        return await axios.get("/api/v1/presentation/", {params: params})
            .then((res) => {
                presentationsPublic.value = res.data
            })
            .catch((e) => console.log(e))
    }

    const getUserPresentations = async (user_id) => {
        return await axios.get("/api/v1/presentation/", {params: {"user_id": user_id}})
            .then((res) => {
                userPresentations.value = res.data
            })
            .catch((e) => console.log(e))
    }

    const getPresentation = async (id, params={}) => {
        return await axios.get(`/api/v1/presentation/${id}/`, {params: params})
            .then((res) => {
                presentation.value = res.data
            })
            .catch((e) => errCode.value = e.response.status)
    }

    const createPresentation = async (data) => {
        return await axios.post(
            "/api/v1/presentation/",
            data
        ).then((res) => console.log(res))
    }

    const editPresentation = async (id, data) => {
        return await axios.patch(
            `/api/v1/presentation/${id}/`,
            data
        ).then((res) => console.log(res))
    }

    const deletePresentation = async (id) => {
        return await axios.delete(
            `/api/v1/presentation/${id}/`
        ).then((res) => console.log(res))
    }

    const addToFavorite = async (id) => {
        return await axios.patch(
            `/api/v1/presentation/${id}/add_to_favorite/`
        ).then((res) => console.log(res))
    }

    const removeFromFavorite = async (id:number) => {
        return await axios.patch(
            `/api/v1/presentation/${id}/remove_from_favorite/`
        ).then((res) => console.log(res))
    }

    const getStatistics = async (id:number) => {
        return await axios.get(`/api/v1/presentation/${id}/statistics`)
            .then((res) => {
                statistics.value = res.data
            })
            .catch((e) => console.log(e))
    }

    return {
        presentationsPublic,
        userPresentations,
        presentation,
        statistics,
        errCode,
        getPublicPresentations,
        getUserPresentations,
        getPresentation,
        createPresentation,
        editPresentation,
        deletePresentation,
        addToFavorite,
        removeFromFavorite,
        getStatistics
    }
}