import axios from "axios";
import {ref} from "vue";

export function useLead() {
    const leads = ref([])

    const leadCreateMessage = ref({header: "", body: ""})

    const createLead = async (id, data) => {
        console.log(data)
        return await axios.post(
            `/api/v1/slide/${id}/lead/`,
            data
        ).then((res) => {
            if (res.status < 400) {
                leadCreateMessage.value.header = "Успешно"
                leadCreateMessage.value.body = "Контактные данные оставлены"
            } else {
                leadCreateMessage.value.header = "Ошибка"
                leadCreateMessage.value.body = "Вы уже оставили свои данные"
            }
            console.log(res)
        }).catch((err) => {
            leadCreateMessage.value.header = "Ошибка"
            leadCreateMessage.value.body = "Вы уже оставили свои данные"
        })
    }

    return {leads, leadCreateMessage, createLead}
}