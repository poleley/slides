import {computed, reactive} from "vue";
import {useField} from "@/use/field";

export function usePresentationForm(init = {}) {
    const form = reactive({})

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    form.valid = computed(() => {
        for (let key in form) {
            if (!form[key].valid && key !== "valid") {
                return false
            }
        }
        return true
    })

    return {form}
}