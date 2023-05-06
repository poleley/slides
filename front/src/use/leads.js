import axios from "axios";
import {ref} from "vue";

export function useLead() {
    const leads = ref([])

    const createLead = async (id, data) => {
        console.log(data)
        return await axios.post(
            `/api/v1/presentation/${id}/lead/`,
            data
        ).then((res) => console.log(res))
    }

    return {leads, createLead}
}