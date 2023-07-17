import {computed, reactive} from "vue";
import {useField} from "./field";
import { Field } from "./form";

export interface Form {
    file: Field,
    title: Field,
    topic: Field,
    privacy: Field,
    valid: boolean,
}

export interface Field {
    value: string,
    valid: boolean,
    touched: boolean,
    blur: boolean,
    errors: object
}

export function useDefaultForm(init = {}) {
    const form = reactive<Form>(<Form>{
        valid: computed(() => {
        return Object.keys(form).filter(k => k !== "valid").reduce((acc, key) => {
            acc = form[key].valid
            return acc
        }, true)
    })
    })

    for (const [key, val] of Object.entries(init)) {
        form[key] = useField(val)
    }

    return form
}