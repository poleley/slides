import axios from "axios";
import {ref} from "vue";

export function usePresentations() {
    const presentationsPublic = ref([])
    const userPresentations = ref([])
    const presentation = ref({})

    const getPublicPresentations = async () => {
        return await axios.get("/api/v1/presentation/")
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

    const getPresentation = async (id) => {
        return await axios.get(`/api/v1/presentation/${id}/`)
            .then((res) => {
                presentation.value = res.data
            })
            .catch((e) => console.log(e))
    }

    const createPresentation = async (data) => {
        return await axios.post(
            "/api/v1/presentation/",
            data
        ).then((res) => console.log(res))
    }

    return {
        presentationsPublic,
        userPresentations,
        presentation,
        getPublicPresentations,
        getUserPresentations,
        getPresentation,
        createPresentation
    }
}