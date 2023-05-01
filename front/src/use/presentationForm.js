import {computed, reactive} from "vue";
import {useField} from "@/use/field";

export function usePresentationForm(init = {}) {
    const form = reactive({})

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    form.valid = computed(() => {
        return Object.keys(form).filter(k => k !== "valid").reduce((acc, key) => {
            acc = form[key].valid
            return acc
        }, true)
    })

    return {form}
}