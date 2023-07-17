import {reactive} from "vue";
import {useField} from "@/use/field";

export function useOneFieldForm(init = {}) {
    const form = reactive({})

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    return {form}
}